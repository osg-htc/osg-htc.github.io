import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
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

export default function Page() {
  return (
    <Container maxWidth='md' sx={{ py: 5 }}>
      <Typography variant='h2' component='h1' gutterBottom>
        OSG’s Support for Campus Cyberinfrastructure Awardees
      </Typography>

      <Typography paragraph>
        Enhancing the capacity of Research Computing of US campuses through local
        deployment and cross-campus sharing is fully aligned with the vision of
        our NSF-funded project —{' '}
        <Link href='https://path-cc.io'>
          Partnership to Advance Throughput Computing (PATh)
        </Link>
        . Our project is committed to supporting CC* projects through deployment
        and operation.
      </Typography>

      <Typography
        variant='h4'
        component='h2'
        gutterBottom
        mt={4}
        id='support-for-cc-campuses'
      >
        Support for CC* Campuses
      </Typography>
      <Typography paragraph>
        Campuses that hold a CC* award can draw on the OSG Consortium and{' '}
        <Link href='https://path-cc.io'>PATh</Link> throughout the life of their
        award. Our teams have experience with each of the following aspects of a
        CC* project:
      </Typography>
      <ul>
        <li>
          Sharing data with authorized users via the{' '}
          <Link href='/services/osdf'>Open Science Data Federation (OSDF)</Link>
        </li>
        <li>
          Bringing the power of high throughput computing via the{' '}
          <Link href='/services/ospool'>OSPool</Link> to your researchers
        </li>
        <li>
          Meeting the resource sharing commitments in your award, and other
          options for integrating with the OSG Consortium
        </li>
        <li>Providing connections to help with data storage systems for shared resources</li>
        <li>Building regional computing networks and developing science gateways</li>
      </ul>
      <Typography paragraph>
        Please do not hesitate to contact us at{' '}
        <Link href='mailto:support@osg-htc.org'>support@osg-htc.org</Link> with
        questions about any of the above.
      </Typography>

      <Typography variant='h5' component='h3' gutterBottom mt={3} id='deployment'>
        Deployment
      </Typography>
      <Typography paragraph>
        Our experienced and friendly team of engineers and facilitators is
        dedicated to supporting system engineers and campus research groups,
        providing networking, computing and data storage consulting, expertise and
        guidance. These teams support your award to ensure smooth integration and
        onboarding into the OSPool or OSDF. Contact us at{' '}
        <Link href='mailto:help@osg-htc.org'>help@osg-htc.org</Link> to schedule a
        consultation.
      </Typography>

      <Typography variant='h5' component='h3' gutterBottom mt={3} id='operation'>
        Operation
      </Typography>
      <Typography paragraph>
        After your campus has integrated with the OSPool or OSDF, our team offers
        continued support to make the best use of computational resources at your
        campus, including troubleshooting and accounting data. Our CC* liaison
        meets with you periodically. If you or your researchers have any questions,
        contact us at <Link href='mailto:support@osg-htc.org'>support@osg-htc.org</Link>.
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
          <Typography fontWeight='bold'>CC* Institutional Contributions</Typography>
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
          <ul>
            {ccStar.map((site) => (
              <li key={site.name}>
                {site.href ? <Link href={site.href}>{site.name}</Link> : site.name}
              </li>
            ))}
          </ul>
        </AccordionDetails>
      </Accordion>

      <Typography variant='h4' component='h2' gutterBottom mt={4}>
        CC* Campus impact on Open Science
      </Typography>
      <Typography paragraph>
        The OSG Consortium has worked with CC* campuses for many years. These
        campuses have made significant contributions in support of science, both
        on their own campus and for the entire country.
      </Typography>
      <Typography variant='h5' component='h3' gutterBottom>
        Computing
      </Typography>
      <Typography paragraph>
        Campuses contribute core hours to researchers via the{' '}
        <Link href='/services/ospool'>OSPool</Link>, a compute resource accessible
        to any researcher affiliated with a US academic institution. These
        contributions support more than 230 research groups, campuses, multi-campus
        collaborations, and gateways, in fields ranging from medicine to economics,
        and from genomics to physics.
      </Typography>
      <Typography variant='h5' component='h3' gutterBottom>
        Data Storage
      </Typography>
      <Typography>
        The <Link href='/services/osdf'>Open Science Data Federation</Link>{' '}
        integrates data origins, making data accessible via caches, many of which
        are strategically located in the R&amp;E network backbone. CC* awards for
        data storage require interoperability with a national and federated data
        sharing fabric such as PATh/OSDF.
      </Typography>
    </Container>
  );
}
