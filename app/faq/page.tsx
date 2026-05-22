'use client';
import { useState, useEffect } from 'react';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Breadcrumb from '@/app/components/Breadcrumb';
import FAQAccordion from '@/app/components/FAQAccordion';

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

export default function FAQPage() {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const response = await fetch('/api/faqs');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading FAQs...</p>
          </div>
        ) : (
          /* FAQ Categories */
          <div className="space-y-16 pb-24">
            {categories.map((category) => (
              <section key={category.id}>
                <h2 className="font-serif text-[28px] text-black mb-8 pb-4 border-b border-gray-200">
                  {category.name}
                </h2>
                <FAQAccordion items={category.faqs} />
              </section>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
