import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Breadcrumb from '@/app/components/Breadcrumb';
import { customLanding } from '@/app/data/pages';
import { ArrowRight, Sparkles, Clock, Gem } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Custom Jewelry Design & Heirloom Revamps | BJÖRK & CO.',
  description: 'Create something unique with BJÖRK & CO. Custom jewelry design, heirloom revamps, and personalized showroom appointments.',
};

export default function CustomLandingPage() {
  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Header />

      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-[450px] bg-black">
        <div className="absolute inset-0">
          <Image
            src="/images/custom-hero.jpg"
            alt="Custom jewelry design"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-[42px] md:text-[56px] lg:text-[64px] text-white leading-[1.1] mb-4">
            {customLanding.hero.title}
          </h1>
          <p className="max-w-[650px] text-[18px] text-white/90 leading-relaxed mb-8">
            {customLanding.hero.description}
          </p>
          <Link
            href="/custom/showroom-appointments"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#013220] text-[13px] font-medium tracking-[0.1em] uppercase hover:bg-gray-100 transition-colors"
          >
            Book a Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <Breadcrumb items={[{ label: 'Custom', href: '/custom' }]} />
        </div>

        {/* Services Grid */}
        <section className="py-16 lg:py-24">
          <h2 className="font-serif text-[32px] md:text-[40px] text-black text-center mb-16">
            Our Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {customLanding.services.map((service) => (
              <div
                key={service.title}
                className="group bg-white border border-gray-200 hover:border-[#013220] transition-colors"
              >
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-[24px] text-black mb-3">
                    {service.title}
                  </h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    className="inline-flex items-center text-[13px] font-medium tracking-[0.05em] text-[#013220] hover:text-black transition-colors"
                  >
                    {service.cta}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 lg:py-24 border-t border-gray-200">
          <h2 className="font-serif text-[32px] md:text-[40px] text-black text-center mb-16">
            {customLanding.process.title}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {customLanding.process.steps.map((step, index) => {
              const icons = [Sparkles, Clock, Gem, ArrowRight];
              const Icon = icons[index];
              return (
                <div key={step.number} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-[#013220]/10 rounded-full flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[#013220]" />
                  </div>
                  <span className="text-[13px] font-medium tracking-[0.1em] text-[#013220] uppercase">
                    Step {step.number}
                  </span>
                  <h3 className="font-medium text-[20px] text-black mt-2 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Gallery Teaser */}
        <section className="py-16 lg:py-24 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="font-serif text-[32px] md:text-[40px] text-black mb-2">
                {customLanding.galleryTeaser.title}
              </h2>
              <p className="text-[16px] text-gray-600">
                {customLanding.galleryTeaser.description}
              </p>
            </div>
            <Link
              href={customLanding.galleryTeaser.href}
              className="mt-4 md:mt-0 inline-flex items-center text-[13px] font-medium tracking-[0.05em] text-[#013220] hover:text-black transition-colors"
            >
              {customLanding.galleryTeaser.cta}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {customLanding.galleryTeaser.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square bg-gray-100 overflow-hidden group cursor-pointer"
              >
                <Image
                  src={image}
                  alt={`Custom piece ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 16vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="bg-[#013220] py-20">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <h2 className="font-serif text-[32px] md:text-[40px] text-white mb-4">
            Ready to Create Something Unique?
          </h2>
          <p className="text-[18px] text-white/80 mb-8">
            Schedule a consultation with our design team to begin your custom journey.
          </p>
          <Link
            href="/custom/showroom-appointments"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#013220] text-[13px] font-medium tracking-[0.1em] uppercase hover:bg-gray-100 transition-colors"
          >
            Book Your Appointment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
