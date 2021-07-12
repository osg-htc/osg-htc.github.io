---
title: Computation Ideal for OSPool
---
<figure class="figure">
  <img src="{{site.baseurl}}/assets/images/osg_pool_lab.png" class="figure-img img-fluid rounded" alt="Open Science Pool Users">
</figure>

## What size of computations are ideal for the OSPool?

> For problems that can be run as many independent jobs, as in the first two columns of the table below, the OSPool provides computing capacity that can transform the types of questions that researchers are able to tackle. Importantly, many compute tasks that may appear to not be a good fit can be modified in simple ways to take advantage, and we'd love to discuss options with you!

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
<td>1</td>
<td>< 8</td>
<td>> 8 (or MPI)</td>
</tr>
<tr>
<th>Walltime</th>
<td>< 10 hrs*</td>
<td>< 20 hrs*</td>
<td>> 20 hrs (Not a good fit)</td>
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
<td>Most other than -></td>
<td>Licensed Software, non-Linux</td>
</tr>
</tbody>
</table>

<span class="text-muted">or checkpointable *per job; you can work with a large dataset on OSG if it can be split into pieces</span>

## Some examples of work that has been a good fit for the OSG and benefited from using its resources include

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

## What about Campuses that want to Support Researchers and dHTC locally?

> Campuses can

- Build ‘Local’ dHTC capacity with HTCondor, which provides service orchestration services
- Share local resources and excess capacity via OSG 
- Take advantage of dHTC and dHTC Facilitation training 
- Provide Local submission points into OSPools 
- These Services are all Free and Open with Facilitation for Campuses 

> Most campuses prefer the hosted Compute Entry (CE) option wherein the OSG team will host and operate the HTCondor Compute Entrypoint, and configure it for the communities the campus chooses to support. 

> Other campuses choose to set up their compute entry point locally and use an OSG hosted Compute CE that provides the entry point for resource requests coming from the OSG; it handles authorization and delegation of resource requests to campus’ existing HPC/HTC cluster. 

