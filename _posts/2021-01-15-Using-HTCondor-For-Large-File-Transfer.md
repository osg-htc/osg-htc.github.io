---
title: "Case Study Using HTCondor and dHTC to Transfer Large files" 
date: 2021-01-15T12:00:00+00:00
publish: true
--- 

<h1>Dark Energy Survey File Transfer Case Study</h1>

When Greg Daues at the https://resources.istcoalition.org/national-center-for-supercomputing-applications National Center for Supercomputing Applications (NCSA)  needed to transfer several million files of Dark Energy Survey (DES) data from the French National Institute of Nuclear and Particle Physics (IN2P3) in Lyon, France to Illinois, he turned to the HTCondor High Throughput system, not to run computationally intensive jobs, as many do, but to manage the hundreds of thousands of I/O bound transfers.
The Data
IN2P3 made the data available via https, but the number of files and their total size made the management of the transfer an engineering challenge.  There were two kinds of files to be transferred, with 3.5 million files with a median size of roughly 100 Mb, and another 3.5 million smaller files, with a median size of about 10 megabytes.  Total transfer size is roughly 385 Terabytes.
The Requirements
The requirement for this transfer was to reliably transfer all the files in a reasonably performant way, minimizing the human time to set up, run, and manage the transfer.  Note the noni-goal of optimizing for the fastest possible transfer time -- reliability and minimizing the human effort take priority here.  Reliability, in this context implies:

Failed transfers are identified and re-run (with millions of files, a failed transfer is almost inevitable)
Every file will get transferred
The operation will not overload the sender, the receiver, or any network in between
The Inspiration
Daues presented unrelated work at the 2017 HTCondor Week workshop.  At this workshop, he heard about the work of Phillip Papodopolous at UCSD, and his international Data Placement Lab (iDPL).   iDPL used HTCondor jobs solely for transferring data between international sites.  Daues re-used and adapted some of these ideas for NCSA’s needs.
The Solution
First, Daues installed a “mini-condor”, an HTCondor pool entirely on one machine, with an access point and eight execution slots on that same machine.  Then, given a single large file containing the names of all the files to transfer, he ran the Unix split command to create separate files with either 50 of the larger files, or 200 of the smaller files.  Finally, using the HTCondor submit file command 

Queue filename matching files *.txt

The condor_submit command creates one job per split file, which runs the wget2 command and passes the list of filenames to wget2.  The HTCondor access point can handle tens of thousands of idle jobs, and will schedule these jobs on the eight execution slots.  While more slots would yield more overlapped i/o, eight slots were chosen to throttle the total network bandwidth used.  Over the course of days, this machine with eight slots maintained roughly 600 MB/seconds.

Nine jobs failed to run, with wget returning a non-zero exit code.  These nine jobs we re-run, and all completed successfully on a second run.

Note that the machine running HTCondor did not crash during this run, but if it had, all the jobs, after submission, were stored reliably on the local disk, and at such time as the crashed machine restarted, and the init program restarted the HTCondor system, all interrupted jobs would be restarted, and the process would continue without human intervention.
