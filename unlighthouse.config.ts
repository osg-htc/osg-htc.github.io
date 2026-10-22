// Defaults to production. To scan a local build, serve it (`npx serve out -l 3000`)
// and set UNLIGHTHOUSE_SITE=http://localhost:3000.
const SITE = process.env.UNLIGHTHOUSE_SITE ?? 'https://osg-htc.org'

async function fetchLocs(path: string): Promise<string[]> {
	const res = await fetch(new URL(path, SITE))
	if (!res.ok)
		throw new Error(`Failed to fetch ${path} from ${SITE}: ${res.status}`)
	const xml = await res.text()
	return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc)
}

// next-sitemap writes absolute URLs for the production host, so read the
// sitemaps from SITE ourselves and keep only each entry's path.
async function sitemapPaths(): Promise<string[]> {
	const sitemaps = await fetchLocs('/sitemap.xml')
	const locs = (await Promise.all(sitemaps.map((loc) => fetchLocs(new URL(loc).pathname)))).flat()
	const paths = locs
		.map((loc) => new URL(loc).pathname)
		// trailingSlash: true, so request the canonical URL and avoid a redirect per page
		.map((path) => (path.endsWith('/') ? path : `${path}/`))
		.filter((path) => path !== '/404/')
	return [...new Set(paths)]
}

export default {
	site: SITE,
	urls: sitemapPaths,
	scanner: {
    dynamicSampling: true,
    samples: 5,
    throttle: true,
    maxRoutes: false
  },
  puppeteerClusterOptions: {
    maxConcurrency: 1,
  },
}
