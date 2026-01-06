---
layout: page
title: Search
permalink: /search/
---

<input type="text" id="search-input" placeholder="Search posts...">

<div id="search-tags">
{% for tag in site.data.stats.tags limit:15 %}<a href="#" class="search-tag" data-tag="{{ tag.name }}">{{ tag.name }}</a> {% endfor %}
</div>

<div id="search-results"></div>

<script src="/search.js"></script>
