import fs from 'fs';
import path from 'path';
import type { Staff } from '@chtc/web-components/content';

/**
 * Manifest of the remote images the build rendered, read back by
 * `remoteOptimizedImages.js` once `next build` has finished.
 *
 * next-image-export-optimizer only generates variants for images declared up
 * front, and most of this site's photography is absolute URLs — staff
 * headshots on chtc.github.io, article and event art on
 * raw.githubusercontent.com — rather than files under `public/`. Anything
 * missing from this list renders at full size straight from the origin, so
 * the pages that show remote images record the URLs they used instead of us
 * maintaining a second hand-written list.
 */
export const REMOTE_IMAGE_MANIFEST = path.join(
  process.cwd(),
  '.remote-images.json'
);

function readManifest(): string[] {
  try {
    const parsed: unknown = JSON.parse(
      fs.readFileSync(REMOTE_IMAGE_MANIFEST, 'utf-8')
    );
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    // No manifest yet, or a half-written one from an interrupted build.
    return [];
  }
}

/**
 * next-image-export-optimizer passes every URL through `new URL()` and keys
 * the generated file on the extension, so anything it cannot parse or cannot
 * re-encode would only add a download and a broken variant.
 */
const OPTIMIZABLE = /^https?:\/\/.+\.(jpe?g|png|gif|webp|avif)(\?.*)?$/i;

/**
 * Add these URLs to the manifest.
 *
 * Merges rather than overwrites: many pages render remote images, and each
 * only knows about the subset it shows. Written through a temporary file so a
 * reader never sees a partial array.
 */
export function recordRemoteImages(
  candidates: Iterable<string | undefined | null>
): void {
  const urls = new Set(readManifest());
  const before = urls.size;

  for (const candidate of candidates) {
    if (candidate && OPTIMIZABLE.test(candidate)) {
      urls.add(candidate);
    }
  }

  // Rewriting on every page would be a lot of churn for nothing; most pages
  // after the first contribute no new URLs.
  if (urls.size === before) return;

  const tmp = `${REMOTE_IMAGE_MANIFEST}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify([...urls].sort(), null, 2));
  fs.renameSync(tmp, REMOTE_IMAGE_MANIFEST);
}

/** Add these people's portraits to the manifest. */
export function recordStaffImages(staff: Staff[]): void {
  recordRemoteImages(staff.map((member) => member.image));
}

/**
 * Absolute image URLs referenced from a markdown body.
 *
 * Article and event bodies carry both markdown `![](url)` images and raw HTML
 * `<img src="url">` tags, so this matches the URL itself rather than either
 * syntax. The manifest is a set, so duplicates and the odd false positive in
 * a code block cost nothing but one extra download.
 */
const MARKDOWN_IMAGE_URL =
  /https?:\/\/[^\s"'()<>\\]+\.(?:jpe?g|png|gif|webp|avif)/gi;

export function extractMarkdownImageUrls(
  ...bodies: (string | undefined | null)[]
): string[] {
  const urls: string[] = [];
  for (const body of bodies) {
    if (body) urls.push(...body.match(MARKDOWN_IMAGE_URL) ?? []);
  }
  return urls;
}
