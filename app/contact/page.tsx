import type { Metadata } from 'next';
import Link from 'next/link';
import { Box, Button, Card, CardContent, Container, Divider, Typography } from '@mui/material';

export const metadata: Metadata = {
  title: 'Contact Us — OSG Consortium',
  description: 'Reach out to the OSG Consortium with questions, comments, or ideas.',
};

export default function Page() {
  return (
    <Container maxWidth='md' sx={{ py: 5 }}>
      <Box
        component='img'
        src='/images/talk-to-us-chicago.jpeg'
        alt='OSG staff at a community event'
        sx={{ width: '100%', borderRadius: 1 }}
      />
      <Typography variant='h2' component='h1' mt={4} gutterBottom>
        We Want to Hear From You
      </Typography>
      <Typography paragraph>
        Our work depends on collaboration and feedback with our community. Please
        reach out at any time with questions, comments, complaints, ideas, or
        whatever you want to share!
      </Typography>
      <Button href='mailto:support@osg-htc.org' variant='contained' color='secondary'>
        Contact Us
      </Button>

      <Typography variant='h4' component='h2' mt={4} mb={2}>
        Other Resources
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant='h5' component='h3'>Use</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography paragraph>
            Manage and run thousands of computational jobs, and deliver your data
            across platforms using the Open Science Pool and Open Science Data
            Federation. To learn more, contact the Research Facilitation team at
            support@osg-htc.org or see our{' '}
            <Link href='https://portal.osg-htc.org/documentation/support_and_training/support/getting-help-from-RCFs/'>
              help page
            </Link>{' '}
            for other ways to get in touch.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Button href='https://portal.osg-htc.org/application' variant='contained' color='secondary' size='small'>
              Request an OSPool Account
            </Button>
            <Button href='https://osgfacilitation.setmore.com/#classes' variant='contained' color='secondary' size='small'>
              Register for trainings or events
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant='h5' component='h3'>Contribute</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography paragraph>
            OSG services are comprised of compute and storage contributions from
            dozens of campuses, national labs and other institutions. To learn
            more, contact the Campus Coordinator at support@osg-htc.org.
          </Typography>
          <Button href='/campus-cyberinfrastructure' variant='contained' color='secondary' size='small'>
            Learn about CC* Campuses
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant='h5' component='h3'>Learn</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography paragraph>
            The OSG Consortium benefits from many different technology groups. To
            learn more, see the pages below or for general questions, contact
            support@osg-htc.org.
          </Typography>
          <ul>
            <li><Link href='https://htcondor.org/'>About HTCSS</Link></li>
            <li><Link href='https://pelicanplatform.org/'>About Pelican</Link></li>
            <li><Link href='https://osg-htc.org/docs/'>About OSG Software Overview</Link></li>
          </ul>
        </CardContent>
      </Card>

      <Typography variant='h5' component='h2' mt={4}>
        For OSG policies, executive information
      </Typography>
      <Typography paragraph>
        Email: <Link href='mailto:peter.couvares@ligo.org'>Peter Couvares</Link>{' '}
        (OSG Executive Director)
      </Typography>
      <Typography variant='h5' component='h2'>
        For help managing an OSG Mailing list membership
      </Typography>
      <Typography>
        Please refer to our{' '}
        <Link href='/community/mailing-lists'>
          managing mailing list membership document
        </Link>
        .
      </Typography>
    </Container>
  );
}
