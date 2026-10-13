import {
  filterArticles,
  getArticle,
  getArticles,
  sortArticles,
  type ArticleType,
  type BackendArticle,
} from '@chtc/web-components/content';
import type { Metadata } from 'next';
import {
  extractMarkdownImageUrls,
  recordRemoteImages,
} from '@/utils/remoteImages';
import {
  OG_SITE,
  TWITTER_SITE,
  firstParagraph,
  isoDate,
  pageTitle,
  shareImage,
  summarize,
} from '@/utils/metadata';

const ORGANIZATION = 'CHTC';
const REPOSITORY = 'Articles';
const BRANCH = 'main';

/**
 * The article types this site renders: news at `/news`, user stories at
 * `/spotlights`. The shared repository also carries `tech-blog` and feature
 * articles that never get a page here, and their images should not be
 * downloaded and re-encoded for an export that will not reference them.
 */
const PUBLISHED_TYPES: ArticleType[] = ['news', 'user'];

/**
 * Declare an article's art for the export image optimizer; see
 * remoteImages.ts. Covers the card image, the wide banner the home page
 * renders behind its hero story, and every image in the body — all of which
 * the list fetch already has in hand, so the detail pages need no separate
 * pass.
 */
function recordArticleImages(articles: BackendArticle[]): void {
  recordRemoteImages(
    articles.flatMap((article) => [
      article.image?.path,
      article.banner_src,
      ...extractMarkdownImageUrls(article.content, article.excerpt),
    ])
  );
}

/**
 * The OSG articles, newest first, optionally narrowed to one type.
 *
 * `getArticles` is memoized for the revalidate window, so the several pages
 * that call this during a build share one fetch of the repository.
 */
export async function getSiteArticles(
  type?: ArticleType
): Promise<BackendArticle[]> {
  const onOsg = filterArticles(
    await getArticles(ORGANIZATION, REPOSITORY, BRANCH),
    'osg'
  );

  recordArticleImages(
    onOsg.filter((article) => PUBLISHED_TYPES.includes(article.type))
  );

  return sortArticles(
    type ? onOsg.filter((article) => article.type === type) : onOsg
  );
}

/** One article by the slug its page was generated for. */
export async function getSiteArticle(
  slug: string[]
): Promise<BackendArticle> {
  return getArticle(
    ORGANIZATION,
    REPOSITORY,
    `${slug.join('-')}.md`,
    BRANCH
  );
}

/**
 * Metadata for one article's page.
 *
 * Draws on the frontmatter the repository already carries: the excerpt
 * becomes the description, the card image becomes the shared image, and
 * `canonical_url` becomes the canonical link. That field names wherever the
 * authoritative copy of the article lives — another site for anything
 * syndicated from the Morgridge newsroom or chtc.cs.wisc.edu, and this page
 * itself for the ones OSG published first.
 */
export function articleMetadata(
  article: BackendArticle,
  path: string
): Metadata {
  const title = pageTitle(article.title);
  const description =
    summarize(article.excerpt) ?? firstParagraph(article.content);
  const images = shareImage(article.image?.path, article.image?.alt);

  return {
    title,
    description,
    authors: article.author ? [{ name: article.author }] : undefined,
    keywords: article.tag,
    alternates: { canonical: article.canonical_url ?? path },
    openGraph: {
      ...OG_SITE,
      type: 'article',
      title,
      description,
      // The page's own address, even when the canonical points off-site: a
      // share of this URL should resolve to the page that was shared.
      url: path,
      publishedTime: isoDate(article.date),
      authors: article.author ? [article.author] : undefined,
      images,
    },
    twitter: { ...TWITTER_SITE, title, description, images },
  };
}
