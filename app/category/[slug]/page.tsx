import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import Breadcrumb from '@/app/components/Breadcrumb';
import ProductGrid from '@/app/components/ProductGrid';
import { getCategoryBySlug, getProductsByCategory } from '@/app/lib/supabase-queries';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category | BJÖRK & CO.',
    };
  }

  return {
    title: `${category.name} | BJÖRK & CO.`,
    description: category.description || `Shop ${category.name} at BJÖRK & CO.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).replace(/ /g, '-');
  const category = await getCategoryBySlug(decodedSlug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(decodedSlug);

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Shop', href: '/shop' },
              { label: category.name },
            ]}
          />

          <div className="py-8 sm:py-12">
            <h1 className="font-serif text-[32px] sm:text-[40px] text-[#013220] mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-600 text-[16px] mb-8 max-w-2xl">
                {category.description}
              </p>
            )}

            {products.length === 0 ? (
              <p className="text-gray-400 text-[14px]">No products in this category yet.</p>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
