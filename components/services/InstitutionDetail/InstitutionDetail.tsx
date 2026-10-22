import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  getInstitutionOverview,
  getInstitutionsForRangeCached,
  type ProjectUsage,
} from '@/utils/adstash';
import { slugify } from '@/utils/slug';

function BackLink() {
  return (
    <Box sx={{ mb: 2 }}>
      <Link
        href='/services/ospool/institutions'
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}
      >
        <ArrowBackIcon sx={{ fontSize: '1rem' }} />
        All institutions
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

/** A scrollable two-column "label / jobs" table. */
function BreakdownTable({ header, rows }: { header: string; rows: [string, number][] }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={header} titleTypographyProps={{ variant: 'subtitle1' }} />
      <CardContent sx={{ maxHeight: 320, overflowY: 'auto', pt: 0 }}>
        <Table size='small' stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: 'background.paper' }}>Name</TableCell>
              <TableCell align='right' sx={{ bgcolor: 'background.paper' }}>
                Jobs Ran
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(([label, jobs]) => (
              <TableRow key={label}>
                <TableCell>{label}</TableCell>
                <TableCell align='right'>{Math.round(jobs).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function sumByKey(
  projects: ProjectUsage[],
  keyOf: (p: ProjectUsage) => string | undefined
): [string, number][] {
  const totals = new Map<string, number>();
  for (const p of projects) {
    const key = keyOf(p);
    if (!key || key === 'null') continue;
    totals.set(key, (totals.get(key) ?? 0) + p.numJobs);
  }
  return [...totals.entries()].sort((a, b) => b[1] - a[1]);
}

export default async function InstitutionDetail({ slug }: { slug: string }) {
  const list = await getInstitutionsForRangeCached();
  const institution = list.find((i) => slugify(i.institutionName) === slug);

  if (!institution) {
    return (
      <Container maxWidth='lg' sx={{ py: { xs: 4, md: 6 } }}>
        <BackLink />
        <Typography variant='h5' sx={{ mt: 4 }}>
          Institution not found.
        </Typography>
      </Container>
    );
  }

  const name = institution.institutionName;
  const overview = await getInstitutionOverview(name);
  const projects = Object.values(overview);
  const totals = projects.reduce(
    (acc, v) => ({
      jobs: acc.jobs + v.numJobs,
      cpu: acc.cpu + v.cpuHours,
      gpu: acc.gpu + v.gpuHours,
    }),
    { jobs: 0, cpu: 0, gpu: 0 }
  );

  return (
    <Container maxWidth='lg' sx={{ py: { xs: 4, md: 6 } }}>
      <BackLink />

      <Typography variant='overline' color='text.secondary'>
        OSPool Institution
      </Typography>
      <Typography variant='h3' component='h1' sx={{ fontWeight: 800, wordBreak: 'break-word' }}>
        {name}
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {[
          { label: 'Jobs Ran', value: totals.jobs },
          { label: 'CPU Core Hours Provided', value: totals.cpu },
          { label: 'GPU Hours Provided', value: totals.gpu },
        ].map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
            <StatTile label={stat.label} value={Math.round(stat.value).toLocaleString()} />
          </Grid>
        ))}
      </Grid>

      <SectionLabel>Breakdowns</SectionLabel>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <BreakdownTable
            header='Projects Supported'
            rows={projects
              .map((p) => [p.projectName, p.numJobs] as [string, number])
              .sort((a, b) => b[1] - a[1])}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <BreakdownTable
            header='Fields of Science Supported'
            rows={sumByKey(projects, (p) => p.detailedFieldOfScience)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <BreakdownTable
            header='Institutions with Projects Supported'
            rows={sumByKey(projects, (p) => p.projectInstitutionName)}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
