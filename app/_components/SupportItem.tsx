import type { ReactNode } from 'react';
import ExportedImage from 'next-image-export-optimizer';
import { Box, Card, CardContent, Link, Typography } from '@mui/material';

export function SupportItem({
  image,
  alt,
  title,
  href,
  children,
}: {
  image: string;
  alt: string;
  title: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', p: 3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href={href} style={{ flexShrink: 0, lineHeight: 0 }}>
            <ExportedImage
              src={image}
              alt={alt}
              width={72}
              height={72}
              style={{ width: 72, height: 72, objectFit: 'contain' }}
            />
          </Link>
          <Typography variant='h5' component='h3'>
            <Link underline={'hover'} href={href}>{title}</Link>
          </Typography>
        </Box>
        <Typography color='text.secondary' sx={{ lineHeight: 1.7 }}>
          {children}
        </Typography>
      </CardContent>
    </Card>
  );
}
