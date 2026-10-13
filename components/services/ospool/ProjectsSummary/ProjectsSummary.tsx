'use client';

import useSWR from 'swr';
import { Box, Button, Card, CardContent, Container, Grid, Skeleton, Typography } from '@mui/material';
import { getDateOfLatestData, getMergedProjects } from '@/utils/adstash';

/**
 * The window `getMergedProjects` aggregates over: the twelve months ending at
 * the most recent record in adstash. Recomputed here rather than returned by
 * the fetcher so the existing `merged-projects` cache entry is shared with
 * `ProjectsExplorer` instead of being split across two shapes.
 */
function useReportingWindow() {
  const { data: end } = useSWR('latest-data-date', getDateOfLatestData, {
    revalidateOnFocus: false,
  });
  if (!end) return undefined;
  const start = new Date(end);
  start.setUTCFullYear(start.getUTCFullYear() - 1);
  return { start, end };
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  // The record timestamps are UTC; formatting in local time would shift the
  // boundary by a day for viewers west of Greenwich.
  timeZone: 'UTC',
};

function StatCard({ value, label }: { value: number | undefined; label: string }) {
  return (
    <Card
      sx={{
        height: '100%',
        textAlign: 'center',
        // These are a static readout, not navigation, so drop the themed
        // card lift.
        '&:hover': { transform: 'none', boxShadow: 'none' },
      }}
    >
      <CardContent>
        <Typography
          variant='h4'
          component='p'
          sx={{
            fontWeight: 700,
            color: 'primary.dark',
            // The jobs figure runs to eleven characters, which overflows an
            // h4 in a quarter-width card below ~1000px and in a half-width
            // one on a phone. Step the size down where the card is narrowest.
            fontSize: { xs: '1.15rem', sm: '1.75rem', lg: '2.125rem' },
          }}
        >
          {value === undefined ? (
            <Skeleton variant='text' sx={{ mx: 'auto', width: '60%' }} />
          ) : (
            value.toLocaleString()
          )}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}

/**
 * Headline totals for the OSPool reporting year, shown above the explorer.
 * These summarise the whole dataset and deliberately do not react to the
 * explorer's search box.
 */
export function ProjectsSummary() {
  const { data: projects } = useSWR('merged-projects', getMergedProjects, {
    revalidateOnFocus: false,
  });
  const reportingWindow = useReportingWindow();

  const totals = projects
    ? {
        jobs: Math.round(projects.reduce((sum, p) => sum + p.numJobs, 0)),
        projects: projects.length,
        // Counted by topology InstitutionID, matching the legacy page's
        // figure; `projectInstitutionName` comes from the usage records and
        // resolves a few institutions differently.
        institutions: new Set(
          projects.map((p) => p.InstitutionID).filter(Boolean)
        ).size,
        fields: new Set(
          projects.map((p) => p.detailedFieldOfScience).filter(Boolean)
        ).size,
      }
    : undefined;

  return (
    <Container maxWidth='lg' sx={{ pb: 5 }}>
      <Typography variant='body2' color='text.secondary' textAlign='center' sx={{ mb: 2 }}>
        {reportingWindow ? (
          <>
            Data covers the 12 months from{' '}
            {reportingWindow.start.toLocaleDateString('en-US', DATE_FORMAT)} to{' '}
            {reportingWindow.end.toLocaleDateString('en-US', DATE_FORMAT)}.
          </>
        ) : (
          'Data covers the past 12 months.'
        )}
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard value={totals?.jobs} label='Jobs completed' />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard value={totals?.projects} label='Projects' />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard value={totals?.institutions} label='Institutions' />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard value={totals?.fields} label='Fields of science' />
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          href='https://portal.osg-htc.org/application'
          variant='contained'
          color='secondary'
          size='large'
        >
          Get Started Today
        </Button>
      </Box>
    </Container>
  );
}
