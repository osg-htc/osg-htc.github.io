import ExportedImage from 'next-image-export-optimizer';
import Link from 'next/link';
import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import { type Staff } from '@chtc/web-components/content';

/** First letters of the first and last name, for the portrait placeholder. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/**
 * A single person on the team page: portrait on top, then name, institution
 * and role — the vertical card the legacy site used for every section. The
 * `executive` variant is the same card at a larger grid size, so it only
 * changes the portrait's `sizes` hint.
 *
 * The initials sit *behind* the portrait rather than being swapped in by an
 * error handler, so the card still reads correctly when a staff entry points
 * at an image that does not exist. The export optimizer emits no variants for
 * an image it could not fetch, and next/image renders its `<img>` with
 * transparent text, so the alternative is a blank tile.
 */
export function StaffCard({
  member,
  executive = false,
}: {
  member: Staff;
  executive?: boolean;
}) {
  const { name, title, image, institution, website } = member;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: 1,
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'grey.200',
        }}
      >
        <Typography
          aria-hidden
          sx={{
            fontSize: executive ? '3.5rem' : '2.25rem',
            fontWeight: 700,
            color: 'grey.500',
            userSelect: 'none',
          }}
        >
          {initials(name)}
        </Typography>
        {image && (
          <ExportedImage
            src={image}
            alt={name}
            fill
            sizes={
              executive
                ? '(max-width: 600px) 100vw, (max-width: 1200px) 33vw, 300px'
                : '(max-width: 600px) 50vw, (max-width: 1200px) 25vw, 200px'
            }
            style={{ objectFit: 'cover' }}
          />
        )}
      </Box>
      <CardContent
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2 }}
      >
        <Typography variant='subtitle1' component='h3' fontWeight={700}>
          {website ? (
            <Link href={website} style={{ textDecoration: 'underline' }}>
              {name}
            </Link>
          ) : (
            name
          )}
        </Typography>
        {institution && (
          <Typography variant='caption' color='text.secondary'>
            {institution}
          </Typography>
        )}
        <Typography
          variant='body2'
          fontStyle='italic'
          color='text.secondary'
          sx={{ mt: 'auto', pt: 1.5 }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}
