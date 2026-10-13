import ExportedImage from 'next-image-export-optimizer';
import { Article } from '@chtc/web-components/content';
import { getSiteArticle, getSiteArticles } from '@/utils/articles';

export async function generateStaticParams() {
  const articles = await getSiteArticles('user');
  return articles.map((article) => ({ slug: article.slug }));
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
