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

<div class="alert alert-dark d-flex flex-column">
<h5 class="mx-auto">Want to make your dataset available via the OSDF?</h5>
<a class="btn btn-secondary mx-auto d-block mt-3" href="mailto:support@osg-htc.org">Contact OSDF Support Staff</a>
</div>

## Connecting to the OSDF

The “origin” service connects the backend object store (a POSIX filesystem, S3-compatible endpoint, or HTTP endpoint) with the national infrastructure. The origin service needs access to the storage and incoming connectivity from the external infrastructure.



Most origin backends are currently a mounted shared filesystem and S3 endpoints like those found on AWS or [OSN](https://www.openstoragenetwork.org/) are increasingly common. To ease operations, the OSG Consortium offers a “hosted origin service” where central experts will install and operate the origin as a container. The container is most often deployed via on-prem hardware deployed as part of the [National Research Platform](https://nationalresearchplatform.org/) or an institutional Kubernetes cluster and inside a [ScienceDMZ](https://fasterdata.es.net/science-dmz/).



If the repository runs their own origin, this can be done on “bare metal” with native packages or as a container operated by the institution.



The hardware needed for the origin varies widely based on expected usage; it is typically deployed on server-class hardware; planning the network connectivity with the object store and out to the national infrastructure (including firewalls along the path) is key. The OSG team is experienced in consulting and providing help to universities in designing the integration. To provide the community some guidance, we host your [suggested solutions](https://osg-htc.org/organization/osdf/example_data_origin.html).

## Who can use the OSDF?

Any US-based academic, government, or non-profit institution may connect their object store to the OSDF.



Researchers using the [OSPool](https://osg-htc.org/services/open_science_pool.html) from an [OSG-operated Access Point](https://osg-htc.org/services/access-point) automatically get an allocation on a local filesystem connected to the OSDF.

## Can I get storage on the OSDF? / OSDF and CC* Storage

What about a researcher or community that would like to connect to the OSDF but doesn’t have their own storage infrastructure?

-   A half dozen [CC* Storage projects](https://new.nsf.gov/funding/opportunities/cc-campus-cyberinfrastructure) have committed to having their storage managed by OSG; projects can request space from the OSG for their use via the support desk.

-   Researchers can request an [OSN](https://openstoragenetwork.readthedocs.io/en/latest/) allocation from ACCESS and request OSG connect their bucket to the OSDF.


## How is OSDF used?

The Open Science Data Federation (OSDF) enables users and institutions to make datasets available to compute jobs running in distributed high-throughput computing (dHTC) environments such as the [Open Science Pool (OSPool)](https://osg-htc.org/services/open_science_pool.html). Compute jobs submitted from an HTCondor access point (e.g. an [OSG-Operated Access Point](https://osg-htc.org/services/access-point)) can access data stored in data origins, with HTCondor managing data transfer via the OSDF’s global namespace and data caches.

By providing the distributed data access layer via these data caches, jobs running in the OSPool (or any other resource pool) can reduce wide-area network consumption, load on the data origins, and latency of data access.



The OSDF is not limited to dHTC environments: it can be accessed via a browser (like S3, OSDF’s underlying protocol is HTTPS) or directly via a [Python client](https://github.com/PelicanPlatform/pelicanfs).

### Example OSDF Use Cases

-   A repository wants to stream its datasets, at scale, without scaling egress.
-   A researcher wants to share a dataset with their community so others can use it in computational workflows.
-   A researcher produces data on the OSPool that they need to store for future processing or sharing with the community.
-   A team wants to make their datasets available to their community without opening their storage directly to the Internet.

To learn more details about these or other use cases, please reach out to our team of Research Computing Facilitators through support@osg-htc.org.

## Who can access data in the OSDF?

Each [origin](https://osg-htc.org/docs/data/stashcache/overview/#architecture) is configured to enforce the object store’s access policies. Objects can be made public or private, and the repository controls the rules for sharing. For example, origins at Access Points can provide users with a public directory and a directory that is only accessible to a user’s jobs.

The content distribution network enforces the origin’s access policies by requiring a signed [access token](https://scitokens.org/) for non-public objects.

Objects cached in the content distribution network are visible to the administrators of the [cache](https://osg-htc.org/docs/data/stashcache/overview/#architecture) services and of the execution points where a user’s jobs run. Non-public data is encrypted when sent over the network, but not on disk. The OSDF is appropriate for non-public data from “open science” communities but not highly regulated or sensitive data (such as PII or HIPAA data).

## Who is behind the OSDF?

The OSDF is part of the OSG Fabric of Services run by the OSG Consortium.

The effort to operate the OSDF central services and hosted origins is provided by the [PATh project](https://path-cc.io/). Institutions may operate their own origins on behalf of local repositories.

The caches in the distribution network are primarily managed by PATh staff but consist of hardware contributed by external projects or institutions such as:

<div class="container">
    <div class="row text-center align-items-center mt-4">
        <div class="col-sm col-3">
            <a href="https://chtc.cs.wisc.edu/" target="_blank">
                <img src="/assets/images/osdf/chtc.png" class="img-fluid" alt="CHTC">
            </a>
        </div>
        <div class="col-sm col-3">
            <a href="https://www.es.net/" target="_blank">
                <img src="/assets/images/osdf/esnet.jpeg" class="img-fluid" alt="ESnet">
            </a>
        </div>
        <div class="col-sm col-3">
            <a href="https://www.internet2.edu/" target="_blank">
                <img src="/assets/images/osdf/internet2.png" class="img-fluid" alt="Internet2">
            </a>
        </div>
        <div class="col-sm col-3">
            <a href="https://www.unl.edu/" target="_blank">
                <img src="/assets/images/osdf/nebraska-n.jpg" class="img-fluid" alt="University of Nebraska">
            </a>
        </div>
        <div class="col-sm col-3">
            <a href="https://nationalresearchplatform.org/" target="_blank">
                <img src="/assets/images/osdf/NRP.png" class="img-fluid" alt="NRP">
            </a>
        </div>
        <div class="col-sm col-3">
            <a href="https://www.syracuse.edu/" target="_blank">
                <img src="/assets/images/osdf/syracuse.png" class="img-fluid" alt="Syracuse University">
            </a>
        </div>
        <div class="col-sm col-3">
            <a href="https://path-cc.io/" target="_blank">
                <img src="/assets/images/osdf/path.png" class="img-fluid" alt="Path-CC">
            </a>
        </div>
    </div>
    <div class="row text-center d-md-flex d-none">
        <div class="col-sm col-3">
            <p>CHTC</p>
        </div>
        <div class="col-sm col-3">
            <p>ESnet</p>
        </div>
        <div class="col-sm col-3">
            <p>Internet2</p>
        </div>
        <div class="col-sm col-3">
            <p>University of Nebraska</p>
        </div>
        <div class="col-sm col-3">
            <p>NRP</p>
        </div>
        <div class="col-sm col-3">
            <p>Syracuse University</p>
        </div>
        <div class="col-sm col-3">
            <p>PATh</p>
        </div>
    </div>
</div>
