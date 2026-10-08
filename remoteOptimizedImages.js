// Remote images next-image-export-optimizer should download and generate
// variants for. It `require()`s this file (CommonJS) after `next build`, via
// the `postbuild` script.
//
// The list is the staff-portrait manifest that `utils/staffImages.ts` writes
// while the team pages render, so it is exactly what the build asked for. The
// ordering matters: `next build` has to run first, which `postbuild` ensures.
const fs = require('fs');
const path = require('path');

const MANIFEST = path.join(__dirname, '.staff-images.json');

if (!fs.existsSync(MANIFEST)) {
  throw new Error(
    `remoteOptimizedImages.js: ${MANIFEST} is missing. It is written during ` +
      '`next build`; run the build before the image optimizer.'
  );
}

const urls = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));

if (!Array.isArray(urls) || urls.length === 0) {
  throw new Error(
    `remoteOptimizedImages.js: ${MANIFEST} is empty. The staff list failed to ` +
      'load during the build, and every portrait would 404 in the export.'
  );
}

module.exports = urls;
