import type { Metadata } from 'next';
import ExportedImage from 'next-image-export-optimizer';
import Link from '@mui/material/Link';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { MiniBarHeading } from './_components/MiniBarHeading';

export const metadata: Metadata = {
  alternates: { canonical: '/services/osdf' },
  title: 'Open Science Data Federation — OSG Consortium',
  description:
    'The OSDF connects disparate dataset repositories into a single, nation-wide data distribution network.',
};

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: 'Who can use the OSDF?',
    a: (
      <>
        <Typography paragraph>
          Any US-based academic, government, or non-profit institution may
          connect their object store to the OSDF.
        </Typography>
        <Typography>
          Researchers using the <Link href='/services/ospool'>OSPool</Link> from
          an <Link href='/services/access-point'>OSG-operated Access Point</Link>{' '}
          automatically get an allocation on a local filesystem connected to the
          OSDF.
        </Typography>
      </>
    ),
  },
  {
    q: 'Can I get storage on the OSDF? / OSDF and CC* Storage',
    a: (
      <>
        <Typography paragraph>
          What about a researcher or community that would like to connect to the
          OSDF but doesn’t have their own storage infrastructure?
        </Typography>
        <ul>
          <li>
            <Link href='https://new.nsf.gov/funding/opportunities/cc-campus-cyberinfrastructure'>
              CC* Storage projects
            </Link>{' '}
            have committed to having their storage managed by OSG; projects can
            request space from the OSG for their use via the support desk.
          </li>
          <li>
            Researchers can request an{' '}
            <Link href='https://openstoragenetwork.readthedocs.io/en/latest/'>
              OSN
            </Link>{' '}
            allocation from ACCESS and request OSG connect their bucket to the
            OSDF.
          </li>
        </ul>
      </>
    ),
  },
  {
    q: 'What is needed to contribute to the OSDF?',
    a: (
      <>
        <Typography paragraph>
          The “origin” service connects the backend object store (a POSIX
          filesystem, S3-compatible endpoint, or HTTP endpoint) with the national
          infrastructure. The origin service needs access to the storage and
          incoming connectivity from the external infrastructure.
        </Typography>
        <Typography paragraph>
          Most origin backends are currently a mounted shared filesystem, and S3
          endpoints like those found on AWS or{' '}
          <Link href='https://www.openstoragenetwork.org/'>OSN</Link> are
          increasingly common. To ease operations, the OSG Consortium offers a
          “hosted origin service” where central experts will install and operate
          the origin as a container, often deployed via the{' '}
          <Link href='https://nationalresearchplatform.org/'>
            National Research Platform
          </Link>{' '}
          or an institutional Kubernetes cluster inside a{' '}
          <Link href='https://fasterdata.es.net/science-dmz/'>ScienceDMZ</Link>.
        </Typography>
        <Typography>
          The hardware needed for the origin varies widely based on expected
          usage. The OSG team is experienced in consulting and providing help to
          universities in designing the integration; we host some{' '}
          <Link href='https://osg-htc.org/organization/osdf/example_data_origin.html'>
            suggested solutions
          </Link>
          .
        </Typography>
      </>
    ),
  },
  {
    q: 'How is the OSDF used?',
    a: (
      <>
        <Typography paragraph>
          The OSDF enables users and institutions to make datasets available to
          compute jobs running in distributed high-throughput computing (dHTC)
          environments such as the <Link href='/services/ospool'>OSPool</Link>.
          Compute jobs submitted from an HTCondor access point can access data
          stored in data origins, with HTCondor managing data transfer via the
          OSDF’s global namespace and data caches.
        </Typography>
        <Typography paragraph>
          By providing the distributed data access layer via these data caches,
          jobs can reduce wide-area network consumption, load on the data
          origins, and latency of data access.
        </Typography>
        <Typography>
          The OSDF is not limited to dHTC environments: it can be accessed via a
          browser (like S3, OSDF’s underlying protocol is HTTPS) or directly via
          a <Link href='https://github.com/PelicanPlatform/pelicanfs'>Python client</Link>.
        </Typography>
      </>
    ),
  },
  {
    q: 'Example OSDF Use Cases',
    a: (
      <>
        <Typography paragraph>
          The OSDF can be used in a variety of scenarios, including:
        </Typography>
        <ul>
          <li>A repository wants to stream its datasets, at scale, without scaling egress.</li>
          <li>
            A researcher wants to share a dataset with their community so others
            can use it in computational workflows.
          </li>
          <li>
            A researcher produces data on the OSPool that they need to store for
            future processing or sharing with the community.
          </li>
          <li>
            A team wants to make their datasets available to their community
            without opening their storage directly to the Internet.
          </li>
        </ul>
        <Typography>
          To learn more about these or other use cases, please reach out to our
          team of Research Computing Facilitators through{' '}
          <Link href='mailto:support@osg-htc.org'>support@osg-htc.org</Link>.
        </Typography>
      </>
    ),
  },
  {
    q: 'Who can access data in the OSDF?',
    a: (
      <>
        <Typography paragraph>
          Each origin is configured to enforce the object store’s access
          policies. Objects can be made public or private, and the repository
          controls the rules for sharing.
        </Typography>
        <Typography paragraph>
          The content distribution network enforces the origin’s access policies
          by requiring a signed{' '}
          <Link href='https://scitokens.org/'>access token</Link> for non-public
          objects.
        </Typography>
        <Typography>
          Non-public data is encrypted when sent over the network, but not on
          disk. The OSDF is appropriate for non-public data from “open science”
          communities but not highly regulated or sensitive data (such as PII or
          HIPAA data).
        </Typography>
      </>
    ),
  },
];

