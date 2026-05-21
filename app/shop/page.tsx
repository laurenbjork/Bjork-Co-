import { Metadata } from 'next';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import Breadcrumb from '@/app/components/Breadcrumb';
import CollectionHeader from '@/app/components/CollectionHeader';
import FilterBar from '@/app/components/FilterBar';
import ProductGrid from '@/app/components/ProductGrid';
import { getAllProducts } from '@/app/lib/supabase-queries';

export const metadata: Metadata = {
  title: 'Shop All | BJÖRK & CO.',
  description: 'Explore our complete collection of fine jewelry, engagement rings, necklaces, bracelets, and custom designs.',
};

export default async function ShopPage() {
  const products = await getAllProducts();
  
  // Debug logging
  console.log('Shop page products:', products.length, products);

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Shop' }]} />
          <CollectionHeader
            title="Shop All"
            description="Discover our curated collection of fine jewelry, crafted with exceptional attention to detail and timeless elegance."
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
