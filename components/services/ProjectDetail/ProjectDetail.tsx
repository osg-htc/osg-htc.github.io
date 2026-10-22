import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PieChart } from '@/components/services/PieChart';
import {
  formatBytes,
  getProjectOverview,
  getProjectsForRangeCached,
  getTopologyProjectsCached,
  type ProjectUsage,
} from '@/utils/adstash';
import { slugify } from '@/utils/slug';

const TOP_N = 15;

/** Stat-tile formatter for plain counts and hour totals. */
function formatRounded(value: number): string {
  return Math.round(value).toLocaleString();
}

/** Top-N institutions by jobs, grouping the remainder into "Other". */
function topInstitutions(rows: ProjectUsage[]) {
  const sorted = [...rows]
    .filter((r) => r.numJobs > 0)
    .sort((a, b) => b.numJobs - a.numJobs);
  const top = sorted.slice(0, TOP_N);
  const otherTotal = sorted.slice(TOP_N).reduce((s, r) => s + r.numJobs, 0);
  const labels = top.map((r) => r.projectName); // overview rows are keyed by institution
  const data = top.map((r) => Math.round(r.numJobs));
  if (otherTotal > 0) {
    labels.push('Other');
    data.push(Math.round(otherTotal));
  }
  return { labels, data };
}

function BackLink() {
  return (
    <Box sx={{ mb: 2 }}>
      <Link
        href='/services/ospool/projects'
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}
      >
        <ArrowBackIcon sx={{ fontSize: '1rem' }} />
        All projects
      </Link>
    </Box>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ mt: 5, mb: 2 }}>
      <Box sx={{ width: '2.5rem', height: 4, bgcolor: 'primary.main', borderRadius: 2, mb: 1 }} />
      <Typography variant='h5' component='h2'>
        {children}
      </Typography>
    </Box>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Typography
          variant='h4'
          sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}
        >
          {value}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 0.75 }}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}

function MetaField({ label, value }: { label: string; value?: string }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant='overline' color='text.secondary' sx={{ display: 'block', lineHeight: 1.4 }}>
        {label}
      </Typography>
      <Typography sx={{ color: value ? 'text.primary' : 'text.disabled' }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

export default async function ProjectDetail({ slug }: { slug: string }) {
  const [list, topology] = await Promise.all([
    getProjectsForRangeCached(),
    getTopologyProjectsCached(),
  ]);
  const project = list.find((p) => slugify(p.projectName) === slug);

  if (!project) {
    return (
      <Container maxWidth='lg' sx={{ py: { xs: 4, md: 6 } }}>
        <BackLink />
        <Typography variant='h5' sx={{ mt: 4 }}>
          Project not found.
        </Typography>
      </Container>
    );
  }

  const name = project.projectName;
  const overview = await getProjectOverview(name);
  const institutions = Object.values(overview);
  const totals = institutions.reduce(
    (acc, v) => ({
      jobs: acc.jobs + v.numJobs,
      cpu: acc.cpu + v.cpuHours,
      gpu: acc.gpu + v.gpuHours,
      osdfFiles: acc.osdfFiles + v.osdfFileTransferCount,
      osdfBytes: acc.osdfBytes + v.osdfByteTransferCount,
    }),
    { jobs: 0, cpu: 0, gpu: 0, osdfFiles: 0, osdfBytes: 0 }
  );
  const instChart = topInstitutions(institutions);
  const meta = topology[name];

  // One stat row for the whole project: OSPool usage and the OSDF transfer
  // totals side by side. A project that never touched a given resource would
  // otherwise show a wall of zeros, so empty measures are dropped entirely.
  const stats = [
    { label: 'Jobs Ran', value: totals.jobs, format: formatRounded },
    { label: 'CPU Core Hours', value: totals.cpu, format: formatRounded },
    { label: 'GPU Hours', value: totals.gpu, format: formatRounded },
    {
      label: 'Contributing Institutions',
      value: institutions.length,
      format: formatRounded,
    },
    {
      label: 'OSDF Objects Transferred',
      value: totals.osdfFiles,
      format: formatRounded,
    },
    { label: 'OSDF Bytes Transferred', value: totals.osdfBytes, format: formatBytes },
  ].filter((stat) => stat.value > 0);

  return (
    <Container maxWidth='lg' sx={{ py: { xs: 4, md: 6 } }}>
      <BackLink />

      <Typography variant='overline' color='text.secondary'>
        OSPool Project
      </Typography>
      <Typography variant='h3' component='h1' sx={{ fontWeight: 800, wordBreak: 'break-word' }}>
        {name}
      </Typography>

      {/* Metadata */}
      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 5 }}>
              <MetaField label='Principal Investigator' value={meta?.PIName} />
              <MetaField label='Organization' value={meta?.Organization} />
              <MetaField
                label='Field of Science'
                value={meta?.FieldOfScience ?? project.detailedFieldOfScience}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <MetaField label='Description' value={meta?.Description} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Project stat tiles — OSPool usage and OSDF transfers together */}
      {stats.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
              <StatTile label={stat.label} value={stat.format(stat.value)} />
            </Grid>
          ))}
        </Grid>
      )}

      <SectionLabel>Contributing Institutions</SectionLabel>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ bgcolor: 'grey.900', color: 'common.white', height: '100%' }}>
            <CardHeader title='Jobs by Institution' titleTypographyProps={{ variant: 'subtitle1' }} />
            <CardContent>
              {instChart.labels.length > 0 ? (
                <PieChart
                  labels={instChart.labels}
                  data={instChart.data}
                  ariaLabel='Jobs by institution'
                  legendColor='#fff'
                />
              ) : (
                <Typography variant='body2'>No institution data.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title='Map of Contributing Institutions'
              titleTypographyProps={{ variant: 'subtitle1' }}
            />
            <CardContent sx={{ height: 360, p: 0 }}>
              <iframe
                title='Project institution map'
                src={`https://osg-htc.org/maps/projects/?sidebarHidden=true&project=${encodeURIComponent(name)}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
