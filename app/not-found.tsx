import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Typography } from '@mui/material';

export const metadata: Metadata = {
  title: '404 Not Found — OSG Consortium',
  description:
    'The page you were looking for was not found on the OSG Consortium website.',
  // Nothing here is worth a search result, and it has no canonical URL of its
  // own: the same page answers for every address that does not exist.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container maxWidth='md' sx={{ py: 5 }}>
      <Typography variant='h2' component='h1' gutterBottom>
        404 Page Not Found
      </Typography>
      <Typography paragraph>
        The page you were looking for was not found. If you believe this was in
        error, please contact{' '}
        <Link href='mailto:help@osg-htc.org'>help@osg-htc.org</Link>.
      </Typography>
      <Typography paragraph>
        For other ways to get in touch, see{' '}
        <Link href='https://portal.osg-htc.org/documentation/support_and_training/support/getting-help-from-RCFs/'>
          Getting Help from Research Computing Facilitators
        </Link>
        .
      </Typography>
    </Container>
  );
}
