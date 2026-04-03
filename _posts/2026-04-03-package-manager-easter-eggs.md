---
layout: post
title: "Package Manager Easter Eggs"
date: 2026-04-03 10:00 +0000
description: "A tour of the easter eggs hiding inside package managers."
tags:
  - package-managers
  - reference
---

It's Easter, so here's a tour of the easter eggs hiding inside package managers.

The very first known easter egg in software dates back to 1967-68 on the PDP-6/PDP-10, where typing `make love` at the TOPS-10 operating system's [COMPIL program](https://en.wikipedia.org/wiki/Easter_egg_(media)#Software) would pause and respond "not war?" before creating the file.

### apt and friends

A cow-shaped thread runs through the history of system package managers, starting with `apt-get moo`:

```
$ apt-get moo
                 (__)
                 (oo)
           /------\/
          / |    ||
         *  /\---/\
            ~~   ~~
..."Have you mooed today?"...
```

Running `apt-get help` reveals the line "This APT has Super Cow Powers." The `moo` subcommand has been there for decades and doesn't need root.

[Aptitude's response](https://www.digitalocean.com/community/tutorials/top-10-linux-easter-eggs) is more elaborate. It lies to you, then gradually caves under pressure:

```
$ aptitude moo
There are no Easter Eggs in this program.

$ aptitude -v moo
There really are no Easter Eggs in this program.

$ aptitude -vv moo
Didn't I already tell you that there are no Easter Eggs in this program?

$ aptitude -vvv moo
Stop it!

$ aptitude -vvvv moo
Okay, okay, if I give you an Easter Egg, will you go away?

$ aptitude -vvvvv moo
All right, you win.

                               /----\
                       -------/      \
                      /               \
                     /                |
   -----------------/                  --------\
   ----------------------------------------------
```

Adding one more `-v` reveals the explanation: "What is it? It's an elephant being eaten by a snake, of course." A reference to *[The Little Prince](https://en.wikipedia.org/wiki/The_Little_Prince)* by Antoine de Saint-Exupéry. And `aptitude --help` declares "This aptitude does not have Super Cow Powers," which is a [dirty, filthy lie](https://www.linux.com/news/10-truly-amusing-easter-eggs-linux/).

The tradition spread to openSUSE's package manager too. [`zypper moo`](https://eeggs.com/items/36008.html) draws an ASCII hedgehog by default, and the source code invites translators to draw a different animal for their locale. Gentoo got in on it as well: [`emerge --moo`](https://eeggs.com/items/47251.html) displays ASCII art of Larry the Cow with "Have you mooed today?"

### pacman and Portage

Adding [`ILoveCandy`](https://eeggs.com/items/59538.html) to the `[options]` section of Arch Linux's `/etc/pacman.conf` turns the progress bar into a Pac-Man character eating pellets as it installs packages, because Pac-Man loves candy. Completely independently, Gentoo landed on the same word: adding [`candy` to FEATURES](https://eeggs.com/items/50075.html) in `/etc/make.conf` replaces the default emerge spinner with a livelier animation.

### npm

[`npm xmas`](https://gist.github.com/AvnerCohen/4051934) showed a Christmas-themed display. [`npm visnup`](https://www.manvendrask.com/2017/05/30/advanced-npm-tricks-and-fun/) displayed terminal art of npm contributor Visnu Pitiyanuvath, and `npm substack` honoured the prolific module author James Halliday. There was also a `ham-it-up` config option that printed "I Have the Honour to Be Your Obedient Servant" after successful commands, in a PR titled "Talk less, complete more," both Hamilton references. All gone as of npm v9.

And [`npm rum dev`](https://dev.to/vansh-codes/easter-egg-or-a-bug-the-mysterious-case-of-npm-rum-dev-3ki1) works identically to `npm run dev`. Turns out `rum` and `urn` are [documented aliases](https://docs.npmjs.com/cli/v8/commands/npm-run-script/) for `run-script`, so it's less of an easter egg and more of a happy accident that `npm rum` sounds like a pirate order.

[Someone going through npm's codebase](https://github.com/npm/cli/issues/4091) found an undocumented `birthday` command backed by completely obfuscated JavaScript that executed code from a separate npm package. Running it returned "Please try again in 26632152294ms," a countdown to npm's birthday.

The community was alarmed. Obfuscated, undocumented code in a tool installed on every CI server on earth was indistinguishable from a supply chain attack. The [package was eventually rewritten](https://github.com/npm/npm-birthday) to be human-readable "to make our users more comfortable," then the command was [removed entirely](https://github.com/npm/cli/pull/5455) in npm 9.

### Pipenv

Pipenv swaps its install label to a pumpkin on Halloween and Santa on Christmas. When the community [asked to remove them](https://github.com/pypa/pipenv/issues/3128), Kenneth Reitz said "The easter eggs stay" and closed the issue.

### Python

`import this` prints [The Zen of Python](https://peps.python.org/pep-0020/) by Tim Peters, 19 guiding principles for Python's design, and [the source code of the `this` module](https://github.com/python/cpython/blob/main/Lib/this.py) uses ROT13 encoding so that the code printing Python's design philosophy deliberately violates those same principles by being ugly and obfuscated.

`import antigravity` opens your browser to [xkcd comic #353](https://xkcd.com/353/) and has been in the standard library since Python 2.6. A second egg is nested inside: [the module also contains a `geohash` function](https://github.com/OrkoHunter/python-easter-eggs) implementing xkcd's geohashing algorithm.

The `__future__` module has two. `from __future__ import braces` raises `SyntaxError: not a chance`. `from __future__ import barry_as_FLUFL` is an [April Fools' joke (PEP 401)](https://peps.python.org/pep-0401/) honouring Barry Warsaw as the "Friendly Language Uncle For Life" that makes `!=` a syntax error and forces you to use `<>` instead.

`hash(float('inf'))` returns `314159`, the first digits of pi [hiding in the numeric internals](https://code-specialist.com/python-easter-eggs).

### Leiningen

In the early Clojure ecosystem, there was a plague of projects with names ending in "jure." The maintainer of [Leiningen](https://leiningen.org/) [had enough](https://github.com/technomancy/leiningen/commit/39732d5b649dedb70b14e88fe561dfc9ddb31611):

```
Sorry, names such as clojure or *jure are not allowed.
If you intend to use this name ironically, please set the
LEIN_IRONIC_JURE environment variable and try again.
```

As one commenter quipped: "I'd say I've never seen this error message, but I don't want to perjure myself."

### Ruby

[`rvm seppuku`](https://chrisarcand.com/programming-easter-eggs/) was an alias for `rvm implode`, which removes the entire Ruby Version Manager installation. The commit message read: "Added 'rvm seppuku' in honor of tsykoduk who can't spell so it saved his life." The uninstall log message was `"Hai! Removing $rvm_path"`. RVM also had `rvm answer`, with a notable bugfix in its changelog: "rvm answer now uses perl, since the universe is written in Perl."

The [Pry debugger gem](https://github.com/pry/pry) shipped a dedicated easter eggs file with a nyan cat command, and text snippets from Jermaine Stewart, T.S. Eliot, Leonard Cohen, and Fernando Pessoa (some of which remain in current versions). Installing the HTTParty gem greets you with "When you HTTParty, you must party hard!" which annoyed enough people that Tim Pope published a gem called [gem-shut-the-fuck-up](https://rubyflow.com/p/gkgid4-gem-shut-the-fk-up) to suppress all post-install messages.

### Go

In Go's `net` package, a variable called [`aLongTimeAgo`](https://dev.to/ymotongpoo/easter-eggs-in-go-source-code-2l02) was originally set to `time.Unix(233431200, 0)`, which converts to May 25, 1977, the day Star Wars: Episode IV opened in theatres. It's used to force-cancel connections by setting a deadline far in the past. The value was later changed to `time.Unix(1, 0)` back in 2017 because Raspberry Pi boards sometimes boot with their clock reset to 1970, making 1977 no longer safely "in the past."

### Homebrew

Homebrew once had a `brew beer` command, removed from the main codebase but preserved in [`homebrew-vintage`](https://github.com/DomT4/homebrew-vintage), a dedicated tap for anyone who misses it. The entire tool is already an easter egg of sorts, with its formulae, taps, casks, kegs, bottles, cellars, and pouring.

Know of more package manager easter eggs I've missed? [Let me know](https://github.com/andrew/nesbitt.io/issues).
