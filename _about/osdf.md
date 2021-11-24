---
title: Open Science Data Federation
---

<figure class="figure">
  <img src="{{site.baseurl}}/assets/images/osdf.png" class="figure-img img-fluid rounded" alt="Map of the Open Science Data Federation">
</figure>

## What is the Open Science Data Federation?

The Open Science Data Federation (OSDF) is an OSG service that enables users and institutions to
make datasets available to distributed high-throughput computing (dHTC) environments such as the
[Open Science Pool](open_science_pool) (OSPool). The OSDF provides execution points with remote
access to data via a global namespace and a set of *data caches* which can access data stored in
*data origins*.

By providing the distributed data access layer via the caches, jobs running in the OSPool (or any
other resource pool) can reduce wide-area network consumption, load on the data origins, and latency
of data access.

## Who can use the OSDF?

Any US-based academic, government, or non-profit institution may operate a data origin to export their
users' data.  Researchers with an OSG-Connect account may also use the origin at the [OSG-Connect](osgconnect.net)
access point.

To learn how to access your data through the OSDF, please reach out to our team of Research Computing Facilitators
through <support@opensciencegrid.org>.

## Who can access my data?

Access control for the OSDF is managed by the *origin* service.  The origin can be configured to make data public
or private and can control the rules for sharing.  For example, the OSG-Connect service allows users to
make their data accessible to all (public) or only accessible to their own jobs.

The data may additionally be visible to the administrators of the *cache* services and the execution point where
the job runs.  Non-public data is encrypted when sent over the network but not on disk.

## Who manages the OSDF?

The origins on the OSDF are managed by the projects or institutions which own the underlying storage.  The caches
are largely managed by OSG staff, who remotely operate the services.  Some caches are dedicated to a specific
experiment; a number of caches are specific to the [LIGO](https://www.ligo.caltech.edu/) experiment.

The cache hardware is distributed throughout the US, including points of presence in the [Internet2](https://internet2.edu/)
and [ESNet](https://www.es.net/) networks and universities facilities such as UW-Madison,
Chicago, Syracuse, UCSD, and Nebraska.

