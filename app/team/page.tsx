import type { Metadata } from 'next';
import Link from '@mui/material/Link';
import { Box, Container, Grid, Typography } from '@mui/material';
import { type Staff } from '@chtc/web-components/content';
import { getStaff } from '@/utils/staff';
import { recordStaffImages } from '@/utils/remoteImages';
import { StaffCard } from './cards';

export const metadata: Metadata = {
  alternates: { canonical: '/team' },
  title: 'The OSG Team — OSG Consortium',
  description:
    'The executive team, staff, and past members of the OSG Consortium.',
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mt: 5 }}>
      <Box
        sx={{
          width: '2.5rem',
          height: 4,
          bgcolor: 'primary.main',
          borderRadius: 2,
          mb: 1,
        }}
      />
      <Typography variant='h4' component='h2' gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default async function Page() {
  // `getStaff` flattens the per-site override onto each member, so `promoted`,
  // `weight` and `title` already carry the OSG values where one is set.
  const team = (await getStaff('osg')).filter((member) =>
    member.organizations?.includes('osg')
  );

  const byName = (a: Staff, b: Staff) => a.name.localeCompare(b.name);

  const executive = team
    .filter((member) => member.promoted && member.status !== 'Past')
    .sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));
  const current = team.filter((member) => member.status !== 'Past').sort(byName);
  const past = team.filter((member) => member.status === 'Past').sort(byName);

  // Declare the portraits for the export image optimizer; see remoteImages.ts.
  recordStaffImages(team);

  return (
    <Container maxWidth='xl' sx={{ py: 6 }}>
      <Typography variant='h2' component='h1'>
        The OSG Team
      </Typography>

      <Section title='Executive Team'>
        <Typography paragraph color='text.secondary'>
          Executive Team members not on the OSG Staff can be found on the{' '}
          <Link
            href='https://osg-htc.org/management/#executive-team'
            style={{ textDecoration: 'underline' }}
          >
            Executive Team page
          </Link>
          .
        </Typography>
        <Grid container spacing={2}>
          {executive.map((member) => (
            <Grid key={member.name} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <StaffCard member={member} executive />
            </Grid>
          ))}
        </Grid>
      </Section>

      <Section title='Full Team'>
        <Grid container spacing={2}>
          {current.map((member) => (
            <Grid key={member.name} size={{ xs: 6, md: 4, lg: 3, xl: 2 }}>
              <StaffCard member={member} />
            </Grid>
          ))}
        </Grid>
      </Section>

      {past.length > 0 && (
        <Section title='Past Members'>
          <Grid container spacing={2}>
            {past.map((member) => (
              <Grid key={member.name} size={{ xs: 6, md: 4, lg: 3, xl: 2 }}>
                <StaffCard member={member} />
              </Grid>
            ))}
          </Grid>
        </Section>
      )}
    </Container>
  );
}
