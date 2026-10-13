import type { Metadata } from 'next';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

export const metadata: Metadata = {
  alternates: { canonical: '/newsletter' },
  title: 'OSG Community Announcements — OSG Consortium',
  description:
    'Sign up for the OSG announcement mailing list for researchers, campuses, collaborators and operators.',
};

export default function Page() {
  return (
    <Container maxWidth='sm' sx={{ py: 5 }}>
      <Typography variant='h2' component='h1' gutterBottom>
        OSG Community Announcements
      </Typography>
      <Typography paragraph>
        Sign up for our announcement mailing list for researchers, campuses,
        collaborators and operators of OSG services.
      </Typography>
      <Typography fontWeight='bold'>Content Includes:</Typography>
      <ul>
        <li>Upcoming events, training schedules</li>
        <li>Occasional reminders about office hours for individual Users/Staff</li>
        <li>Featured News about service updates and milestones</li>
        <li>Collection of new User Stories and OSG Service Statistics</li>
      </ul>

      <Box
        component='form'
        action='https://osg-htc.us3.list-manage.com/subscribe/post?u=114fa2e78e0c95bb7671fc015&id=21a88cec7e&f_id=00855ee2f0'
        method='post'
        target='_self'
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}
      >
        <TextField required type='email' name='EMAIL' label='Email Address' fullWidth />
        <TextField type='text' name='FNAME' label='First Name' fullWidth />
        <TextField type='text' name='LNAME' label='Last Name' fullWidth />
        <Typography variant='caption' color='text.secondary'>
          * indicates required
        </Typography>
        {/* Mailchimp bot-protection honeypot — must stay off-screen, not hidden */}
        <Box aria-hidden='true' sx={{ position: 'absolute', left: -5000 }}>
          <input
            type='text'
            name='b_114fa2e78e0c95bb7671fc015_21a88cec7e'
            tabIndex={-1}
            defaultValue=''
          />
        </Box>
        <Button type='submit' name='subscribe' variant='contained' sx={{ alignSelf: 'flex-start' }}>
          Subscribe
        </Button>
      </Box>
    </Container>
  );
}
