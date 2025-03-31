---
title: Open Science Data Federation
layout: text-optimized-width
---


<figure class="w-100 figure">
    <iframe width="100%" height="500px" frameBorder="0" style="margin-top:1em" allow="fullscreen" src="https://map.osg-htc.org/map/iframe?view=OpenScienceDataFederation#45.737115,-45.140436|2"></iframe>
    <figcaption>US Map featuring the locations of current OSDF <a href="/docs/data/stashcache/overview/#architecture">architectural components</a>.</figcaption>
</figure>

## Open Science Data Federation

The Open Science Data Federation (OSDF) connects disparate dataset repositories into a single, nation-wide data distribution network. Leveraging the OSDF, providers can make their datasets available to a wide variety of compute users, from browsers to Jupyter notebooks to high throughput computing environments.

The OSDF is part of the OSG Fabric of Services, running software developed by the [Pelican Platform](https://pelicanplatform.org/).

There are many ways to participate in the OSDF. Read on for three different ways to engage. 

{: .mini-bar}
### Share

The OSDF may be for you if...
- You are part of a collaborative project that works with shared data sets
- You have generated data as part of a project and want to share it

<div class="alert alert-light border-0 shadow d-flex flex-column">
<h5 class="mx-auto">Want to make your dataset available via the OSDF?</h5>
<a class="btn btn-secondary mx-auto d-block mt-3" href="mailto:support@osg-htc.org">Contact OSDF Support Staff</a>
</div>

{: .mini-bar}
### Contribute

The OSDF can be a platform for sharing data from your institution or contributing infrastructure to a national project. These are some ways that institutions and communities can contribute to the OSDF: 

- Provide unused storage space for other groups or projects to use via the OSDF
- Host infrastructure to make the OSDF more robust, like a local cache

<div class="alert alert-light border-0 shadow d-flex flex-column">
<h5 class="mx-auto">Want to contribute to the OSDF infrastructure?</h5>
<a class="btn btn-secondary mx-auto d-block mt-3" href="https://docs.google.com/forms/d/e/1FAIpQLSem2Lu-9nL2DBOXrSzmHTWdBZHsMmVN_pIq5ITSnj4A51BTLw/viewform?usp=header">Request a Meeting</a>
</div>

{: .mini-bar}
### Use

The OSDF may be for you if...
- You are using the OSPool to analyze or produce data. 
- You want to analyze data that has been shared on the OSDF.

<div class="alert  alert-light border-0 shadow d-flex flex-column">
<h5 class="mx-auto">Want to use or process data hosted on the OSDF? </h5>
<div class="row justify-content-center">
<div class="col-auto">
<a class="btn btn-secondary mx-auto d-block mt-3" href="mailto:support@osg-htc.org">Contact OSDF Support Staff</a>
</div>
<div class="col-auto d-flex">
<div class="my-auto pt-2">or</div>
</div>
<div class="col-auto">
<a class="btn btn-secondary mx-auto d-block mt-3" href="mailto:support@osg-htc.org">Request an OSPool Account</a>
</div>
</div>
</div>


## FAQ

### Who can use the OSDF?

Any US-based academic, government, or non-profit institution may connect their object store to the OSDF.

Researchers using the [OSPool](https://osg-htc.org/services/open_science_pool.html) from an [OSG-operated Access Point](https://osg-htc.org/services/access-point) automatically get an allocation on a local filesystem connected to the OSDF.

### Can I get storage on the OSDF? / OSDF and CC* Storage

What about a researcher or community that would like to connect to the OSDF but doesn’t have their own storage infrastructure?

-   A half dozen [CC* Storage projects](https://new.nsf.gov/funding/opportunities/cc-campus-cyberinfrastructure) have committed to having their storage managed by OSG; projects can request space from the OSG for their use via the support desk.

-   Researchers can request an [OSN](https://openstoragenetwork.readthedocs.io/en/latest/) allocation from ACCESS and request OSG connect their bucket to the OSDF.

### What is needed to contribute to the OSDF? 

The “origin” service connects the backend object store (a POSIX filesystem, S3-compatible endpoint, or HTTP endpoint) with the national infrastructure. The origin service needs access to the storage and incoming connectivity from the external infrastructure.

Most origin backends are currently a mounted shared filesystem and S3 endpoints like those found on AWS or [OSN](https://www.openstoragenetwork.org/) are increasingly common. To ease operations, the OSG Consortium offers a “hosted origin service” where central experts will install and operate the origin as a container. The container is most often deployed via on-prem hardware deployed as part of the [National Research Platform](https://nationalresearchplatform.org/) or an institutional Kubernetes cluster and inside a [ScienceDMZ](https://fasterdata.es.net/science-dmz/).

If the repository runs their own origin, this can be done on “bare metal” with native packages or as a container operated by the institution.

The hardware needed for the origin varies widely based on expected usage; it is typically deployed on server-class hardware; planning the network connectivity with the object store and out to the national infrastructure (including firewalls along the path) is key. The OSG team is experienced in consulting and providing help to universities in designing the integration. To provide the community some guidance, we host your [suggested solutions](https://osg-htc.org/organization/osdf/example_data_origin.html).

### How is OSDF used?

The Open Science Data Federation (OSDF) enables users and institutions to make datasets available to compute jobs running in distributed high-throughput computing (dHTC) environments such as the [Open Science Pool (OSPool)](https://osg-htc.org/services/open_science_pool.html). Compute jobs submitted from an HTCondor access point (e.g. an [OSG-Operated Access Point](https://osg-htc.org/services/access-point)) can access data stored in data origins, with HTCondor managing data transfer via the OSDF’s global namespace and data caches.

By providing the distributed data access layer via these data caches, jobs running in the OSPool (or any other resource pool) can reduce wide-area network consumption, load on the data origins, and latency of data access.

The OSDF is not limited to dHTC environments: it can be accessed via a browser (like S3, OSDF’s underlying protocol is HTTPS) or directly via a [Python client](https://github.com/PelicanPlatform/pelicanfs).

#### Example OSDF Use Cases

-   A repository wants to stream its datasets, at scale, without scaling egress.
-   A researcher wants to share a dataset with their community so others can use it in computational workflows.
-   A researcher produces data on the OSPool that they need to store for future processing or sharing with the community.
-   A team wants to make their datasets available to their community without opening their storage directly to the Internet.

To learn more details about these or other use cases, please reach out to our team of Research Computing Facilitators through support@osg-htc.org.

## Who can access data in the OSDF?

Each [origin](https://osg-htc.org/docs/data/stashcache/overview/#architecture) is configured to enforce the object store’s access policies. Objects can be made public or private, and the repository controls the rules for sharing. For example, origins at Access Points can provide users with a public directory and a directory that is only accessible to a user’s jobs.

The content distribution network enforces the origin’s access policies by requiring a signed [access token](https://scitokens.org/) for non-public objects.

Objects cached in the content distribution network are visible to the administrators of the [cache](https://osg-htc.org/docs/data/stashcache/overview/#architecture) services and of the execution points where a user’s jobs run. Non-public data is encrypted when sent over the network, but not on disk. The OSDF is appropriate for non-public data from “open science” communities but not highly regulated or sensitive data (such as PII or HIPAA data).

### Who is behind the OSDF?

The OSDF is part of the OSG Fabric of Services run by the OSG Consortium.

The effort to operate the OSDF central services and hosted origins is provided by the [PATh project](https://path-cc.io/). Institutions may operate their own origins on behalf of local repositories.

The caches in the distribution network are primarily managed by PATh staff but consist of hardware contributed by external projects or institutions such as:

<div class="d-none d-md-block">
    <div class="row text-center align-items-center mt-4">
        <div class="col">
            <a href="https://chtc.cs.wisc.edu/" target="_blank">
                <img src="/assets/images/osdf/chtc.png" class="img-fluid" alt="CHTC">
            </a>
        </div>
        <div class="col">
            <a href="https://www.es.net/" target="_blank">
                <img src="/assets/images/osdf/esnet.jpeg" class="img-fluid" alt="ESnet">
            </a>
        </div>
        <div class="col">
            <a href="https://www.internet2.edu/" target="_blank">
                <img src="/assets/images/osdf/internet2.png" class="img-fluid" alt="Internet2">
            </a>
        </div>
        <div class="col">
            <a href="https://www.unl.edu/" target="_blank">
                <img src="/assets/images/osdf/nebraska-n.jpg" class="img-fluid" alt="University of Nebraska">
            </a>
        </div>
        <div class="col">
            <a href="https://nationalresearchplatform.org/" target="_blank">
                <img src="/assets/images/osdf/NRP.png" class="img-fluid" alt="NRP">
            </a>
        </div>
        <div class="col">
            <a href="https://www.syracuse.edu/" target="_blank">
                <img src="/assets/images/osdf/syracuse.png" class="img-fluid" alt="Syracuse University">
            </a>
        </div>
        <div class="col">
            <a href="https://path-cc.io/" target="_blank">
                <img src="/assets/images/osdf/path.png" class="img-fluid" alt="Path-CC">
            </a>
        </div>
    </div>
    <div class="row text-center d-md-flex d-none">
        <div class="col">
            <p>CHTC</p>
        </div>
        <div class="col">
            <p>ESnet</p>
        </div>
        <div class="col">
            <p>Internet2</p>
        </div>
        <div class="col">
            <p>University of Nebraska</p>
        </div>
        <div class="col">
            <p>NRP</p>
        </div>
        <div class="col">
            <p>Syracuse University</p>
        </div>
        <div class="col">
            <p>PATh</p>
        </div>
    </div>
</div>

<div class="d-block d-md-none">
    <div class="row text-center align-items-center mt-4 justify-content-center">
        <div class="col-3">
            <a href="https://chtc.cs.wisc.edu/" target="_blank">
                <img src="/assets/images/osdf/chtc.png" class="img-fluid" alt="CHTC">
            </a>
        </div>
        <div class="col-3">
            <a href="https://www.es.net/" target="_blank">
                <img src="/assets/images/osdf/esnet.jpeg" class="img-fluid" alt="ESnet">
            </a>
        </div>
        <div class="col-3">
            <a href="https://www.internet2.edu/" target="_blank">
                <img src="/assets/images/osdf/internet2.png" class="img-fluid" alt="Internet2">
            </a>
        </div>
        <div class="col-3">
            <a href="https://www.unl.edu/" target="_blank">
                <img src="/assets/images/osdf/nebraska-n.jpg" class="img-fluid" alt="University of Nebraska">
            </a>
        </div>
        <div class="col-3">
            <a href="https://nationalresearchplatform.org/" target="_blank">
                <img src="/assets/images/osdf/NRP.png" class="img-fluid" alt="NRP">
            </a>
        </div>
        <div class="col-3">
            <a href="https://www.syracuse.edu/" target="_blank">
                <img src="/assets/images/osdf/syracuse.png" class="img-fluid" alt="Syracuse University">
            </a>
        </div>
        <div class="col-3">
            <a href="https://path-cc.io/" target="_blank">
                <img src="/assets/images/osdf/path.png" class="img-fluid" alt="Path-CC">
            </a>
        </div>
    </div>
</div>

