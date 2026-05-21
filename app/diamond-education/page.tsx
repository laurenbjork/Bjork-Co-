import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Breadcrumb from '@/app/components/Breadcrumb';
import { diamondEducation } from '@/app/data/pages';
import { Sparkles, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Diamond Education | BJÖRK & CO.',
  description: 'Learn about the 4Cs of diamonds—cut, color, clarity, and carat—and make an informed decision when purchasing your perfect stone.',
};

export default function DiamondEducationPage() {
  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Header />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-8">
          <Breadcrumb items={[{ label: 'Diamond Education', href: '/diamond-education' }]} />
        </div>

        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-[40px] md:text-[56px] text-black leading-[1.1] mb-4">
            {diamondEducation.hero.title}
          </h1>
          <p className="max-w-[700px] mx-auto text-[16px] text-gray-600 leading-relaxed">
            {diamondEducation.hero.description}
          </p>
        </div>

        {/* The 4Cs */}
        <section className="mb-20">
          <h2 className="font-serif text-[32px] md:text-[40px] text-black text-center mb-12">
            The 4Cs of Diamonds
          </h2>
          <div className="space-y-12">
            {diamondEducation.theFourCs.map((c, index) => (
              <div
                key={c.title}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="w-16 h-16 bg-[#013220]/10 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-[#013220]" />
                  </div>
                  <h3 className="font-serif text-[28px] text-black mb-2">
                    {c.title}
                  </h3>
                  <p className="text-[14px] text-[#013220] font-medium mb-4 uppercase tracking-wider">
                    {c.shortDesc}
                  </p>
                  <div className="text-[15px] text-gray-600 leading-[1.8] whitespace-pre-line">
                    {c.fullDesc}
                  </div>
                  <p className="mt-4 text-[14px] text-[#013220] italic">
                    Tip: {c.tip}
                  </p>
                </div>
                <div className={`bg-gray-100 aspect-square ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  {/* Placeholder for diamond imagery */}
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-[14px]">{c.title} Diamond</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Diamond Shapes */}
        <section className="mb-20 bg-gray-50 p-8 lg:p-12">
          <h2 className="font-serif text-[28px] text-black mb-8 text-center">
            Diamond Shapes
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {diamondEducation.shapes.map((shape) => (
              <div key={shape.name} className="bg-white p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#013220]/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#013220]" />
                </div>
                <h3 className="font-medium text-[18px] text-black mb-2">
                  {shape.name}
                </h3>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  {shape.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Buying Tips */}
        <section className="mb-20">
          <h2 className="font-serif text-[28px] text-black mb-8 text-center">
            Diamond Buying Tips
          </h2>
          <ul className="grid sm:grid-cols-2 gap-4">
            {diamondEducation.buyingTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#013220] text-white text-[12px] rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-[15px] text-gray-600">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Care Tips */}
        <section className="mb-20 bg-[#013220] p-8 lg:p-12">
          <h2 className="font-serif text-[28px] text-white mb-8 text-center">
            Caring for Your Diamond
          </h2>
          <ul className="grid sm:grid-cols-2 gap-4 max-w-[800px] mx-auto">
            {diamondEducation.careTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3 text-white/90">
                <span className="text-white">✓</span>
                <span className="text-[15px]">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="text-center py-12 border-t border-gray-200 mb-16">
          <h2 className="font-serif text-[28px] text-black mb-4">
            {diamondEducation.cta.title}
          </h2>
          <p className="text-[16px] text-gray-600 mb-8 max-w-[500px] mx-auto">
            {diamondEducation.cta.description}
          </p>
          <Link
            href={diamondEducation.cta.buttonHref}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#013220] text-white text-[13px] font-medium tracking-[0.1em] uppercase hover:bg-black transition-colors"
          >
            {diamondEducation.cta.buttonText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>

      <Footer />
    </main>
  );
}
