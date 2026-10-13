import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Typography } from '@mui/material';

export const metadata: Metadata = {
  alternates: { canonical: '/covid-19' },
  title: 'Extra Support for COVID-19 Research — OSG Consortium',
  description: 'OSG support and resources for COVID-19 research.',
};

export default function Page() {
  return (
    <Container maxWidth='md' sx={{ py: 5 }}>
      <Typography variant='h2' component='h1' gutterBottom>
        OSG Support for COVID-19 Research
      </Typography>
      <Typography paragraph>
        Please contact us at <Link href='mailto:help@osg-htc.org'>help@osg-htc.org</Link>{' '}
        if your research group could benefit from computing resources or
        consulting related to COVID-19, or if you would like to support COVID-19
        research by sharing your own capacity.
      </Typography>
      <Typography paragraph>
        OSG is helping to organize extra resources to be made available to
        COVID-19 research! These resources include:
      </Typography>
      <ul>
        <li>
          <strong>Capabilities for a variety of computational research tasks.</strong>{' '}
          See <Link href='/services/ospool'>Computation on the OSPool</Link>.
        </li>
        <li>
          <strong>Proactive consultation and facilitation</strong> for quickly
          scaling up and automating workloads with up to thousands of
          concurrently-running jobs.
        </li>
        <li>
          <strong>Access to significant computing capacity</strong> through the{' '}
          <em>
            <Link href='https://support.opensciencegrid.org/support/home'>OSG Connect</Link>
          </em>{' '}
          service, which provides a batch system submit environment based on
          HTCondor. The OSG aggregates more than 100 clusters across the US, and
          COVID-19 projects have concurrently accessed tens of thousands of cores
          through this mechanism.
        </li>
        <li>
          <strong>Expertise</strong> for maximizing research throughput, including
          help with workflow design and development.
        </li>
      </ul>
      <Typography paragraph>
        COVID-19 researchers can access OSG through the Open Science Pool (e.g.,
        the &ldquo;<code>osg</code> VO&rdquo;), whether via the{' '}
        <Link href='https://connect.osg-htc.org/'>OSG Connect service</Link>, or by
        coordinating with us to route work from other submission points.
      </Typography>

      <Typography variant='h4' component='h2' mt={3} gutterBottom>
        Sites Supporting COVID-19 Research
      </Typography>
      <Typography paragraph>
        Any computing resource provider supporting the <code>osg</code> VO
        (&ldquo;Open Science Pool&rdquo;, see above) is likely already providing
        hours to support COVID-19. If you would like to provide additional
        resources <em>exclusive</em> for COVID-19,{' '}
        <Link href='/docs/compute-element/covid-19/'>instructions are available</Link>.
      </Typography>

      <Typography variant='h4' component='h2' mt={3} gutterBottom>
        Other Activities
      </Typography>
      <ul>
        <li>
          OSG participates in the COVID-19 HPC consortium, a broad consortium of
          industry, academia, and national labs to make a diverse set of computing
          resources available for research.
        </li>
        <li>Science Responds is a broad COVID-19 response effort from the scientific community.</li>
        <li>
          The IRIS-HEP software institute provides effort to the OSG through its{' '}
          <em>OSG-LHC</em> area; it has been coordinating additional{' '}
          <Link href='https://iris-hep.org/covid-19'>COVID-19 activities</Link>.
        </li>
        <li>
          OSG is participating in the{' '}
          <Link href='https://twiki.cern.ch/twiki/bin/view/LCG/WLCGresourcesForCOVID-19research'>
            WLCG COVID-19 task force
          </Link>{' '}
          to make LHC resources available to COVID-19 research.
        </li>
        <li>
          OSG and EGI are joining forces to commit specialized technical support,
          simulation tools, and compute and storage resources, to accelerate
          progress on{' '}
          <Link href='https://www.egi.eu/egi-call-for-covid-19-research-projects/'>
            COVID-19 research
          </Link>
          .
        </li>
        <li>
          OSG supports the{' '}
          <Link href='https://molssi.org'>Molecular Sciences Software Institute</Link>{' '}
          (MolSSI), which coordinates the{' '}
          <Link href='https://covid.molssi.org'>
            COVID-19 Molecular Structure and Therapeutics Hub
          </Link>
          .
        </li>
      </ul>
    </Container>
  );
}
