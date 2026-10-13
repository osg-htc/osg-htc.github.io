// Drop unreachable URLs from the remote-image manifest before
// next-image-export-optimizer reads it.
//
// The manifest is built from the CHTC/Articles and CHTC/events repositories,
// which this site does not control. A typo in an image path used to show as
// one missing picture; now that the build downloads every image it renders,
// the optimizer aborts on the first 404 and the whole deploy fails. A dead
// URL is a content bug, not a build bug, so it is reported and skipped —
// `ExportedImage` falls back to the original URL, which is what the page did
// before any of this.
import fs from 'node:fs/promises';
import path from 'node:path';

const MANIFEST = path.join(process.cwd(), '.remote-images.json');
const CONCURRENCY = 20;
const TIMEOUT_MS = 20_000;

/** Whether a URL can be fetched. Falls back to a ranged GET for hosts that reject HEAD. */
async function isReachable(url) {
  for (const init of [{ method: 'HEAD' }, { headers: { range: 'bytes=0-0' } }]) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (response.ok) return true;
      // 4xx means it is genuinely not there; anything else may be transient,
      // so leave it in the manifest and let the optimizer report it.
      if (response.status < 400 || response.status >= 500) return true;
      if (response.status !== 405 && response.status !== 403) return false;
    } catch {
      // A network error here is not evidence the image is missing.
      return true;
    }
  }
  return false;
}

async function main() {
  const urls = JSON.parse(await fs.readFile(MANIFEST, 'utf-8'));

  const reachable = [];
  const dead = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(isReachable));
    batch.forEach((url, index) =>
      (results[index] ? reachable : dead).push(url)
    );
  }

  if (dead.length === 0) {
    console.log(`validate-remote-images: all ${urls.length} remote images reachable.`);
    return;
  }

  console.warn(
    `validate-remote-images: dropping ${dead.length} unreachable image(s) ` +
      'from the manifest. Fix the path in the content repository:'
  );
  for (const url of dead) console.warn(`  ${url}`);

  await fs.writeFile(MANIFEST, JSON.stringify(reachable, null, 2));
}

await main();
