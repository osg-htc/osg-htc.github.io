import type { Metadata } from 'next';
import ProjectDetail from '@/components/services/ProjectDetail';
import {
  getProjectsForRangeCached,
  getTopologyProjectsCached,
} from '@/utils/adstash';
import { slugify } from '@/utils/slug';

// Pre-render one fully static page per project (static export, no on-demand
// rendering). The route segment is a URL-safe slug; the real name is recovered
// from the list at build time.
export async function generateStaticParams() {
  const projects = await getProjectsForRangeCached();
  const slugs = new Set<string>();
  for (const p of projects) {
    if (p.projectName) slugs.add(slugify(p.projectName));
  }
  return [...slugs].map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const slug = (await params).name;
  const [list, topology] = await Promise.all([
    getProjectsForRangeCached(),
    getTopologyProjectsCached(),
  ]);
  const project = list.find((p) => slugify(p.projectName) === slug);
  if (!project) return { title: 'Project — OSG Consortium' };
  const meta = topology[project.projectName];
  return {
    alternates: { canonical: `/projects/${slug}` },
    title: `${project.projectName} — OSPool Project | OSG Consortium`,
    description:
      meta?.Description ??
      `OSPool usage statistics for the ${project.projectName} project on the OSG Open Science Pool.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  return <ProjectDetail slug={name} />;
}
