/**
 * Not in NobelBanner.tsx: that file is `'use client'`, and every export of a
 * client module reaches a server component as a client reference rather than
 * its value — so the layout's build-time expiry check would compare against an
 * object and silently never render the banner.
 */

/** Hide the banner after this date, checked at build time and again in the browser. */
export const NOBEL_BANNER_EXPIRES = '2026-11-06';

/** The article the banner points at. */
export const NOBEL_ARTICLE_HREF = '/news/2026/10/06/francis-halzen-nobel-prize';
