'use client';

import { useRouter } from 'next/navigation';
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ChevronRight } from '@mui/icons-material';

import type { DataRepository } from '@/types';
import { formatBytes, formatCount } from '@/utils/dataRepositories';

export interface RepositoryTableProps {
  repositories: DataRepository[];
  basePath?: string;
}

export default function RepositoryTable({
  repositories,
  basePath = '/repository',
}: RepositoryTableProps) {
  const router = useRouter();

  const hrefFor = (id: string) => `${basePath}/${id}/`;

  return (
    <TableContainer component={Paper} variant='outlined'>
      <Table aria-label='Data repositories' sx={{ minWidth: 720 }}>
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 700 } }}>
            <TableCell>Name</TableCell>
            <TableCell>Organization</TableCell>
            <TableCell>Field of Science</TableCell>
            <TableCell>Access</TableCell>
            <TableCell align='right'>Datasets</TableCell>
            <TableCell align='right'>Size</TableCell>
            <TableCell padding='checkbox' />
          </TableRow>
        </TableHead>
        <TableBody>
          {repositories.map((repository) => (
            <TableRow
              key={repository.id}
              hover
              onClick={() => router.push(hrefFor(repository.id))}
              sx={{
                cursor: 'pointer',
                '&:last-child td': { border: 0 },
              }}
            >
              <TableCell>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {repository.name}
                </Typography>
                {repository.inProgress && (
                  <Typography variant='caption' color='text.secondary'>
                    In progress
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Typography variant='body2' color='text.secondary'>
                  {repository.organization}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body2' color='text.secondary'>
                  {repository.fieldOfScience}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  size='small'
                  label={
                    repository.dataVisibility === 'public'
                      ? 'Public'
                      : 'Private'
                  }
                  color={
                    repository.dataVisibility === 'public'
                      ? 'success'
                      : 'default'
                  }
                  variant={
                    repository.dataVisibility === 'public'
                      ? 'filled'
                      : 'outlined'
                  }
                />
              </TableCell>
              <TableCell align='right'>
                {formatCount(repository.numberOfDatasets)}
              </TableCell>
              <TableCell align='right'>{formatBytes(repository.size)}</TableCell>
              <TableCell padding='checkbox'>
                <Box sx={{ display: 'flex', color: 'text.secondary' }}>
                  <ChevronRight fontSize='small' />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

