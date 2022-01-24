---
    layout: blank
---
{% assign split_url = page.url | split: "/" %}
{% assign file_name = split_url[-1] %}
<meta http-equiv="refresh" content="0;URL='{{site.url}}/spotlights/{{file_name}}'" />