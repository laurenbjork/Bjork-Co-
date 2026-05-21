import { Metadata } from 'next';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Breadcrumb from '@/app/components/Breadcrumb';
import { privacyPolicy } from '@/app/data/pages';

export const metadata: Metadata = {
  title: 'Privacy Policy | BJÖRK & CO.',
  description: 'Learn how BJÖRK & CO. collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Header />

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-8">
          <Breadcrumb items={[{ label: 'Privacy Policy', href: '/privacy-policy' }]} />
        </div>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-serif text-[40px] md:text-[56px] text-black leading-[1.1] mb-4">
            Privacy Policy
          </h1>
          <p className="text-[14px] text-gray-500">
            Last Updated: {privacyPolicy.lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 pb-24">
          {privacyPolicy.sections.map((section, index) => (
            <section key={index}>
              <h2 className="font-serif text-[24px] text-black mb-4">
                {section.title}
              </h2>
              <div className="text-[15px] text-gray-600 leading-[1.8] whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
