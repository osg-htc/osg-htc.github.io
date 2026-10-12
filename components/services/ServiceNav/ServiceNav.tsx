import { Box, Button, Container, Stack, Typography } from '@mui/material';

export interface ServiceNavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

/**
 * The sub-navigation bar for a service section (e.g. OSPool: Overview /
 * Projects / Institutions / Documentation / Training).
 *
 * Carries the legacy site's bar treatment — the brand navy background with
 * brand-orange links — from the `navy`/`orange` palette entries in app/theme.ts.
 * Hidden on small screens, where the main header navigation is used instead.
 */
export function ServiceNav({
  title,
  icon,
  links,
}: {
  title: string;
  icon?: React.ReactNode;
  links: ServiceNavLink[];
}) {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'block' },
        bgcolor: 'navy.main',
        py: 1,
      }}
    >
      <Container maxWidth='xl'>
        <Stack
          direction='row'
          alignItems='center'
          sx={{ position: 'relative', minHeight: 40 }}
        >
          <Typography
            variant='subtitle1'
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'orange.main',
              fontWeight: 700,
            }}
          >
            {icon}
            {title}
          </Typography>
          <Stack
            direction='row'
            spacing={1}
            sx={{
              alignItems: 'center',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {links.map((link) => (
              <Button
                key={link.href}
                href={link.href}
                variant='text'
                color='orange'
                size='small'
                startIcon={link.icon}
                sx={{
                  fontSize: '0.95rem',
                  '&:hover': { bgcolor: 'rgba(244, 182, 39, 0.12)' },
                  '& .MuiButton-startIcon': { mr: 0.5 },
                  '& svg': { fontSize: '1.1rem' },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
