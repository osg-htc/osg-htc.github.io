import type { Metadata } from 'next';
import Link from '@mui/material/Link';
import { Box, Container, Typography } from '@mui/material';
import { OsdfProjectsExplorer } from '@/components/services/osdf/OsdfProjectsExplorer';

export const metadata: Metadata = {
  alternates: { canonical: '/services/osdf/projects' },
  title: 'OSDF via the OSPool — OSG Consortium',
  description:
    'Statistics for how jobs running on the OSPool have leveraged the OSDF services.',
};

export default function Page() {
  return (
    <Box>
      <Container maxWidth='md' sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant='h2' component='h1' gutterBottom>
          OSDF accesses via the OSPool
        </Typography>
        <Typography color='text.secondary'>
          The <Link href='/services/ospool'>OSPool</Link> is one of the most
          common ways researchers use the{' '}
          <Link href='/services/osdf'>OSDF</Link> in computational workflows. This
          page shows statistics for how jobs running on the OSPool have leveraged
          the OSDF services over the past year.
        </Typography>
      </Container>

      <OsdfProjectsExplorer />
    </Box>
  );
}
