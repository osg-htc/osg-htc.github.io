/**
 * AlphaFold3 Alignment Library search — parsing, registry queries, and the
 * client-side zip writer.
 *
 * Only SHA-256 hashes of the normalized sequences are sent to the registry;
 * the sequences themselves never leave the browser.
 */

const API_BASE = 'https://af3-msa-library.dannymorales.com';
export const QUERY_URL = `${API_BASE}/v1/query`;
const OSDF_HTTPS_BASE = 'https://osdf-director.osg-htc.org';

/** /v1/query batch size for typical searches (finer progress). */
const HASHES_PER_REQUEST_SMALL = 100;
/** Batch size for bulk searches (the server answers 500 in ~0.16s). */
const HASHES_PER_REQUEST_LARGE = 500;
/** Unique sequences at which to switch to large batches. */
const LARGE_QUERY_THRESHOLD = 10000;
/** Parallel /v1/query batches. */
const QUERY_CONCURRENCY = 4;
/** Parallel A3M fetches when zipping. */
export const DOWNLOAD_CONCURRENCY = 4;
/** Table rows per page. */
export const RESULTS_PER_PAGE = 50;
/** Stay well under the 4 GiB zip32 limit. */
export const MAX_ZIP_BYTES = 3.5 * 1024 ** 3;

export const ANY_SOURCE = '__any__';

export const EXAMPLE_FASTA = `>P62975 Ubiquitin
MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQRLIFAGKQLEDGRTLSDYNIQKESTLHLVLRLRGG
>P42212 Green fluorescent protein
MSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTFSYGVQCFSRYPDHMKQHDFFKSAMPEGYVQERTIFFKDDGNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGIKVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMVLLEFVTAAGITHGMDELYK
>Not in the library (scrambled)
GGRLRLVLHLTSEKQINYDSLTRGDELQKGAFILRQQDPPIGEKDQIKAKVNEITDSPEVELTITKGTLTKVFIQM
`;

export const numberFormat = new Intl.NumberFormat('en-US');

/** One alignment record as the registry returns it. */
export interface Hit {
  osdf_uri: string;
  seq_hash: string;
  source: string;
  db_version?: string | null;
  species?: string | null;
  query_name?: string | null;
  seq_length?: number | null;
  n_sequences?: number | null;
  a3m_size_bytes?: number | null;
  a3m_sha256?: string | null;
}

/** A hit deduplicated across queries, with the browser-fetchable URL added. */
export interface ResolvedHit extends Hit {
  https_url: string;
  query_names: string[];
}

/** One sequence the researcher submitted, plus whatever it matched. */
export interface Query {
  name: string;
  raw: string;
  sequence: string;
  error: string | null;
  hash?: string;
  hits: Hit[];
}

// ---------------------------------------------------------------------------
// Sequence parsing and hashing
// ---------------------------------------------------------------------------

/**
 * Parse the textarea contents into query records.
 *
 * Lines starting with ">" open a FASTA record whose sequence is the
 * concatenation of the following lines up to the next header. Non-empty lines
 * that appear before any header are each treated as their own (unnamed)
 * sequence, so "one sequence per line" also works.
 */
export function parseSequences(text: string): Query[] {
  const queries: Array<Pick<Query, 'name' | 'raw'>> = [];
  let current: { name: string; raw: string } | null = null;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith(';') || line.startsWith('#')) continue;

    if (line.startsWith('>')) {
      current = { name: line.slice(1).trim(), raw: '' };
      queries.push(current);
    } else if (current) {
      current.raw += line;
    } else {
      queries.push({ name: '', raw: line });
    }
  }

  return queries.map((query, index) => {
    // Match the registry's normalization (strip whitespace, uppercase) and
    // additionally drop a trailing stop marker.
    const sequence = query.raw.replace(/\s+/g, '').toUpperCase().replace(/\*$/, '');
    let error: string | null = null;
    if (!sequence) {
      error = 'Empty sequence';
    } else if (!/^[A-Z]+$/.test(sequence)) {
      const bad = [...new Set(sequence.replace(/[A-Z]/g, ''))].join(' ');
      error = `Unexpected characters: ${bad}`;
    }
    return {
      name: query.name || `Query ${index + 1}`,
      raw: query.raw,
      sequence,
      error,
      hits: [],
    };
  });
}

