/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: `https://${process.env.HOSTNAME}` || 'https://example.com',
	output: "export",
	// Match `trailingSlash: true` in next.config.mjs
	trailingSlash: true,
}
