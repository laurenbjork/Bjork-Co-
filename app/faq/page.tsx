import { Suspense } from 'react';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Breadcrumb from '@/app/components/Breadcrumb';
import FAQContent from '@/app/components/FAQContent';

interface FAQCategory {
  id: string;
  name: string;
  faqs: FAQItem[];
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

async function getFAQs(): Promise<FAQCategory[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/faqs`, {
      next: { revalidate: 60 }
    });
    if (!response.ok) throw new Error('Failed to fetch FAQs');
    return await response.json();
  } catch (error) {
    console.error('Error loading FAQs:', error);
    return [];
  }
}

// FAQ Server Component
export default async function FAQPage() {
  const categories = await getFAQs();

  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Header />

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-8">
          <Breadcrumb items={[{ label: 'FAQ', href: '/faq' }]} />
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-[40px] md:text-[56px] text-black leading-[1.1] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="max-w-[600px] mx-auto text-[16px] text-gray-600 leading-relaxed">
            Find answers to common questions about our products, services, and policies.
          </p>
        </div>

        {/* FAQ Content */}
        <Suspense fallback={
          <div className="text-center py-12">
            <p className="text-gray-500">Loading FAQs...</p>
          </div>
        }>
          <FAQContent categories={categories} />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}
