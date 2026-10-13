import type { Metadata } from 'next';
import { Container, Link, Typography } from '@mui/material';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';

export const metadata: Metadata = {
  alternates: { canonical: '/pointers/enrollment-email' },
  title: 'Check Your Email — OSG Consortium',
  description: 'Next steps for enrolling in OSG services via CILogon.',
};

export default function Page() {
  return (
    <Container maxWidth='sm' sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
      <MarkEmailReadOutlinedIcon sx={{ fontSize: 120, color: 'primary.main' }} />
      <Typography sx={{ mt: 4 }}>
        Check your email mailbox for an email from{' '}
        <Link href='mailto:registry@cilogon.org'>registry@cilogon.org</Link> with more
        instructions.
      </Typography>
      <Typography sx={{ mt: 2 }}>
        Contact the Facilitation team with questions at{' '}
        <Link href='mailto:support@osg-htc.org'>support@osg-htc.org</Link>.
      </Typography>
    </Container>
  );
}
