---
layout: page
title: Security
permalink: /security/
description: Posts about software supply chain security, threat models, and the things that go wrong.
---

{%- assign sec_posts_all = site.posts | where_exp: "post", "post.tags contains 'security'" -%}
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
    "numberOfItems": {{ sec_posts_all.size }},
    "itemListElement": [
      {%- for post in sec_posts_all -%}
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

<p>Everything I've written about security, organized by type.</p>

<nav class="page-chips" aria-label="Sections">
  <a class="page-chip" href="#reference">Reference</a>
  <a class="page-chip" href="#package-managers">Package managers</a>
  <a class="page-chip" href="#supply-chain">Supply chain</a>
  <a class="page-chip" href="#ai">AI</a>
  <a class="page-chip" href="#tools">Tools</a>
  <a class="page-chip" href="#satire">Satire</a>
  <a class="page-chip" href="#everything-else">Everything else</a>
</nav>

{%- assign sec_posts = site.posts | where_exp: "post", "post.tags contains 'security'" -%}

<h3 id="reference">Reference</h3>

{%- assign reference_posts = sec_posts | where_exp: "post", "post.tags contains 'reference'" | sort: "title" -%}
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

<h3 id="package-managers">Package managers</h3>

{%- assign pm_posts = sec_posts | where_exp: "post", "post.tags contains 'package-managers'" | sort: "title" -%}
<section class="posts">
{%- for post in pm_posts -%}
{%- unless post.tags contains 'supply-chain' -%}
<div class="post-item">
  <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
  {%- if post.description -%}
  <span class="post-description"> — {{ post.description }}</span>
  {%- endif -%}
</div>
{%- endunless -%}
{%- endfor -%}
</section>

<h3 id="supply-chain">Supply chain</h3>

{%- assign supplychain_posts = sec_posts | where_exp: "post", "post.tags contains 'supply-chain'" | sort: "title" -%}
<section class="posts">
{%- for post in supplychain_posts -%}
<div class="post-item">
  <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
  {%- if post.description -%}
  <span class="post-description"> — {{ post.description }}</span>
  {%- endif -%}
</div>
{%- endfor -%}
</section>

<h3 id="ai">AI</h3>

{%- assign ai_posts = sec_posts | where_exp: "post", "post.tags contains 'ai'" | sort: "title" -%}
<section class="posts">
{%- for post in ai_posts -%}
<div class="post-item">
  <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
  {%- if post.description -%}
  <span class="post-description"> — {{ post.description }}</span>
  {%- endif -%}
</div>
{%- endfor -%}
</section>

<h3 id="tools">Tools</h3>

{%- assign tools_posts = sec_posts | where_exp: "post", "post.tags contains 'tools'" | sort: "title" -%}
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

<h3 id="satire">Satire</h3>

{%- assign satire_posts = sec_posts | where_exp: "post", "post.tags contains 'satire'" | sort: "title" -%}
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

<h3 id="everything-else">Everything else</h3>

{%- assign categorized_posts = reference_posts | concat: pm_posts | concat: supplychain_posts | concat: ai_posts | concat: tools_posts | concat: satire_posts | map: "url" -%}
{%- assign other_posts = sec_posts | sort: "title" -%}
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
