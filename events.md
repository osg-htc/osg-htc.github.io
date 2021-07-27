---
title: Event Page
layout: default
---

<h1>Events</h1>

{% include get/future_events.html %}
{% assign num_events = future_events.size %}
{% assign num_events_sub_one = num_events | minus: 1 %}

{% for event_index in (0..num_events_sub_one) %}

{% assign date = future_events[event_index].start_date | date: "%e" %}
{% if future_events[event_index].end_date != future_events[event_index].start_date %}
    {% assign date = future_events[event_index].end_date | date: "-%e %B %Y" | prepend: date %}
{% else %}
    {% assign date = future_events[event_index].start_date | date: " %B %Y" | prepend: date %}
{% endif %}
    
<a href="{{ future_events[event_index].url | relative_url }}">{{ future_events[event_index].title }}</a> ({{ date }})

{{ future_events[event_index].excerpt }}

{% unless event_index == num_events_sub_one %}
<hr/>
{% endunless %}

{% endfor %}

<h2 class="pt-3 text-muted">Past Events</h2>

{% include get/past_events.html %}
{% assign num_events = past_events.size %}
{% assign num_events_sub_one = num_events | minus: 1 %}

{% for event_index in (0..num_events_sub_one) %}

{% assign date = past_events[event_index].start_date | date: "%e" %}
{% if past_events[event_index].end_date != past_events[event_index].start_date %}
{% assign date = past_events[event_index].end_date | date: "-%e %B %Y" | prepend: date %}
{% else %}
{% assign date = past_events[event_index].start_date | date: " %B %Y" | prepend: date %}
{% endif %}

<a href="{{ past_events[event_index].url | relative_url }}">{{ past_events[event_index].title }}</a> ({{ date }})

{{ past_events[event_index].excerpt }}

{% unless event_index == num_events_sub_one %}
<hr/>
{% endunless %}

{% endfor %}

