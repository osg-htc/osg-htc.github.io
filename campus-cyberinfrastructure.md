---
title: OSG’s Support for Campus Cyberinfrastructure Awardees
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
  - name: Support for CC* Campuses
    href: "#support-for-cc-campuses"
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

# OSG’s Support for Campus Cyberinfrastructure Awardees


<div class="p-3 my-4 bg-white-offset fs-5 rounded shadow">
    <h3 class="mt-0 text-center pb-3">CC* campuses are a cornerstone of Open Science</h3>
    <p class="text-center">
        Campuses with awards from the
        <a href="https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=504748">NSF Campus Cyberinfrastructure (CC*)</a>
        Program play an important role in supporting Open Science. To date, 37 CC* campuses contribute to the processing and storage capacity of the
        <a href="{{ '/services/ospool/' | relative_url }}">Open Science Pool (OSPool)</a> that is 
        harnessed weekly by more than 3M jobs.
    </p>
    <p class="mb-0 d-flex justify-content-center pt-3">
        <a class="btn btn-dark text-decoration-underline fs-5" href="mailto:support@osg-htc.org">Email Us</a>
        <a class="btn btn-dark text-decoration-underline ms-1 fs-5" href="#cc-campus-impact-on-open-science">Their Impact</a>
    </p>
</div>


{: .fs-5 }
Enhancing the capacity of Research Computing of US campuses through local deployment and cross campus sharing is 
fully aligned with the vision of our NSF funded project - [Partnership to Advance Throughput Computing (PATh)](https://path-cc.io). 
Our project is committed to supporting CC* projects through deployment and operation.


## Support for CC* Campuses

{: .fs-5 }
Campuses that hold a CC* award can draw on the OSG Consortium and [PATh](https://path-cc.io) throughout the life of 
their award. Our teams have experience with each of the following aspects of a CC* project:

{: .fs-5 }
- Sharing data with authorized users via the [Open Science Data Federation (OSDF)](/services/osdf.html)
- Bringing the power of high throughput computing via the [OSPool](/services/ospool/) to your researchers
- Meeting the resource sharing commitments in your award, and other options for integrating with the OSG Consortium
- Providing connections to help with data storage systems for shared inter-campus or intra-campus resources
  - We have collected [community data storage systems](/organization/osdf/example_data_origin.html) for your consideration
- Building [regional computing networks](https://osg-htc.org/spotlights/gpargo-cc-star.html)
- Developing science gateways to utilize high throughput computing via the [OSPool](/services/ospool/)

{: .fs-5 }
Please do not hesitate to contact us at 
[support@osg-htc.org](mailto:support@osg-htc.org) with 
questions about any of the above.

### Deployment

{: .fs-5 }
Our experienced and friendly team of engineers and facilitators is dedicated to supporting system engineers and 
campus research groups. This team provides networking, computing and data storage consulting, 
providing expertise and guidance.

{: .fs-5 }
These teams support your award to ensure smooth integration and onboarding into the OSPool or OSDF. 
The facilitation team also provides extensive support to researchers with regular training, weekly office hours, 
documentation, videos and more.

{: .fs-5 }
Please contact us at [help@osg-htc.org](mailto:help@osg-htc.org) to schedule a consultation to discuss deployment
of OSG resources at your campus.

### Operation

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


## CC* Campus impact on Open Science

{: .fs-5 }
The OSG Consortium has worked with CC* campuses for many years. 
These campuses have made significant contributions in support of science, both on their 
own campus and for the entire country.

### Computing

{: .fs-5 }
Campuses contribute core hours to researchers 
via the [OSPool](/services/ospool/), a compute resource accessible to any 
researcher affiliated with a US academic institution. These contributions support more than 230 
research groups, campuses, multi-campus collaborations, and gateways, and in fields of 
study ranging from the medicine to economics, and from genomics to physics.

### Data Storage

{: .fs-5 }
The [Open Science Data Federation](/services/osdf.html) integrates data origins, making data 
accessible via caches, of which many are strategically located in the R&E network backbone.
CC* awards for data storage require interoperability with a national and federated data sharing fabric such as PATh/OSDF,
and many CC* campuses meet that commitment through the OSDF.
