import { Box, Container, Grid, Link, Typography } from '@mui/material';

const PARTNER_LOGOS = [
  { href: 'https://path-cc.io', src: '/images/logos/Logo_Round_Med.png', alt: 'PATh' },
  {
    href: 'https://pelicanplatform.org/',
    src: '/images/logos/PelicanPlatformLogo_Icon.png',
    alt: 'Pelican Platform',
  },
  { href: 'https://iris-hep.org/', src: '/images/logos/IRIS_HEP.png', alt: 'IRIS-HEP' },
];

const FOOTER_LINKS: {
  name: string;
  children: { name: string; url: string }[];
}[] = [
  {
    name: 'About',
    children: [
      { name: 'Introduction', url: '/about/introduction' },
      { name: 'Publications', url: '/about/publications' },
      { name: 'Code of Conduct', url: '/code-of-conduct' },
      { name: 'Acknowledging OSG', url: '/about/acknowledging' },
    ],
  },
  {
    name: 'Services',
    children: [
      { name: 'Open Science Pool', url: '/services/ospool' },
      { name: 'Open Science Data Federation', url: '/services/osdf' },
      { name: 'OSG-Operated Access Points', url: '/services/access-point' },
    ],
  },
  {
    name: 'Documentation',
    children: [
      { name: 'User', url: 'https://portal.osg-htc.org' },
      { name: 'System Admin', url: 'https://osg-htc.org/docs/' },
      { name: 'Security', url: 'https://osg-htc.org/security/' },
    ],
  },
  {
    name: 'Engagement',
    children: [
      { name: 'User Spotlights', url: '/spotlights' },
      { name: 'News', url: '/news' },
      { name: 'Events', url: '/events' },
      { name: 'Presentations', url: '/presentations' },
      { name: 'Newsletter', url: '/newsletter' },
    ],
  },
];

export default function Footer() {
  return (
    <Box component='footer' sx={{ mt: 'auto' }}>
      {/* Logos + link columns on a light, shadowed band */}
      <Box sx={{ bgcolor: 'grey.100', boxShadow: '0 -1px 10px rgba(17,24,39,0.06)' }}>
        <Container maxWidth='xl' sx={{ py: 6 }}>
          <Grid container spacing={4} justifyContent='center'>
            {/* Logo cluster — hidden on small screens, like the legacy footer */}
            <Grid size={{ xs: 12, lg: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Link href='/' aria-label='OSG home'>
                  <Box
                    component='img'
                    src='/images/logos/OSG-logo.svg'
                    alt='OSG logo'
                    sx={{ height: '5rem', width: 'auto' }}
                  />
                </Link>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                {PARTNER_LOGOS.map((logo) => (
                  <Box
                    key={logo.href}
                    component='a'
                    href={logo.href}
                    target='_blank'
                    rel='noopener'
                    sx={{ display: 'inline-flex' }}
                  >
                    <Box
                      component='img'
                      src={logo.src}
                      alt={logo.alt}
                      sx={{ height: '4rem', width: 'auto' }}
                    />
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Link columns */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={3}>
                {FOOTER_LINKS.map((category) => (
                  <Grid key={category.name} size={{ xs: 6, lg: 4, xl: 3 }}>
                    <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 1 }}>
                      {category.name}
                    </Typography>
                    <Box component='ul' sx={{ listStyle: 'none', m: 0, p: 0 }}>
                      {category.children.map((child) => (
                        <Box component='li' key={child.url + child.name} sx={{ mb: 0.5 }}>
                          <Link
                            href={child.url}
                            color='text.secondary'
                            underline='hover'
                            sx={{
                              fontSize: '0.95rem',
                              '&:hover': { color: 'primary.main' },
                            }}
                          >
                            {child.name}
                          </Link>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* NSF funding statement */}
      <Container maxWidth='lg' sx={{ py: 5 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          <Box
            component='img'
            src='/images/logos/nsf.png'
            alt='National Science Foundation logo'
            sx={{ height: 80, width: 'auto', flexShrink: 0 }}
          />
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ textAlign: { xs: 'center', sm: 'left' }, maxWidth: '70ch' }}
          >
            This work is supported by{' '}
            <Link href='https://www.nsf.gov/div/index.jsp?div=OAC'>NSF</Link> under
            Grant Nos. 2030508, 1836650, and{' '}
            <Link href='https://www.nsf.gov/awardsearch/show-award?AWD_ID=2609485'>
              2609485
            </Link>
            . Any opinions, findings, and conclusions or recommendations expressed in
            this material are those of the author(s) and do not necessarily reflect the
            views of the National Science Foundation.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
