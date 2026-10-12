'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import {
  Box,
  Container,
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
import {
  getInstitutionsForRange,
  type InstitutionUsage,
} from '@/utils/adstash';
import { slugify } from '@/utils/slug';

interface Column {
  id: keyof InstitutionUsage;
  label: string;
  numeric?: boolean;
}
const COLUMNS: Column[] = [
  { id: 'institutionName', label: 'Name' },
  { id: 'numJobs', label: 'Jobs Ran', numeric: true },
  { id: 'numDetailedFieldOfScience', label: 'Impacted Fields of Science', numeric: true },
  { id: 'numProjects', label: 'Impacted Research Projects', numeric: true },
];

export function InstitutionsExplorer() {
  const router = useRouter();
  const { data: institutions, isLoading } = useSWR(
    'ospool-institutions',
    getInstitutionsForRange,
    { revalidateOnFocus: false }
  );

  // The legacy site opened an institution in a modal from `?institution=NAME`
  // (or the older `?facility=`). Each institution now has its own page, so
  // forward to it once the list has loaded and the name resolves. Read from
  // `window.location` rather than `useSearchParams` so the static export does
  // not need a Suspense bailout for a value only known in the browser.
  useEffect(() => {
    if (!institutions) return;
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('institution') ?? params.get('facility');
    if (!requested) return;
    const wanted = requested.trim().toLowerCase();
    const match = institutions.find(
      (i) =>
        i.institutionName.toLowerCase() === wanted ||
        slugify(i.institutionName) === slugify(requested)
    );
    if (match) {
      router.replace(`/institutions/${slugify(match.institutionName)}/`);
    }
  }, [institutions, router]);

  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<keyof InstitutionUsage>('numJobs');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const rowsPerPage = 50;

  const all = useMemo(() => institutions ?? [], [institutions]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter((i) => i.institutionName.toLowerCase().includes(q));
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

  const totalJobs = useMemo(
    () => filtered.reduce((s, i) => s + i.numJobs, 0),
    [filtered]
  );

  const handleSort = (id: keyof InstitutionUsage) => {
    if (orderBy === id) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(id);
      setOrder(id === 'institutionName' ? 'asc' : 'desc');
    }
  };

  const pageRows = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Container maxWidth='lg' sx={{ py: 2 }}>
      {institutions && (
        <Typography color='text.secondary' sx={{ mb: 2 }}>
          {filtered.length.toLocaleString()} contributing institutions ·{' '}
          {totalJobs.toLocaleString()} jobs in the last year.
        </Typography>
      )}

      <TextField
        fullWidth
        size='small'
        type='search'
        placeholder='Search institutions'
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
                key={row.institutionName}
                hover
                onClick={() =>
                  router.push(`/institutions/${slugify(row.institutionName)}/`)
                }
                sx={{ cursor: 'pointer' }}
              >
                <TableCell sx={{ textDecoration: 'underline' }}>
                  {row.institutionName}
                </TableCell>
                <TableCell align='right'>
                  {Math.floor(row.numJobs).toLocaleString()}
                </TableCell>
                <TableCell align='right'>
                  {row.numDetailedFieldOfScience.toLocaleString()}
                </TableCell>
                <TableCell align='right'>
                  {row.numProjects.toLocaleString()}
                </TableCell>
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
  );
}
