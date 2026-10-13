import { Box, Container, Grid, Typography } from '@mui/material';
import { EventCard } from '@/components/EventCard';
import { getEvents, splitEvents } from '@/utils/events';
import { listingMetadata } from '@/utils/metadata';

export const metadata = listingMetadata(
  'Events',
  'Upcoming and past workshops, trainings, and meetings hosted by or involving the OSG Consortium.',
  '/events'
);

export default async function Page() {
  const events = await getEvents('CHTC', 'events', 'main');
  const { upcoming, past } = splitEvents(events);

  return (
    <>
      <Box textAlign={'center'} py={5}>
        <Typography variant={'h2'}>Events</Typography>
      </Box>
      <Container maxWidth={'xl'}>
        {upcoming.length > 0 && (
          <Grid container spacing={2} mb={4}>
            {upcoming.map((event) => (
              <Grid
                key={event.slug.join('-')}
                size={{ xs: 12, sm: 6, lg: 4 }}
              >
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        )}

        <Typography variant='h4' component='h2' color='text.secondary' pt={2}>
          Past Events
        </Typography>
        <Grid container spacing={2} mt={1}>
          {past.map((event) => (
            <Grid key={event.slug.join('-')} size={{ xs: 12, sm: 6, lg: 4 }}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
