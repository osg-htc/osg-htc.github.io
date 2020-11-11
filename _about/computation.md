---
title: Computation on the OSG
---

*What kind of computational tasks are likely accelerated on the Open Science Grid?*

Jobs run on the OSG will be able to execute on servers at up to 100 remote physical clusters, making OSG an ideal environment for computational problems that can be executed as numerous, independent, and relatively small/short tasks. 

The following are examples of computations that are a great match for OSG:

1. parameters sweeps, parameter optimizations, statistical model optimizations, etc. (as pertains to many machine learning approaches)
2. molecular docking and other simulations with numerous starting systems and/or configurations
3. image processing, including medical images (with non-restricted data), satellite images, Cryo-EM datasets, etc.
4. many genomics/bioinformatics tasks where numerous reads, samples, genes, etc., might be analyzed independent of one another before bringing results together
5. text analysis
And many others!

Given the opportunistic nature of many OSG sites (providing 'backfill' of their clusters), computations following the below guidelines will achieve the greatest throughput (with up to thousands of concurrently running jobs) and impact on research:

1. Independent compute tasks using up to 8 cores (ideally 1 core, each), less than 8 GB memory (RAM) per core, no more than 1 GPU, and running for 1-12 hours. *Additional capabilities for [COVID-19 research](https://opensciencegrid.org/covid-19.html) are currently available, with up to 48 hours of runtime per job.* Please contact the support listed below for more information about these capabilities. Workloads with independent jobs of 1 core and less than 1 GB RAM are ideal, with up to thousands of concurrently-running jobs and 100,000s of core hours achieved daily. Jobs using several cores and/or several GB of RAM will likely experience hundreds of concurrently-running jobs.
2. Many sites in the OSG are configured to use pre-emption, which means that OSG jobs 'backfill' the site and can be automatically killed if high-priority/local jobs enter the system. Pre-empted OSG jobs will be automatically re-run elsewhere, but it is important that the jobs can handle multiple restarts and/or complete in less than 12 hours (*Additional capabilities for [COVID-19 research](https://opensciencegrid.org/covid-19.html) are currently available, with up to 48 hours of runtime per job*). Application-level checkpointing can be implemented for longer-running work (for example, applications writing out state and restart files).
3. Software dependencies can be staged with the job (statically-linked binaries are ideal), and more complex software can distributed via containers, or installed on the read-only distributed OASIS filesystem with support from OSG staff. OSG can support some licensed software where compilation allows execution without a license (like Matlab, Matlab-Simulink, etc.), or where licenses still accommodate multiple jobs and are not node-locked.
4. Input and output data _for each job_ should be <20 GB to allow for distribution across sites in OSG and back to the submit node. Note that the OSG does not have a global shared filesystem across sites. Projects with many TBs of data can be distributed with significant scalability, beyond the capacity of a single cluster, if each of numerous jobs access subsets of the data.

The following are examples of computations that are not good matches for OSG:

1. Multi-node computations requiring frequent inter-node communication (e.g. MPI-based multi-node communication), will not work well on OSG due to the distributed nature of the infrastructure. Complex worflows expressed as inter-related - but independent - jobs are quite feasible, though, and the OSG's HTCondor job scheduler supports several worflow tools.
2. Computations with jobs requiring data access via a shared filesystem will not work, as there is no shared filesystem between the different clusters on OSG.
3. Computations requiring restrictive licensing are not a good fit, unless the licenses allow a single user's jobs to distribute the software to multiple running instances, without pre-registering the execute nodes or installation of the software on those nodes. Note that while containers can make complex software dependencies more portable, the OSG's open distribution of containers may violate some software licenses requiring that a single user download and not share the software.
