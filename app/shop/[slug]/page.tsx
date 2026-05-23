import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import Breadcrumb from '@/app/components/Breadcrumb';
import CollectionHeader from '@/app/components/CollectionHeader';
import FilterBar from '@/app/components/FilterBar';
import ProductGrid from '@/app/components/ProductGrid';
import {
  getProductsByCollection,
  getProductsByCategory,
  getCollectionBySlug,
  getCategoryBySlug,
} from '@/app/lib/supabase-queries';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  const category = collection ? null : await getCategoryBySlug(slug);
  const name = collection?.name || category?.name || slug;
  return {
    title: `${name} | BJÖRK & CO.`,
  };
}

export default async function ShopSlugPage({ params }: Props) {
  const { slug } = await params;

  const collection = await getCollectionBySlug(slug);
  const category = collection ? null : await getCategoryBySlug(slug);

  if (!collection && !category) {
    notFound();
  }

  const products = collection
    ? await getProductsByCollection(slug)
    : await getProductsByCategory(slug);

  const title = collection?.name || category?.name || slug;
  const description = collection?.description || category?.description || '';

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Shop', href: '/shop' },
              { label: title },
            ]}
          />
          <CollectionHeader
            title={title}
            description={description}
            productCount={products.length}
          />
          <FilterBar />
          <ProductGrid products={products} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
