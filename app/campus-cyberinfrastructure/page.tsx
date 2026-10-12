import type { Metadata } from 'next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { FacilityExplorer } from '@/components/FacilityExplorer';
import ccStar from '@/utils/cc-star.json';

export const metadata: Metadata = {
  title:
    'OSG’s Support for Campus Cyberinfrastructure Awardees — OSG Consortium',
  description:
    'How the PATh team and OSG support campuses holding an NSF Campus Cyberinfrastructure (CC*) award.',
};

/**
 * Sidebar contents, mirroring the `table_of_contents` front matter the legacy
 * page declared for its table-of-contents layout. Kept next to the headings it
 * points at so the two stay in step.
 */
const CONTENTS: { name: string; href: string; children?: { name: string; href: string }[] }[] = [
  {
    name: 'Support for CC* Campuses',
    href: '#support-for-cc-campuses',
    children: [
      { name: 'Deployment', href: '#deployment' },
      { name: 'Operation', href: '#operation' },
    ],
  },
  {
    name: 'CC* Impact on Open Science',
    href: '#cc-campus-impact-on-open-science',
    children: [
      { name: 'Computing', href: '#computing' },
      { name: 'Data Storage', href: '#data-storage' },
    ],
  },
];

/** The legacy page set `.fs-5` on every body paragraph of this page. */
const BODY = {
  fontSize: '1.25rem',
  lineHeight: 1.6,
  // globals.css strips color and underline from bare anchors, so in-copy links
  // need the warm amber the MDX content pages use or they read as plain text.
  '& a': { color: '#b45309', fontWeight: 600 },
} as const;

