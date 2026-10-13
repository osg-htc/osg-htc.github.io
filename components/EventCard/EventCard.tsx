import ExportedImage from 'next-image-export-optimizer';
import Link from 'next/link';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { BackendEvent, formatEventDate } from '@/utils/events';

export function EventCard({ event }: { event: BackendEvent }) {
  const href = `/events/${event.slug.join('/')}`;

  return (
    <Card
      variant='outlined'
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: 0,
        transition: 'box-shadow 200ms',
        '&:hover': { boxShadow: 4 },
      }}
    >
      {event.image && (
        <Link href={href} style={{ display: 'block' }}>
          <Box sx={{ position: 'relative', aspectRatio: 2 }}>
            <ExportedImage
              src={event.image.path}
              alt={event.image.alt}
              fill
              // One per row below `sm`, two up to `lg`, then three in an `xl`
              // container. Without this the browser assumes the full viewport
              // width and fetches the widest variant for a ~500px card.
              sizes='(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 500px'
              style={{ objectFit: 'cover' }}
            />
          </Box>
        </Link>
      )}
      <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Link href={href} style={{ textDecoration: 'none' }}>
          <Typography variant='h5' color='primary.dark'>
            {event.title}
          </Typography>
        </Link>
        <Typography variant='subtitle2' color='text.secondary'>
          {formatEventDate(event.start_date, event.end_date)}
        </Typography>
        {event.excerpt && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant='body2' color='text.primary'>
              {event.excerpt}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}
