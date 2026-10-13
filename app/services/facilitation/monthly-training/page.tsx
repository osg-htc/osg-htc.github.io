import type { Metadata } from 'next';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { EventCard } from '@/components/EventCard';
import { getEvents, splitEvents } from '@/utils/events';

export const metadata: Metadata = {
  alternates: { canonical: '/services/facilitation/monthly-training' },
  title: 'Monthly Training with the Facilitation Team — OSG Consortium',
  description:
    'The Facilitation Team offers monthly training sessions for the HTC community.',
};

export default async function Page() {
  const events = await getEvents('CHTC', 'events', 'main');
  const trainings = splitEvents(events).upcoming.filter((e) =>
    e.tags?.includes('osg-training')
  );

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Box sx={{ width: '2rem', height: 5, bgcolor: 'primary.main', mb: 1 }} />
      <Typography variant='h2' component='h1' gutterBottom>
        Monthly Training with the Facilitation Team
      </Typography>
      <Typography paragraph>
        The Facilitation Team offers monthly training sessions for the HTC
        community. Peruse our previous training materials and recordings below,
        and see what sessions are coming up!
      </Typography>

      <Typography variant='h4' component='h2' gutterBottom mt={3}>
        Training Materials
      </Typography>
      <Typography paragraph>
        Many of our previous training materials are available online. View a
        recording on YouTube, look at our slides, or try out the hands-on
        tutorial(s).
      </Typography>
      <Button
        href='https://portal.osg-htc.org/documentation/support_and_training/training/materials/'
        variant='contained'
        color='secondary'
      >
        Past Training Materials
      </Button>

      <Typography variant='h4' component='h2' gutterBottom mt={4}>
        Upcoming Training Events
      </Typography>
      <Typography paragraph>
        All User Training sessions are offered on Tuesdays from 2:30–4pm ET
        (11:30am – 1pm PT), on the third Tuesday of the month. The trainings are
        designed as stand-alone subjects — you do not need to bring a dataset.
        The only prerequisites are some familiarity with the command line; some
        familiarity with HTCondor job submission is useful but not required.
      </Typography>
      <Button
        href='https://calendar.google.com/calendar/embed?src=c_f786e9455a56e4b1ea7aca0d15c88178fd0e309e92c3cf4767c268ea3e2fc884%40group.calendar.google.com&ctz=America%2FChicago'
        variant='contained'
        color='secondary'
        sx={{ mb: 2 }}
      >
        Google Calendar
      </Button>

      {trainings.length > 0 ? (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {trainings.map((event) => (
            <Grid key={event.slug.join('-')} size={{ xs: 12, sm: 6 }}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color='text.secondary' sx={{ mt: 2 }}>
          No upcoming training events are scheduled right now — check the calendar
          above for the latest.
        </Typography>
      )}
    </Container>
  );
}
