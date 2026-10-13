import type { Metadata } from 'next';
import InstitutionDetail from '@/components/services/InstitutionDetail';
import { getInstitutionsForRangeCached } from '@/utils/adstash';
import { slugify } from '@/utils/slug';

// Pre-render one fully static page per OSPool institution. The route segment
// is a URL-safe slug; the real name is recovered from the list at build time.
export async function generateStaticParams() {
  const institutions = await getInstitutionsForRangeCached();
  const slugs = new Set<string>();
  for (const i of institutions) {
    if (i.institutionName) slugs.add(slugify(i.institutionName));
  }
  return [...slugs].map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const slug = (await params).name;
  const list = await getInstitutionsForRangeCached();
  const institution = list.find((i) => slugify(i.institutionName) === slug);
  if (!institution) return { title: 'Institution — OSG Consortium' };
  return {
    alternates: { canonical: `/institutions/${slug}` },
    title: `${institution.institutionName} — OSPool Institution | OSG Consortium`,
    description: `Open Science Pool computing resources contributed by ${institution.institutionName}, and the research projects and fields of science they support.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  return <InstitutionDetail slug={name} />;
}
