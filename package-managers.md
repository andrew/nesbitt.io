---
layout: default
title: Package Managers
permalink: /package-managers/
description: Posts about package management, dependency resolution, and software supply chain.
---

<p>Everything I've written about package managers, organized by type.</p>

{%- assign pm_posts = site.posts | where_exp: "post", "post.tags contains 'package-managers'" -%}

<h3>Reference</h3>

{%- assign reference_posts = pm_posts | where_exp: "post", "post.tags contains 'reference'" | sort: "title" -%}
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

<h3>Deep dives</h3>

{%- assign deepdive_posts = pm_posts | where_exp: "post", "post.tags contains 'deep-dive'" | sort: "title" -%}
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

<h3>Tools</h3>

{%- assign tools_posts = pm_posts | where_exp: "post", "post.tags contains 'tools'" | sort: "title" -%}
<section class="posts">
{%- for post in tools_posts -%}
<div class="post-item">
  <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
  {%- if post.description -%}
  <span class="post-description"> — {{ post.description }}</span>
  {%- endif -%}
</div>
{%- endfor -%}
</section>

<h3>Ideas</h3>

{%- assign idea_posts = pm_posts | where_exp: "post", "post.tags contains 'idea'" | sort: "title" -%}
<section class="posts">
{%- for post in idea_posts -%}
<div class="post-item">
  <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
  {%- if post.description -%}
  <span class="post-description"> — {{ post.description }}</span>
  {%- endif -%}
</div>
{%- endfor -%}
</section>

<h3>Security</h3>

{%- assign security_posts = pm_posts | where_exp: "post", "post.tags contains 'security'" | sort: "title" -%}
<section class="posts">
{%- for post in security_posts -%}
<div class="post-item">
  <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
  {%- if post.description -%}
  <span class="post-description"> — {{ post.description }}</span>
  {%- endif -%}
</div>
{%- endfor -%}
</section>

<h3>Satire</h3>

{%- assign satire_posts = pm_posts | where_exp: "post", "post.tags contains 'satire'" | sort: "title" -%}
<section class="posts">
{%- for post in satire_posts -%}
<div class="post-item">
  <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
  {%- if post.description -%}
  <span class="post-description"> — {{ post.description }}</span>
  {%- endif -%}
</div>
{%- endfor -%}
</section>

<h3>Everything else</h3>

{%- assign categorized_posts = reference_posts | concat: deepdive_posts | concat: tools_posts | concat: security_posts | concat: satire_posts | concat: idea_posts | map: "url" -%}
{%- assign other_posts = pm_posts | sort: "title" -%}
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
