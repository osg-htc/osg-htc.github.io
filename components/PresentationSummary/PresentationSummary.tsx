import Link from 'next/link';
import ExportedImage from 'next-image-export-optimizer';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { recordRemoteImages } from '@/utils/remoteImages';
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
 * The thumbnail is usually a remote YouTube frame, so it is recorded for the
 * image optimizer to download and resize at build time.
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
  recordRemoteImages([thumbnailSrc]);

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
          <ExportedImage
            src={thumbnailSrc}
            alt={`${title} thumbnail`}
            // YouTube's hqdefault frames are 480x360; `cover` crops them.
            width={480}
            height={360}
            // `cover` fills the short edge, so the 80px square paints the
            // 4:3 frame ~107px wide.
            sizes={stacked ? '(max-width: 600px) 100vw, 400px' : '107px'}
            style={{
              borderRadius: 12,
              objectFit: 'cover',
              ...(stacked
                ? { width: '100%', height: 'auto', aspectRatio: '1.91', marginBottom: 8 }
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
