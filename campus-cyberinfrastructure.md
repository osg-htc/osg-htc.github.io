---
title: OSG’s Support for Campus Cyberinfrastructure Proposals and Awardees
date: 2024-02-05 12:00:00 -0600
categories: NSF Campus Cyberinfrastructure (CC*)
layout: table-of-contents
js_extension:
- src: "https://unpkg.com/gridjs/dist/gridjs.umd.js"
  loading:
- src: "https://unpkg.com/lunr/lunr.js"
  loading:
- src: "/assets/js/pages/ccstar_v1.js"
  loading: "defer"
  type: "module"
css_extension:
-  href: "https://unpkg.com/gridjs/dist/theme/mermaid.min.css"
table_of_contents:
  - name: How OSG can help your proposal
    href: "#let-the-path-team-help-with-your-proposal"
    children: 
      - name: Deployment
        href: '#deployment'
      - name: Operation
        href: '#operation'
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
{% if now < "1713830399" %}
<p class="fs-5 pt-2 pb-1 text-primary">
<b>Upcoming Deadlines: April 22nd and October 15th, 2024</b>
</p>
{% endif %}

{% assign now = "now" | date: "%s" %}
{% if now < "1729036799" and now > "1729036799" %}
<p class="fs-5 pt-2 pb-1 text-primary">
<b>Upcoming Deadline: October 15th, 2024</b>
</p>
{% endif %}

{% assign now = "now" | date: "%s" %}
{% if now < "1729036799" %}

<div class="p-3 my-4 bg-white-offset fs-5 rounded shadow">
    <h3 class="mt-0 text-center pb-3">We are here to help with your <a href="https://new.nsf.gov/funding/opportunities/campus-cyberinfrastructure-cc/nsf24-530/solicitation">CC* Proposal (NSF 24-530)!</a></h3>
    <p class="text-center">
        Campuses with awards from the
        <a href="https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=504748">NSF Campus Cyberinfrastructure (CC*)</a>
        Program play an important role in supporting Open Science. To date, 37 CC* campuses contribute to the processing and storage capacity of the
        <a href="{{ '/services/open_science_pool.html' | relative_url }}">Open Science Pool (OSPool)</a> that is 
        harnessed weekly by more than 3M jobs.
    </p>
    <p class="mb-0 d-flex justify-content-center pt-3">
        <a class="btn btn-dark text-decoration-underline fs-5" href="mailto:cc-star-proposals@osg-htc.org">Email Us</a>
        <a class="btn btn-dark text-decoration-underline ms-1 fs-5" href="#let-the-path-team-help-with-your-proposal">How We Can Help</a>
    </p>
</div>


