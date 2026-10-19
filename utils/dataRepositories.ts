import type { DataRepository } from '@/types';

/** The Pelican federation OSDF data is served from. */
export const PELICAN_FEDERATION = 'osg-htc.org';

/** Builds a `pelican://` object URL for a namespace within the federation. */
export function pelicanObjectUrl(namespace: string): string {
  return `pelican://${PELICAN_FEDERATION}${namespace}`;
}

/** Live source of OSDF data repositories, shared across OSG/FabAID sites. */
const DATA_REPOSITORIES_URL = 'https://fabaid.io/data/data-repositories.json';

// Memoize the fetch so the listing page, generateStaticParams, and every
// per-repository detail page share a single request per build worker.
let repositoriesCache: Promise<DataRepository[]> | undefined;

/**
 * Returns every data repository flagged for display, sorted by rank (higher
 * first) then alphabetically by name.
 */
export function getDataRepositories(): Promise<DataRepository[]> {
  return (repositoriesCache ??= (async () => {
    const response = await fetch(DATA_REPOSITORIES_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data repositories: ${response.status}`);
    }
    const json = (await response.json()) as Record<string, DataRepository>;
    return Object.entries(json)
      .map(([id, repository]) => ({ ...repository, id }))
      .filter((repository) => repository.display)
      .sort(
        (a, b) => b.rank - a.rank || (a.name ?? '').localeCompare(b.name ?? '')
      );
  })());
}

/**
 * Returns a single displayable data repository by id, or undefined.
 */
export async function getDataRepository(
  id: string
): Promise<DataRepository | undefined> {
  const repositories = await getDataRepositories();
  return repositories.find((repository) => repository.id === id);
}

/** Ids of every data repository that should be statically generated. */
export async function getDataRepositoryIds(): Promise<string[]> {
  const repositories = await getDataRepositories();
  return repositories.map((repository) => repository.id);
}

/** Formats a raw byte count into a human readable string (e.g. "1.2 TB"). */
export function formatBytes(bytes: number | null): string {
  if (bytes === null || Number.isNaN(bytes)) {
    return '—';
  }

  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1000)),
    units.length - 1
  );
  const value = bytes / 1000 ** exponent;

  return `${value.toFixed(value >= 100 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

/**
 * Formats a nullable count into a localized string, using an em dash for
 * missing values.
 */
export function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  return value.toLocaleString();
}
