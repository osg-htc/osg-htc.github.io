// Computes the dynamic legacy → new redirects for the content collections
// (articles + events) from the live GitHub sources. This imports the app's
// TypeScript data utilities, so it only runs under a TS loader (tsx): it is
// used by generate-redirects.mjs (postbuild) and, opportunistically, by
// compare-migration.mjs.

// @chtc/web-components ships ESM from a package without `"type": "module"`,
// so Node reads the `content` entry as CommonJS and can't see through its
// re-exports to the named bindings. The default import is the module object.
import content from '@chtc/web-components/content';
import { getEvents } from '../utils/events';

const { getArticles } = content;

/** @typedef {{ source: string, destination: string, text?: string }} Redirect */

/**
 * Legacy date-less article URLs → their new paths. In the old site every
 * article (news and user story) was published at `/spotlights/<page-name>`;
 * now news lives at `/news/<y>/<m>/<d>/<name>` and user stories at
 * `/spotlights/<y>/<m>/<d>/<name>`.
 * @returns {Promise<Redirect[]>}
 */
export async function articleRedirects() {
  const articles = await getArticles('CHTC', 'Articles', 'main');
  return articles
    .filter(
      (article) =>
        Array.isArray(article.publish_on) && article.publish_on.includes('osg')
    )
    .map((article) => {
      const pageName = article.slug[3] ?? article.slug.slice(3).join('-');
      const base = article.type === 'news' ? '/news' : '/spotlights';
      return {
        source: `/spotlights/${pageName}`,
        destination: `${base}/${article.slug.join('/')}`,
        text: article.title,
      };
    });
}

/**
 * Legacy date-less event URLs (`/events/<page-name>`) → their new dated path
 * (`/events/<y>/<m>/<d>/<name>`). getEvents already filters to OSG-published.
 * @returns {Promise<Redirect[]>}
 */
export async function eventRedirects() {
  const events = await getEvents('CHTC', 'events', 'main');
  return events.map((event) => {
    const pageName = event.slug[3] ?? event.slug.slice(3).join('-');
    return {
      source: `/events/${pageName}`,
      destination: `/events/${event.slug.join('/')}`,
      text: event.title,
    };
  });
}
