---
layout: page
title: Git
permalink: /git/
description: Posts about git internals, extensions, and tools built on git.
---

{%- assign git_posts_all = site.posts | where_exp: "post", "post.tags contains 'git'" -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "{{ page.title }}",
  "description": "{{ page.description }}",
  "url": "{{ page.url | absolute_url }}",
  "isPartOf": {
    "@type": "Blog",
    "name": "{{ site.title }}",
    "url": "{{ site.url }}"
  },
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": {{ git_posts_all.size }},
    "itemListElement": [
      {%- for post in git_posts_all -%}
      {
        "@type": "ListItem",
        "position": {{ forloop.index }},
        "url": "{{ post.url | absolute_url }}"
      }{%- unless forloop.last -%},{%- endunless -%}
      {%- endfor -%}
    ]
  }
}
</script>

<p>Everything I've written about git, organized by type.</p>

{%- assign git_posts = site.posts | where_exp: "post", "post.tags contains 'git'" -%}

<h3>Reference</h3>

{%- assign reference_posts = git_posts | where_exp: "post", "post.tags contains 'reference'" | sort: "title" -%}
<section class="posts">
{%- for post in reference_posts -%}
<div class="post-item">
  <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
  {%- if post.description -%}
  <span class="post-description"> — {{ post.description }}</span>
  {%- endif -%}
</div>
{%- endfor -%}
</section>

<h3>git-pkgs</h3>

{%- assign gitpkgs_posts = git_posts | where_exp: "post", "post.tags contains 'git-pkgs'" | sort: "title" -%}
<section class="posts">
{%- for post in gitpkgs_posts -%}
<div class="post-item">
  <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
  {%- if post.description -%}
  <span class="post-description"> — {{ post.description }}</span>
  {%- endif -%}
</div>
{%- endfor -%}
</section>

<h3>GitHub</h3>

{%- assign github_posts = git_posts | where_exp: "post", "post.tags contains 'github'" | sort: "title" -%}
<section class="posts">
{%- for post in github_posts -%}
<div class="post-item">
  <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
  {%- if post.description -%}
  <span class="post-description"> — {{ post.description }}</span>
  {%- endif -%}
</div>
{%- endfor -%}
</section>

<h3>Deep dives</h3>

{%- assign deepdive_posts = git_posts | where_exp: "post", "post.tags contains 'deep-dive'" | sort: "title" -%}
<section class="posts">
{%- for post in deepdive_posts -%}
<div class="post-item">
  <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
  {%- if post.description -%}
  <span class="post-description"> — {{ post.description }}</span>
  {%- endif -%}
</div>
{%- endfor -%}
</section>

<h3>Everything else</h3>

{%- assign categorized_posts = reference_posts | concat: gitpkgs_posts | concat: github_posts | concat: deepdive_posts | map: "url" -%}
{%- assign other_posts = git_posts | sort: "title" -%}
<section class="posts">
{%- for post in other_posts -%}
{%- unless categorized_posts contains post.url -%}
<div class="post-item">
  <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
  {%- if post.description -%}
  <span class="post-description"> — {{ post.description }}</span>
  {%- endif -%}
</div>
{%- endunless -%}
{%- endfor -%}
</section>
