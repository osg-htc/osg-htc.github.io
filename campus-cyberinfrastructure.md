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

{: .fs-5 }
The National Science Foundation Campus Cyberinfrastructure (CC*) program 
<a href="https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=504748" target="_blank">(NSF 22-582)</a>
invests in coordinated campus and regional-level cyberinfrastructure improvements and 
innovation. The 2022 solicitation has two program areas, both of which explicitly mention 
and encourage the use of OSG services to meet requirements.

{: .fs-5 }
The NSF supports awards in 2 CC* program areas:

{: .fs-5 }
- Data Storage awards, which mention the OSG [Open Science Data Federation](/services/osdf.html), 
  encouraging responses that would add data origins or caches at campuses
- Regional Computing awards, in which the NSF strongly encourages joining PATh, and using our 
  services to contribute to the [Open Science Pool](/services/open_science_pool.html)
  
## Let OSG Help with your CC* Proposal

{: .fs-5 }
The [Partnership to Advance Throughput Computing (PATh)](https://path-cc.io), which develops technologies 
and operates services for the OSG, has significant experience working with CC* applicants and awardees, and
offering letters of support and consulting for:

{: .fs-5 }
- Sharing data with authorized users via the [Open Science Data Federation (OSDF)](/services/osdf.html)
- Bringing the power of high throughput computing via the [OSPool](/services/open_science_pool.html) to your researchers
- Gathering science drivers and planning local computing resources
- Meeting CC*-required resource sharing as specified in <a href="https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=504748" target="_blank">(NSF 22-582)</a>, and other options for integrating with the OSG Consortium
- Providing connections to help with data storage systems for shared inter-campus or intra-campus resources
  - We have collected [community data storage systems](/organization/osdf/example_data_origin.html) for your consideration
- Building regional computing networks
- Developing science gateways to utilize high throughput computing via the [OSPool](/services/open_science_pool.html)

{: .fs-5 }
CC* applicants are encouraged to email OSG Support with questions or requests for letters of support regarding their CC* proposal.

<div class="bg-light py-3 my-2 mb-4">
<div class="row justify-content-center">
<div class="col-auto">
<a class="btn btn-primary fs-5" href="mailto:cc-star-proposals@opensciencegrid.org">Email OSG Leadership to Discuss CC* Opportunities</a>
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

<div class="row d-none">
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
- <a href="https://www.amnh.org/research/computational-sciences" target="_blank">American Museum of Natural History</a>
- <a href="https://sites.clarkson.edu/acres/" target="_blank">Clarkson University</a>
- <a href="https://www.fandm.edu/" target="_blank">Franklin and Marshall College</a>
- <a href="https://pace.gatech.edu/" target="_blank">Georgia Institute of Technology</a>
- <a href="https://lamar.edu" target="_blank">Lamar University</a>
- <a href="https://www1.lehigh.edu/" target="_blank">Lehigh University</a>
- <a href="http://www.hpc.lsu.edu/about/index.php" target="_blank"> Louisiana State University</a>
- <a href="https://www.lsuhsc.edu/" target="_blank">LSU Health</a>
- <a href="https://www.psu.edu/" target="_blank">Penn State</a>
- <a href="https://www.pdx.edu/" target="_blank">Portland State University</a>
- <a href="https://www.purdue.edu/newsroom/releases/2019/Q3/nsf-supports-purdue-team-developing-online-manufacturing-education.html" target="_blank">Purdue University</a>
- <a href="https://www.rhodes.edu/" target="_blank">Rhodes University</a>
- <a href="https://www.rice.edu/" target="_blank">Rice University</a>
- <a href="https://www.siue.edu/its/cyberinfrastructure/" target="_blank">Southern Illinois University Edwardsville</a>
- <a href="https://news.syr.edu/blog/2020/09/03/national-science-foundation-awards-390000-to-syracuse-university-computing-initiative/" target="_blank">Syracuse University</a>
- <a href="https://tcnj.edu/" target="_blank">The College of New Jersey</a>
- <a href="https://now.tufts.edu/articles/tufts-awarded-nsf-grant-expand-big-data-innovation-and-discovery" target="_blank">Tufts University</a>
- <a href="https://www.ua.edu/" target="_blank">University of Alabama</a>
- <a href="https://ucsdnews.ucsd.edu/pressrelease/sdsc-awarded-nsf-grant-for-triton-shared-computing-cluster-upgrade" target="_blank">University of California San Diego</a>
- <a href="https://www.colorado.edu/rc/" target="_blank"> University of Colorado Boulder</a>
- <a href="https://www.ucdenver.edu/" target="_blank">University of Colorado Denver</a>
- <a href="https://news.engr.uconn.edu/500k-nsf-grant-awarded-to-dr-bing-wang-uconn-health-center-2.php" target="_blank">University of Connecticut</a>
- <a href="https://www.nd.edu/" target="_blank">University of Notre Dame</a>
- <a href="https://www.usc.edu/" target="_blank">University of Southern California</a>
- <a href="https://www.utc.edu/" target="_blank">University of Tennessee-Chattanooga</a>
- <a href="https://www1.villanova.edu/university.html" target="_blank">University of Villanova</a>
- <a href="https://www.uwb.edu/" target="_blank">University of Washington-Bothell</a>
- <a href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=1925467&HistoricalAwards=false" target="_blank">Wayne State University</a>
- <a href="https://www.wtamu.edu/" target="_blank">West Texas A&M University</a>

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
The CC* solicitation of 2022 (NSF 22-582) encourages responses that would add data origins 
or caches at campuses.
