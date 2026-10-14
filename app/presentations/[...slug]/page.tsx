import type { Metadata } from 'next';
import {
  Presentation,
  filterPresentations,
  getPresentations,
  isoDate,
  openGraphDefaults,
  pageTitle,
  shareImages,
  summarize,
  twitterDefaults,
  type BackendPresentation,
} from '@chtc/web-components/content';
import { Box, Container, Typography } from '@mui/material';
import { OSG_SITE } from '@/site.config';

export async function generateStaticParams() {
  try {
    const presentations = filterPresentations(
      await getPresentations('CHTC', 'Presentations', 'main'),
      'osg'
    );

    return presentations.map((presentation) => ({
      slug: presentation.slug,
    }));
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function getPresentationBySlug(
  slug: string[]
): Promise<BackendPresentation | null> {
  try {
    const presentations = filterPresentations(
      await getPresentations('CHTC', 'Presentations', 'main'),
      'osg'
    );
    const matchedPresentation = presentations.find(
      (presentation) => presentation.slug.join('-') === slug.join('-')
    );

    if (!matchedPresentation) {
      return null;
    }

    return matchedPresentation;
  } catch (error) {
    console.error('Error finding presentation by slug:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const presentation = await getPresentationBySlug(slug);
  if (!presentation) return { title: 'Presentation Not Found — OSG Consortium' };

  const title = pageTitle(presentation.title, OSG_SITE);
  // Frontmatter rarely carries a description, so fall back to the facts the
  // listing itself shows: who gave the talk, and where.
  const attribution = [
    presentation.presenter && `Presented by ${presentation.presenter}`,
    presentation.event,
  ]
    .filter(Boolean)
    .join(' at ');
  const description = summarize(presentation.description) ?? (attribution || undefined);
  const images = shareImages(
    presentation.thumbnail?.src,
    presentation.thumbnail?.alt,
    OSG_SITE
  );

  return {
    title,
    description,
    authors: presentation.presenter
      ? [{ name: presentation.presenter }]
      : undefined,
    keywords: presentation.keywords,
    alternates: { canonical: `/presentations/${slug.join('/')}` },
    openGraph: {
      ...openGraphDefaults(OSG_SITE),
      type: 'article',
      title,
      description,
      url: `/presentations/${slug.join('/')}`,
      publishedTime: isoDate(presentation.date),
      authors: presentation.presenter ? [presentation.presenter] : undefined,
      images,
    },
    twitter: { ...twitterDefaults, title, description, images },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slug = (await params).slug;
  const presentation = await getPresentationBySlug(slug);

  if (!presentation) {
    return (
      <Container>
        <Box textAlign='center' pt={6}>
          <Typography variant='h3'>Presentation Not Found</Typography>
        </Box>
      </Container>
    );
  }

  return <Presentation {...presentation} />;
}
