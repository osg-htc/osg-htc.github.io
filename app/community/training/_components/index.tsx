import { Box, Button, Card, CardContent, Divider, Typography } from '@mui/material';

/**
 * The dark, centered call-out the legacy page rendered as `.alert.alert-dark`:
 * a prompt plus a single action, set apart from the surrounding prose.
 */
export function TrainingCallout({
  title,
  ctaLabel,
  href,
}: {
  title: string;
  ctaLabel: string;
  href: string;
}) {
  return (
    <Box
      sx={{
        my: 4,
        px: 3,
        py: 3,
        borderRadius: 3,
        bgcolor: 'secondary.main',
        color: 'common.white',
        textAlign: 'center',
      }}
    >
      <Typography variant='h6' component='p' gutterBottom>
        {title}
      </Typography>
      <Button variant='contained' color='primary' href={href} sx={{ mt: 1 }}>
        {ctaLabel}
      </Button>
    </Box>
  );
}

/**
 * A bordered event card — title, rule, body, then a "Learn More" action —
 * matching the two `.card` blocks the legacy page used for OSG School and the
 * annual throughput computing conference.
 */
export function EventHighlight({
  title,
  href,
  ctaLabel = 'Learn More',
  children,
}: {
  title: string;
  href: string;
  ctaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <Card sx={{ my: 3, '&:hover': { transform: 'none' } }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant='h5' component='h3'>
          {title}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ lineHeight: 1.7, '& ul': { pl: 3 }, '& li': { mb: 0.75 } }}>
          {children}
        </Box>
        <Button variant='contained' color='primary' href={href} sx={{ mt: 2 }}>
          {ctaLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
