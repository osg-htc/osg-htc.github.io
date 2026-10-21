import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowBack, Launch } from '@mui/icons-material';

import {
  formatBytes,
  formatCount,
  getDataRepository,
  getDataRepositoryIds,
} from '@/utils/dataRepositories';
import { filterValidNamespaces } from '@/utils/validNamespaces';
import { Markdown, RepositoryFileBrowser } from '../_components';

type PageParams = { id: string };
type PageProps = { params: Promise<PageParams> };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<PageParams[]> {
  const ids = await getDataRepositoryIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const repository = await getDataRepository(id);

  if (!repository) {
    return { title: 'Data Repository Not Found — OSG Consortium' };
  }

  return {
    // Ids contain dots (`pnfs-fnal.gov-dune`), and Next treats a final
    // segment with a dot as a file, so `trailingSlash` does not apply. The
    // slash is explicit here to match the URL the page is served at.
    alternates: { canonical: `/services/osdf/data/${id}/` },
    title: `${repository.name} — OSDF Data Repository | OSG Consortium`,
    description: `${repository.name} — a data repository operated by ${repository.organization}, available through the Open Science Data Federation.`,
  };
}

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Typography
        variant='overline'
        color='text.secondary'
        sx={{ display: 'block', lineHeight: 1.6 }}
      >
        {label}
      </Typography>
      <Typography variant='body1' component='div' sx={{ fontWeight: 500 }}>
        {children}
      </Typography>
    </Box>
  );
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const repository = await getDataRepository(id);

  if (!repository) {
    notFound();
  }

  const repositoryUrl = repository.repositoryUrl?.url
    ? repository.repositoryUrl
    : null;

  // Only show namespaces visitors can browse; see utils/validNamespaces.ts.
  const namespaces = await filterValidNamespaces(repository.namespace ?? []);

  return (
    <Box pt={6} pb={8}>
      <Container maxWidth={'lg'}>
        <Button href='/services/osdf/data/' startIcon={<ArrowBack />} sx={{ mb: 2 }}>
          All Repositories
        </Button>

        <Box
          sx={{ width: '2.5rem', height: 4, bgcolor: 'primary.main', borderRadius: 2, mb: 1.5 }}
        />
        <Typography
          variant='h3'
          component='h1'
          sx={{ fontWeight: 800, wordBreak: 'break-word', mb: 3 }}
        >
          {repository.name}
        </Typography>

        <Stack
          direction='row'
          spacing={1}
          flexWrap='wrap'
          useFlexGap
          sx={{ mb: 4 }}
        >
          <Chip
            label={
              repository.dataVisibility === 'public'
                ? 'Public Access'
                : 'Private Access'
            }
            color={
              repository.dataVisibility === 'public' ? 'success' : 'default'
            }
            variant={
              repository.dataVisibility === 'public' ? 'filled' : 'outlined'
            }
          />
          {repository.inProgress && (
            <Chip label='In Progress' color='warning' variant='outlined' />
          )}
          <Chip label={repository.fieldOfScience} variant='outlined' />
        </Stack>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant='h5' component='h2' gutterBottom>
              About
            </Typography>
            <Markdown>
              {repository.description ?? '_No description available._'}
            </Markdown>

            {namespaces.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant='h6' component='h3' gutterBottom>
                  Namespaces
                </Typography>
                <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
                  {namespaces.map((namespace) => (
                    <Chip
                      key={namespace}
                      label={namespace}
                      size='small'
                      sx={{ fontFamily: 'monospace' }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {repository.publicObject && (
              <Box sx={{ mt: 4 }}>
                <Typography variant='h6' component='h3' gutterBottom>
                  Download a Public Object
                </Typography>
                <Typography variant='subtitle2' sx={{ mt: 2, mb: 1 }}>
                  With the Pelican client on the command line
                </Typography>
                <Paper
                  variant='outlined'
                  component='pre'
                  sx={{
                    p: 2,
                    m: 0,
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    bgcolor: 'secondary.main',
                    color: 'common.white',
                  }}
                >
                  <code>
                    {`pelican object get ${
                      repository.is_directory ? '-r ' : ''
                    }osdf://${repository.publicObject} ./`}
                  </code>
                </Paper>
                {/* The director 404s on a directory, so only files get a
                    browser download. */}
                {!repository.is_directory && (
                  <>
                    <Typography variant='subtitle2' sx={{ mt: 2, mb: 1 }}>
                      From your browser
                    </Typography>
                    <Button
                      href={`https://osdf-director.osg-htc.org${repository.publicObject}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      variant='contained'
                      color='secondary'
                      endIcon={<Launch />}
                    >
                      Download Public Object
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper variant='outlined' sx={{ p: 3 }}>
              <Stack spacing={2.5} divider={<Divider flexItem />}>
                <DetailItem label='Organization'>
                  {repository.organizationUrl ? (
                    <Link
                      href={repository.organizationUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {repository.organization}
                    </Link>
                  ) : (
                    repository.organization
                  )}
                </DetailItem>
                <DetailItem label='Number of Datasets'>
                  {formatCount(repository.numberOfDatasets)}
                </DetailItem>
                <DetailItem label='Total Size'>
                  {formatBytes(repository.size)}
                </DetailItem>
                <DetailItem label='Object Count'>
                  {formatCount(repository.objectCount)}
                </DetailItem>
                <DetailItem label='Reads (30 days)'>
                  {formatBytes(repository.thirtyDayReads)}
                </DetailItem>
                <DetailItem label='Reads (1 year)'>
                  {formatBytes(repository.oneYearReads)}
                </DetailItem>
              </Stack>

              {repositoryUrl && (
                <Button
                  href={repositoryUrl.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  variant='contained'
                  endIcon={<Launch />}
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  {repositoryUrl.label || 'Visit Repository'}
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>

        {repository.dataVisibility === 'public' && namespaces.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography variant='h5' component='h2' gutterBottom>
              Browse Files
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              Explore the objects in this repository&apos;s namespaces using the
              Pelican web client.
            </Typography>
            <RepositoryFileBrowser namespaces={namespaces} />
          </Box>
        )}
      </Container>
    </Box>
  );
}
