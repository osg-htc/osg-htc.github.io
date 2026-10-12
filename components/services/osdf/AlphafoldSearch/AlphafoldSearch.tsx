'use client';

import { useCallback, useMemo, useRef, useState, type DragEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  LinearProgress,
  Link,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/Upload';

import {
  ANY_SOURCE,
  DOWNLOAD_CONCURRENCY,
  EXAMPLE_FASTA,
  MAX_ZIP_BYTES,
  RESULTS_PER_PAGE,
  basename,
  buildManifest,
  buildZip,
  compareSources,
  downloadSetLabel,
  formatBytes,
  mapConcurrent,
  numberFormat,
  osdfToHttps,
  parseSequences,
  queryRegistry,
  saveBlob,
  sha256Hex,
  slugify,
  type Hit,
  type Query,
  type ResolvedHit,
  type ZipEntry,
} from './registry';

interface Progress {
  done: number;
  total: number;
  text: string;
  complete?: boolean;
}

/**
 * Search the AlphaFold3 Alignment Library.
 *
 * Sequences are hashed in the browser and only the hashes are sent to the
 * registry. "Download All" fetches every matching A3M and bundles it into a
 * zip built client-side, together with a manifest.tsv of the provenance.
 */
export function AlphafoldSearch() {
  const [text, setText] = useState('');
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [queries, setQueries] = useState<Query[] | null>(null);
  const [page, setPage] = useState(1);
  const [searchProgress, setSearchProgress] = useState<Progress | null>(null);
  const [dropActive, setDropActive] = useState(false);

  const [downloadAnchor, setDownloadAnchor] = useState<HTMLElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<Progress | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadFailures, setDownloadFailures] = useState<
    Array<{ hit: ResolvedHit; reason: string }>
  >([]);

  const [expandedMeta, setExpandedMeta] = useState<Set<string>>(new Set());
  const [expandedSeq, setExpandedSeq] = useState<Set<number>>(new Set());

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Unique hits across every query, in display order.
  const hits = useMemo<ResolvedHit[]>(() => {
    if (!queries) return [];
    const seen = new Map<string, ResolvedHit>();
    for (const query of queries) {
      for (const hit of query.hits) {
        if (!seen.has(hit.osdf_uri)) {
          seen.set(hit.osdf_uri, {
            ...hit,
            https_url: osdfToHttps(hit.osdf_uri),
            query_names: [],
          });
        }
        seen.get(hit.osdf_uri)!.query_names.push(query.name);
      }
    }
    return [...seen.values()].sort(
      (a, b) =>
        compareSources(a.source, b.source) ||
        basename(a.osdf_uri).localeCompare(basename(b.osdf_uri))
    );
  }, [queries]);

  const hitsBySource = useMemo(() => {
    const bySource = new Map<string, ResolvedHit[]>();
    for (const hit of hits) {
      if (!bySource.has(hit.source)) bySource.set(hit.source, []);
      bySource.get(hit.source)!.push(hit);
    }
    return bySource;
  }, [hits]);

  const sources = useMemo(
    () => [...hitsBySource.keys()].sort(compareSources),
    [hitsBySource]
  );

  const loadFasta = useCallback(async (files: File[]) => {
    try {
      const texts = await Promise.all(files.map((f) => f.text()));
      setText(texts.map((t) => t.trim()).filter(Boolean).join('\n') + '\n');
      setStatus(
        `Loaded ${files.length === 1 ? files[0].name : `${files.length} files (appended together)`}`
      );
      setError(null);
    } catch (e) {
      setError(`Could not read the FASTA file(s): ${(e as Error).message}`);
    }
  }, []);

  async function search() {
    setError(null);
    const parsed = parseSequences(text);
    if (!parsed.length) {
      setError('Enter at least one protein sequence to search for.');
      return;
    }

    setSearching(true);
    setStatus(
      `Hashing ${parsed.length} ${parsed.length === 1 ? 'sequence' : 'sequences'}…`
    );
    try {
      const valid = parsed.filter((q) => !q.error);
      await Promise.all(
        valid.map(async (q) => {
          q.hash = await sha256Hex(q.sequence);
        })
      );
      const uniqueHashes = [...new Set(valid.map((q) => q.hash!))];

      setStatus('');
      // Report progress in the researcher's sequences, not the deduplicated
      // hashes actually sent on the wire.
      const seqsPerHash = new Map<string, number>();
      for (const q of valid) {
        seqsPerHash.set(q.hash!, (seqsPerHash.get(q.hash!) ?? 0) + 1);
      }
      const describe = (done: number) => ({
        done,
        total: valid.length,
        text: `Queried ${numberFormat.format(done)} of ${numberFormat.format(valid.length)} ${valid.length === 1 ? 'sequence' : 'sequences'}…`,
      });
      setSearchProgress(describe(0));

      let done = 0;
      const hitsByHash = uniqueHashes.length
        ? await queryRegistry(uniqueHashes, (chunk) => {
            done += chunk.reduce((n, hash) => n + (seqsPerHash.get(hash) ?? 0), 0);
            setSearchProgress(describe(done));
          })
        : new Map();

      for (const q of parsed) {
        q.hits = q.error ? [] : (hitsByHash.get(q.hash!) ?? []);
      }
      setQueries(parsed);
      setPage(1);
      setExpandedMeta(new Set());
      setExpandedSeq(new Set());
      setDownloadError(null);
      setDownloadFailures([]);
      setDownloadProgress(null);
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    } catch (e) {
      console.error('AlphaFold alignment search failed:', e);
      setError(
        `The alignment registry could not be queried (${(e as Error).message}). Please try again later or contact support@osg-htc.org.`
      );
      setStatus('');
    } finally {
      setSearching(false);
      setSearchProgress(null);
    }
  }

  /**
   * Download a single hit. Fetching it ourselves lets us attach a proper
   * filename; if that fails (e.g. the cache is unreachable) fall back to
   * opening the link directly.
   */
  async function downloadOne(url: string, filename: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      saveBlob(await response.blob(), filename);
    } catch (e) {
      console.warn(`Direct download of ${url} failed, opening in a new tab instead:`, e);
      window.open(url, '_blank', 'noopener');
    }
  }

  /**
   * Fetch every hit for `source` (or every hit when source === ANY_SOURCE)
   * and hand the user a single zip archive.
   */
  async function downloadAll(source: string) {
    setDownloadAnchor(null);
    if (downloading) return;
    const selected = source === ANY_SOURCE ? hits : (hitsBySource.get(source) ?? []);
    if (!selected.length) return;

    const zipName = `af3-alignments-${source === ANY_SOURCE ? 'any-source' : slugify(source)}.zip`;

    setDownloading(true);
    setDownloadError(null);
    setDownloadFailures([]);
    setDownloadProgress({
      done: 0,
      total: selected.length,
      text: `Preparing ${selected.length} ${selected.length === 1 ? 'file' : 'files'}…`,
    });

    let done = 0;
    let bytes = 0;
    const failures: Array<{ hit: ResolvedHit; reason: string }> = [];

    try {
      const usedNames = new Set<string>();
      const entries = await mapConcurrent(selected, DOWNLOAD_CONCURRENCY, async (hit) => {
        let entry: ZipEntry | null = null;
        try {
          const response = await fetch(hit.https_url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = new Uint8Array(await response.arrayBuffer());
          bytes += data.length;
          if (bytes > MAX_ZIP_BYTES) {
            throw new Error('the archive would exceed the zip size limit');
          }
          let name = `${slugify(hit.source)}/${basename(hit.osdf_uri)}`;
          let n = 1;
          while (usedNames.has(name)) name = name.replace(/(\.[^.]*)?$/, `-${++n}$1`);
          usedNames.add(name);
          entry = { name, data };
        } catch (e) {
          failures.push({ hit, reason: (e as Error).message });
        }
        done += 1;
        setDownloadProgress({
          done,
          total: selected.length,
          text: `Fetched ${done} of ${selected.length} ${selected.length === 1 ? 'file' : 'files'} (${formatBytes(bytes)})…`,
        });
        return entry;
      });

      const files = entries.filter((e): e is ZipEntry => !!e);
      if (!files.length) {
        throw new Error(
          `none of the ${selected.length} alignment files could be fetched (${failures[0]?.reason ?? 'unknown error'})`
        );
      }

      files.push({
        name: 'manifest.tsv',
        data: new TextEncoder().encode(buildManifest(selected, failures)),
      });
      setDownloadProgress({
        done: selected.length,
        total: selected.length,
        text: `Building ${zipName} (${formatBytes(bytes)})…`,
      });
      saveBlob(buildZip(files), zipName);

      const n = files.length - 1;
      setDownloadProgress({
        done: selected.length,
        total: selected.length,
        complete: true,
        text: `Done — downloaded ${n} ${n === 1 ? 'alignment' : 'alignments'} (${formatBytes(bytes)}) as ${zipName}.`,
      });
      setDownloadFailures(failures);
    } catch (e) {
      console.error('Download all failed:', e);
      setDownloadProgress(null);
      setDownloadError(`Could not build the archive: ${(e as Error).message}.`);
    } finally {
      setDownloading(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLFormElement>) {
    event.preventDefault();
    setDropActive(false);
    const files = [...(event.dataTransfer?.files ?? [])];
    if (files.length) void loadFasta(files);
  }

  const pageCount = queries ? Math.max(1, Math.ceil(queries.length / RESULTS_PER_PAGE)) : 1;
  const pageStart = (page - 1) * RESULTS_PER_PAGE;
  const pageQueries = queries?.slice(pageStart, pageStart + RESULTS_PER_PAGE) ?? [];

  const queriesWithHits = queries?.filter((q) => q.hits.length).length ?? 0;
  const invalidQueries = queries?.filter((q) => q.error).length ?? 0;
  const totalHits = queries?.reduce((n, q) => n + q.hits.length, 0) ?? 0;

  return (
    <Box>
      <Box
        component='form'
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void search();
        }}
        onDragEnter={(event) => {
          if ([...(event.dataTransfer?.types ?? [])].includes('Files')) {
            event.preventDefault();
            setDropActive(true);
          }
        }}
        onDragOver={(event) => {
          if ([...(event.dataTransfer?.types ?? [])].includes('Files')) {
            event.preventDefault();
            setDropActive(true);
          }
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setDropActive(false);
          }
        }}
        onDrop={handleDrop}
        sx={{
          borderRadius: 1,
          ...(dropActive && {
            outline: '3px dashed',
            outlineColor: 'primary.main',
            outlineOffset: 6,
          }),
        }}
      >
        <TextField
          id='af3-sequences'
          label='Protein sequences'
          multiline
          minRows={8}
          fullWidth
          spellCheck={false}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
              event.preventDefault();
              void search();
            }
          }}
          placeholder={'>P62975 Ubiquitin\nMQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEG…\n>my-second-chain\nMSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEG…'}
          slotProps={{ input: { sx: { fontFamily: 'monospace', fontSize: '0.85rem' } } }}
          helperText='Whitespace and line breaks inside a sequence are ignored, letters are uppercased, and a trailing * is dropped before hashing. Press Ctrl+Enter to search.'
        />

        <Stack direction='row' flexWrap='wrap' alignItems='center' gap={1} mt={2}>
          <Button
            type='submit'
            variant='contained'
            disabled={searching}
            startIcon={
              searching ? <CircularProgress size={16} color='inherit' /> : <SearchIcon />
            }
          >
            Search
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            startIcon={<UploadIcon />}
            onClick={() => fileInputRef.current?.click()}
          >
            Load FASTA file(s)
          </Button>
          <input
            ref={fileInputRef}
            type='file'
            hidden
            multiple
            accept='.fasta,.fa,.faa,.txt,text/plain'
            onChange={(event) => {
              const files = [...(event.target.files ?? [])];
              if (files.length) void loadFasta(files);
              event.target.value = '';
            }}
          />
          <Button onClick={() => setText(EXAMPLE_FASTA)}>Use an example</Button>
          <Button
            color='inherit'
            onClick={() => {
              setText('');
              setQueries(null);
              setStatus('');
              setError(null);
            }}
          >
            Clear
          </Button>
          <Typography variant='caption' color='text.secondary' sx={{ ml: 'auto' }} aria-live='polite'>
            {status}
          </Typography>
        </Stack>

        {searchProgress && (
          <Box mt={2}>
            <LinearProgress
              variant={searchProgress.total ? 'determinate' : 'indeterminate'}
              value={
                searchProgress.total
                  ? (searchProgress.done / searchProgress.total) * 100
                  : 0
              }
            />
            <Typography variant='caption' color='text.secondary' aria-live='polite'>
              {searchProgress.text}
            </Typography>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity='error' sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {queries && (
        <Box ref={resultsRef} mt={4}>
          <Paper variant='outlined' sx={{ p: 3, bgcolor: 'grey.50' }}>
            <Stack
              direction='row'
              flexWrap='wrap'
              justifyContent='space-between'
              alignItems='flex-start'
              gap={3}
            >
              <Stack direction='row' flexWrap='wrap' columnGap={4} rowGap={1}>
                <Stat
                  value={queries.length}
                  label={queries.length === 1 ? 'query' : 'queries'}
                />
                <Stat value={queriesWithHits} label='with a cached alignment' />
                <Stat
                  value={totalHits}
                  label={totalHits === 1 ? 'hit in total' : 'hits in total'}
                />
                {invalidQueries > 0 && (
                  <Stat value={invalidQueries} label='could not be parsed' error />
                )}
              </Stack>
              <Box>
                <Button
                  variant='contained'
                  color='secondary'
                  startIcon={<FolderZipIcon />}
                  endIcon={<ExpandMoreIcon />}
                  disabled={!hits.length || downloading}
                  onClick={(event) => setDownloadAnchor(event.currentTarget)}
                >
                  Download All
                </Button>
                <Menu
                  anchorEl={downloadAnchor}
                  open={Boolean(downloadAnchor)}
                  onClose={() => setDownloadAnchor(null)}
                >
                  <MenuItem disabled sx={{ opacity: '1 !important' }}>
                    <Typography variant='overline'>Download every hit from…</Typography>
                  </MenuItem>
                  {sources.map((source) => (
                    <MenuItem key={source} onClick={() => void downloadAll(source)}>
                      {source}&nbsp;
                      <Typography component='span' variant='body2' color='text.secondary'>
                        ({downloadSetLabel(hitsBySource.get(source) ?? [])})
                      </Typography>
                    </MenuItem>
                  ))}
                  {sources.length > 1 && <Divider />}
                  <MenuItem onClick={() => void downloadAll(ANY_SOURCE)}>
                    Any Matching Source&nbsp;
                    <Typography component='span' variant='body2' color='text.secondary'>
                      ({downloadSetLabel(hits)})
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Stack>

            <Box mt={3}>
              <Typography variant='caption' color='text.secondary' display='block' mb={1}>
                Hits per source
              </Typography>
              {sources.length ? (
                <Stack direction='row' flexWrap='wrap' gap={1}>
                  {sources.map((source) => (
                    <Chip
                      key={source}
                      variant='outlined'
                      label={
                        <>
                          {source}{' '}
                          <Box component='b' sx={{ ml: 0.5 }}>
                            {numberFormat.format(hitsBySource.get(source)?.length ?? 0)}
                          </Box>
                        </>
                      }
                    />
                  ))}
                </Stack>
              ) : (
                <Typography color='text.secondary'>
                  No matching alignments were found for these sequences.
                </Typography>
              )}
            </Box>

            {downloadProgress && (
              <Box mt={2}>
                <LinearProgress
                  variant='determinate'
                  color={downloadProgress.complete ? 'success' : 'primary'}
                  value={
                    downloadProgress.total
                      ? (downloadProgress.done / downloadProgress.total) * 100
                      : 0
                  }
                />
                <Typography variant='caption' color='text.secondary' aria-live='polite'>
                  {downloadProgress.text}
                </Typography>
              </Box>
            )}

            {downloadError && (
              <Alert severity='warning' sx={{ mt: 3 }}>
                {downloadError}
              </Alert>
            )}

            {downloadFailures.length > 0 && (
              <Alert severity='warning' sx={{ mt: 3 }}>
                <b>
                  {downloadFailures.length}{' '}
                  {downloadFailures.length === 1 ? 'file' : 'files'} could not be fetched
                </b>{' '}
                and {downloadFailures.length === 1 ? 'was' : 'were'} left out of the
                archive (see manifest.tsv):
                <ul style={{ marginBottom: 0 }}>
                  {downloadFailures.map((failure) => (
                    <li key={failure.hit.osdf_uri}>
                      <code>{basename(failure.hit.osdf_uri)}</code> — {failure.reason}
                    </li>
                  ))}
                </ul>
              </Alert>
            )}
          </Paper>

          <TableContainer component={Paper} variant='outlined' sx={{ mt: 3 }}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Query</TableCell>
                  <TableCell>Sequence</TableCell>
                  <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>
                    # Hits
                  </TableCell>
                  <TableCell>Alignments by source</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pageQueries.map((query, index) => {
                  const queryIndex = pageStart + index;
                  const sequenceExpanded = expandedSeq.has(queryIndex);
                  const sortedHits = [...query.hits].sort((a, b) =>
                    compareSources(a.source, b.source)
                  );
                  return (
                    <TableRow
                      key={queryIndex}
                      sx={query.hits.length ? undefined : { bgcolor: 'grey.50' }}
                    >
                      <TableCell>
                        <Typography variant='body2' fontWeight={600}>
                          {query.name}
                        </Typography>
                        {query.hash && (
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            fontFamily='monospace'
                            title={`SHA-256 ${query.hash}`}
                          >
                            {query.hash.slice(0, 12)}…
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {query.error ? (
                          <>
                            <Typography variant='body2' color='error'>
                              <ErrorOutlineIcon
                                fontSize='inherit'
                                sx={{ verticalAlign: 'text-bottom', mr: 0.5 }}
                              />
                              {query.error}
                            </Typography>
                            {query.raw && (
                              <SequenceText
                                value={query.raw}
                                expanded={sequenceExpanded}
                                onToggle={() => toggleNumber(setExpandedSeq, queryIndex)}
                                muted
                              />
                            )}
                          </>
                        ) : (
                          <>
                            <SequenceText
                              value={query.sequence}
                              expanded={sequenceExpanded}
                              onToggle={() => toggleNumber(setExpandedSeq, queryIndex)}
                            />
                            <Typography variant='caption' color='text.secondary' display='block'>
                              {numberFormat.format(query.sequence.length)} aa
                            </Typography>
                          </>
                        )}
                      </TableCell>
                      <TableCell align='center'>
                        {query.error ? (
                          <Typography color='text.secondary'>—</Typography>
                        ) : query.hits.length ? (
                          <Typography fontWeight='bold'>
                            {numberFormat.format(query.hits.length)}
                          </Typography>
                        ) : (
                          <Typography color='text.secondary'>0</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {sortedHits.length ? (
                          <Stack component='ul' spacing={2} sx={{ listStyle: 'none', p: 0, m: 0 }}>
                            {sortedHits.map((hit) => (
                              <HitRow
                                key={`${queryIndex}-${hit.osdf_uri}`}
                                hit={hit}
                                expanded={expandedMeta.has(`${queryIndex}-${hit.osdf_uri}`)}
                                onToggle={() =>
                                  toggleString(setExpandedMeta, `${queryIndex}-${hit.osdf_uri}`)
                                }
                                onDownload={downloadOne}
                              />
                            ))}
                          </Stack>
                        ) : query.error ? null : (
                          <Typography color='text.secondary' fontStyle='italic'>
                            No cached alignment
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {pageCount > 1 && (
            <Stack
              direction='row'
              flexWrap='wrap'
              justifyContent='space-between'
              alignItems='center'
              gap={2}
              mt={2}
            >
              <Typography variant='caption' color='text.secondary'>
                Showing queries {numberFormat.format(pageStart + 1)}–
                {numberFormat.format(pageStart + pageQueries.length)} of{' '}
                {numberFormat.format(queries.length)}
              </Typography>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => {
                  setPage(value);
                  resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                size='small'
              />
            </Stack>
          )}

          <Typography variant='caption' color='text.secondary' display='block' mt={2}>
            Click a source to download that alignment (A3M), or “Get Metadata” for the
            database version and checksums. “Download All” bundles every matching file
            into a single zip archive together with a <code>manifest.tsv</code> of the
            provenance metadata.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function toggleNumber(
  setter: React.Dispatch<React.SetStateAction<Set<number>>>,
  value: number
) {
  setter((previous) => {
    const next = new Set(previous);
    if (!next.delete(value)) next.add(value);
    return next;
  });
}

function toggleString(
  setter: React.Dispatch<React.SetStateAction<Set<string>>>,
  value: string
) {
  setter((previous) => {
    const next = new Set(previous);
    if (!next.delete(value)) next.add(value);
    return next;
  });
}

function Stat({
  value,
  label,
  error,
}: {
  value: number;
  label: string;
  error?: boolean;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
      <Typography
        component='b'
        sx={{ fontSize: '1.6rem', color: error ? 'error.main' : undefined }}
      >
        {numberFormat.format(value)}
      </Typography>
      <Typography variant='caption' color={error ? 'error' : 'text.secondary'}>
        {label}
      </Typography>
    </Box>
  );
}

/** Truncated monospace sequence that expands to full width when clicked. */
function SequenceText({
  value,
  expanded,
  onToggle,
  muted,
}: {
  value: string;
  expanded: boolean;
  onToggle: () => void;
  muted?: boolean;
}) {
  return (
    <Box
      component='code'
      title='Click to expand'
      onClick={onToggle}
      sx={{
        display: 'inline-block',
        cursor: 'pointer',
        verticalAlign: 'bottom',
        color: muted ? 'text.secondary' : undefined,
        ...(expanded
          ? { maxWidth: 'none', whiteSpace: 'normal', wordBreak: 'break-all' }
          : {
              maxWidth: '14rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }),
      }}
    >
      {value}
    </Box>
  );
}

function HitRow({
  hit,
  expanded,
  onToggle,
  onDownload,
}: {
  hit: Hit;
  expanded: boolean;
  onToggle: () => void;
  onDownload: (url: string, filename: string) => Promise<void>;
}) {
  const url = osdfToHttps(hit.osdf_uri);
  const filename = basename(hit.osdf_uri);

  const details: Array<string | null> = [
    hit.query_name && hit.query_name !== 'Unclassified' ? hit.query_name : null,
    hit.species && hit.species !== 'Unclassified' ? hit.species : null,
    hit.n_sequences != null ? `${numberFormat.format(hit.n_sequences)} sequences` : null,
    hit.a3m_size_bytes != null ? formatBytes(hit.a3m_size_bytes) : null,
  ].filter(Boolean);

  const metadata: Array<[string, string]> = (
    [
      ['File', filename],
      ['Source', hit.source],
      ['Database version', hit.db_version],
      ['Query length', hit.seq_length != null ? `${numberFormat.format(hit.seq_length)} aa` : null],
      ['Aligned sequences', hit.n_sequences != null ? numberFormat.format(hit.n_sequences) : null],
      [
        'Size',
        hit.a3m_size_bytes != null
          ? `${formatBytes(hit.a3m_size_bytes)} (${numberFormat.format(hit.a3m_size_bytes)} bytes)`
          : null,
      ],
      ['A3M SHA-256', hit.a3m_sha256],
      ['Sequence hash', hit.seq_hash],
    ] as Array<[string, string | null | undefined]>
  ).filter((entry): entry is [string, string] => entry[1] != null && entry[1] !== '');

  return (
    <Box component='li'>
      <Link
        href={url}
        underline='none'
        fontWeight={600}
        onClick={(event) => {
          event.preventDefault();
          void onDownload(url, filename);
        }}
        title={`Download ${filename}`}
      >
        <DownloadIcon fontSize='inherit' sx={{ verticalAlign: 'text-bottom', mr: 0.5 }} />
        {hit.source}
      </Link>
      {details.length > 0 && (
        <Typography variant='caption' color='text.secondary' display='block'>
          {details.join(' · ')}
        </Typography>
      )}
      <Button
        size='small'
        sx={{ p: 0, minWidth: 0, fontSize: '0.8rem' }}
        endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        onClick={onToggle}
      >
        {expanded ? 'Hide Metadata' : 'Get Metadata'}
      </Button>
      <Collapse in={expanded}>
        <Paper
          variant='outlined'
          sx={{ p: 1, mt: 0.5, bgcolor: 'grey.50', fontSize: '0.8rem' }}
        >
          <Box component='dl' sx={{ m: 0 }}>
            {metadata.map(([key, value]) => (
              <Box key={key} sx={{ display: 'flex', gap: 1.5 }}>
                <Box component='dt' sx={{ flex: '0 0 9.5rem', fontWeight: 600 }}>
                  {key}
                </Box>
                <Box
                  component='dd'
                  sx={{ m: 0, fontFamily: 'monospace', wordBreak: 'break-all' }}
                >
                  {value}
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
}
