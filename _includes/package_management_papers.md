{% for section in site.data.package_management_papers.sections %}
<section class="papers-section" markdown="1">

## {{ section.title }}

{% if section.description %}{{ section.description }}

{% endif %}{% for paper in section.papers %}
<div class="paper" markdown="1">

**[{{ paper.title }}]({{ paper.url }})**{% if paper.archive_url %} ([archive]({{ paper.archive_url }})){% endif %}{% if paper.github_url %} | [GitHub]({{ paper.github_url }}){% endif %} ({{ paper.year }})
{% if paper.authors %}*{{ paper.authors }}*
{% endif %}{% if paper.venue %}{{ paper.venue }}
{% endif %}
{{ paper.notes }}

</div>

{% endfor %}
</section>

{% endfor %}
