import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Breadcrumb from '@/app/components/Breadcrumb';
import { ringSizeGuide } from '@/app/data/pages';
import { Ruler, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ring Size Guide | BJÖRK & CO.',
  description: 'Find your perfect ring fit with our comprehensive ring size guide. Learn how to measure at home or book a professional sizing appointment.',
};

export default function RingSizeGuidePage() {
  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Header />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-8">
          <Breadcrumb items={[{ label: 'Ring Size Guide', href: '/ring-size-guide' }]} />
        </div>

        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-[40px] md:text-[56px] text-black leading-[1.1] mb-4">
            {ringSizeGuide.hero.title}
          </h1>
          <p className="max-w-[700px] mx-auto text-[16px] text-gray-600 leading-relaxed">
            {ringSizeGuide.hero.description}
          </p>
        </div>

        {/* Methods */}
        <section className="mb-20">
          <h2 className="font-serif text-[28px] text-black text-center mb-12">
            How to Measure
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {ringSizeGuide.methods.map((method, index) => (
              <div key={index} className="bg-gray-50 p-8">
                <div className="w-12 h-12 bg-[#013220]/10 rounded-full flex items-center justify-center mb-6">
                  <Ruler className="w-6 h-6 text-[#013220]" />
                </div>
                <h3 className="font-medium text-[20px] text-black mb-4">
                  {method.title}
                </h3>
                <ol className="space-y-3 mb-6">
                  {method.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex gap-3 text-[14px] text-gray-600">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#013220] text-white text-[12px] rounded-full flex items-center justify-center">
                        {stepIndex + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="text-[13px] text-[#013220] italic">
                  Tip: {method.tip}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Size Chart */}
        <section className="mb-20">
          <h2 className="font-serif text-[28px] text-black text-center mb-12">
            Ring Size Chart
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#013220] text-white">
                  <th className="px-6 py-4 text-left text-[14px] font-medium">US Size</th>
                  <th className="px-6 py-4 text-left text-[14px] font-medium">Circumference (mm)</th>
                  <th className="px-6 py-4 text-left text-[14px] font-medium">Diameter (mm)</th>
                </tr>
              </thead>
              <tbody>
                {ringSizeGuide.sizeChart.usSizes.map((size, index) => (
                  <tr key={size} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-3 text-[15px] font-medium text-black">{size}</td>
                    <td className="px-6 py-3 text-[15px] text-gray-600">
                      {ringSizeGuide.sizeChart.mmCircumference[index]}
                    </td>
                    <td className="px-6 py-3 text-[15px] text-gray-600">
                      {ringSizeGuide.sizeChart.mmDiameter[index]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tips */}
        <section className="mb-20 bg-gray-50 p-8 lg:p-12">
          <h2 className="font-serif text-[28px] text-black mb-8">
            Tips for Accurate Measurement
          </h2>
          <ul className="grid sm:grid-cols-2 gap-4">
            {ringSizeGuide.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#013220] flex-shrink-0 mt-0.5" />
                <span className="text-[15px] text-gray-600">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="text-center py-12 border-t border-gray-200">
          <h2 className="font-serif text-[28px] text-black mb-4">
            {ringSizeGuide.cta.title}
          </h2>
          <p className="text-[16px] text-gray-600 mb-8 max-w-[500px] mx-auto">
            {ringSizeGuide.cta.description}
          </p>
          <Link
            href={ringSizeGuide.cta.buttonHref}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#013220] text-white text-[13px] font-medium tracking-[0.1em] uppercase hover:bg-black transition-colors"
          >
            {ringSizeGuide.cta.buttonText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>

      <Footer />
    </main>
  );
}
