---
layout: post
title: "Just Use Postgres"
description: "Taking 'just use Postgres' to its logical endpoint: git push to deploy into a single Postgres process."
date: 2026-03-10 10:00:00 +0000
tags:
  - git
  - postgres
---

A couple of weeks ago I wrote about [storing git repositories in Postgres](/2026/02/26/git-in-postgres.html) and built [gitgres](https://github.com/andrew/gitgres) to prove it worked. Two tables, some PL/pgSQL, a libgit2 backend, and you could push to and clone from a database. The post ended with a missing piece: the server-side pack protocol, the part that lets a Postgres instance serve `git push` and `git clone` over HTTP without a separate application in front of it.

I built that missing piece as [omni_git](https://github.com/andrew/omni_git), a Postgres extension that implements the git smart HTTP protocol inside the database and, when paired with [omnigres](https://omnigres.com), turns `git push` into a deployment mechanism where your SQL files go from git objects in a table to running code in the same Postgres instance.

The end result is something like Heroku, except the entire platform is a single Postgres process. You `git push` a Flask app (or raw SQL, or both) to a Postgres remote, a trigger deploys it, and omnigres starts serving HTTP traffic from it -- no reverse proxy, no container runtime, no separate application server. The database is the git host, the build system, and the production runtime.

### The protocol in SQL

The git smart HTTP protocol is simpler than it looks from the outside. A client hits `/repo/info/refs?service=git-receive-pack` and gets back a list of refs with their OIDs, encoded in git's [pkt-line format](https://git-scm.com/docs/protocol-common#_pkt_line_format): each line prefixed with a 4-character hex length. The client compares those refs against its own, figures out which objects the server is missing, packs them into a packfile, and POSTs it to `/repo/git-receive-pack` along with the ref updates it wants applied. Clone works the same way in reverse through `/repo/git-upload-pack`.

pkt-line encoding turned out to be straightforward in SQL, since a function that takes some bytes and prepends `lpad(to_hex(octet_length(data) + 4), 4, '0')` covers the whole format. The ref advertisement is a query against the refs table with a null byte separating the first ref's name from the capability list, which was the first bug I hit: PL/pgSQL's `convert_from` rejects null bytes in UTF-8 strings, so the lines have to be assembled as bytea before any text conversion happens.

When a client pushes, the body is a stream of pkt-line commands (old OID, new OID, ref name) followed by a raw packfile. Parsing the commands is more SQL string slicing, but packfiles are a binary format with variable-length headers, zlib-compressed objects, and delta chains, and reimplementing that in PL/pgSQL would have been miserable. I wrote a small C function that hands the packfile bytes to libgit2's indexer, iterates the unpacked objects, and inserts each one into the objects table via SPI. About 200 lines of C handles both unpacking and generation, and the SQL layer never has to think about the packfile format.

For clone, a `reachable_objects` function walks from the requested commits through their trees and parent commits, collecting every OID, and the C function packs them back into a packfile with zlib compression and a SHA1 trailer. There's no delta compression, so the packfiles are larger than what a real git server would produce, but git clients accept them without complaint.

### omnigres

The HTTP handlers need something to serve them, and [omnigres](https://omnigres.com) is a project that turns Postgres into an application server by bundling extensions for HTTP serving (omni_httpd), HTTP client requests, Python execution, and a bunch of other things, all running inside the database process. omni_httpd has a routing system where you create a table with URL pattern and handler function columns, and it auto-discovers your routes, so wiring up the three git endpoints looks like this:

```sql
create table omni_git.router (like omni_httpd.urlpattern_router);

insert into omni_git.router (match, handler) values
  (omni_httpd.urlpattern(pathname => '/:repo/info/refs'),
   'omni_git.http_info_refs'::regproc),
  (omni_httpd.urlpattern(pathname => '/:repo/git-receive-pack', method => 'POST'),
   'omni_git.http_receive_pack'::regproc),
  (omni_httpd.urlpattern(pathname => '/:repo/git-upload-pack', method => 'POST'),
   'omni_git.http_upload_pack'::regproc);
```

omnigres picks up the table, matches incoming requests against the URL patterns, and calls the handler functions, each of which extracts the repo name from the path, looks it up in the repositories table, and delegates to the protocol functions. The `git-receive-pack` handler is about 20 lines of PL/pgSQL.

### Deploy on push

omni_git has a deploy trigger that fires when a ref is updated, walks the commit's tree looking for files under a `deploy/` directory, and executes them: SQL migration files run in alphabetical order, Python files go through omni_python, and a seed file runs last for route registration and data setup.

```sql
insert into omni_git.deploy_config (repo_id, branch)
select id, 'refs/heads/main' from repositories where name = 'myapp';
```

After that, `git push pg main` deploys your application. The trigger reads SQL files out of the git tree as bytea, converts to text, and passes them to `EXECUTE`, all in the same transaction as the ref update. "[Just use Postgres](https://amattn.com/p/just_use_postgres.html)" is usually advice about replacing Redis and Elasticsearch and RabbitMQ with one database you already run, but at some point I wanted to see how far the idea actually goes: Postgres as your git remote, your HTTP server, your deployment target, and your application runtime, with nothing else in the stack.

### What actually works

You can `docker run` the image, push a repo, and clone it back, and I've tested it with small repos where it handles the happy path including multiple pushes with compare-and-swap ref updates. Large repos will be slow because the packfile generator skips delta compression, the deploy trigger hasn't been exercised with real applications yet, there's no authentication, the HTTP handlers only speak protocol v1, and I haven't tested concurrent pushes to the same repo. omnigres itself is young, and running application code inside Postgres means a bad deploy can take down your database, which is a trade-off that probably needs more than a trigger and an `EXECUTE` to manage safely.

### gitgres as a dependency

omni_git started as a copy of [gitgres](https://github.com/andrew/gitgres) with extra code layered on top, which meant the core git functions existed in both repos. I expanded the gitgres extension to include its full SQL layer -- tables, functions, materialized views -- and added it as a git submodule of omni_git, so `CREATE EXTENSION omni_git CASCADE` pulls in gitgres automatically and omni_git only contains what's actually new: protocol handling, HTTP transport, and the deploy system. About 380 lines of duplicated SQL disappeared.

### The forbidden monolith

With omni_git the entire stack is one process. That sounds like a liability until you remember what Postgres already gives you for free when everything is in one database.

Streaming replication means a standby server gets every git push, every deployed function, and every row of application state through the same WAL stream. You don't need to synchronize a git mirror, replicate a deployment artifact store, and set up database replication as three separate problems -- one `pg_basebackup` and a replication slot covers all of it. Point-in-time recovery works the same way: restore from a base backup and replay WAL to any moment, and you get the repository contents, the deployed code, and the application data all consistent with each other at that exact point in time. If a deploy breaks something at 3:47 PM, you can recover to 3:46 PM and have the old code running against the old data, no coordination required.

`pg_dump` backs up the application code, its git history, and whatever state the code created, all at once. Foreign data wrappers can expose the git tables to other Postgres instances without copying anything. And because git objects and refs are just rows, they participate in Postgres's MVCC, its vacuum process, its monitoring, its connection pooling -- all the operational tooling that already exists for keeping a database healthy.

None of this is available when git repositories live on a filesystem. You get rsync, or you get a purpose-built replication layer like Gitaly, or you get object storage with its own consistency model. Every additional storage system is another thing to back up, another thing to monitor, another failure mode during recovery. The forbidden monolith collapses all of that into one system that already knows how to do it.

I don't know if anyone should run production systems this way, but "just use Postgres" deserves to know where its logical endpoint is.
