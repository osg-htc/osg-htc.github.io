import matter from 'gray-matter';
import type { Website } from '@chtc/web-components/content';
import { getRawFile, getRepoPaths } from '@chtc/web-components/github';
import {
  extractMarkdownImageUrls,
  recordRemoteImages,
} from '@/utils/remoteImages';

interface Image {
  path: string;
  alt: string;
  credit?: string;
}

export interface Event {
  title: string;
  short_title?: string;
  published?: boolean;
  start_date: string;
  end_date: string;
  publish_on: Website[];
  tags?: string[];
  excerpt?: string;
  image?: Image;
  banner?: Image;
  sidebar?: string;
  endblock?: string;
  content: string;
}

/**
 * The event data with additional fields used for the site.
 */
export interface BackendEvent extends Event {
  slug: string[];
  path: string;
}

function getSlug(path: string) {
  const splitSlug = path.slice(0, -3).split('-');
  return [
    splitSlug[0],
    splitSlug[1],
    splitSlug[2],
    splitSlug.slice(3).join('-'),
  ];
}

function isEvent(path: string) {
  const regex = /\d\d\d\d-\d\d?-\d\d?-.*?\.md/g;
  return path.search(regex) !== -1;
}

/**
 * Coerce a frontmatter date into a `YYYY-MM-DD` string. Unquoted YAML dates
 * (e.g. `start_date: 2024-08-05`) are parsed into JS `Date` objects by
 * gray-matter/js-yaml, so normalize using UTC to avoid timezone drift.
 */
function toISODate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value ?? '');
}

function filterVisibleEvents(event: BackendEvent) {
  const isPublished = event.published ?? true;
  const isOnOsg = event.publish_on?.includes('osg') ?? false;
  return isPublished && isOnOsg;
}

export async function getEvents(
  organization: string,
  repo: string,
  branch: string
): Promise<BackendEvent[]> {
  const paths = await getRepoPaths(organization, repo, branch);

  // Filter paths to only include event markdown files
  const events = await Promise.all(
    paths
      .filter(isEvent)
      .map(async (path) => await getEvent(organization, repo, path, branch))
  ).then((all) => all.filter(filterVisibleEvents));

  // Declare the art for the export image optimizer; see remoteImages.ts.
  // Every page that shows events goes through here, so this is the one place
  // that sees the whole set.
  recordRemoteImages(
    events.flatMap((event) => [
      event.image?.path,
      event.banner?.path,
      ...extractMarkdownImageUrls(event.content, event.sidebar, event.endblock),
    ])
  );

  return events;
}

export async function getEvent(
  organization: string,
  repo: string,
  path: string,
  branch: string
): Promise<BackendEvent> {
  const text = await getRawFile(organization, repo, path, branch);
  const frontMatter = matter(text);

  return {
    title: frontMatter.data.title,
    short_title: frontMatter.data.short_title,
    published: frontMatter.data.published,
    start_date: toISODate(frontMatter.data.start_date),
    end_date: toISODate(frontMatter.data.end_date),
    publish_on: frontMatter.data.publish_on,
    tags: frontMatter.data.tags ?? undefined,
    excerpt: frontMatter.data.excerpt,
    image: frontMatter.data.image ?? undefined,
    banner: frontMatter.data.banner ?? undefined,
    sidebar: frontMatter.data.sidebar ?? undefined,
    endblock: frontMatter.data.endblock ?? undefined,
    content: frontMatter.content,
    slug: getSlug(path),
    path: path,
  };
}

/** True when an event's end date is today or later (in UTC). */
export function isUpcoming(event: Event): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return event.end_date >= today;
}

/**
 * Split events into upcoming (soonest first) and past (most recent first).
 */
export function splitEvents(events: BackendEvent[]): {
  upcoming: BackendEvent[];
  past: BackendEvent[];
} {
  const upcoming = events
    .filter(isUpcoming)
    .sort((a, b) => a.end_date.localeCompare(b.end_date));
  const past = events
    .filter((event) => !isUpcoming(event))
    .sort((a, b) => b.end_date.localeCompare(a.end_date));
  return { upcoming, past };
}

/**
 * Format an event's date range, e.g. "August 5–9, 2024", "March 29, 2024",
 * or "January 30 – February 2, 2024".
 */
export function formatEventDate(start: string, end: string): string {
  if (!start) return '';
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = end ? new Date(`${end}T00:00:00Z`) : startDate;

  const month = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
  const day = (d: Date) => d.getUTCDate();
  const year = (d: Date) => d.getUTCFullYear();

  if (start === end || !end) {
    return `${month(startDate)} ${day(startDate)}, ${year(startDate)}`;
  }
  if (year(startDate) !== year(endDate)) {
    return `${month(startDate)} ${day(startDate)}, ${year(startDate)} – ${month(endDate)} ${day(endDate)}, ${year(endDate)}`;
  }
  if (month(startDate) !== month(endDate)) {
    return `${month(startDate)} ${day(startDate)} – ${month(endDate)} ${day(endDate)}, ${year(endDate)}`;
  }
  return `${month(startDate)} ${day(startDate)}–${day(endDate)}, ${year(endDate)}`;
}
