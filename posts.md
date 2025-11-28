---
layout: default
title: Posts
permalink: /posts/
---

{%- assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" -%}
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
    {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
    <p class="post-meta">{{ post.date | date: date_format }}</p>
    {%- if post.description -%}
    <p class="post-description">{{ post.description }}</p>
    {%- endif -%}
  </div>
  {%- endfor -%}
</section>
{%- endfor -%}
