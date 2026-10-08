import {
  Article,
  filterArticles,
  getArticle,
  getArticles,
} from '@chtc/web-components/content';

export async function generateStaticParams() {
  const articles = await getArticles('CHTC', 'Articles', 'main');
  return filterArticles(articles, 'osg', 'user').map((article) => ({
    slug: article.slug,
  }));
}

async function getMarkdownFile(slug: string[]) {
  return getArticle('CHTC', 'Articles', slug.join('-') + '.md', 'main');
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slug = (await params).slug;
  const markdownData = await getMarkdownFile(slug);

  return <Article article={markdownData} />;
}
