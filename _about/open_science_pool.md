---
title: The Facts on the OSG Pool
---

<figure class="figure">
  <img src="{{site.baseurl}}/assets/images/utilizing_osg_pools.png" class="figure-img img-fluid rounded" alt="Open Science Pool on the OSG">
</figure>

## What is the Open Science Pool?

> The OSG is organized around multiple ‘pools’ of computing and data resources (like virtual clusters), each operated by and for a different research community. In addition to pools operated by some institutions and large collaborations, the Open Science Pool is operated by OSG staff for broad use by the open science community, including campus researchers who are not part of an institution or collaboration with its own pool. 

> The OSPool aggregates computing resources from across the nation, making this capacity available as a single virtual cluster available large-scale, distributed High Throughput Computing (dHTC).. Researchers can submit computational work to the  OSPool via access points operated locally to their campuses, or via OSG Connect access points, which serve researchers affiliated with projects at UW-based academic, non-profit, and government institutions.
Who can use the OS Pool?

## Access is free and open to:

>- Any researcher affiliated with a project at a US-based academic, government, or non-profit institution (via the OSG Connect service).
>- Any researcher affiliated with an organization that has its own access point (not limited to US affiliation)s 
>- All areas of research including social sciences, humanities, life sciences, engineering, medicine, chemistry and physics. 

## What types of work run well on the OSPool?

> Work that can be executed as numerous laptop-sized computations and individually complete in less than 20 hours run well in the OSPool. A wide range of research problems and computational methods can be broken up or otherwise executed this way, including:

- image analysis (including MRI, GIS, etc.)
- text-based analysis, including DNA read mapping and other bioinformatics
- parameter sweeps
- model optimization approaches, including Monte Carlo methods
- Machine learning and AI executed with multiple independent training tasks, different parameters, and/or data subsets

>Learn more and chat with a Research Computing Facilitator by [requesting an account](https://www.osgconnect.net/).

## Who contributes capacity to the OSPool?

> The computing resources for the OSPool are contributed by members of the OSG Compute Federation, typically campuses, government supported supercomputing centers or research collaborations. The members individually determine their policies for providing resources. The member determines the amount of resources it contributes and when these resources are available. In addition, some resource providers decide to share their resources with a specific research project,or they may choose to contribute resources to all in the OSPool.
<figure class="figure">
  <img src="{{site.baseurl}}/assets/images/osg_pool_lab.png" class="figure-img img-fluid rounded" alt="Open Science Pool Users">
</figure>

## What size of computations are ideal for the OSPool?

> For problems that can be run as many independent jobs, as in the first two columns of the table below, the OSPool provides computing capacity that can transform the types of questions that researchers are able to tackle. Importantly, many compute tasks that may appear to not be a good fit can be modified in simple ways to take advantage, and we'd love to discuss options with you!

Ideal jobs!			Still very advantageous	Maybe not, but get in touch!
Expected Throughput, per user	1000s concurrent cores	100s concurrent cores	let's discuss!
CPU	1	< 8	> 8 (or MPI)
Walltime	< 10 hrs*	< 20 hrs*	> 20 hrs (not a good fit)
RAM	< few GB	< 40 GB	> 40 GB
Input	< 500 MB	< 10 GB	> 10 GB**
Output	< 1GB	< 10 GB	> 10 GB**
Software	pre-compiled binaries, containers	Most other than ->	Licensed software, non-Linux
or checkpointable *per job; you can work with a large dataset on OSG if it can be split into pieces

## Some examples of work that has been a good fit for the OSG and benefited from using its resources include:
- image analysis (including MRI, GIS, etc.)
- text-based analysis, including DNA read mapping and other bioinformatics
- parameter sweeps
 - Monte Carlo methods and other model optimization

[Learn more and chat with a Research Computing Facilitator](https://www.osgconnect.net/) by requesting an account.

## Running jobs on the OSPool

> Users submitting jobs can specify their own requirements on what machines to use. You can require the use of one particular machine, or any from a particular cluster, or any with a certain amount of memory or processor type. 

> We recommend  submitting lots of jobs and taking advantage of all the idle cycles, wherever they may be. If you are doing simulation work, don't submit one simulation, submit one hundred or one thousand variations at once. We  cannot guarantee that any single job will finish quickly, but it will allow you to accomplish more overall work than if you used just your own machines. 

## Where do I go if I need help or have questions?

> We have complete knowledge base materials here and an active and supportive facilitation team.

 
# What about Campuses that want to Support Researchers and dHTC locally?

> Campuses can:


- Build ‘Local’ dHTC capacity with HTCondor, which provides service orchestration services
- Share local resources and excess capacity via OSG 
- Take advantage of dHTC and dHTC Facilitation training 
- Provide Local submission points into OSPools 
- These Services are all Free and Open with Facilitation for Campuses 

 
> Most campuses prefer the hosted Compute Entry (CE) option wherein the OSG team will host and operate the HTCondor Compute Entrypoint, and configure it for the communities the campus chooses to support. 

> Other campuses choose to set up their compute entry point locally and use an OSG hosted Compute CE that provides the entry point for resource requests coming from the OSG; it handles authorization and delegation of resource requests to campus’ existing HPC/HTC cluster. 


