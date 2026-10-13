import type { Metadata } from 'next';
import { Box, Container, Stack, Typography } from '@mui/material';

export const metadata: Metadata = {
  alternates: { canonical: '/branding' },
  title: 'OSG Branding and Logos — OSG Consortium',
  description: 'OSG brand colors and downloadable logo assets.',
};

const COLORS = [
  { name: 'Light Orange', hex: '#FDCB26' },
  { name: 'Intermediate Orange', hex: '#F1A52B' },
  { name: 'Dark Orange', hex: '#F08231' },
];

const LOGOS = [
  { label: 'OSG Logo (SVG)', src: '/images/logos/OSG-logo.svg' },
  { label: 'OSG Logo with Text (SVG)', src: '/images/logos/OSG_Logo_W_Text.svg' },
  { label: 'OSG Logo (PNG)', src: '/images/logos/OSG-logo.png' },
  { label: 'OSG Logo with Text (PNG)', src: '/images/logos/OSG_Logo_W_Text.png' },
];

export default function Page() {
  return (
    <Container maxWidth='md' sx={{ py: 5 }}>
      <Typography variant='h2' component='h1' gutterBottom>
        OSG Branding and Logos
      </Typography>

      <Typography variant='h4' component='h2' mt={3} gutterBottom>
        Colors
      </Typography>
      <Typography paragraph>
        The OSG colors and their hexadecimal values are:
      </Typography>
      <Stack spacing={1}>
        {COLORS.map((c) => (
          <Box key={c.hex} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: c.hex }} />
            <Typography>
              {c.name} — <code>{c.hex}</code>
            </Typography>
          </Box>
        ))}
      </Stack>

      <Typography variant='h4' component='h2' mt={4} gutterBottom>
        Images
      </Typography>
      <Typography paragraph>
        <strong>Click on an image to download.</strong> Where applicable the SVG
        format of the OSG logo is suggested for use due to its superior resolution
        and smaller file size. PNGs are also made available for use.
      </Typography>
      <Stack spacing={4} sx={{ mt: 2 }}>
        {LOGOS.map((logo) => (
          <Box key={logo.src}>
            <Typography variant='h6' component='h3' gutterBottom>
              <a href={logo.src} download>
                {logo.label}
              </a>
            </Typography>
            <a href={logo.src} download>
              <Box
                component='img'
                src={logo.src}
                alt={logo.label}
                sx={{ width: '50%', bgcolor: 'grey.100', p: 2, borderRadius: 1 }}
              />
            </a>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}