export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ---------------------------------------------------------------------------
// Registry query
// ---------------------------------------------------------------------------

export async function queryRegistry(
  seqHashes: string[],
  onChunkDone?: (chunk: string[]) => void
): Promise<Map<string, Hit[]>> {
  const batchSize =
    seqHashes.length < LARGE_QUERY_THRESHOLD
      ? HASHES_PER_REQUEST_SMALL
      : HASHES_PER_REQUEST_LARGE;
  const chunks: string[][] = [];
  for (let i = 0; i < seqHashes.length; i += batchSize) {
    chunks.push(seqHashes.slice(i, i + batchSize));
  }

  const hitsByHash = new Map<string, Hit[]>();
  await mapConcurrent(chunks, QUERY_CONCURRENCY, async (chunk) => {
    const response = await fetch(QUERY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seq_hashes: chunk }),
    });
    if (!response.ok) {
      throw new Error(`Registry responded with HTTP ${response.status}`);
    }
    const json = (await response.json()) as {
      results?: Array<{ seq_hash: string; hits?: Hit[] }>;
    };
    for (const result of json.results ?? []) {
      hitsByHash.set(result.seq_hash, result.hits ?? []);
    }
    onChunkDone?.(chunk);
    return null;
  });

  return hitsByHash;
}

/**
 * Convert an OSDF/Pelican URI into a browser-fetchable HTTPS URL.
 *   osdf:///af3-msa-library/x.a3m          -> https://osdf-director.osg-htc.org/af3-msa-library/x.a3m
 *   pelican://osg-htc.org/af3-msa-library/x -> https://osdf-director.osg-htc.org/af3-msa-library/x
 */
export function osdfToHttps(uri: string): string {
  if (/^https?:\/\//i.test(uri)) return uri;
  let path = uri.replace(/^osdf:\/\//i, '').replace(/^pelican:\/\/[^/]*/i, '');
  if (!path.startsWith('/')) path = '/' + path;
  return OSDF_HTTPS_BASE + path.split('/').map(encodeURIComponent).join('/');
}

export function basename(uri: string): string {
  return decodeURIComponent(uri.split('/').filter(Boolean).pop() ?? 'alignment.a3m');
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'source'
  );
}

/**
 * Display order for sources: OSG/OSPool-generated first, community
 * contributions second, everything else alphabetically.
 */
function sourceRank(name: string): number {
  if (/(osg|ospool)[\s_-]*generated/i.test(name)) return 0;
  if (/community/i.test(name)) return 1;
  return 2;
}

export function compareSources(a: string, b: string): number {
  return sourceRank(a) - sourceRank(b) || a.localeCompare(b);
}

/**
 * Page numbers to offer in the pagination control: all of them when few,
 * otherwise first, last, and a window around the current page, with nulls
 * marking the gaps (rendered as ellipses).
 */
export function pageNumbers(current: number, pages: number): Array<number | null> {
  if (pages <= 7) return [...Array(pages).keys()];
  const shown = [...new Set([0, current - 1, current, current + 1, pages - 1])]
    .filter((p) => p >= 0 && p < pages)
    .sort((a, b) => a - b);
  const items: Array<number | null> = [];
  for (let i = 0; i < shown.length; i++) {
    if (i > 0 && shown[i] - shown[i - 1] > 1) items.push(null);
    items.push(shown[i]);
  }
  return items;
}

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  if (bytes < 1024 ** 4) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  return `${(bytes / 1024 ** 4).toFixed(2)} TB`;
}

/**
 * "N files · 12.3 MB" label for a set of hits; sizes come from the registry's
 * a3m_size_bytes, with a ≥ prefix when some hits don't report a size.
 */
export function downloadSetLabel(hits: ResolvedHit[]): string {
  const known = hits.filter((h) => h.a3m_size_bytes != null);
  const files = `${numberFormat.format(hits.length)} ${hits.length === 1 ? 'file' : 'files'}`;
  if (!known.length) return files;
  const bytes = known.reduce((n, h) => n + (h.a3m_size_bytes ?? 0), 0);
  return `${files} · ${known.length < hits.length ? '≥' : ''}${formatBytes(bytes)}`;
}

