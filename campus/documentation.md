---
title: OSPool Site Admin Documentation
layout: text-optimized-width
---


# OSPool Site Admin Documentation

## Monitoring and Information

### Viewing researcher jobs running within a glidein job

1. Log in to a worker node as the OSPool user (e.g., “osg01” but may be different at your site)

2. Pick a glidein (and its directory):

   **Note:** *SCRATCH* is the path of the scratch directory you gave us to put glideins in.

   1. Option 1: List HTCondor processes, pick one, and note its glidein directory:
   
       {: .bg-dark .text-light .p-2 .rounded}
       ```
       $ ps -u osg01 -f | grep master
       osg01    4122304 [...] SCRATCH/glide_qJDh7z/main/condor/sbin/condor_master [...]
       ```

   2. Option 2: List glidein directories and pick an active one:

      {: .bg-dark .text-light .p-2 .rounded}
      ```
      $ ls -l SCRATCH/glide_*/_GLIDE_LEASE_FILE
      ```

      Pick a “glide\_xxxxxx” directory that has a lease file with a timestamp less than about 5 minutes old.

   **Note:** Let *GLIDEDIR* be the path to the chosen glidein directory, e.g., ```SCRATCH/glide_xxxxxx```

3. Make sure HTCondor is recent enough:

   {: .bg-dark .text-light .p-2 .rounded}
   ```
   $ GLIDEDIR/main/condor/bin/condor_version
   $CondorVersion: 24.6.1 2025-03-20 BuildID: 794846 PackageID: 24.6.1-1 $
   $CondorPlatform: x86_64_AlmaLinux9 $
   ```

   The Condor Version should be 2.7.0 or later; if not, go back to step 2 and pick a different glidein directory.

4. Pick the PID of an HTCondor “startd” process to query:

    1. If you are just exploring, run the following command and pick any “condor\_startd” process — it does not matter if it is associated with the HTCondor instance identified in steps 2–3 above:

       {: .bg-dark .text-light .p-2 .rounded}
       ```
       $ ps -u osg01 -f | grep condor_startd
       ```

    2. If you are looking for the “startd” associated with some other process, start with a process tree:

       {: .bg-dark .text-light .p-2 .rounded}
       ```
       $ ps -u osg01 -f --forest
       ```

       Find the process of interest, then work upward in the process tree to the nearest ancestor “condor\_startd” process.

    3. In either case, note the PID (leftmost number) on the “condor\_startd” line you picked.

5. Run `condor_who` on the PID you picked:

    {: .bg-dark .text-light .p-2 .rounded}
    <pre><code>
    $ GLIDEDIR/main/condor/bin/condor_who -pid PID -ospool
    <b>Batch System : SLURM</b>
    <b>Batch Job    : 346675</b>
    <b>Birthdate    : 2025-04-07 14:47:02</b>
    <b>Temp Dir     : /var/lib/condor/execute/osg01/glide_qJDh7z/tmp</b>
    <b>Startd : glidein_4101601_324283152@spark-a220.chtc.wisc.edu has 1 job(s) running:</b>
    PROJECT   USER   AP_HOSTNAME         JOBID        RUNTIME    MEMORY    DISK      CPUs EFCY PID     STARTER
    Inst-Proj jsmith ap20.uc.osg-htc.org 27781234.0   0+00:17:43  512.0 MB  129.0 MB    1 0.00 4124321 4123123
    …
    </code></pre>

Definitions of fields in the header (before the PROJECT USER … row):

| Batch System | HTCondor’s name for the type of batch system you are running. |
| :---- | :---- |
| Batch Job | The identifier for this glidein job in your batch system. |
| Birthdate | When HTCondor began running within this glidein; typically, this is a few minutes after the glidein job itself began running. |
| Temp Dir | The path to the glidein job directory (remove the trailing “/tmp”) |
| Startd | HTCondor’s identifier for its “startd” process within the glidein job. |
{: .my-3 }

Definitions of fields in each row of the researcher job table:

| PROJECT | The OSPool project identifier for this researcher job |
| :---- | :---- |
| USER | The OSPool AP’s user identifier for this researcher job |
| AP\_HOSTNAME | The OSPool AP’s hostname |
| JOBID | HTCondor’s identifier for this researcher job on its AP |
| RUNTIME | HTCondor’s value for the runtime of the researcher job |
| MEMORY | The amount of memory (RAM), in MB, that HTCondor **allocated** to this researcher job |
| DISK | The amount of disk, in KB, that HTCondor **allocated** to this researcher job |
| CPUs | The number of CPU cores that HTCondor **allocated** to this researcher job |
| EFCY | An HTCondor measure of the efficiency of the job, roughly calculated as CPU time / wallclock time; a value noticeably greater than the CPUs value may mean the researcher job is using more cores than requested |
| PID | The local PID of the researcher job, or more often, of the root of the process tree for the researcher job (e.g., this could be a wrapper script or even Singularity or Apptainer for a researcher job in a container) |
| STARTER | The local PID of the HTCondor “starter” process that owns this research job |
{: .my-3 }

### Viewing researcher jobs running within all OSPool glidein jobs

Note: Steps 1–3 are the same as above.

1. Log in to a worker node as the OSPool user (e.g., “osg01” but may be different at your site)

2. Pick a glidein (and its directory):

   **Note:** *SCRATCH* is the path of the scratch directory you gave us to put glideins in.

    1. Option 1: List HTCondor processes, pick one, and note its glidein directory:
    
       {: .bg-dark .text-light .p-2 .rounded}
       ```
       $ ps -u osg01 -f | grep master
       osg01    4122304 [...] SCRATCH/glide_qJDh7z/main/condor/sbin/condor_master [...]
       ```

    2. Option 2: List glidein directories and pick an active one:

       {: .bg-dark .text-light .p-2 .rounded}
       ```
       $ ls -l SCRATCH/glide_*/_GLIDE_LEASE_FILE
       ```

       Pick a “glide\_xxxxxx” directory that has a lease file with a timestamp less than about 5 minutes old.

   **Note:** Let *GLIDEDIR* be the path to the chosen glidein directory, e.g., ```SCRATCH/glide_xxxxxx```

3. Make sure HTCondor is recent enough:

   {: .bg-dark .text-light .p-2 .rounded}
   ```
   $ GLIDEDIR/main/condor/bin/condor_version
   $CondorVersion: 24.6.1 2025-03-20 BuildID: 794846 PackageID: 24.6.1-1 $
   $CondorPlatform: x86_64_AlmaLinux9 $
   ```

   The Condor Version should be 2.7.0 or later; if not, go back to step 2 and pick a different glidein directory.

4. Run `condor_who` on all discoverable glideins on this host running as the current user:

    {: .bg-dark .text-light .p-2 .rounded}
    ```
    $ GLIDEDIR/main/condor/bin/condor_who -allpids -ospool
   
    Batch System : SLURM
    Batch Job    : 346675
    Birthdate    : 2025-04-07 14:47:02
    Temp Dir     : /var/lib/condor/execute/osg01/glide_qJDh7z/tmp
    Startd : glidein_4101601_324283152@spark-a220.chtc.wisc.edu has 1 job(s) running:
    PROJECT   USER   AP_HOSTNAME         JOBID        RUNTIME    MEMORY    DISK      CPUs EFCY PID     STARTER
    Inst-Proj jsmith ap20.uc.osg-htc.org 27781234.0   0+00:17:43  512.0 MB  129.0 MB    1 0.00 4124321 4123123
    …
    ```

For each glidein job, there will be one set of heading lines (“Batch System”, etc.) and a table of researcher jobs, one per line; format and definitions are as above.