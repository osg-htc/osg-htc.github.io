// Computes the dynamic legacy → new redirects for the content collections
// (articles + events) from the live GitHub sources. This imports the app's
// TypeScript data utilities, so it only runs under a TS loader (tsx): it is
// used by generate-redirects.mjs (postbuild) and, opportunistically, by
// compare-migration.mjs.

import { getArticles } from '@chtc/web-components/content';
import { getSiteEvents } from '../utils/events';

/** @typedef {{ source: string, destination: string, text?: string }} Redirect */

/**
 * Legacy article URLs → their new paths. In the old site every shared article
 * (news and user story alike) was published by the `spotlights` collection at
 * `/spotlights/:title.html`; now news lives at `/news/<y>/<m>/<d>/<name>` and
 * user stories at `/spotlights/<y>/<m>/<d>/<name>`.
 *
 * The `.html` suffix matters. The site is served by GitHub Pages, where a
 * request for `/spotlights/x.html` resolves to that literal file and nothing
 * else — a stub written to `/spotlights/x/index.html` does not rescue it. Since
 * `.html` is the form in the old sitemap, in search results and in anyone's
 * bookmarks, it is the one that has to be emitted. The extension-less form is
 * emitted too: Pages served it via its own `.html` fallback, so it is also a
 * URL people may hold.
 * @returns {Promise<Redirect[]>}
 */
export async function articleRedirects() {
  const articles = await getArticles('CHTC', 'Articles', 'main');
  return articles
    .filter(
      (article) =>
        Array.isArray(article.publish_on) && article.publish_on.includes('osg')
    )
    .flatMap((article) => {
      const pageName = article.slug[3] ?? article.slug.slice(3).join('-');
      const base = article.type === 'news' ? '/news' : '/spotlights';
      // The trailing slash is required, not cosmetic. `trailingSlash: true`
      // puts every page at `<path>/index.html`, and once a stub exists at
      // `<path>.html` GitHub Pages prefers that file over the directory index
      // for a slash-less request — so a stub pointing at `<path>` would serve
      // itself and refresh forever. `<path>/` can only mean the real page.
      const destination = `${base}/${article.slug.join('/')}/`;

      const sources = [`/spotlights/${pageName}.html`, `/spotlights/${pageName}`];
      // Posts migrated out of the old local `_news` collection keep their
      // dated URL, which Jekyll published as `/news/:y/:m/:d/:title.html`.
      if (article.type === 'news') {
        sources.push(`${base}/${article.slug.join('/')}.html`);
      }

      return sources.map((source) => ({
        source,
        destination,
        text: article.title,
      }));
    });
}

/**
 * Legacy date-less event URLs (`/events/<page-name>`) → their new dated path
 * (`/events/<y>/<m>/<d>/<name>`). getSiteEvents already filters to
 * OSG-published.
 * @returns {Promise<Redirect[]>}
 */
export async function eventRedirects() {
  const events = await getSiteEvents();
  return events.map((event) => {
    const pageName = event.slug[3] ?? event.slug.slice(3).join('-');
    return {
      source: `/events/${pageName}`,
      // Trailing slash for the same reason as the article destinations above.
      destination: `/events/${event.slug.join('/')}/`,
      text: event.title,
    };
  });
}
