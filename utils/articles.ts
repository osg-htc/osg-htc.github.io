import {
  filterArticles,
  getArticle,
  getArticles,
  sortArticles,
  type ArticleType,
  type BackendArticle,
} from '@chtc/web-components/content';
import {
  extractMarkdownImageUrls,
  recordRemoteImages,
} from '@/utils/remoteImages';

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
 * remoteImages.ts. Covers the card image and every image in the body, which
 * the list fetch already has in hand — the detail pages need no separate pass.
 */
function recordArticleImages(articles: BackendArticle[]): void {
  recordRemoteImages(
    articles.flatMap((article) => [
      article.image?.path,
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
