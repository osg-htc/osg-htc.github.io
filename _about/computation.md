---
title: Computation on the OSG
---

*What kind of computational problems fit well on OSG?*

Jobs submitted into the OSG will be executed on machines at several remote physical clusters. These machines may differ in terms of computing environment from the submit node. Therefore it is important that the jobs are as self-contained as possible by generic binaries and data that can be either carried with the job, or staged on demand. Please consider the following guidelines:

1. Software should preferably be single threaded, using less than 2 GB memory and each invocation should run for 1-12 hours. Please contact the support listed below for more information about these capabilities. System level check pointing, such as the HTCondor standard universe, is not available. Application level check pointing, for example applications writing out state and restart files, can be made to work on the system.
2. Compute sites in the OSG can be configured to use pre-emption, which means jobs can be automatically killed if higher priority jobs enter the system. Pre-empted jobs will restart on another site, but it is important that the jobs can handle multiple restarts.
3. Binaries should preferably be statically linked. However, dynamically linked binaries with standard library dependencies, built for a 64-bit Red Hat Enterprise Linux (RHEL) 6 machines will also work. Also, interpreted languages such as Python or Perl will work as long as there are no special module requirements.
4. Input and output data for each job should be < 10 GB to allow them to be pulled in by the jobs, processed and pushed back to the submit node. Note that the OSG Virtual Cluster does not currently have a global shared file system, so jobs with such dependencies will not work.
5. Software dependencies can be difficult to accommodate unless the software can be staged with the job, or installed on the read-only distributed OASIS filesystem.

The following are examples of computations that are not good matches for OSG:

1. Tightly coupled computations, for example MPI based communication, will not work well on OSG due to the distributed nature of the infrastructure.
2. Computations requiring a shared file system will not work, as there is no shared filesystem between the different clusters on OSG.
3. Computations requiring complex software deployments are not a good fit. There is limited support for distributing software to the compute clusters, but for complex software, or licensed software, deployment can be a major task.

