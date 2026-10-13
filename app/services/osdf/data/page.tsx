import type { Metadata } from 'next';
import { Box, Container, Typography } from '@mui/material';

import { getDataRepositories } from '@/utils/dataRepositories';
import { RepositoryTable } from './_components';

export const metadata: Metadata = {
  alternates: { canonical: '/services/osdf/data' },
  title: 'OSDF Data Repositories — OSG Consortium',
  description:
    'Browse the data repositories integrated with the Open Science Data Federation (OSDF).',
};

export default async function Page() {
  const repositories = await getDataRepositories();

  return (
    <Box component='section' sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth='lg'>
        <Box
          sx={{ width: '2.5rem', height: 4, bgcolor: 'primary.main', borderRadius: 2, mb: 1.5 }}
        />
        <Typography variant='h3' component='h1' sx={{ fontWeight: 800 }}>
          Data Repositories
        </Typography>
        <Typography color='text.secondary' sx={{ mt: 1, mb: 4, maxWidth: '70ch' }}>
          Explore the {repositories.length} data repositories available through the Open
          Science Data Federation. Select a repository to learn more about its data,
          access, and namespaces.
        </Typography>
        <RepositoryTable repositories={repositories} basePath='/services/osdf/data' />
      </Container>
    </Box>
  );
}
