---
layout: default
title: This Week in Source Control
permalink: /twisc/
description: A weekly roundup of releases, advisories, and articles from across version control and forges, published on Wednesdays.
---

{%- assign series_posts = site.posts | where_exp: "post", "post.tags contains 'twisc'" -%}
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
    "numberOfItems": {{ series_posts.size }},
    "itemListElement": [
      {%- for post in series_posts -%}
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

<p>A weekly roundup of source control client and forge releases, security advisories and articles, published on Wednesdays. Package management news is in <a href="/twipm/">This Week in Package Management</a> on Saturdays.</p>

{%- assign posts_by_year = series_posts | group_by_exp: "post", "post.date | date: '%Y'" -%}
{%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
{%- for year in posts_by_year -%}
<h3>{{ year.name }}</h3>
<section class="posts">
  {%- for post in year.items -%}
  <div class="post-item">
    <h4>
      <a class="post-link" href="{{ post.url | relative_url }}">
        {{ post.title | escape }}
      </a>
    </h4>
    <p class="post-meta">{{ post.date | date: date_format }}</p>
  </div>
  {%- endfor -%}
</section>
{%- endfor -%}