// ---------------------------------------------------------------------------
// Minimal ZIP writer (store method, no compression)
// ---------------------------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array<ArrayBuffer>): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date: Date) {
  const time =
    (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1);
  const day =
    ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, day };
}

export interface ZipEntry {
  name: string;
  /** Backed by a plain ArrayBuffer so the entry can go straight into a Blob. */
  data: Uint8Array<ArrayBuffer>;
}

/** Build a zip Blob from `{name, data}` entries. */
export function buildZip(entries: ZipEntry[]): Blob {
  const encoder = new TextEncoder();
  const { time, day } = dosDateTime(new Date());
  const parts: BlobPart[] = [];
  const central: BlobPart[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const crc = crc32(entry.data);
    const size = entry.data.length;

    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true); // version needed
    local.setUint16(6, 0x0800, true); // flags: UTF-8 names
    local.setUint16(8, 0, true); // method: store
    local.setUint16(10, time, true);
    local.setUint16(12, day, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, size, true);
    local.setUint32(22, size, true);
    local.setUint16(26, nameBytes.length, true);
    local.setUint16(28, 0, true);
    parts.push(local.buffer, nameBytes, entry.data);

    const cd = new DataView(new ArrayBuffer(46));
    cd.setUint32(0, 0x02014b50, true);
    cd.setUint16(4, 20, true); // version made by
    cd.setUint16(6, 20, true); // version needed
    cd.setUint16(8, 0x0800, true);
    cd.setUint16(10, 0, true);
    cd.setUint16(12, time, true);
    cd.setUint16(14, day, true);
    cd.setUint32(16, crc, true);
    cd.setUint32(20, size, true);
    cd.setUint32(24, size, true);
    cd.setUint16(28, nameBytes.length, true);
    cd.setUint16(30, 0, true); // extra length
    cd.setUint16(32, 0, true); // comment length
    cd.setUint16(34, 0, true); // disk number
    cd.setUint16(36, 0, true); // internal attrs
    cd.setUint32(38, 0, true); // external attrs
    cd.setUint32(42, offset, true); // local header offset
    central.push(cd.buffer, nameBytes);

    offset += 30 + nameBytes.length + size;
  }

  const centralSize = central.reduce(
    (n, p) => n + (p as ArrayBuffer | Uint8Array).byteLength,
    0
  );
  const eocd = new DataView(new ArrayBuffer(22));
  eocd.setUint32(0, 0x06054b50, true);
  eocd.setUint16(4, 0, true);
  eocd.setUint16(6, 0, true);
  eocd.setUint16(8, entries.length, true);
  eocd.setUint16(10, entries.length, true);
  eocd.setUint32(12, centralSize, true);
  eocd.setUint32(16, offset, true);
  eocd.setUint16(20, 0, true);

  return new Blob([...parts, ...central, eocd.buffer], { type: 'application/zip' });
}

export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/** Run `worker(item, index)` over `items` with a bounded number in flight. */
export async function mapConcurrent<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const run = async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

/** Tab-separated provenance table shipped inside the "Download All" archive. */
export function buildManifest(
  hits: ResolvedHit[],
  failures: Array<{ hit: ResolvedHit; reason: string }>
): string {
  const failed = new Map(failures.map((f) => [f.hit.osdf_uri, f.reason]));
  const header = [
    'query_names', 'seq_hash', 'source', 'file', 'osdf_uri', 'https_url',
    'db_version', 'species', 'query_name', 'n_sequences', 'a3m_size_bytes',
    'a3m_sha256', 'status',
  ];
  const rows = hits.map((hit) =>
    [
      hit.query_names.join('; '),
      hit.seq_hash,
      hit.source,
      `${slugify(hit.source)}/${basename(hit.osdf_uri)}`,
      hit.osdf_uri,
      hit.https_url,
      hit.db_version,
      hit.species,
      hit.query_name,
      hit.n_sequences ?? '',
      hit.a3m_size_bytes ?? '',
      hit.a3m_sha256 ?? '',
      failed.has(hit.osdf_uri) ? `failed: ${failed.get(hit.osdf_uri)}` : 'ok',
    ]
      .map((v) => String(v ?? '').replace(/[\t\r\n]+/g, ' '))
      .join('\t')
  );
  return [header.join('\t'), ...rows].join('\n') + '\n';
}
