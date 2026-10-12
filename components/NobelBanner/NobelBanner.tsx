'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Box, Container } from '@mui/material';

import { NOBEL_ARTICLE_HREF, NOBEL_BANNER_EXPIRES } from './config';

/**
 * Homepage banner for the Francis Halzen Nobel Prize article.
 *
 * The layout only renders this while the build date is before the expiry; the
 * effect below covers the window between a build and the expiry passing, so a
 * cached page stops showing it too. Styling lives in globals.css next to the
 * shimmer keyframes.
 */
export function NobelBanner() {
  const pathname = usePathname();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (new Date() >= new Date(NOBEL_BANNER_EXPIRES)) setExpired(true);
  }, []);

  if (expired || pathname !== '/') return null;

  return (
    <Link className='nobel-banner' href={NOBEL_ARTICLE_HREF}>
      <Container maxWidth='xl' sx={{ py: 0.5, textAlign: 'center' }}>
        <EmojiEventsIcon fontSize='inherit' sx={{ verticalAlign: 'text-bottom', mr: 0.5 }} />
        <span>OSPool User, Francis Halzen awarded the 2026 Nobel Prize</span>
        <Box component='span' className='nobel-banner-cta' sx={{ ml: 1, whiteSpace: 'nowrap' }}>
          Read More{' '}
          <ArrowForwardIcon fontSize='inherit' sx={{ verticalAlign: 'text-bottom' }} />
        </Box>
      </Container>
    </Link>
  );
}
