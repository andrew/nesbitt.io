---
layout: default
title: All Posts
permalink: /posts/
description: Articles about package management, software supply chain security, and open source infrastructure.
---

<h3>Archives</h3>

{%- assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" -%}
<ul>
{%- for year in posts_by_year -%}
  <li>
    <a href="/{{ year.name }}/">{{ year.name }}</a>
    {%- assign months_in_year = year.items | group_by_exp: "post", "post.date | date: '%m'" -%}
    <ul>
    {%- for month in months_in_year -%}
      {%- assign month_name = month.items.first.date | date: "%B" -%}
      <li><a href="/{{ year.name }}/{{ month.name }}/">{{ month_name }}</a> ({{ month.size }})</li>
    {%- endfor -%}
    </ul>
  </li>
{%- endfor -%}
</ul>

{%- for year in posts_by_year -%}
<h3><a href="/{{ year.name }}/">{{ year.name }}</a></h3>
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