const CONTRIBUTORS = [
  { img: '/images/osdf/chtc.png', label: 'CHTC', href: 'https://chtc.cs.wisc.edu/' },
  { img: '/images/osdf/esnet.jpeg', label: 'ESnet', href: 'https://www.es.net/' },
  { img: '/images/osdf/internet2.png', label: 'Internet2', href: 'https://www.internet2.edu/' },
  { img: '/images/osdf/nebraska-n.jpg', label: 'University of Nebraska', href: 'https://www.unl.edu/' },
  { img: '/images/osdf/NRP.png', label: 'NRP', href: 'https://nationalresearchplatform.org/' },
  { img: '/images/osdf/syracuse.png', label: 'Syracuse University', href: 'https://www.syracuse.edu/' },
  { img: '/images/osdf/path.png', label: 'PATh', href: 'https://path-cc.io/' },
];

export default function Page() {
  return (
    <Container maxWidth='md' sx={{ py: 2 }}>
      <Box component='figure' sx={{ m: 0, mb: 4 }}>
        <iframe
          title='OSDF architectural component map'
          width='100%'
          height='500'
          frameBorder='0'
          allow='fullscreen'
          src='https://map.osg-htc.org/map/iframe?view=OpenScienceDataFederation#20.737115,-10.140436|2'
          style={{ marginTop: '1em', border: 'none' }}
        />
        <Typography component='figcaption' variant='caption' color='text.secondary'>
          Locations of current OSDF architectural components.
        </Typography>
      </Box>

      <Typography variant='h2' component='h1' gutterBottom>
        Open Science Data Federation
      </Typography>
      <Typography paragraph>
        The Open Science Data Federation (OSDF) connects disparate dataset
        repositories into a single, nation-wide data distribution network.
        Leveraging the OSDF, providers can make their datasets available to a
        wide variety of compute users, from browsers to Jupyter notebooks to high
        throughput computing environments.
      </Typography>
      <Typography paragraph>
        The OSDF is part of the OSG Fabric of Services, running software developed
        by the <Link href='https://pelicanplatform.org/'>Pelican Platform</Link>.
        There are many ways to participate in the OSDF — read on for three
        different ways to engage.
      </Typography>

      <MiniBarHeading>Share</MiniBarHeading>
      <Typography>The OSDF may be for you if…</Typography>
      <ul>
        <li>You are part of a collaborative project that works with shared data sets</li>
        <li>You have generated data as part of a project and want to share it</li>
      </ul>
      <Typography variant='h6' component='h4' gutterBottom>
        Want to make your dataset available via the OSDF?
      </Typography>
      <Button
        variant='outlined'
        color='secondary'
        href='https://docs.google.com/forms/d/e/1FAIpQLSdr3pLLRlEbhbf-h8cdZ5N9UJpshIDdgUeHJ07keRUK8ecKOw/viewform?usp=dialog'
      >
        Request a Consultation
      </Button>
      <Typography sx={{ mt: 2 }}>
        CICI PIs, see additional details for your projects here:{' '}
        <Link href='https://path-cc.io/cici-awardees/'>Dear CICI PIs</Link>
      </Typography>

      <MiniBarHeading>Contribute</MiniBarHeading>
      <Typography>
        The OSDF can be a platform for sharing data from your institution or
        contributing infrastructure to a national project:
      </Typography>
      <ul>
        <li>Provide unused storage space for other groups or projects to use via the OSDF</li>
        <li>Host infrastructure to make the OSDF more robust, like a local cache</li>
      </ul>
      <Typography variant='h6' component='h4' gutterBottom>
        Want to contribute to the OSDF infrastructure?
      </Typography>
      <Button
        variant='outlined'
        color='secondary'
        href='https://docs.google.com/forms/d/e/1FAIpQLSem2Lu-9nL2DBOXrSzmHTWdBZHsMmVN_pIq5ITSnj4A51BTLw/viewform?usp=header'
      >
        Request a Meeting
      </Button>

      <MiniBarHeading>Use</MiniBarHeading>
      <Typography>The OSDF may be for you if…</Typography>
      <ul>
        <li>You are using the OSPool to analyze or produce data.</li>
        <li>You want to analyze data that has been shared on the OSDF.</li>
      </ul>
      <Typography variant='h6' component='h4' gutterBottom>
        Want to use or process data hosted on the OSDF?
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button variant='outlined' color='secondary' href='mailto:support@osg-htc.org'>
          Contact OSDF Support Staff
        </Button>
        <Typography component='span'>or</Typography>
        <Button variant='outlined' color='secondary' href='mailto:support@osg-htc.org'>
          Request an OSPool Account
        </Button>
      </Box>

      <Typography variant='h3' component='h2' sx={{ mt: 5, mb: 2 }}>
        FAQ
      </Typography>
      {FAQS.map((faq, i) => (
        <Accordion key={i}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight='bold'>{faq.q}</Typography>
          </AccordionSummary>
          <AccordionDetails>{faq.a}</AccordionDetails>
        </Accordion>
      ))}

      <Typography variant='h3' component='h2' sx={{ mt: 5 }}>
        OSDF Contributors
      </Typography>
      <Typography paragraph sx={{ mt: 2 }}>
        The OSDF is part of the OSG Fabric of Services run by the OSG Consortium.
        The effort to operate the OSDF central services and hosted origins is
        provided by the <Link href='https://path-cc.io/'>PATh project</Link>.
        Institutions may operate their own origins on behalf of local repositories.
        The caches in the distribution network are primarily managed by PATh staff but
        consist of hardware contributed by external projects or institutions such
        as:
      </Typography>
      <Grid container spacing={3} alignItems='center' sx={{ mt: 1 }}>
        {CONTRIBUTORS.map((c) => (
          <Grid key={c.label} size={{ xs: 4, md: 12 / 7 }} sx={{ textAlign: 'center' }}>
            <Link href={c.href}>
              <Box sx={{ position: 'relative', height: 60 }}>
                <ExportedImage
                  src={c.img}
                  alt={c.label}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            </Link>
            <Typography variant='caption' color='text.secondary'>
              {c.label}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Powered-by / operated-by footer */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
          mt: 5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href='https://pelicanplatform.org'>
            <ExportedImage
              src='/images/logos/PelicanPlatformLogo_Icon.png'
              alt='Pelican Logo'
              width={200}
              height={200}
              style={{ width: 80, height: 'auto' }}
            />
          </Link>
          <Typography variant='h5' component='p'>
            Powered By <Link href='https://pelicanplatform.org'>Pelican Platform</Link>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href='https://path-cc.io'>
            <ExportedImage
              src='/images/logos/Logo_Round_Med.png'
              alt='PATh Logo'
              width={300}
              height={300}
              style={{ width: 80, height: 'auto' }}
            />
          </Link>
          <Typography variant='h5' component='p'>
            Operated by <Link href='https://path-cc.io'>PATh</Link>
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Link href='/services/osdf'>
          <ExportedImage
            src='/images/logos/OSDF_OSPool_Logos.png'
            alt='OSDF and OSPool Logos'
            width={3504}
            height={3502}
            style={{ width: 320, height: 'auto' }}
          />
        </Link>
      </Box>
    </Container>
  );
}
