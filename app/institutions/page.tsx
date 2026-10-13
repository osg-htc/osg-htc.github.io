import type { Metadata } from 'next';
import Link from 'next/link';
import { Box, Container, Typography } from '@mui/material';
import { FacilityExplorer } from '@/components/FacilityExplorer';

export const metadata: Metadata = {
  alternates: { canonical: '/institutions' },
  title: 'OSG Institutions — OSG Consortium',
  description:
    'Institutions registered with the OSG Consortium and their contributions over the last year.',
};

export default function Page() {
  return (
    <Box>
      <Container maxWidth='md' sx={{ pt: 5 }}>
        <Typography variant='h2' component='h1' gutterBottom>
          OSG Institutions
        </Typography>
        <Typography paragraph>
          Institutions registered with the OSG Consortium leverage the services
          provided by the Consortium to make locally administered services
          accessible to remote researchers. The services provided by an
          institution can be in the form of computing capacity — processing and/or
          storage — and/or collections of named objects. Some of the capacity
          provided by these institutions is available to the Open Science
          community via the{' '}
          <Link href='/services/ospool/institutions'>Open Science Pool (OSPool)</Link>.
        </Typography>
        <Typography paragraph>
          <strong>Institutions</strong> provide administrative control and
          oversight over the services they provide. At universities, the name of
          the registered institution is typically the name of the university
          rather than the name of the department that operates the service.
        </Typography>
        <Typography paragraph>
          <strong>Click on a row to view facility details.</strong>
        </Typography>
      </Container>

      <FacilityExplorer />
    </Box>
  );
}
