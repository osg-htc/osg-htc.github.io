---
title: "Latest News from the OSG"
layout: default
---

<h1>OSG News</h1>

{% for post in site.posts %}
{% if post.external_url %}
<a href="{{ post.external_url }}">{{ post.title }}</a> ({{ post.date | date_to_long_string }})
{% else %}
<a href="{{ post.url | relative_url }}">{{ post.title }}</a> ({{ post.date | date_to_long_string }})
{% endif %}
{{ post.excerpt }}
<hr/>
{% endfor %}

The OSG Consortium is pleased to see OSG stories reposted on the websites of other organizations.

The stories should be reposted with credits to the OSG website and the original authors, as well as a link to the original posting.

Any alterations to the text or images for the reposting should be agreed by the OSG Communications team.  Please email <mailto:osg-contact@opensciencegrid.org>.


