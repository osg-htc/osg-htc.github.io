---
title: Event Page
layout: default
---

<h1>OSG Events</h1>

{% assign events = site.events %}
{% assign num_events = events.size %}
{% assign num_events_sub_one = num_events | minus: 1 %}

{% for event_index in (0..num_events_sub_one) %}

{% assign date = events[event_index].start_date | date: "%e" %}
{% if events[event_index].end_date != events[event_index].start_date %}
{% assign date = events[event_index].end_date | date: "-%e %B %Y" | prepend: date %}
{% else %}
{% assign date = events[event_index].start_date | date: " %B %Y" | prepend: date %}
{% endif %}

<a href="{{ events[event_index].url | relative_url }}">{{ events[event_index].title }}</a> ({{ date }})

{{ events[event_index].excerpt }}

{% unless event_index == num_events_sub_one %}
<hr/>
{% endunless %}

{% endfor %}

