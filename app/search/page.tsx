import { Suspense } from 'react';
import { Metadata } from 'next';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Breadcrumb from '@/app/components/Breadcrumb';
import SearchResults from '@/app/components/SearchResults';

export const metadata: Metadata = {
  title: 'Search | BJÖRK & CO.',
  description: 'Search for fine jewelry, engagement rings, and custom designs.',
};

export default function SearchPage() {
  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-8">
          <Breadcrumb items={[{ label: 'Search', href: '/search' }]} />
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-[32px] text-black">Search Products</h1>
          <p className="text-gray-600 text-[14px] mt-2">
            Find the perfect piece from our collection
          </p>
        </div>

        {/* Search Results */}
        <Suspense fallback={
          <div className="py-12 text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        }>
          <SearchResults />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}
