---
title: Computation on the OSG
---

*What kind of computational problems fit well on OSG?*

Jobs run on the OSG will be able to execute on servers at numerous remote physical clusters, making OSG an ideal environment for computational problems that can be executed as numerous, independent tasks that are individually relatively small and short (see below). The servers may differ in terms of computing environment from the submit node. Therefore it is important that the jobs are as self-contained as possible by generic binaries and data that can be either carried with the job, or staged on demand. Please consider the following guidelines:

1. Independent compute tasks using up to 8 cores (ideally 1 core, each), less than 8 GB memory (RAM) per core, and 1 GPU, and running for 1-12 hours. *Additional capabilities for COVID-19 research are currently available, with up to 48 hours of runtime per job.* Please contact the support listed below for more information about these capabilities. Application-level checkpointing can be implemented for longer-running work (for example, applications writing out state and restart files). Workloads with independent jobs of 1 core and less than 1 GB RAM are ideal, with up to thousands of concurrently-running jobs and 100,000s of hours achieved daily. Jobs using several cores and/or several GB of RAM will likely experience hundreds of concurrently-running jobs.
2. Compute sites in the OSG can be configured to use pre-emption, which means jobs can be automatically killed if higher priority jobs enter the system. Pre-empted jobs will restart on another site, but it is important that the jobs can handle multiple restarts and/or complete in less than 12 hours.
3. Software dependencies can be can be staged with the job, distributed via containers, or installed on the read-only distributed OASIS filesystem (which an also support software modules). Statically-linked binaries are ideal. However, dynamically linked binaries with standard library dependencies, built for 64-bit Red Hat Enterprise Linux (RHEL) version 6 or 7 will also work. OSG can support some licensed software (like Matlab, Matlab-Simulink, etc.) where compilation allows execution without a license, or where licenses still accommodate multiple jobs and are not node-locked.
4. Input and output data for each job should be <20 GB to allow them to be pulled in by the jobs, processed and pushed back to the submit node. Note that the OSG Virtual Cluster does not currently have a global shared file system, so jobs with such dependencies will not work. Projects with many TBs of data can be distributed with significant scalability, beyond the capacity of a single cluster, if subsets of the data are accessed across numerous jobs.

The following are examples of computations that are a great match for OSG:

1. parameters sweeps, parameter optimizations, statistical model optimizations, etc. (as pertains to many machine learning approaches)
2. molecular docking and other simulations with numerous starting systems and/or configurations
3. image processing (including medical images with non-restricted data), satellite images, etc.
4. many genomics/bioinformatics tasks where numerous reads, samples, genes, etc., might be analyzed independent of one another before bringing results together
5. text analysis
And many others!

The following are examples of computations that are not good matches for OSG:

1. Tightly coupled computations, for example MPI-based multi-node communication, will not work well on OSG due to the distributed nature of the infrastructure.
2. Computations requiring a shared filesystem will not work, as there is no shared filesystem between the different clusters on OSG.
3. Computations requiring complex software deployments or restrictive licensing are not a good fit. There is limited support for distributing software to the compute clusters, but for complex software (though containers may be helpful!), or licensed software, deployment can be a major task.