{: .fs-5 }
Enhancing the capacity of Research Computing of US campuses through local deployment and cross campus sharing is 
fully aligned with the vision of our NSF funded project - [Partnership to Advance Throughput Computing (PATh)](https://path-cc.io). 
Our project is committed to support CC* projects from proposal, through deployment, to operation.


## [Proposal](https://new.nsf.gov/funding/opportunities/campus-cyberinfrastructure-cc/nsf24-530/solicitation)

<div class="border p-3 mt-3 mb-3 pb-0 rounded bg-light" markdown="1">

{: .fs-5 }
Proposals in response to the 2024 CC* program solicitation
([NSF 24-530](https://new.nsf.gov/funding/opportunities/campus-cyberinfrastructure-cc/nsf24-530/solicitation)) are due on 15 October 2024.
Please contact us at [cc-star-proposals@osg-htc.org](mailto:cc-star-proposals@osg-htc.org)
(the earlier the better!) with any questions or requests
you may have regarding the involvement of [PATh](https://path-cc.io) in your proposed project.
Our technology and services are readily available to support a spectrum of CC* projects.

{: .fs-5 }
The
[NSF 24-530](https://new.nsf.gov/funding/opportunities/campus-cyberinfrastructure-cc/nsf24-530/solicitation)
solicitation explicitly mentions the OSG services we provide as a means to meet requirements for the following areas:

{: .fs-5 }
__(2) Computing and the Computing Continuum for the Campus or Region__

{: .fs-5 }

NSF notes that "All Area (2) proposals should commit to a minimum of 20% shared time and describe their approach to making the computing resource available as a shared resource external to the state/region and the institution(s) being primarily served. Proposals are strongly encouraged to address this requirement by joining the [Partnerships to Advance Throughput Computing (PATh)](https://path-cc.io) campus federation and adopting an appropriate subset of PATh services to make the resource available to researchers on a national scale. Proposals are encouraged to include a letter of collaboration from the selected platform and describe how they will track and report on meeting the 20% extramural usage goal each year. Institutions in need of technical direction/expertise during their proposal development are encouraged to engage the NSF-funded PATh project at: [https://path-cc.io](https://path-cc.io)."

{: .fs-5 }
__(4) Data Storage and Digital Archives for the Campus or Region__

{: .fs-5 }
NSF states that "All Area (4) proposals are required to have interoperability with a national and federated data sharing fabric such as PATh/OSDF(see: [http://www.osg-htc.org/about/osdf](http://www.opensciencegrid.org/about/osdf)). At least 20% of the disk/storage space on the proposed storage system should be made available as part of the chosen federated data sharing fabric."

{: .fs-5 }


</div>

{% endif %}



## Let the PATh team help with your proposal

{: .fs-5 }
The National Science Foundation Campus Cyberinfrastructure (CC*) program
([NSF 24-530](https://new.nsf.gov/funding/opportunities/campus-cyberinfrastructure-cc/nsf24-530/solicitation)) invests in coordinated campus 
and regional-level cyberinfrastructure improvements and innovation.

{: .fs-5 }
[PATh](https://path-cc.io) has experience offering consulting to CC* projects during the proposal phase for the 
following aspects of the proposed project:

{: .fs-5 }
- Sharing data with authorized users via the [Open Science Data Federation (OSDF)](/services/osdf.html)
- Bringing the power of high throughput computing via the [OSPool](/services/open_science_pool.html) to your researchers
- Meeting CC*-required resource sharing as specified in <a href="https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=504748" target="_blank">(NSF 24-530)</a>, and other options for integrating with the OSG Consortium
- Providing connections to help with data storage systems for shared inter-campus or intra-campus resources
  - We have collected [community data storage systems](/organization/osdf/example_data_origin.html) for your consideration
- Building [regional computing networks](https://osg-htc.org/spotlights/gpargo-cc-star.html)
- Developing science gateways to utilize high throughput computing via the [OSPool](/services/open_science_pool.html)

{: .fs-5 }
Please do not hesitate (or wait too long) to contact us at 
[cc-star-proposals@osg-htc.org](mailto:cc-star-proposals@osg-htc.org) with 
questions or requests for letters of support regarding your CC* proposed project.

## Deployment

{: .fs-5 }
Our experienced and friendly team of engineers and facilitators is dedicated to supporting system engineers and 
campus research groups. This team provides networking, computing and data storage consulting in support of 
proposals, providing expertise and guidance.

{: .fs-5 }
Post award, these teams continue their support to ensure smooth integration and onboarding into the OSPool or OSDF. 
The facilitation team also provides extensive support to researchers with regular training, weekly office hours, 
documentation, videos and more.

{: .fs-5 }
Please contact us at [help@osg-htc.org](mailto:help@osg-htc.org) to schedule a consultation to discuss deployment
of OSG resources at your campus.

## Operation

{: .fs-5 }
After your campus has integrated with the OSPool or OSDF, our team offers continued support to make the best use of 
computational resources at your campus. This includes troubleshooting of OSG services as well as providing accounting
data for the research projects and kinds of research making use of your resources. Also, our CC* liaison will meet with
you periodically to see how things are going and what we can do to better support you.

{: .fs-5 }
Our staff remains available to assist you with meeting your goals as your research computing needs evolve. If you or 
your researchers have any questions or issues, please contact us at [support@osg-htc.org](mailto:support@osg-htc.org).

<iframe width="100%" height="500px" frameBorder="0" style="margin-bottom:1em; margin-top:1em" src="https://map.osg-htc.org/map/iframe?view=CCStar#38.61687,-97.86621|4|hybrid"></iframe>



<div class="accordion" id="accordionFlushExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="flush-headingOne">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
        CC* Institutional Contributions
      </button>
    </h2>
    <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body">
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
                        <h5 class="pt-3">Science Impact</h5>
                        <div class="row project-usage-row">
                            <div class="col-12 col-xl-6 projects-supported"></div>
                            <div class="col-12 col-xl-6 fields-of-science-supported"></div>
                            <div class="col-12 col-xl-6 organizations-supported"></div>
                        </div>
                        <h5>Resources Provided</h5>
                        <div class="row project-usage-row">
                            <div class="col-12 col-md-6 jobs-ran"></div>
                            <div class="col-12 col-md-6 cpu-provided"></div>
                            <div class="col-12 col-md-6 gpu-provided"></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="flush-headingTwo">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
        All CC* Institutions
      </button>
    </h2>
    <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body">
        <ul>
          {% assign cc_star_sites = site.data.cc_star | sort: "name" %} 
          {% for cc_star_site in cc_star_sites %}
            <li><a href="{{ cc_star_site.href }}">{{ cc_star_site.name }}</a></li>
          {% endfor %}
        </ul>
      </div>
    </div>
  </div>
</div>


### CC* Campus impact on Open Science

{: .fs-5 }
The OSG Consortium has been working with CC* campuses pre and post award for several years. 
These campuses have made significant contributions in support of science, both on their 
own campus and for the entire country.

#### Computing

{: .fs-5 }
Campuses contribute core hours to researchers 
via the [OSPool](/services/open_science_pool.html), a compute resource accessible to any 
researcher affiliated with a US academic institution. These contributions support more than 230 
research groups, campuses, multi-campus collaborations, and gateways, and in fields of 
study ranging from the medicine to economics, and from genomics to physics.

#### Data Storage

{: .fs-5 }
The [Open Science Data Federation](/services/osdf.html) integrates data origins, making data 
accessible via caches, of which many are strategically located in the R&E network backbone.
The CC* solicitation of 2024 (NSF 24-530) requires interoperability with a national and federated data sharing fabric such as PATh/OSDFs.
