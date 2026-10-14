import type { Metadata } from 'next';
import ExportedImage from 'next-image-export-optimizer';
import { Article, articleMetadata } from '@chtc/web-components/content';
import { getSiteArticle, getSiteArticles } from '@/utils/articles';
import { OSG_SITE } from '@/site.config';

export async function generateStaticParams() {
  const articles = await getSiteArticles('user');
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const article = await getSiteArticle(slug);
  return articleMetadata(article, {
    path: `/spotlights/${slug.join('/')}`,
    site: OSG_SITE,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slug = (await params).slug;
  const article = await getSiteArticle(slug);

  return <Article article={article} imageComponent={ExportedImage} />;
}
