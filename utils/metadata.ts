import type { Metadata } from 'next';

/** Suffix every page title carries, matching the hand-written ones. */
export const SITE_NAME = 'OSG Consortium';

/** `Page Name — OSG Consortium`. */
export function pageTitle(title: string): string {
  return `${title} — ${SITE_NAME}`;
}

/**
 * Flatten a frontmatter excerpt into a one-line description.
 *
 * Excerpts are YAML block scalars, so they arrive with hard line breaks and
 * trailing newlines, and some carry light markdown. Meta descriptions are
 * plain text on one line, and search engines cut them around 160 characters,
 * so this trims at a word boundary rather than mid-word.
 */
export function summarize(
  text: string | undefined | null,
  limit = 200
): string | undefined {
  if (!text) return undefined;

  const flat = text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // markdown links -> their text
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!flat) return undefined;
  if (flat.length <= limit) return flat;

  const cut = flat.slice(0, limit);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/**
 * The first prose paragraph of a markdown body, as a description fallback.
 *
 * A handful of articles carry no `excerpt`, and the alternative is the
 * generic site description on a page about something specific. Bodies open
 * with raw HTML figures, headings and images as often as with prose, so
 * those blocks are skipped rather than stripped into noise.
 */
export function firstParagraph(content: string | undefined): string | undefined {
  if (!content) return undefined;

  for (const block of content.split(/\n\s*\n/)) {
    const text = block
      .replace(/<[^>]*>/g, ' ') // inline and block HTML
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
      .trim();
    // Headings, list items, tables and quotes do not read as a summary.
    if (!text || /^[#>|*\-+]|^\d+\./.test(text)) continue;
    const flat = summarize(text);
    // Short leftovers are usually a caption or a stray attribute, not prose.
    if (flat && flat.length > 40) return flat;
  }
  return undefined;
}

/**
 * The site-wide image, as an explicit entry.
 *
 * `app/opengraph-image.png` covers every page that does not define its own
 * `openGraph` block. Pages that do define one have to name an image, because
 * of the replacement rule in {@link OG_SITE} — this is the same file.
 */
const SITE_OG_IMAGE = {
  url: '/opengraph-image.png',
  width: 1200,
  height: 628,
  alt: 'OSG Consortium — distributed high throughput computing for researchers',
};

/**
 * Open Graph fields every page shares.
 *
 * Next.js *replaces* the whole `openGraph` object when a page defines one
 * rather than merging it field by field, and the image from
 * `app/opengraph-image.png` goes with it. So a page that sets any Open Graph
 * field has to restate all of these — hence the helpers below, which always
 * emit a complete block.
 */
export const OG_SITE = {
  siteName: SITE_NAME,
  locale: 'en_US',
} as const;

/**
 * Twitter fields every page shares. Same replacement rule as {@link OG_SITE}:
 * a page that sets `twitter.title` without this drops back to the small
 * `summary` card.
 */
export const TWITTER_SITE = { card: 'summary_large_image' } as const;

/**
 * The Open Graph and Twitter image for a page: its own if it has one, the
 * site-wide image otherwise. Never empty, so a page's block can never end up
 * with no image at all.
 */
export function shareImage(
  src: string | undefined,
  alt: string | undefined
): { url: string; alt?: string }[] {
  return src ? [{ url: src, alt }] : [SITE_OG_IMAGE];
}

/** A `YYYY-MM-DD` string or `Date` as an ISO timestamp, or nothing if unusable. */
export function isoDate(value: Date | string | undefined): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** Metadata for a listing page: title, description, and its own canonical URL. */
export function listingMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  const full = pageTitle(title);
  return {
    title: full,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...OG_SITE,
      type: 'website',
      title: full,
      description,
      url: path,
      images: shareImage(undefined, undefined),
    },
    twitter: { ...TWITTER_SITE, title: full, description },
  };
}
