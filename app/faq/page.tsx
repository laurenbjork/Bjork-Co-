import { Metadata } from 'next';
import { useState } from 'react';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Breadcrumb from '@/app/components/Breadcrumb';
import FAQAccordion from '@/app/components/FAQAccordion';
import { faqItems, faqCategories } from '@/app/data/faq';

export const metadata: Metadata = {
  title: 'FAQ | BJÖRK & CO.',
  description: 'Find answers to frequently asked questions about orders, shipping, returns, jewelry care, and more.',
};

export default function FAQPage() {
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

        {/* FAQ Categories */}
        <div className="space-y-16 pb-24">
          {faqCategories.map((category) => {
            const categoryFAQs = faqItems.filter((item) => item.category === category);
            if (categoryFAQs.length === 0) return null;

            return (
              <section key={category}>
                <h2 className="font-serif text-[28px] text-black mb-8 pb-4 border-b border-gray-200">
                  {category}
                </h2>
                <FAQAccordion items={categoryFAQs} />
              </section>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}
