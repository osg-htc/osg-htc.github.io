---
title: "OSG integrates global computing to support detection of colliding neutron stars by LIGO, VIRGO, and DECam"
date: 2017-11-07 12:00:00 -0600
categories: LIGO
---

OSG integrates global computing to support detection of colliding neutron stars by LIGO, VIRGO, and DECam
==========================================================================================================

On October 16th, scientists at the LIGO and Virgo scientific collaborations
[announced](http://www.ligo.org/detections/GW170817/press-release/pr-english.pdf) the detection of gravitational waves
from the collision of two neutron stars that occurred 130 million years ago. This collision has also been observed with
light emitted across the entire electromagnetic spectrum.

LIGO’s two detectors, located in Hanford, Washington, and Livingston, Louisiana, first detected the gravitational
waves on the morning of August 17, 2017. The VIRGO detector, near Pisa, Italy, confirmed that it detected a wave at
nearly the same time. By having three points of detection, researchers were able to triangulate and determine a
relatively small area of space from which the gravitational waves would have emanated.

Using this data, plus information from NASA’s Fermi space telescope, astronomers around the world were able to train
various types of telescopes on this area in the sky, and over the next week, they observed bursts within the
electromagnetic spectrum starting with gamma rays, then x-rays, on to ultraviolet and infrared light, and finally radio
waves. With observations based on both gravitational waves and the electromagnetic spectrum, this heralds the beginning
of a new era: multi-messenger astronomy.

Researchers from LIGO and Virgo use OSG to aggregate computing resources worldwide to analyze the data recorded with
their instruments. The Open Science Grid (OSG) is a platform that allows researchers to use computing resources around
the world. In the past year, LIGO performed approximately 8.4 million hours of computing on resources contributed by a
few dozen institutions in half a dozen countries across Europe and North America.

To manage this massive workload, researchers turn to software systems called workflow managers that help automate,
schedule, and debug their workflows. LIGO’s scientific application software uses the [Pegasus](https://pegasus.isi.edu/)
workflow manager on top of [HTCondor](https://research.cs.wisc.edu/htcondor/) and the OSG resource provisioning system
to accomplish global science. The Research Director for Pegasus, Ewa Deelman says, “Pegasus allows LIGO scientists to
efficiently analyze the significance of the signals captured by their instruments. It manages the scheduling of
workflow tasks onto the resources, [and] the flow of data between the tasks. It also optimizes the workflow for
performance and reliability.” Using these software systems allowed LIGO to analyze not just the recent waves, but also
the waves detected in 2015 that resulted in the 2017 Nobel Prize in Physics.

The October 16th announcement is particularly interesting for OSG as it includes science by three of its major
scientific user communities: LIGO, the Dark Energy Camera, and IceCube. A common theme across these large international
collaborations is that OSG allows them to aggregate computing resource contributions from their collaborating
institutions, shared national facilities, opportunistic resources across OSG, and in the future, commercial clouds.
OSG thus supports the elastic scale-out of high-throughput computing workflows by large experimental facilities like
these to shrink the time-to-solution for their science.

Pegasus, HTCondor, and OSG are excited to support experiments like LIGO, the Dark Energy Camera, and IceCube as we move
towards a better understanding of the universe around us via multi-messenger astronomy.
