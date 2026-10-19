import * as React from 'react';
import { PelicanClientProvider } from '@pelicanplatform/components';

import { getDataRepository, pelicanObjectUrl } from '@/utils/dataRepositories';
import { filterValidNamespaces } from '@/utils/validNamespaces';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function RepositoryLayout({
  children,
  params,
}: LayoutProps) {
  const { id } = await params;
  const repository = await getDataRepository(id);

  const validNamespaces = await filterValidNamespaces(repository?.namespace ?? []);
  const initialNamespace = validNamespaces[0] ?? '';
  const initialObjectUrl = initialNamespace
    ? pelicanObjectUrl(initialNamespace)
    : '';

  return (
    <PelicanClientProvider initialObjectUrl={initialObjectUrl} enableAuth={false}>
      {children}
    </PelicanClientProvider>
  );
}
