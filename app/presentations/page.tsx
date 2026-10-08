import { PresentationGrid } from '@/components/PresentationGrid';
import {
  filterPresentations,
  getPresentations,
} from '@chtc/web-components/content';
import { Box, Container, Typography } from '@mui/material';

export default async function Page() {
  const presentations = filterPresentations(
    await getPresentations('CHTC', 'Presentations', 'main'),
    'osg'
  );

  return (
    <>
      <Box textAlign={'center'} py={5}>
        <Typography variant={'h2'}>Presentations</Typography>
      </Box>
      <Container maxWidth={'xl'}>
        <PresentationGrid presentations={presentations} />
      </Container>
    </>
  );
}
