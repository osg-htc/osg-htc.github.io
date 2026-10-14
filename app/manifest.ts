import type { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';

/*
 * Web app manifest, emitted at /manifest.webmanifest and linked from every
 * page. Colors are the brand values from `app/theme.ts` — repeated as
 * literals rather than imported, because that module is a client component
 * and this route has no reason to pull MUI's theme factory into the build.
 *
 * Icons point at logos already in `public/`; the manifest references them by
 * URL, so no new artwork is involved.
 */
// `manifest.ts` is a Route Handler, and a statically exported site has no
// server to run it on request, so it has to be marked static explicitly.
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: '/',
    display: 'browser',
    background_color: '#f7f8fa', // palette.background.default
    theme_color: '#0b1725', // BRAND_NAVY
    icons: [
      {
        src: '/logos/osg.svg',
        type: 'image/svg+xml',
        sizes: 'any',
        purpose: 'any',
      },
      {
        src: '/images/logos/Logo_Round_Med.png',
        type: 'image/png',
        sizes: '300x300',
      },
    ],
  };
}
