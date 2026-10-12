import Link from 'next/link';
import { Box, Chip, Stack, Typography } from '@mui/material';
import {
  formatLongDate,
  getTagColor,
  type BackendPresentation,
} from '@chtc/web-components/content';

/**
 * Compact presentation teaser for pointing at /presentations from elsewhere on
 * the site. `stacked` puts the thumbnail above the text (sidebar); the default
 * sits it alongside (list column).
 *
 * The thumbnail is a plain `<img>`: YouTube thumbnails are remote URLs that the
 * static-export image optimizer has no variants for.
 */
export function PresentationSummary({
  presentation,
  stacked = false,
}: {
  presentation: BackendPresentation;
  stacked?: boolean;
}) {
  const { title, presenter, event, date, keywords, thumbnail, youtubeId, slug } =
    presentation;

  const thumbnailSrc =
    thumbnail?.src ??
    (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null);

  const byline = event ? `${presenter} at ${event}` : presenter;

  return (
    <Link
      href={`/presentations/${slug.join('/')}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: stacked ? 'column' : 'row',
          mt: 2,
          '&:hover': { color: 'primary.main' },
        }}
      >
        {thumbnailSrc && (
          <Box
            component='img'
            src={thumbnailSrc}
            alt={`${title} thumbnail`}
            sx={{
              borderRadius: 1,
              objectFit: 'cover',
              ...(stacked
                ? { width: '100%', aspectRatio: '1.91', mb: 1 }
                : { width: 80, height: 80, flexShrink: 0 }),
            }}
          />
        )}
        <Box sx={stacked ? undefined : { pl: 1 }}>
          {stacked && keywords && keywords.length > 0 && (
            <Stack direction='row' spacing={0.5} sx={{ flexWrap: 'wrap', mb: 0.5 }}>
              {keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  size='small'
                  sx={{
                    backgroundColor: getTagColor(keyword),
                    color: '#fff',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                  }}
                />
              ))}
            </Stack>
          )}
          <Typography variant='subtitle1' color='text.primary' lineHeight={1.2}>
            {title}
          </Typography>
          <Typography variant='caption' color='text.secondary' display='block'>
            {byline}
          </Typography>
          <Typography variant='caption' color='text.secondary' display='block'>
            {formatLongDate(date)}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}
