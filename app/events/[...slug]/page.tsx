import ExportedImage from 'next-image-export-optimizer';
import { Box, Container, Grid, Typography } from '@mui/material';
import MarkdownContainer from '@/components/MarkdownContainer';
import type { Metadata } from 'next';
import {
  eventMetadata,
  formatEventDate,
  isUpcoming,
  type BackendEvent,
} from '@chtc/web-components/content';
import { getSiteEvents } from '@/utils/events';
import { OSG_SITE } from '@/site.config';

export async function generateStaticParams() {
  try {
    const events = await getSiteEvents();
    return events.map((event) => ({ slug: event.slug }));
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function getEventBySlug(slug: string[]): Promise<BackendEvent | null> {
  try {
    const events = await getSiteEvents();
    return (
      events.find((event) => event.slug.join('-') === slug.join('-')) ?? null
    );
  } catch (error) {
    console.error('Error finding event by slug:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const event = await getEventBySlug(slug);
  if (!event) return { title: 'Event Not Found — OSG Consortium' };
  return eventMetadata(event, {
    path: `/events/${slug.join('/')}`,
    site: OSG_SITE,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slug = (await params).slug;
  const event = await getEventBySlug(slug);

  if (!event) {
    return (
      <Container>
        <Box textAlign='center' pt={6}>
          <Typography variant='h3'>Event Not Found</Typography>
        </Box>
      </Container>
    );
  }

  const dateLabel = `${isUpcoming(event) ? 'Upcoming Event' : 'Past Event'} | ${formatEventDate(event.start_date, event.end_date)}`;

  return (
    <Container sx={{ pt: 4 }}>
      <Typography
        variant='h6'
        component='p'
        color='text.secondary'
        textAlign='right'
      >
        {dateLabel}
      </Typography>

      {event.banner && (
        <Box mt={2}>
          <Box sx={{ position: 'relative', width: '100%', aspectRatio: 3 }}>
            <ExportedImage
              src={event.banner.path}
              alt={event.banner.alt}
              fill
              // Full width of the default `md` container.
              sizes='(max-width: 1200px) 100vw, 1200px'
              style={{ objectFit: 'cover' }}
            />
          </Box>
          {event.banner.credit && (
            <Box sx={{ bgcolor: 'grey.100', p: 0.5 }}>
              <Typography variant='caption' color='text.secondary'>
                {event.banner.credit}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      <Typography variant='h2' component='h1' mt={2} mb={2}>
        {event.title}
      </Typography>

      <Grid container spacing={4} pb={6}>
        <Grid size={{ xs: 12, md: event.sidebar ? 8 : 12 }}>
          <MarkdownContainer content={event.content} />
        </Grid>
        {event.sidebar && (
          <Grid size={{ xs: 12, md: 4 }}>
            <MarkdownContainer content={event.sidebar} />
          </Grid>
        )}
        {event.endblock && (
          <Grid size={{ xs: 12 }}>
            <MarkdownContainer content={event.endblock} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
