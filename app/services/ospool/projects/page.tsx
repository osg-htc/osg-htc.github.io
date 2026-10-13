import type { Metadata } from 'next';
import Link from 'next/link';
import { Box, Container, Typography } from '@mui/material';
import { ProjectsExplorer } from '@/components/services/ospool/ProjectsExplorer';
import { ProjectsSummary } from '@/components/services/ospool/ProjectsSummary';
import { OspoolLogos } from '@/components/services/ospool/OspoolLogos';

export const metadata: Metadata = {
  alternates: { canonical: '/services/ospool/projects' },
  title: 'OSPool Projects — OSG Consortium',
  description:
    'Projects active across reporting pools in the OSG Consortium in the last year.',
};

export default function Page() {
  return (
    <Box>
      <Container maxWidth='md' sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant='h2' component='h1' gutterBottom>
          OSPool Projects
        </Typography>
        <Typography color='text.secondary'>
          The below projects used OSPool resources to advance their research in
          the past year. To run your own research on the OSPool sign up now on
          the <Link href='https://portal.osg-htc.org'>OSG Portal</Link>.
        </Typography>
      </Container>

      <ProjectsSummary />

      <ProjectsExplorer />

      <OspoolLogos />
    </Box>
  );
}
