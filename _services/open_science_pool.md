---
title: Open Science Pool
layout: text-optimized-width
---

<figure class="figure">
  <img src="{{site.baseurl}}/assets/images/OSGPools.jpg" class="figure-img img-fluid rounded" alt="Open Science Pool on the OSG">
</figure>

# What is the Open Science Pool?

The Open Science Pool (OSPool) is a virtual cluster operated by the OSG, 
with shared computing and data resources via distributed high-throughput 
computing (dHTC) technologies. The pool aggregates mostly opportunistic 
(“backfill”) computing resources from contributing clusters at campuses 
and other organizations, making them available to the US-based open science 
community.

Researchers can submit computational work to the OSPool via access points 
operated locally to their campuses, or via access points operated as part 
of the [OSG Connect](https://connect.osg-htc.org/) service, which serves researchers affiliated with 
projects at US-based academic, non-profit, and government institutions.
Sign up for an account on [OSG Connect](https://connect.osg-htc.org/), today!

## Who can use the OSPool?

**Access is free and open to** 
- any researcher affiliated with a project at a US-based academic, government, or non-profit institution (via the OSG Connect service).
- any researcher affiliated with such an institution or project with its own access point.
- all areas of research including social sciences, humanities, life sciences, engineering, medicine, chemistry and physics.

[View projects](https://gracc.opensciencegrid.org/d/000000037/payload-jobs-summary?orgId=1&var-ReportableVOName=osg&var-Project=All&var-Facility=All&var-User=All&var-ExitCode=All&var-Probe=All&var-interval=1d)
 using the OSPool in OSG’s Accounting System (GRACC).

## What types of work run well on the OSPool?

For problems that can be run as numerous, self-contained jobs, the OSPool provides computing capacity that can transform the types of questions researchers are able to tackle (see the table below). A wide range of research problems and computational methods can be broken up or otherwise executed in this high-throughput computing (HTC ) approach, including:

- image analysis (including MRI, GIS, etc.)
- text-based analysis, including DNA read mapping and other bioinformatics
- parameter sweeps
- model optimization approaches, including Monte Carlo methods
- machine learning and AI executed with multiple independent training tasks, different parameters, and/or data subsets

The OSPool is made up of mostly opportunistic capacity - contributing clusters may interrupt jobs at any time. Thus, the OSPool supports workloads of numerous jobs that individually complete or checkpoint within 20 hours. 

__Importantly, many compute tasks can take advantage of the OSPool with simple modifications, and we’d love to discuss options with you!__

<table class="table table-bordered table-striped">
<tbody>
<tr>
<th></th>
<th>Ideal Jobs!</th>
<th>Still very advantageous</th>
<th>Maybe not, but get in touch!</th>
</tr>
<tr>
<th>Expected Throughput, per user</th>
<td>1000s concurrent cores</td>
<td>100s concurrent cores</td>
<td>Let's discuss!</td>
</tr>
<tr>
<th>CPU</th>
<td>1 per job</td>
<td>< 8 per job</td>
<td>> 8 per job</td>
</tr>
<tr>
<th>Walltime</th>
<td>< 10 hrs*</td>
<td>< 20 hrs*</td>
<td>> 20 hrs</td>
</tr>
<tr>
<th>RAM</th>
<td>< few GB</td>
<td>< 40 GB</td>
<td>> 40 GB</td>
</tr>
<tr>
<th>Input</th>
<td>< 500 MB</td>
<td>< 10 GB</td>
<td>> 10 GB**</td>
</tr>
<tr>
<th>Output</th>
<td>< 1 GB</td>
<td>< 10 GB</td>
<td>> 10 GB**</td>
</tr>
<tr>
<th>Software</th>
<td>pre-compiled binaries, containers</td>
<td>Most other than &#8594;</td>
<td>Licensed Software, non-Linux</td>
</tr>
</tbody>
</table>

*or checkpointable

** per job; you can work with a large dataset on OSG if it can be split into pieces


Learn more and chat with a Research Computing Facilitator by [requesting an account](https://connect.osg-htc.org/).

## Learning to use the OSPool

We have a complete [knowledge base of user documentation](https://support.opensciencegrid.org/support/home)
and an active and supportive [facilitation team](https://support.opensciencegrid.org/support/solutions/articles/12000084585),
who support all users on [OSG Connect](https://connect.osg-htc.org/) access points.

Users submitting jobs can specify their own requirements for per-job compute resources (e.g. CPU cores, memory, etc.) and any special server requirements. We recommend submitting lots of jobs and taking advantage of all the cycles possible, wherever they may be. We cannot guarantee that any single job will finish quickly, but the OSPool will allow you to accomplish a tremendous amount of work across jobs.

## Who contributes capacity to the OSPool?

The computing resources for the OSPool are contributed by members of the OSG Compute Federation, typically campuses, government-supported supercomputing centers, and research collaborations. The members individually determine their policies for contributing resources, including the amount of resources it contributes and when these resources are available. In addition, some resource providers decide to share their resources with specific research projects, or they may choose to contribute resources to all in the OSPool.

[View facility contributions](https://gracc.opensciencegrid.org/d/000000043/pilot-jobs-summary?orgId=1&var-VOName=osg&var-Facility=All&var-ExitCode=All&var-Probe=All&var-interval=1d) to the OSPool in OSG’s Accounting System (GRACC).
