import fs from 'fs';
import path from 'path';
import type { Staff } from '@chtc/web-components/content';

/**
 * Manifest of the remote staff portraits the build rendered, read back by
 * `remoteOptimizedImages.js` once `next build` has finished.
 *
 * next-image-export-optimizer only generates variants for images declared up
 * front, and staff headshots are absolute URLs on chtc.github.io rather than
 * files under `public/`. Anything missing from this list is a silent 404 in
 * the export, so the pages that render portraits record the URLs they used
 * instead of us maintaining a second hand-written list.
 */
export const STAFF_IMAGE_MANIFEST = path.join(
  process.cwd(),
  '.staff-images.json'
);

function readManifest(): string[] {
  try {
    const parsed: unknown = JSON.parse(
      fs.readFileSync(STAFF_IMAGE_MANIFEST, 'utf-8')
    );
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    // No manifest yet, or a half-written one from an interrupted build.
    return [];
  }
}

/**
 * Add these people's portraits to the manifest.
 *
 * Merges rather than overwrites: more than one page renders portraits, and
 * each only knows about the subset of the staff list it shows. Written
 * through a temporary file so a reader never sees a partial array.
 */
export function recordStaffImages(staff: Staff[]): void {
  const urls = new Set(readManifest());
  for (const member of staff) {
    if (member.image?.startsWith('http')) {
      urls.add(member.image);
    }
  }

  const tmp = `${STAFF_IMAGE_MANIFEST}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify([...urls].sort(), null, 2));
  fs.renameSync(tmp, STAFF_IMAGE_MANIFEST);
}
