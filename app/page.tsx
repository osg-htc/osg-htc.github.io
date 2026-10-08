import ExportedImage from 'next-image-export-optimizer';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Link
} from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import {
  ArticleCard,
  formatLongDate,
  getArticles,
  sortArticles,
  type BackendArticle,
} from '@chtc/web-components/content';
import { getEvents, splitEvents, formatEventDate } from '@/utils/events';
import { SectionHeading } from './_components/SectionHeading';
import { IntroCard } from './_components/IntroCard';
import { SupportItem } from './_components/SupportItem';
import { FindUsCard } from './_components/FindUsCard';

const MAPS = [
  {
    title: 'All Sites',
    image: '/images/osg_map_previews/Sites.png',
    params: '#45.737115,-90.140436|2',
  },
  {
    title: 'OSPool Contributors',
    image: '/images/osg_map_previews/OSPool_Contributors.png',
    params: '?view=OSPool#15.737115,-90.140436|3',
  },
  {
    title: 'OSDF Contributors',
    image: '/images/osg_map_previews/OSDF.png',
    params: '?view=OpenScienceDataFederation#45.737115,-90.140436|2',
  },
  {
    title: 'CC* Sites',
    image: '/images/osg_map_previews/CC-Star.png',
    params: '?view=CCStar#38.737115,-90.140436|5',
  },
];

const WHAT_WE_DO: { title: string; icon: React.ReactNode; body: React.ReactNode }[] = [
  {
    title: 'What We Do',
    icon: <BoltOutlinedIcon />,
    body: 'The OSG facilitates access to distributed high throughput computing for research in the US. The resources accessible through the OSG are contributed by the community, organized by the OSG, and governed by the OSG consortium. In the last 12 months, we have provided more than 1.2 billion CPU hours to researchers across a wide variety of projects.',
  },
  {
    title: 'Submit Locally, Run Globally',
    icon: <PublicOutlinedIcon />,
    body: (
      <>
        Researchers can run jobs on OSG from their home institution or an{' '}
        <Link href='https://portal.osg-htc.org/'>OSG-Operated Access Point</Link>{' '}
        (available for US-based research and scholarship).
      </>
    ),
  },
  {
    title: 'Sharing Is Key',
    icon: <Diversity3OutlinedIcon />,
    body: (
      <>
        <em>Sharing is a core principle of the OSG.</em> Over 100 million CPU
        hours delivered on the OSG in the past year were opportunistic,
        contributed by university campuses, government-supported supercomputing
        facilities and research collaborations. Sharing allows individual
        researchers to access larger computing resources and large organizations
        to keep their utilization high.
      </>
    ),
  },
  {
    title: 'Resource Providers',
    icon: <DnsOutlinedIcon />,
    body: 'The OSG consists of computing and storage elements at over 100 individual sites spanning the United States. These sites, primarily at universities and national labs, range in size from a few hundred to tens of thousands of CPU cores.',
  },
  {
    title: 'The OSG Software Stack',
    icon: <LayersOutlinedIcon />,
    body: (
      <>
        The OSG provides an integrated software stack to enable high throughput
        computing;{' '}
        <Link href='https://support.opensciencegrid.org/support/home'>
          visit our technical documents website for information
        </Link>
        .
      </>
    ),
  },
  {
    title: 'Coordinating CI Services',
    icon: <HubOutlinedIcon />,
    body: (
      <>
        NSF’s{' '}
        <Link href='https://www.nsf.gov/cise/oac/vision/blueprint-2019/'>
          Blueprint for National Cyberinfrastructure Coordination Services
        </Link>{' '}
        lays out the need for coordination services to bring together the
        distributed elements of a national CI ecosystem. It highlights OSG as
        providing distributed high throughput computing services to the U.S.
        research community.
      </>
    ),
  },
];

function articleHref(article: BackendArticle): string {
  const base = article.type === 'news' ? '/news' : '/spotlights';
  return `${base}/${article.slug.join('/')}`;
}

