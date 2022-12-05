---
title: OSG’s Support for Campus Cyberinfrastructure Proposals and Awardees
date: 2021-08-12 12:00:00 -0600
categories: NSF Campus Cyberinfrastructure (CC*)
layout: table-of-contents
js_extension:
- src: "https://unpkg.com/gridjs/dist/gridjs.umd.js"
  loading:
- src: "https://unpkg.com/lunr/lunr.js"
  loading:
- src: "/assets/js/pages/ccstar.js"
  loading: "defer"
  type: "module"
css_extension:
-  href: "https://unpkg.com/gridjs/dist/theme/mermaid.min.css"
table_of_contents:
  - name: How OSG can help your proposal
    href: "#let-osg-help-with-your-cc-proposal"
  - name: How OSG supports Awardees
    href: "#osgs-active-support-of-cc-awardees"
  - name: Actively Supported Colleges
    href: "#osg-supported-colleges-and-universities-contributing-via-the-cc-program"
  - name: CC* Impact on Open Science
    href: "#cc-campus-impact-on-open-science"
    children:
    - name: Computing
      href: "#computing"
    - name: Data Storage
      href: "#data-storage"

---

# OSG’s Support for Campus Cyberinfrastructure Proposals and Awardees

{% assign now = "now" | date: "%s" %}
{% if now < "1656392400" %}
<p class="fs-5 pt-2 pb-1">
<b>Upcoming Deadline: June 27th, 2022</b>
</p>
{% endif %}

<div class="p-3 my-4 bg-white-offset fs-5 rounded shadow">
    <h3 class="mt-0 text-center pb-3">We are here to help with your <a href="https://www.nsf.gov/publications/pub_summ.jsp?ods_key=nsf23526&org=NSF">CC* Proposal (NSF 23-526)</a>!</h3>
    <p class="text-center">
        Campuses with awards from the
        <a href="https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=504748">NSF Campus Cyberinfrastructure (CC*)</a>
        Program play an important role in the OSG Consortium. To date, 25 CC* campuses contribute to the more than
        5M core hours delivered weekly by the <a href="{{ '/services/open_science_pool/' | relative_url }}">Open Science Pool (OSPool)</a>.
    </p>
    <p class="mb-0 d-flex justify-content-center pt-3">
        <a class="btn btn-outline-dark fs-5" href="mailto:cc-star-proposals@osg-htc.org">Contact Us</a>
        <a class="btn btn-outline-dark ms-1 fs-5" href="#let-osg-help-with-your-cc-proposal">How We Can Help</a>
    </p>
</div>

{: .fs-5 }
The National Science Foundation Campus Cyberinfrastructure (CC*) program 
<a href="https://www.nsf.gov/publications/pub_summ.jsp?ods_key=nsf23526&org=NSF" target="_blank">(NSF 23-526)</a>
invests in coordinated campus and regional-level cyberinfrastructure improvements and 
innovation. The 2023 solicitation has three program areas which explicitly mention 
and encourage the use of OSG services to meet requirements.

