import type { Metadata } from 'next';
import { Container, Typography } from '@mui/material';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';

export const metadata: Metadata = {
  alternates: { canonical: '/pointers/account-request' },
  title: 'Account Requested — OSG Consortium',
  description:
    'Confirmation that your OSPool Access Point account request was received.',
};

export default function Page() {
  return (
    <Container maxWidth='sm' sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
      <MarkEmailReadOutlinedIcon sx={{ fontSize: 120, color: 'primary.main' }} />
      <Typography sx={{ mt: 4 }}>
        Thank you for requesting access to the OSPool ap40.uw.osg-htc.org Access
        Point.
      </Typography>
      <Typography sx={{ mt: 2 }}>
        An OSG team member will contact you within <strong>one business day</strong>{' '}
        regarding the activation of your account.
      </Typography>
    </Container>
  );
}
