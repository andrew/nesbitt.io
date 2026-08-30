---
layout: default
title: Most Referenced Posts
permalink: /most-referenced/
description: Posts on this site ranked by how many other posts link to them.
---

<section class="posts">
  <h3>Most Referenced Posts</h3>
  <p>Posts ranked by how many other posts on this site link to them. Data from <a href="https://github.com/andrew/jekyll-stats">jekyll-stats</a>.</p>
  {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
  {%- assign entries = site.data.stats.internal_links | where_exp: "e", "e.inbound_count > 1" -%}
  {%- for entry in entries -%}
  {%- assign post = site.posts | where: "url", entry.url | first -%}
  <div class="post-item">
    <h4>
      <a class="post-link" href="{{ entry.url | relative_url }}">
        {{ entry.title | escape }}
      </a>
    </h4>
    <p class="post-meta">
      Referenced by {{ entry.inbound_count }} posts
      {%- if post %} &middot; {{ post.date | date: date_format }}{% endif -%}
      {%- if post.tags.size > 0 -%}
      <span class="post-tags">
        {%- for tag in post.tags -%}
        <a href="/search#{{ tag | url_encode }}" class="post-tag">{{ tag }}</a>
        {%- endfor -%}
      </span>
      {%- endif -%}
    </p>
    {%- if post.description -%}
    <p class="post-description">{{ post.description }}</p>
    {%- endif -%}
  </div>
  {%- endfor -%}
</section>
