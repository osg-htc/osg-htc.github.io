import type { Metadata } from 'next';
import ExportedImage from 'next-image-export-optimizer';
import Link from 'next/link';
import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import {
  filterPresentations,
  getPresentations,
  type Staff,
} from '@chtc/web-components/content';
import { PresentationSummary } from '@/components/PresentationSummary';
import { getStaff } from '@/utils/staff';
import { recordStaffImages } from '@/utils/remoteImages';
import { CTAButton } from './_components/CTAButton';

export const metadata: Metadata = {
  alternates: { canonical: '/services/facilitation' },
  title: 'OSG Research Computing Facilitators — OSG Consortium',
  description:
    'Facilitation Services accelerate dHTC uptake by campus researchers and collaborations via the OSG.',
};

/**
 * `is_facilitator` is an OSG-only field in the shared staff YAML, so it isn't
 * part of the library's `Staff` type.
 */
type Facilitator = Staff & { is_facilitator?: number };

const EXCERPT =
  'Facilitation Services leverage the CHTC-pioneered principles of Research Computing Facilitation to accelerate dHTC uptake by campus researchers and collaborations via the Open Science Federation and OSG-Operated Access Points, and by campuses and other organizations interested in advancing their own dHTC and dHTC Facilitation capabilities.';

export default async function Page() {
  const team = (await getStaff('osg')) as Facilitator[];
  const facilitators = team
    .filter((member) => member.is_facilitator === 1)
    .sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));

  // Declare the portraits for the export image optimizer; see remoteImages.ts.
  recordStaffImages(facilitators);

  const facilitationTalks = filterPresentations(
    await getPresentations('CHTC', 'Presentations', 'main'),
    'osg'
  )
    .filter((presentation) => presentation.keywords?.includes('Facilitation'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <Box sx={{ width: '2rem', height: 5, bgcolor: 'primary.main', mb: 1 }} />
          <Typography variant='h2' component='h1' gutterBottom>
            OSG Research Computing Facilitators
          </Typography>
          <Typography variant={'body1'}>Facilitation Services leverage the CHTC-pioneered principles of Research Computing Facilitation to accelerate dHTC uptake by campus researchers and collaborations via the Open Science Federation and OSG-Operated Access Points, and by campuses and other organizations interested in advancing their own dHTC and dHTC Facilitation capabilities.</Typography>

          {/* Facilitator team */}
          <Box sx={{ py: 2 }}>
            {facilitators.map((member) => (
              <Paper
                key={member.name}
                variant='outlined'
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  gap: 2,
                  p: 2,
                  mb: 2,
                }}
              >
                <Box sx={{ order: { xs: 2, sm: 1 } }}>
                  {member.website ? (
                    <Link href={member.website} style={{ textDecoration: 'none' }}>
                      <Typography variant='h5' color='primary.dark'>
                        {member.name}
                      </Typography>
                    </Link>
                  ) : (
                    <Typography variant='h5'>{member.name}</Typography>
                  )}
                  <Typography color='text.secondary'>{member.institution}</Typography>
                  {member.description && (
                    <Typography variant='body2' color='text.secondary' mt={1}>
                      {member.description}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ order: { xs: 1, sm: 2 }, flexShrink: 0 }}>
                  <ExportedImage
                    src={member.image}
                    alt={member.name}
                    width={140}
                    height={140}
                    style={{ borderRadius: '0.5rem', objectFit: 'cover' }}
                  />
                </Box>
              </Paper>
            ))}
          </Box>

          <Typography variant='h4' component='h2' gutterBottom id='what-we-do'>
            What We Do
          </Typography>
          <Typography paragraph>
            To help researchers effectively utilize computing resources, our Research
            Computing Facilitators (RCFs) not only guide the implementation of
            computational work on PATh-supported compute capacity, but can also point
            researchers to other national services related to research computing and
            data needs.
          </Typography>
          <CTAButton href='https://path-cc.io/contact/'>Talk to Us</CTAButton>
          <CTAButton href='#our-philosophy'>Learn More about Our Approach</CTAButton>

          <Typography variant='h5' component='h3' gutterBottom mt={3} id='regular-activities'>
            Regular Activities
          </Typography>
          <Typography paragraph>
            We are available to answer questions via an email &ldquo;ticket&rdquo;
            system. We aim to provide a first response (although not necessarily a
            solution!) within 1-2 business days.
          </Typography>
          <CTAButton href='mailto:support@path-cc.io'>Email Us</CTAButton>
          <Typography paragraph>
            In addition to email, we host drop-in &ldquo;office hours&rdquo; online
            twice a week.
          </Typography>
          <ul>
            <li>
              <strong>Tuesday</strong>: 4 – 5:30pm ET / 1 – 2:30pm PT
            </li>
            <li>
              <strong>Thursday</strong>: 11:30am – 1pm ET / 8:30 – 10am PT
            </li>
          </ul>
          <Typography paragraph>
            No appointment is needed, just show up during the available times!
            Contact us for the zoom link.
          </Typography>
          <CTAButton href='https://portal.osg-htc.org/documentation/support_and_training/support/getting-help-from-RCFs/'>
            Get Help
          </CTAButton>

          <Typography variant='h5' component='h3' gutterBottom mt={3} id='training'>
            Training
          </Typography>
          <Typography paragraph>
            The Facilitation Team offers monthly training sessions for the HTC
            community. Upcoming training events are announced via the OSPool users
            email list and are listed on our monthly training page. The Team also
            organizes and hosts an annual in-person summer school, the OSG School.
          </Typography>
          <CTAButton href='/services/facilitation/monthly-training'>
            Monthly Training
          </CTAButton>
          <CTAButton href='https://osg-htc.org/community/school.html'>
            Annual OSG School
          </CTAButton>

          <Typography variant='h5' component='h3' gutterBottom mt={3} id='other-events'>
            Other Events
          </Typography>
          <Typography variant={'body1'}>
            Are you hosting an event where the audience might benefit from our
            services? We are happy to give guest presentations or trainings for your
            organization or event. Let us know at{' '}
            <Link href='mailto:support@osg-htc.org'>support@osg-htc.org</Link>.
          </Typography>

          <Typography variant='h4' component='h2' gutterBottom mt={4} id='our-philosophy'>
            Our Philosophy
          </Typography>
          <Typography variant={'body1'}>
            Drawing upon the principles of Research Computing Facilitation (RCF) pioneered by UW-Madison’s Center for High Throughput Computing, the Facilitation Services team work to expand the impact of dHTC and dHTC Facilitation across various PATh stakeholders, including researchers, multi-institutional collaborations, and the campuses and organizations that support them. These principles include:
          </Typography>
          <ul>
            <li>proactive engagement</li>
            <li>personalized guidance</li>
            <li>technology agnosticism</li>
            <li>
              &lsquo;teach-to-fish&rsquo; documentation and training methodologies
            </li>
            <li>prioritization of &ldquo;research performance&rdquo; over computing performance</li>
            <li>advocacy for user-centric improvements to relevant technologies.</li>
          </ul>
          <Typography variant={'body1'}>
            PATh Research Computing Facilitators apply these principles to the practice of dHTC Facilitation for researchers, research groups, and multi-institutional collaborations leveraging the dHTC environment of the OSG via access services like the <Link href='https://portal.osg-htc.org'>OSG Portal</Link> (available to researchers affiliated with any US-based academic, government, or non-profit organization). For example, all new users of the OSG-Operated Access Points first meet with a Facilitator to collaborate on an efficient on-ramp plan and anticipated impact, with accessible ongoing support.
          </Typography>

          <Typography variant='h5' component='h3' gutterBottom>
            Facilitation for Campuses
          </Typography>
          <Typography variant={'body1'}>
            Leveraging the same principles and a history of experience with researchers, the RCF team also facilitates the navigation of PATh services for staff at campuses (including NSF CC\* awardees) and other organizations looking to enhance their dHTC capabilities, whether by growing local dHTC capacity and support, or by connecting local resources and end-users into the OSG. As part of the services for campuses, the RCF team also leverages its own experience in dHTC for end-users to offer dHTC Facilitation training via shadowing, workshops, and ongoing support channels.
          </Typography>

          <Typography variant='h5' component='h3' gutterBottom>
            Taking dHTC Impact Farther
          </Typography>
          <Typography variant={'body1'}>
            As an ultimate principle of Research Computing Facilitation, insights from the facilitation of dHTC stakeholders are continually integrated across PATh areas to improve dHTC capabilities and services. These include improvements to strategies for Community Empowerment, where our RCFs also contribute significantly to the materials and execution of PATh’s various outreach, education, and training programs. As part of the services for campuses, the RCF team leverages its own experience in dHTC for end-users to offer dHTC Facilitation training for personnel at campuses.
          </Typography>
        </Grid>

        {facilitationTalks.length > 0 && (
          <Grid size={{ xs: 12, lg: 3 }}>
            <Box
              component='aside'
              sx={{ position: { lg: 'sticky' }, top: '1rem' }}
            >
              <Box sx={{ width: '2rem', height: 5, bgcolor: 'primary.main', mb: 1 }} />
              <Typography variant='h5' component='h2' gutterBottom>
                Presentations &amp; Videos
              </Typography>
              {facilitationTalks.map((presentation) => (
                <PresentationSummary
                  key={presentation.slug.join('-')}
                  presentation={presentation}
                  stacked
                />
              ))}
              <Button
                href='/presentations?keyword=Facilitation'
                variant='outlined'
                sx={{ mt: 2 }}
              >
                See All
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

    </Container>
  );
}
