import type { Metadata } from 'next';
import ExportedImage from 'next-image-export-optimizer';
import { Article } from '@chtc/web-components/content';
import {
  articleMetadata,
  getSiteArticle,
  getSiteArticles,
} from '@/utils/articles';

export async function generateStaticParams() {
  const articles = await getSiteArticles('news');
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const article = await getSiteArticle(slug);
  return articleMetadata(article, `/news/${slug.join('/')}`);
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
