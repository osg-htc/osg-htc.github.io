import type { ReactNode } from 'react';
import { Box, Card, CardContent, Link, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export function FindUsCard({
  icon,
  title,
  ctaLabel,
  href,
  children,
}: {
  icon: ReactNode;
  title: string;
  ctaLabel: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Box sx={{ height: '100%' }}>
      <Card sx={{ p: 3, pb: 0, height: '100%', overflow: 'visible' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, gap: 1.5, p: 0 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'rgba(246,163,42,0.15)',
              color: '#b45309',
            }}
          >
            {icon}
          </Box>
          <Typography variant='h6' component='h3'>
            {title}
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.6 }}>
            {children}
          </Typography>
          <Link
            href={href}
            underline={"hover"}
            sx={{
              mt: 'auto',
              pt: 1,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 0.5,
              fontWeight: 600,
            }}
          >
            <Box component='span' sx={{ minWidth: 0 }}>
              {ctaLabel}
            </Box>
            <ArrowForwardIcon sx={{ fontSize: '1rem', flexShrink: 0 }} />
          </Link>
        </CardContent>
      </Card>
    </Box>
  );
}
