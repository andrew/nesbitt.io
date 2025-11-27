---
layout: post
title: "Community Benchmarks for AI Coding Tools"
date: 2025-11-27 12:00 +0000
description: "AI coding benchmarks are heavily skewed toward Python and JavaScript. Framework maintainers could change that by defining what good code looks like in their ecosystems."
tags:
  - ai
  - open source
  - benchmarks
  - maintainers
---

If you've used AI coding tools outside of Python or JavaScript, you've probably noticed they get things wrong. Not syntax errors, but convention errors: old package versions, deprecated APIs, outdated idioms.

I've been looking into how open source code is used in training AI models. That led me to benchmarks, which is how AI companies measure whether their coding tools actually work. The major benchmarks are almost entirely Python. That makes sense: they're built by research engineers who use Python. But it means a diverse range of languages and communities in open source aren't represented in how these tools get evaluated.

- **[HumanEval](https://github.com/openai/human-eval)**: 164 Python problems
- **[MBPP](https://github.com/google-research/google-research/tree/master/mbpp)**: 1000+ Python problems
- **[SWE-bench](https://github.com/princeton-nlp/SWE-bench)**: Real GitHub issues, mostly Python repos
- **[DS-1000](https://github.com/xlang-ai/DS-1000)**: Data science tasks, Python only

This explains the gap. If a benchmark doesn't test your framework, AI providers have no signal on whether their tools work for it. And no incentive to improve.

Framework maintainers review AI-generated PRs regularly. They see the deprecated method calls, the wrong idioms, the hallucinated APIs. They know exactly what good code looks like for their framework. But there's no mechanism for that knowledge to feed back into how AI tools are evaluated.

## The idea

What if maintainers could define benchmarks for their own communities? A public repo where framework maintainers submit tests based on patterns they see in code review. Run those tests against AI models monthly via GitHub Actions. Publish the results.

The format would follow existing patterns like HumanEval and SWE-bench where possible. Each community would define its own quality standards: Does the code compile? Do tests pass? Does it follow framework conventions? Would it pass code review?

If this worked, maintainers would write benchmarks, AI providers would see specific failures, providers could use those benchmarks to improve training, and the cycle could repeat. Maintainers are already doing the hard part by identifying what's wrong with AI-generated code. This would capture that knowledge in a form that's useful.

Initial focus would be frameworks with user bases but minimal benchmark coverage. Ruby (Rails, Hanami, Sinatra), Elixir (Phoenix, LiveView), Go, Rust. Later expansion could include Gleam, Zig, Mojo, HTMX, Alpine.js, Nix. The specific frameworks would depend on which maintainers want to participate.

## Benchmark format

Something like this:

```yaml
ecosystem: "hanami"
version: "2.2"
language: "ruby"

tests:
  - id: "hanami-routing-001"
    category: "routing"
    prompt: |
      Create a Hanami route that accepts a user ID parameter
      and returns JSON with user details
    expected_files:
      - path: "config/routes.rb"
        contains:
          - "get '/users/:id'"
    test_command: "bundle exec rspec spec/requests/users_spec.rb"
```

Benchmarks would test things maintainers actually care about: correct API usage, current idioms, proper error handling, framework conventions. Not just "does it run" but "would this pass code review."

## If this worked

AI companies pay attention to benchmarks. If a community benchmark showed that Claude or GPT-4 was bad at Phoenix LiveView, that's the kind of thing that gets prioritized. Published results create pressure to improve.

More interesting to me: this would give open source maintainers a real channel into model training. Right now, AI companies scrape public code and train on it, but maintainers have no input into how that training is evaluated. These benchmarks would be a public, maintained signal from the people who actually know what good code looks like. Not a guarantee that AI companies would use them, but a much better position than having no voice at all.

There's also a documentation effect. Writing benchmarks forces you to articulate what good code looks like in your community. That's useful even if AI companies ignore it entirely.

Versioning matters too. Benchmarks could cover multiple major versions of a framework, so AI tools could be tested against Rails 7 and Rails 8 separately. When a new major version comes out, maintainers could add benchmarks for it immediately. That could shorten the lag time where AI tools suggest outdated patterns because the new version hasn't made it into training data yet.

## Open questions

There's a lot I haven't figured out yet. What's the right benchmark format? Function tests, code review scenarios, real bugs? How do you score results fairly across different communities? How do you keep benchmarks current as frameworks evolve? And for communities with multiple valid idioms (Rails vs dry-rb patterns, for example), who decides what "correct" looks like? Probably the answer is: whoever writes the benchmark for their community.

Further out, there's potential to expand beyond code. [Emma Irwin](https://sunnydeveloper.com/) pointed out that AI tools also suggest governance docs and contributing guides, where good suggestions depend on project context. But that's future scope.

I've written up more detail in a [proposal document](https://github.com/andrew/oss-community-benchmarks). If you maintain a framework outside the Python/JS mainstream and have thoughts on this, I'd like to hear from you. Reach out on [Mastodon](https://mastodon.social/@andrewnez) or open an issue on the repo.
