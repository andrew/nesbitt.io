---
layout: post
title: "Hardening the Override Flag"
date: 2026-08-25 10:00 +0000
description: "export PIP_BREAK_SYSTEM_PACKAGES=1"
tags:
  - package-managers
  - security
  - cli
---

I've been reading through the recent run of incidents where package-manager infrastructure was the attack surface, as one does on a Sunday afternoon. One question I kept coming back to was whether the tools have any defences at the flag and config level. Every package manager has an override that turns off a check: `--allow-unauthenticated`, `--break-system-packages`, `--ignore-scripts`, an env var that points the resolver at a different registry. If a compromised install script can pass those as easily as a person at a keyboard can, the check does very little. So I went looking at how command-line tools more generally handle their dangerous overrides, `sudo` and `curl` and `rm` and the rest, and the catalogue got long enough to write up on its own.

## Names and channels

GNU rm goes back and re-reads `argv` after option parsing has finished. getopt_long accepts any unambiguous prefix of a long option, which would make `--no-p` a valid spelling of `--no-preserve-root`, so rm [checks the literal string](https://github.com/coreutils/coreutils/blob/master/src/rm.c) and rejects anything shorter with "you may not abbreviate the --no-preserve-root option". `--preserve-root` has been the default [since 2006](https://lists.gnu.org/archive/html/bug-coreutils/2006-08/msg00354.html), and the override requires the full flag every time, on top of whatever the argument parser does. It's easy to miss when reimplementing: uutils, the Rust coreutils rewrite, [accepted `--n` until March 2026](https://github.com/uutils/coreutils/issues/10188).

A long name with no short form is the most common hardening on an override flag, and the one most package managers reach for. apt has `--allow-remove-essential`, `--allow-downgrades`, `--allow-change-held-packages` and `--allow-unauthenticated`, all long-only, [split out from a blanket `--force-yes` in apt 1.1](https://manpages.debian.org/unstable/apt/apt-get.8.en.html). pnpm 10 disables install scripts by default and calls the global re-enable [`dangerouslyAllowAllBuilds`](https://pnpm.io/settings/build). hdparm gates its drive-destroying operations behind [`--yes-i-know-what-i-am-doing`, and the worst of them behind `--please-destroy-my-drive` as well](https://sourceforge.net/projects/hdparm/files/hdparm/). The name is the warning, and someone reviewing a script or a diff will read past `-f` but stop on `--allow-remove-essential`.

apt also used a typed confirmation phrase for essential-package removal until 2021: print the warning, require `Yes, do as I say!` character-for-character before proceeding. Typing the translated phrase in Chinese locales [required an input method that was unavailable at a bare console](https://bugs.debian.org/234886), so apt 0.5.23 stopped translating it for zh_*. The check [ran regardless of TTY](https://lists.debian.org/deity/2012/10/msg00042.html), so `echo 'Yes, do as I say!' | apt-get ...` worked. In November 2021 a Pop!_OS packaging conflict made `apt install steam` propose removing the desktop environment, the prompt appeared [in a Linus Tech Tips video](https://www.youtube.com/watch?v=0506yDSgU7M&t=597s), and the phrase got typed anyway. [apt 2.3.12](https://salsa.debian.org/apt-team/apt/-/merge_requests/199) replaced the prompt with a hard error two weeks later; the NEWS entry credits Linus Tech Tips and System76 by name.

[PEP 668](https://peps.python.org/pep-0668/) says the escape hatch for externally-managed environments "should not be something as simple as a `--force` flag", and pip's `--break-system-packages`, [added in 23.0.1](https://github.com/pypa/pip/pull/11780), is long-only with an error message that takes half a screen to steer users away. But pip maps every long option to both an environment variable and a config-file key automatically, with no per-option opt-out. `PIP_BREAK_SYSTEM_PACKAGES=1` in `.bashrc` or `break-system-packages = true` in `pip.conf` sets it permanently, and the [pip test suite itself](https://github.com/pypa/pip/blob/main/tests/functional/test_pep668.py) has to clear the env var to test the un-overridden path.

Node.js tags each option individually in [`src/node_options.cc`](https://github.com/nodejs/node/blob/main/src/node_options.cc) as either `kAllowedInEnvvar` or `kDisallowedInEnvvar`, and exits with an error if a disallowed one arrives through `NODE_OPTIONS`. `--eval`, `--print`, `--interactive` and anything that names a script to run are on the [disallowed list](https://nodejs.org/api/cli.html#node_optionsoptions), and the [PR that introduced the mechanism](https://github.com/nodejs/node/pull/12028) put `--tls-cipher-list` there too with the one-line rationale "Disallowed because of security concerns". cargo's config reference marks registry `[source]` replacement and `[patch]` tables the same way, ["Environment: not supported"](https://doc.rust-lang.org/cargo/reference/config.html), so pointing a build at a different crate source takes a file on disk rather than an exported variable. npm 12 restricts a different channel: passing `--allow-scripts` on the command line in a project-scoped install throws [`EALLOWSCRIPTS`](https://github.com/npm/cli/pull/9424), forcing the policy into `package.json` where it's checked in and reviewed.

Daniel Stenberg made the case against relying on names alone in 2017, when a curl user [proposed](https://curl.se/mail/archive-2017-04/0002.html) deprecating `-k` and keeping only `--insecure`, on the grounds that a two-character flag is hard to spot in a script and easy to insert. Stenberg [declined](https://curl.se/mail/archive-2017-04/0004.html): the misuse comes from copy-paste, users transplant `-k` from a Stack Overflow answer without reading it, and they'd transplant `--insecure` just as readily. Adding a warning would produce fatigue rather than caution. curl 8.x still accepts `-k`, though the equivalent `CURL_INSECURE` environment variable is absent; every entry in the man page's [ENVIRONMENT section](https://curl.se/docs/manpage.html#ENVIRONMENT) leaves verification on.

## Preconditions and scope

`git push --force-with-lease` attaches a precondition rather than relying on spelling: override only if the remote ref matches what I last fetched, so a force-push fails if someone else pushed in the meantime. That check turned out to have a hole: editors with background auto-fetch update the tracking ref without the user seeing the new commits, so the lease matches even though the user's mental model is stale. git 2.30 added [`--force-if-includes`](https://git-scm.com/docs/git-push#Documentation/git-push.txt---force-if-includes), which additionally requires the remote tip to appear in the local branch's reflog, so a fetched-but-unread commit still blocks the push.

`go get -insecure` applied to everything the command touched, and Go 1.17 [removed it](https://go.dev/doc/go1.17) in favour of [`GOINSECURE`](https://go.dev/ref/mod#environment-variables), which takes a comma-separated list of module path globs so unverified fetches only apply to matching paths. pacman made the same move: the boolean `--force` that overrode file-conflict checks was removed in 5.1 and replaced with [`--overwrite <glob>`](https://man.archlinux.org/man/pacman.8), which has to name what it's clobbering. Nix's [`permittedInsecurePackages`](https://nixos.org/manual/nixpkgs/stable/#sec-allow-insecure) requires the versioned package name, `openssl-1.1.1w` rather than `openssl`, so when the version changes the exception stops matching and the build fails again until someone re-approves it. Composer 2.2's [`allow-plugins`](https://getcomposer.org/doc/06-config.md#allow-plugins) is a per-plugin map in `composer.json` rather than a global switch. cargo's `[patch]` table is per-crate.

`systemctl reboot --force` skips the orderly shutdown of units, and passing `--force` twice [skips systemd itself](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html#-f), issuing the `reboot(2)` syscall directly from the systemctl process so it works even when PID 1 has hung.

Ceph's pool-deletion command stacks three mechanisms: `ceph osd pool delete NAME NAME --yes-i-really-really-mean-it`, with the pool name given twice, and the monitor on the server side still refuses unless [`mon_allow_pool_delete`](https://docs.ceph.com/en/latest/rados/operations/pools/#deleting-a-pool) is set to true in its configuration.

## Out of band

Docker keeps [`insecure-registries`](https://docs.docker.com/reference/cli/dockerd/) in the daemon config only, so pulling from an unverified registry means reconfiguring the daemon. A git server with [`receive.denyNonFastForwards`](https://git-scm.com/docs/git-config#Documentation/git-config.txt-receivedenyNonFastForwards) or `receive.denyDeletes` set rejects a force-push regardless of what flags the client sent. Homebrew's `HOMEBREW_FORBIDDEN_FORMULAE` and siblings let an admin block installs, and `HOMEBREW_FORBIDDEN_OWNER` [names who set the policy](https://docs.brew.sh/Manpage#environment) so the error message tells the user who to ask rather than what to type. Set in `/etc/homebrew/brew.env` alongside [`HOMEBREW_SYSTEM_ENV_TAKES_PRIORITY`](https://github.com/Homebrew/brew/pull/15787), the system file is applied after the user's shell environment and overrides it, so a value exported in the shell is discarded.

`csrutil disable` has always required booting to Recovery. `spctl --master-disable` used to turn off Gatekeeper from a normal terminal, but on macOS 15 it [prints "This operation is no longer supported"](https://derflounder.wordpress.com/2024/09/23/spctl-command-line-tool-no-longer-able-to-manage-gatekeeper-on-macos-sequoia/) and directs the user to System Settings; a persistent global disable now needs an MDM configuration profile or an interactive System Settings change rather than a scriptable command.

sudo's credential cache expires instead of requiring a separate channel: [five minutes by default](https://www.sudo.ws/docs/man/sudoers.man/) per terminal. `Set-ExecutionPolicy -Scope Process` in PowerShell lasts for the shell session, and GitHub's sudo mode for sensitive account settings re-prompts after a couple of hours. Ceph's `injectargs`, which is how you set `mon_allow_pool_delete` without a monitor restart, is cleared when the monitor restarts. Putting the examples against the same six properties:

| | Long name, no short form | No env-var route | Must name target | Lapses | Checks state | Out of band |
| --- | :---: | :---: | :---: | :---: | :---: | :---: |
| `rm --no-preserve-root` | ✓ | ✓ | | | | |
| pip `--break-system-packages` | ✓ | | | | | |
| apt `--allow-remove-essential` | ✓ | ✓ | | | | |
| pnpm `dangerouslyAllowAllBuilds` | ✓ | ✓ | | | | |
| curl `-k` / `--insecure` | | ✓ | | | | |
| cargo `[source]` replacement | | ✓ | ✓ | | | |
| git `--force-with-lease` | ✓ | ✓ | | | ✓ | |
| pacman `--overwrite <glob>` | ✓ | ✓ | ✓ | | | |
| Go `GOINSECURE` | | | ✓ | | | |
| Composer `allow-plugins` | | ✓ | ✓ | | | |
| Nix `permittedInsecurePackages` | | | ✓ | ✓ | | |
| sudo credential cache | | | | ✓ | | |
| Docker `insecure-registries` | | | ✓ | | | ✓ |
| git `receive.denyNonFastForwards` | | | | | | ✓ |
| Homebrew `FORBIDDEN_*` + system priority | | | ✓ | | | ✓ |
| macOS `csrutil disable` | ✓ | ✓ | | | | ✓ |
| Ceph pool delete | ✓ | ✓ | ✓ | ✓ | | ✓ |

## Threat models

A long unabbreviatable flag catches a fat-fingered `-f` and stands out to a reviewer skimming a diff. A TTY check blocks `yes | tool`, server-side config ignores whatever flags the client sent, and a typed phrase, on apt's evidence, stops very little. Refusing an env-var route stops a poisoned parent process, and for package managers specifically that parent is often something the tool itself just installed.

An npm postinstall script, a `setup.py`, a `build.rs`, a Homebrew formula's `install` block: all of these run with the package manager's environment and all of them can invoke the package manager again, or export variables that the next invocation will read. When [140 `@mastra/*` npm packages were compromised in June 2026](https://socket.dev/blog/mastra-npm-packages-compromised) the injected payload set `NODE_TLS_REJECT_UNAUTHORIZED=0` in its own process before phoning home, because Node reads that from the environment unconditionally. In [CVE-2024-48990](https://www.qualys.com/2024/11/19/needrestart/needrestart.txt) `needrestart`, running as root, inherited `PYTHONPATH` from the unprivileged processes it was inspecting and executed attacker code with it. Homebrew's `bin/brew` [re-executes itself through `env -i`](https://github.com/Homebrew/brew/pull/1753) with a fixed allowlist before any formula code runs, and separately [strips anything matching `token`, `key`, `password`, `cookie` or `auth`](https://github.com/Homebrew/brew/blob/master/Library/Homebrew/extend/ENV/sensitive.rb) from the environment before evaluating tap Ruby. Node's `kDisallowedInEnvvar` list, cargo's env-unsupported `[source]` table, and npm's `EALLOWSCRIPTS` all guard against the case where the package manager's caller is itself a package.

A global `NIXPKGS_ALLOW_INSECURE=1` or `GOINSECURE=*` applies to every dependency resolved from that point on, including transitive ones pulled in by other packages. Nix's version-pinned entries mean an exception granted for `openssl-1.1.1w` stops applying when a dependency bumps to a newer vulnerable build, and an entry in Composer's `allow-plugins` map for `phpstan/extension-installer` applies to that plugin alone. A boolean override reaches everything downstream of it; a named one reaches what it names.

pip's PEP 668 error message ends with "You can override this, at the risk of breaking your Python installation or OS, by passing --break-system-packages." apt's error, when `-y` is passed, reads "Essential packages were removed and -y was used without --allow-remove-essential", while the interactive error a human at a terminal sees omits the flag, so of apt's two code paths the automated one is the one told how to bypass. pip's message and apt's `-y` message both spell out the next command for anything that parses error output and retries: a CI wrapper, a `build.rs` shelling out to the system package manager, a provisioning script, or increasingly an agent that reads stderr as instructions.
