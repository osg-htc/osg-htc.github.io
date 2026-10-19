import fs from 'fs';
import path from 'path';
import { fetchFederation, list } from '@pelicanplatform/web-client';

import { PELICAN_FEDERATION } from '@/utils/dataRepositories';

/**
 * The OSDF namespaces a visitor can actually browse: publicly readable, and
 * listable with something in them. Repository pages only show namespaces in
 * this set.
 *
 * Server-only — it reads and writes a cache file — which is why it is not in
 * `dataRepositories.ts`, whose formatters client components import.
 */

const NAMESPACES_URL =
  'https://osdf-director.osg-htc.org/api/v1.0/director_ui/namespaces';

/**
 * Listing every public namespace takes the better part of a minute, and
 * `next build` renders pages in several worker processes that would each
 * repeat it. The first to finish writes the result here and the rest read it.
 * An hour is long enough to cover one build and short enough that the next
 * scheduled build fetches fresh.
 */
const CACHE_FILE = path.join(process.cwd(), '.namespace-cache.json');
const CACHE_TTL_MS = 60 * 60 * 1000;

type DirectorNamespace = {
  path: string;
  capabilities: { PublicRead: boolean };
};

function readFileCache(): string[] | null {
  try {
    const { timestamp, paths } = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    if (Date.now() - timestamp < CACHE_TTL_MS) return paths;
  } catch {
    // Missing or unreadable: fetch instead.
  }
  return null;
}

function writeFileCache(paths: string[]): void {
  // Through a temporary file so another worker never reads half of it.
  const tmp = `${CACHE_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify({ timestamp: Date.now(), paths }));
  fs.renameSync(tmp, CACHE_FILE);
}

async function fetchValidNamespacePaths(): Promise<string[]> {
  const response = await fetch(NAMESPACES_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch OSDF namespaces: ${response.status}`);
  }
  const namespaces = (await response.json()) as DirectorNamespace[];
  const federation = await fetchFederation(PELICAN_FEDERATION);

  // A namespace that cannot be listed, or holds no more than a single object,
  // would show visitors an empty or broken file browser.
  const listable = await Promise.all(
    namespaces
      .filter((namespace) => namespace.capabilities.PublicRead)
      .map(async (namespace) => {
        try {
          const objects = await list(
            `pelican://${PELICAN_FEDERATION}${namespace.path}`,
            federation
          );
          return objects.length > 1 ? namespace.path : null;
        } catch {
          return null;
        }
      })
  );
  return listable.filter((p): p is string => p !== null).sort();
}

// One fetch per worker process, shared by every page that asks.
let validPathsCache: Promise<Set<string>> | undefined;

function loadValidNamespacePaths(): Promise<Set<string>> {
  return (validPathsCache ??= (async () => {
    let paths = readFileCache();
    if (!paths) {
      paths = await fetchValidNamespacePaths();
      writeFileCache(paths);
    }
    return new Set(paths);
  })());
}

/**
 * Filters a list of namespace strings to those visitors can browse: each must
 * exactly match a valid namespace, or be a sub-path of one.
 */
export async function filterValidNamespaces(
  namespaces: string[]
): Promise<string[]> {
  const validPaths = await loadValidNamespacePaths();
  return namespaces.filter((namespace) => {
    if (validPaths.has(namespace)) return true;
    for (const valid of validPaths) {
      if (namespace.startsWith(valid + '/')) return true;
    }
    return false;
  });
}
