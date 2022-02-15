---
published: false
---

# Articles
Contains all articles published on the various CHTC influenced websites.

## Creating a new Article
To create a new article add a new file to the root of this repo with the following format:

```markdown
YEAR-MONTH-DAY-title.md
```

Then include the following frontmatter

```yaml
---
title: 
author: 
publish_on:
    - <htcondor, path, osg, chtc>
canonical_url: 
image:
  path: https://raw.githubusercontent.com/CHTC/Articles/main/images/...
  alt: 
description: <I would make this the same as excerpt>
banner_src: https://raw.githubusercontent.com/CHTC/Articles/main/images/...
card_src: https://raw.githubusercontent.com/CHTC/Articles/main/images/...
card_alt: 
excerpt: |
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consectetur 
    enim lacus, eget feugiat turpis porta sit amet. Mauris cursus lectus vitae 
    luctus accumsan. Nullam sit amet condimentum tortor, sed feugiat augue. Quisque 
    lobortis neque non aliquam faucibus. Nam ultrices nunc ex, sed pulvinar orci 
    bibendum in.
---
```

## Things to remember when working in this folder

- `date` is omitted on purpose, Jekyll populates this field from the filename.
    - Discrepancy in front matter and filename dates can cause unexpected results

- All images must be absolute
    - As these images will be served from a variety of folders and depths you must use an absolute url 
    - Absolute URL to use: `https://raw.githubusercontent.com/CHTC/Articles/main/images/`
    
