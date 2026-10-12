'use client';

import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import { PieChart } from '@/components/services/PieChart';
import { getMergedProjects, type MergedProject } from '@/utils/adstash';
import { slugify } from '@/utils/slug';

const TOP_N = 15;

type ChartData = { labels: string[]; data: number[] };

/** Top-N items by a numeric field, grouping the remainder into "Other". */
function topNByField(
  items: MergedProject[],
  labelOf: (p: MergedProject) => string | undefined,
  valueOf: (p: MergedProject) => number
): ChartData {
  const totals = new Map<string, number>();
  for (const item of items) {
    const label = labelOf(item);
    const value = valueOf(item);
    if (!label || value <= 0) continue;
    totals.set(label, (totals.get(label) ?? 0) + value);
  }
  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, TOP_N);
  const otherTotal = sorted.slice(TOP_N).reduce((s, [, v]) => s + v, 0);
  const labels = top.map(([k]) => k);
  const data = top.map(([, v]) => Math.round(v));
  if (otherTotal > 0) {
    labels.push('Other');
    data.push(Math.round(otherTotal));
  }
  return { labels, data };
}

interface Column {
  id: keyof MergedProject;
  label: string;
  numeric?: boolean;
}
const COLUMNS: Column[] = [
  { id: 'numJobs', label: 'Jobs Ran', numeric: true },
  { id: 'projectName', label: 'Name' },
  { id: 'PIName', label: 'PI Name' },
  { id: 'Organization', label: 'Organization' },
  { id: 'detailedFieldOfScience', label: 'Field Of Science' },
];

function ChartCard({
  title,
  chart,
}: {
  title: string;
  chart: ChartData;
}) {
  return (
    <Card sx={{ bgcolor: 'grey.900', color: 'common.white', height: '100%' }}>
      <CardHeader title={title} titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        {chart.labels.length ? (
          <PieChart
            labels={chart.labels}
            data={chart.data}
            ariaLabel={title}
            legendColor='#fff'
          />
        ) : (
          <Skeleton variant='rounded' height={240} />
        )}
      </CardContent>
    </Card>
  );
}

export function ProjectsExplorer() {
  const router = useRouter();
  const { data: projects, isLoading } = useSWR(
    'merged-projects',
    getMergedProjects,
    { revalidateOnFocus: false }
  );

  // The legacy site opened a project in a modal from `?project=NAME`; those
  // URLs are still linked to from elsewhere. Each project now has its own
  // page, so forward to it once the list has loaded and the name resolves.
  // Read from `window.location` rather than `useSearchParams` so the static
  // export does not need a Suspense bailout for a value that is only ever
  // known in the browser.
  useEffect(() => {
    if (!projects) return;
    const requested = new URLSearchParams(window.location.search).get('project');
    if (!requested) return;
    const wanted = requested.trim().toLowerCase();
    const match = projects.find(
      (p) =>
        p.projectName.toLowerCase() === wanted ||
        slugify(p.projectName) === slugify(requested)
    );
    if (match) router.replace(`/projects/${slugify(match.projectName)}/`);
  }, [projects, router]);

  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<keyof MergedProject>('numJobs');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const rowsPerPage = 50;

  const all = useMemo(() => projects ?? [], [projects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter((p) =>
      [p.projectName, p.PIName, p.Organization, p.detailedFieldOfScience]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    );
  }, [all, search]);

  const sorted = useMemo(() => {
    const factor = order === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[orderBy];
      const bv = b[orderBy];
      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * factor;
      }
      return String(av ?? '').localeCompare(String(bv ?? '')) * factor;
    });
  }, [filtered, orderBy, order]);

  const charts = useMemo(
    () => ({
      jobsByProject: topNByField(all, (p) => p.projectName, (p) => p.numJobs),
      cpuByProject: topNByField(all, (p) => p.projectName, (p) => p.cpuHours),
      gpuByProject: topNByField(all, (p) => p.projectName, (p) => p.gpuHours),
      jobsByFos: topNByField(
        all,
        (p) => p.detailedFieldOfScience,
        (p) => p.numJobs
      ),
      cpuByFos: topNByField(
        all,
        (p) => p.detailedFieldOfScience,
        (p) => p.cpuHours
      ),
    }),
    [all]
  );

  const handleSort = (id: keyof MergedProject) => {
    if (orderBy === id) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(id);
      setOrder(id === 'numJobs' ? 'desc' : 'asc');
    }
  };

  const pageRows = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Box>
      {/* Summary charts */}
      <Box sx={{ bgcolor: 'grey.900', py: 3 }}>
        <Container maxWidth='xl'>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ChartCard title='Projects by Jobs' chart={charts.jobsByProject} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ChartCard title='Projects by CPU Hours' chart={charts.cpuByProject} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ChartCard title='Projects by GPU Hours' chart={charts.gpuByProject} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ChartCard title='Fields of Science by Jobs' chart={charts.jobsByFos} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ChartCard title='Fields of Science by CPU Hours' chart={charts.cpuByFos} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Typography variant='h4' component='h2' gutterBottom>
          By Project
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <strong>Click on a project to view its details.</strong>
        </Typography>

        <TextField
          fullWidth
          size='small'
          type='search'
          placeholder='Search Project Details'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={{ mb: 2 }}
        />

        <TableContainer component={Box}>
          <Table size='small' stickyHeader>
            <TableHead>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableCell
                    key={col.id}
                    align={col.numeric ? 'right' : 'left'}
                    sortDirection={orderBy === col.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : 'asc'}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading &&
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={COLUMNS.length}>
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                ))}
              {pageRows.map((row) => (
                <TableRow
                  key={row.projectName}
                  hover
                  onClick={() => router.push(`/projects/${slugify(row.projectName)}/`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell align='right'>
                    {Math.floor(row.numJobs).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ textDecoration: 'underline' }}>
                    {row.projectName}
                  </TableCell>
                  <TableCell>{row.PIName ?? '—'}</TableCell>
                  <TableCell>{row.Organization ?? '—'}</TableCell>
                  <TableCell>{row.detailedFieldOfScience ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component='div'
          count={sorted.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
        />
      </Container>
    </Box>
  );
}