{: .fs-5 }
The NSF explicitly mentions the OSG and [PATh](https://path-cc.io) in 3 of the 7 CC* program areas:

##### (4) Campus Computing and the Computing Continuum

{: .fs-5 }
NSF recommends reaching out to [PATh](https://path-cc.io) for "technical direction/expertise during their proposal
development" and suggests working with the OSG to contribute its "minimum of 20% shared time on the cluster" to the 
[OSPool](/services/open_science_pool).

##### (5) Regional Computing awards

{: .fs-5 }
NSF strongly encourages joining PATh, and suggests working with the OSG to contribute its "minimum of 20% shared time on the cluster" to the
[OSPool](/services/open_science_pool).

##### (6) Data Storage awards

{: .fs-5 }
NSF solely mentions the OSG's [Open Science Data Federation](/services/osdf.html) as a federated data sharing fabric to share
its required "20% of the disk/storage space on the proposed storage system."
  
## Let OSG Help with your CC* Proposal

{: .fs-5 }
The [Partnership to Advance Throughput Computing (PATh)](https://path-cc.io), which develops technologies 
and operates services for the OSG, has significant experience working with CC* applicants and awardees, and
offering letters of support and consulting for:

{: .fs-5 }
- Sharing data with authorized users via the [Open Science Data Federation (OSDF)](/services/osdf.html)
- Bringing the power of high throughput computing via the [OSPool](/services/open_science_pool.html) to your researchers
- Gathering science drivers and planning local computing resources
- Meeting CC*-required resource sharing as specified in <a href="https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=504748" target="_blank">(NSF 23-526)</a>, and other options for integrating with the OSG Consortium
- Providing connections to help with data storage systems for shared inter-campus or intra-campus resources
  - We have collected [community data storage systems](/organization/osdf/example_data_origin.html) for your consideration
- Building regional computing networks
- Developing science gateways to utilize high throughput computing via the [OSPool](/services/open_science_pool.html)

{: .fs-5 }
CC* applicants are encouraged to email OSG Support with questions or requests for letters of support regarding their CC* proposal.

<div class="bg-light py-3 my-2 mb-4">
<div class="row justify-content-center">
<div class="col-auto">
<a class="btn btn-primary fs-5" href="mailto:cc-star-proposals@osg-htc.org">Email OSG Leadership to Discuss CC* Opportunities</a>
</div>
</div>
</div>

## OSG’s active support of CC* Awardees

{: .fs-5 }
Our experienced and friendly team of engineers and facilitators is dedicated to 
supporting system engineers and campus research groups. This team provides networking, 
computing and data storage consulting in support of proposals,  providing expertise
and guidance.

{: .fs-5 }
Post award, these teams continue their support to ensure smooth integration and 
onboarding into the OSPool or OSDF. The facilitation team also provides extensive 
support to researchers with regular training, weekly office hours,  documentation, 
videos and more.

### OSG supported Colleges and Universities contributing via the CC* program:

<iframe width="100%" height="500px" frameBorder="0" style="margin-bottom:1em; margin-top:1em" src="https://map.opensciencegrid.org/map/iframe?view=CCStar#38.61687,-97.86621|4|hybrid"></iframe>

<div id="ccstar-table" class="row d-none">
    <div class="col-12 col-xl-7 col-lg-8 col-md-10">
        <input class="form-control" id="search" placeholder="Search Facility Details" type="search"/>
    </div>
</div>
<div id="wrapper" class="overflow-auto"></div>

<div class="modal fade" id="display" tabindex="-1" aria-labelledby="Name" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-fullscreen-lg-down">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="facility-Name" class="mb-0 facility-Name"></h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h5>Resources Provided</h5>
                <div class="row project-usage-row">
                    <div class="col-12 col-md-6 gpu-provided"></div>
                    <div class="col-12 col-md-6 cpu-provided"></div>
                    <div class="col-12 col-md-6 jobs-ran"></div>
                </div>
                <h5 class="pt-3">Science Impact</h5>
                <div class="row project-usage-row">
                    <div class="col-12 col-xl-6 projects-supported"></div>
                    <div class="col-12 col-xl-6 fields-of-science-supported"></div>
                    <div class="col-12 col-xl-6 organizations-supported"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

{: .fs-5 }
{% assign cc_star_sites = site.data.cc_star | sort: "name" %}
{% for cc_star_site in cc_star_sites %}
- <a href="{{ cc_star_site.href }}" target="_blank">{{ cc_star_site.name }}</a>{% endfor %}

### CC* Campus impact on Open Science

{: .fs-5 }
The OSG Consortium has been working with CC* campuses pre and post award for several years. 
These campuses have made significant contributions in support of science, both on their 
own campus and for the entire country.

#### Computing

{: .fs-5 }
In the last year, twenty-two campuses contributed over 235 million core hours to researchers 
via the [OSPool](/services/open_science_pool.html) (April 2021 - March 2022). These contributions supported more than 230 
research groups, campuses, multi-campus collaborations, and gateways, and in fields of 
study ranging from the medicine to economics, and from genomics to physics. Every month,
OSG services help additional campuses to support open science by sharing their resources 
via the OSPool.

#### Data Storage

{: .fs-5 }
As of March 2022, the [Open Science Data Federation](/services/osdf.html) integrates 10 data origins, making data 
accessible via 20 caches, 6 of which are strategically located in the R&E network backbone.
The CC* solicitation of 2022 (NSF 23-526) encourages responses that would add data origins 
or caches at campuses.