export default function Page() {
  return (
    <Container maxWidth='xl' sx={{ py: 5 }}>
      <Grid container spacing={4} justifyContent='center'>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Typography variant='h2' component='h1' gutterBottom>
            OSG’s Support for Campus Cyberinfrastructure Awardees
          </Typography>

          <Typography paragraph sx={BODY}>
            Enhancing the capacity of Research Computing of US campuses through
            local deployment and cross campus sharing is fully aligned with the
            vision of our NSF funded project —{' '}
            <Link href='https://path-cc.io'>
              Partnership to Advance Throughput Computing (PATh)
            </Link>
            . Our project is committed to supporting CC* projects through
            deployment and operation.
          </Typography>

          <Typography
            variant='h4'
            component='h2'
            gutterBottom
            mt={5}
            id='support-for-cc-campuses'
          >
            Support for CC* Campuses
          </Typography>
          <Typography paragraph sx={BODY}>
            Campuses that hold a CC* award can draw on the OSG Consortium and{' '}
            <Link href='https://path-cc.io'>PATh</Link> throughout the life of
            their award. Our teams have experience with each of the following
            aspects of a CC* project:
          </Typography>
          <Box component='ul' sx={{ ...BODY, pl: 3, '& li': { mb: 1 } }}>
            <li>
              Sharing data with authorized users via the{' '}
              <Link href='/services/osdf'>
                Open Science Data Federation (OSDF)
              </Link>
            </li>
            <li>
              Bringing the power of high throughput computing via the{' '}
              <Link href='/services/ospool'>OSPool</Link> to your researchers
            </li>
            <li>
              Meeting the resource sharing commitments in your award, and other
              options for integrating with the OSG Consortium
            </li>
            <li>
              Providing connections to help with data storage systems for shared
              inter-campus or intra-campus resources
              <Box component='ul' sx={{ pl: 3, mt: 1 }}>
                <li>
                  We have collected{' '}
                  <Link href='/organization/osdf/example_data_origin'>
                    community data storage systems
                  </Link>{' '}
                  for your consideration
                </li>
              </Box>
            </li>
            <li>
              Building{' '}
              <Link href='/spotlights/2023/10/24/gpargo-cc-star'>
                regional computing networks
              </Link>
            </li>
            <li>
              Developing science gateways to utilize high throughput computing
              via the <Link href='/services/ospool'>OSPool</Link>
            </li>
          </Box>
          <Typography paragraph sx={BODY}>
            Please do not hesitate to contact us at{' '}
            <Link href='mailto:support@osg-htc.org'>support@osg-htc.org</Link>{' '}
            with questions about any of the above.
          </Typography>

          <Typography
            variant='h5'
            component='h3'
            gutterBottom
            mt={4}
            id='deployment'
          >
            Deployment
          </Typography>
          <Typography paragraph sx={BODY}>
            Our experienced and friendly team of engineers and facilitators is
            dedicated to supporting system engineers and campus research groups.
            This team provides networking, computing and data storage
            consulting, providing expertise and guidance.
          </Typography>
          <Typography paragraph sx={BODY}>
            These teams support your award to ensure smooth integration and
            onboarding into the OSPool or OSDF. The facilitation team also
            provides extensive support to researchers with regular training,
            weekly office hours, documentation, videos and more.
          </Typography>
          <Typography paragraph sx={BODY}>
            Please contact us at{' '}
            <Link href='mailto:help@osg-htc.org'>help@osg-htc.org</Link> to
            schedule a consultation to discuss deployment of OSG resources at
            your campus.
          </Typography>

          <Typography
            variant='h5'
            component='h3'
            gutterBottom
            mt={4}
            id='operation'
          >
            Operation
          </Typography>
          <Typography paragraph sx={BODY}>
            After your campus has integrated with the OSPool or OSDF, our team
            offers continued support to make the best use of computational
            resources at your campus. This includes troubleshooting of OSG
            services as well as providing accounting data for the research
            projects and kinds of research making use of your resources. Also,
            our CC* liaison will meet with you periodically to see how things are
            going and what we can do to better support you.
          </Typography>
          <Typography paragraph sx={BODY}>
            Our staff remains available to assist you with meeting your goals as
            your research computing needs evolve. If you or your researchers have
            any questions or issues, please contact us at{' '}
            <Link href='mailto:support@osg-htc.org'>support@osg-htc.org</Link>.
          </Typography>

          <Box sx={{ my: 3 }}>
            <iframe
              title='CC* facility map'
              width='100%'
              height='500'
              frameBorder='0'
              src='https://map.osg-htc.org/map/iframe?view=CCStar#38.61687,-97.86621|4|hybrid'
              style={{ border: 'none' }}
            />
          </Box>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight='bold'>
                CC* Institutional Contributions
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <FacilityExplorer ccStarOnly />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight='bold'>All CC* Institutions</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                component='ul'
                sx={{ pl: 3, '& a': { color: '#b45309', fontWeight: 600 } }}
              >
                {ccStar.map((site) => (
                  <li key={site.name}>
                    {site.href ? (
                      <Link href={site.href}>{site.name}</Link>
                    ) : (
                      site.name
                    )}
                  </li>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Typography
            variant='h4'
            component='h2'
            gutterBottom
            mt={5}
            id='cc-campus-impact-on-open-science'
          >
            CC* Campus impact on Open Science
          </Typography>
          <Typography paragraph sx={BODY}>
            The OSG Consortium has worked with CC* campuses for many years. These
            campuses have made significant contributions in support of science,
            both on their own campus and for the entire country.
          </Typography>

          <Typography
            variant='h5'
            component='h3'
            gutterBottom
            mt={4}
            id='computing'
          >
            Computing
          </Typography>
          <Typography paragraph sx={BODY}>
            Campuses contribute core hours to researchers via the{' '}
            <Link href='/services/ospool'>OSPool</Link>, a compute resource
            accessible to any researcher affiliated with a US academic
            institution. These contributions support more than 230 research
            groups, campuses, multi-campus collaborations, and gateways, and in
            fields of study ranging from the medicine to economics, and from
            genomics to physics.
          </Typography>

          <Typography
            variant='h5'
            component='h3'
            gutterBottom
            mt={4}
            id='data-storage'
          >
            Data Storage
          </Typography>
          <Typography sx={BODY}>
            The{' '}
            <Link href='/services/osdf'>Open Science Data Federation</Link>{' '}
            integrates data origins, making data accessible via caches, of which
            many are strategically located in the R&amp;E network backbone. CC*
            awards for data storage require interoperability with a national and
            federated data sharing fabric such as PATh/OSDF.
          </Typography>
        </Grid>

        <Grid size={{ lg: 4 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
          <Box sx={{ position: 'sticky', top: '2rem' }}>
            <Typography variant='h5' component='h2' gutterBottom>
              Contents
            </Typography>
            <Box
              component='ul'
              sx={{
                pl: 3,
                '& li': { mb: 0.75 },
                '& a': { color: '#b45309', fontWeight: 600 },
              }}
            >
              {CONTENTS.map((entry) => (
                <li key={entry.href}>
                  <Link href={entry.href}>{entry.name}</Link>
                  {entry.children && (
                    <Box component='ul' sx={{ pl: 3, mt: 0.75 }}>
                      {entry.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href}>{child.name}</Link>
                        </li>
                      ))}
                    </Box>
                  )}
                </li>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