export default async function Home() {
  const articles = await getArticles('CHTC', 'Articles', 'main');
  const osgArticles = sortArticles(
    articles.filter((a) => a.publish_on?.includes('osg'))
  );

  const news = osgArticles.filter((a) => a.type === 'news').slice(0, 4);
  const spotlights = osgArticles.filter((a) => a.type !== 'news');
  const heroStory =
    osgArticles.find((a) => a.banner_src) ?? osgArticles[0] ?? null;

  const events = await getEvents('CHTC', 'events', 'main');
  const upcomingEvents = splitEvents(events).upcoming.slice(0, 3);

  return (
    <Box>
      {/* Hero banner */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'secondary.main',
          color: 'common.white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(70% 130% at 50% -20%, rgba(246,163,42,0.40), transparent 60%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth='md' sx={{ position: 'relative' }}>
          <Typography
            variant='h1'
            component='h1'
            sx={{ fontSize: { xs: '2.75rem', md: '4.25rem' } }}
          >
            OSG Consortium
          </Typography>
          <Typography
            variant='h5'
            component='p'
            sx={{ mt: 2, fontWeight: 400, color: 'rgba(255,255,255,0.82)' }}
          >
            Advancing Open Science through High Throughput Computing
          </Typography>
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant='contained'
              color='primary'
              size='large'
              href='https://portal.osg-htc.org/application'
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Three intro cards */}
      <Container maxWidth='xl' sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <IntroCard
              image='/images/logos/OSDF_OSPool_Logos.png'
              alt='OSDF Logo'
              title='OSDF'
              buttons={[{ href: '/services/osdf', label: 'Explore OSDF' }]}
            >
              <Typography paragraph>
                The OSDF enables users and institutions to share data files and
                storage capacity.
              </Typography>
              <Typography component='div'>
                Leveraging the OSDF, providers can make their datasets available
                to a wide variety of compute users, such as:
                <ul>
                  <li>Browsers</li>
                  <li>Jupyter Notebooks</li>
                  <li>HTC Environments, such as the OSPool</li>
                </ul>
              </Typography>
            </IntroCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <IntroCard
              image='/images/logos/OSPool_Logo.png'
              alt='OSPool Logo'
              title='OSPool'
              subtitle='No Proposal, No Allocation, No Cost'
              buttons={[
                { href: 'https://portal.osg-htc.org/application', label: 'Request An Account' },
                {
                  href: 'https://portal.osg-htc.org/documentation/support_and_training/training/ospool_for_education/',
                  label: 'OSPool for Educators',
                },
              ]}
            >
              <Typography paragraph>
                The OSPool provides its users with fair-share access to compute
                and storage capacity contributed by university campuses, and
                government-supported supercomputing institutions.
              </Typography>
              <Typography>
                Sign up now and join the{' '}
                <Link href='/projects'>hundreds of researchers and educators</Link>{' '}
                already using the OSPool!
              </Typography>
            </IntroCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <IntroCard
              image='/images/homepage/HTC25.png'
              alt='Throughput Computing Abstract Graphic'
              title='Learn More'
              buttons={[
                { href: 'https://path-cc.io/contact/', label: 'Contact Us' },
                { href: '/community/training', label: 'Learning Opportunities' },
              ]}
            >
              <Typography component='div'>
                Get connected with our community!
                <ul>
                  <li>
                    <Link href='/services/facilitation'>
                      Learn about the facilitation team and their services
                    </Link>
                  </li>
                  <li>
                    <Link href='/services/facilitation/monthly-training'>
                      Explore upcoming training and past materials
                    </Link>
                  </li>
                  <li>
                    <Link href='https://agenda.hep.wisc.edu/event/2297/'>
                      Check out our most recent community conference, HTC25
                    </Link>
                  </li>
                </ul>
                Contact the facilitation team — we want to hear from you!
              </Typography>
            </IntroCard>
          </Grid>
        </Grid>
      </Container>

      {/* Hero story / News / Events */}
      <Container maxWidth='xl' sx={{ py: 3 }}>
        {/* Center the columns so there's no empty gap when the (conditional)
            Events column is absent. */}
        <Grid container spacing={2} justifyContent='center'>
          {heroStory && (
            <Grid size={{ xs: 12, md: 5 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
                <Typography variant='subtitle2'>
                  <Link href='/spotlights'>Spotlight User</Link>
                </Typography>
                <Typography variant='h4' component='h2' gutterBottom>
                  {heroStory.title}
                </Typography>
                <Box sx={{ minHeight: 120 }}>
                  <Typography>{heroStory.excerpt}</Typography>
                </Box>
                <Button
                  href={articleHref(heroStory)}
                  variant='contained'
                  color='secondary'
                  sx={{ mt: 'auto', mr: 'auto' }}
                >
                  Read About Spotlight User
                </Button>
              </Card>
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%', p: 2 }}>
              <Typography variant='subtitle2' gutterBottom>
                <Link href='/news'>News</Link>
              </Typography>
              {news.map((article) => (
                <Link
                  key={article.slug.join('-')}
                  href={articleHref(article)}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <Box sx={{ my: 1.5, '&:hover': { color: 'primary.main' } }}>
                    <Typography variant='subtitle1' color='text.primary' lineHeight={1.2}>
                      {article.title}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {formatLongDate(article.date)}
                    </Typography>
                  </Box>
                </Link>
              ))}
            </Card>
          </Grid>

          {upcomingEvents.length > 0 && (
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: '100%', p: 2 }}>
                <Typography variant='subtitle2' gutterBottom>
                  <Link href='/events'>Events</Link>
                </Typography>
                {upcomingEvents.map((event) => (
                  <Link
                    key={event.slug.join('-')}
                    href={`/events/${event.slug.join('/')}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <Box sx={{ display: 'flex', mt: 1.5, '&:hover': { color: 'primary.main' } }}>
                      {event.banner?.path && (
                        <Box sx={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                          <ExportedImage
                            src={event.banner.path}
                            alt={event.banner.alt}
                            fill
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                          />
                        </Box>
                      )}
                      <Box sx={{ pl: 1 }}>
                        <Typography variant='subtitle1' color='text.primary' lineHeight={1.2}>
                          {event.title}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {formatEventDate(event.start_date, event.end_date)}
                        </Typography>
                      </Box>
                    </Box>
                  </Link>
                ))}
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Maps */}
      <Container maxWidth='xl' sx={{ py: 6 }}>
        <SectionHeading>OSG By Maps</SectionHeading>
        <Grid container spacing={2}>
          {MAPS.map((map) => (
            <Grid key={map.title} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Box
                component='a'
                href={`https://map.osg-htc.org${map.params}`}
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'box-shadow .2s ease, transform .2s ease, border-color .2s ease',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(17,24,39,0.10)',
                    transform: 'translateY(-3px)',
                    borderColor: 'transparent',
                  },
                }}
              >
                <Typography variant='subtitle1' component='h3' fontWeight={700} sx={{ px: 1.5, py: 1, color: 'text.primary' }}>
                  {map.title}
                </Typography>
                <Box sx={{ position: 'relative', width: '100%', aspectRatio: 2 }}>
                  <ExportedImage src={map.image} alt={`${map.title} map preview`} fill style={{ objectFit: 'cover' }} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* User Spotlights */}
      <Box sx={{ bgcolor: 'grey.100', py: 6, mb: 4 }}>
        <Container maxWidth='xl'>
          <SectionHeading>User Spotlights</SectionHeading>
          <Grid container spacing={2} justifyContent='center'>
            {spotlights.slice(0, 3).map((article) => (
              <Grid key={article.slug.join('-')} size={{ xs: 12, md: 6, xl: 4 }}>
                <ArticleCard href={articleHref(article)} article={article} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* What We Do */}
      <Container maxWidth='xl' sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {WHAT_WE_DO.map((item) => (
            <Grid key={item.title} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent
                  sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 1.5, p: 3 }}
                >
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
                    {item.icon}
                  </Box>
                  <Typography variant='h6' component='h3'>
                    {item.title}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    component='div'
                    sx={{ lineHeight: 1.7, '& a': { color: '#b45309', fontWeight: 600 } }}
                  >
                    {item.body}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Find Us */}
      <Box sx={{ bgcolor: 'grey.100', my: 4, py: 6 }}>
        <Container maxWidth='lg'>
          <SectionHeading>Find Us</SectionHeading>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FindUsCard
                icon={<GroupsOutlinedIcon />}
                title='Contribute Resources'
                ctaLabel='Email our team'
                href='mailto:support@osg-htc.org'
              >
                Are you a resource provider wanting to join our collaboration?
                We&rsquo;d love to hear from you.
              </FindUsCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FindUsCard
                icon={<RocketLaunchOutlinedIcon />}
                title='Access Computing'
                ctaLabel='OSG-Operated Access Point'
                href='https://portal.osg-htc.org'
              >
                Want more computing capacity? Check with your local providers, or
                use an Access Point with access to the OSPool (US-based
                academic, government, and non-profit research).
              </FindUsCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FindUsCard
                icon={<ForumOutlinedIcon />}
                title='Get in Touch'
                ctaLabel='support@osg-htc.org'
                href='mailto:support@osg-htc.org'
              >
                For any other inquiries, reach out and our team will be happy to
                help.
              </FindUsCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FindUsCard
                icon={<InsightsOutlinedIcon />}
                title='Explore Our Impact'
                ctaLabel='Accounting portal'
                href='https://gracc.opensciencegrid.org'
              >
                See the breadth of the OSG&rsquo;s impact through our
                accounting portal.
              </FindUsCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Support */}
      <Container maxWidth='lg' sx={{ pb: 8 }}>
        <SectionHeading>Support</SectionHeading>
        <Typography
          color='text.secondary'
          sx={{ maxWidth: '65ch', mx: 'auto', textAlign: 'center', mb: 4 }}
        >
          The activities of the OSG Consortium are supported by multiple projects
          and in-kind contributions from members. Significant funding is provided
          through:
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <SupportItem
              image='/images/logos/Logo_Round_Med.png'
              alt='PATh Logo'
              title='PATh'
              href='https://path-cc.io/'
            >
              The Partnership to Advance Throughput Computing (PATh) is an
              NSF-funded (#2030508) project to address the needs of the rapidly
              growing community embracing Distributed High Throughput Computing
              (dHTC) technologies and services to advance their research.
            </SupportItem>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SupportItem
              image='/images/logos/IRIS_HEP.png'
              alt='IRIS-HEP Logo'
              title='IRIS-HEP'
              href='https://iris-hep.org/'
            >
              The Institute for Research and Innovation in Software for High Energy
              Physics (IRIS-HEP) is an NSF-funded (#1836650) software institute
              established to meet the software and computing challenges of the
              HL-LHC, through R&D for the software for acquiring, managing,
              processing and analyzing HL-LHC data.
            </SupportItem>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
