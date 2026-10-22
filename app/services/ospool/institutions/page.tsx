import type { Metadata } from 'next';
import Link from '@mui/material/Link';
import { Box, Container, Typography } from '@mui/material';
import { InstitutionsExplorer } from '@/components/services/ospool/InstitutionsExplorer';
import { OspoolLogos } from '@/components/services/ospool/OspoolLogos';

export const metadata: Metadata = {
  alternates: { canonical: '/services/ospool/institutions' },
  title: 'OSPool Contributing Institutions — OSG Consortium',
  description:
    'Institutions that contribute resources to the OSPool and their contributions to open science.',
};

export default function Page() {
  return (
    <Box>
      <Container maxWidth='md' sx={{ pt: 5 }}>
        <Typography variant='h2' component='h1' gutterBottom>
          OSPool Contributing Institutions
        </Typography>
        <Typography paragraph>
          The{' '}
          <Link href='/services/ospool'>OSPool</Link> is powered by contributions
          from the Open Science community, specifically the institutions listed
          below. The scale of research being conducted has reached new heights
          through the capacity provided by these institutions and the
          Consortium&rsquo;s technology suite.
        </Typography>
        <Typography paragraph>
          <strong>Institutions</strong> provide administrative control and
          oversight over the services they provide. At universities, the name of
          the registered institution is typically the name of the university
          rather than the name of the department that operates the service.
        </Typography>
        <Typography paragraph>
          All statistics listed below are a summary of the last year of
          contributions. <strong>Click on a row to view institution details.</strong>
        </Typography>
      </Container>

      <InstitutionsExplorer />

      <OspoolLogos />
    </Box>
  );
}
