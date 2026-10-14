import type { ReactNode } from 'react';
import ExportedImage from 'next-image-export-optimizer';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { MiniBarHeading } from './MiniBarHeading';

export function IntroCard({
  image,
  alt,
  sizes,
  title,
  subtitle,
  children,
  buttons,
}: {
  image: string;
  alt: string;
  /**
   * The width the image is painted at, for picking off the `srcset`.
   *
   * It is not a width this component can work out: the box below is 170px
   * tall with 16px of padding, so the image is 138px high, and `width: auto`
   * makes it 138px times its own aspect ratio wide. A square logo lands
   * around 139px and a wide graphic several times that.
   */
  sizes: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  buttons: { href: string; label: string }[];
}) {
  return (
    <Card
      variant='outlined'
      sx={{ border: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, height: 170 }}>
        {/* This row is above the fold, so the images are eager and
            preloaded rather than carrying next/image's default lazy
            loading. On xs the cards stack and only the first is really
            visible, which is the cost of doing it in the component. */}
        <ExportedImage
          src={image}
          alt={alt}
          width={350}
          height={350}
          sizes={sizes}
          priority
          style={{ height: '100%', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
        />
      </Box>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <MiniBarHeading variant='h5'>{title}</MiniBarHeading>
        {subtitle && (
          <Typography variant='subtitle1' color='text.secondary' mt={1}>
            {subtitle}
          </Typography>
        )}
        <Box sx={{ '& p': { mb: 1 } }}>{children}</Box>
        <Box sx={{ mt: 'auto', pt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {buttons.map((b) => (
            <Button
              key={b.href + b.label}
              href={b.href}
              variant='contained'
              color='secondary'
              size='small'
            >
              {b.label}
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
