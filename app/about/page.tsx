import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Breadcrumb from '@/app/components/Breadcrumb';
import { aboutPage } from '@/app/data/pages';
import { Gem, Shield, Heart, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About BJÖRK & CO. | Heritage Jewelry Craftsmanship',
  description: 'Discover the heritage and craftsmanship behind BJÖRK & CO. Since 1985, creating timeless jewelry that becomes part of your legacy.',
};

const iconMap = {
  gem: Gem,
  shield: Shield,
  heart: Heart,
  award: Award,
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] bg-black">
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero.jpg"
            alt="BJÖRK & CO. craftsmanship"
            fill
            className="object-cover opacity-70"
            priority
          />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-[48px] md:text-[64px] lg:text-[72px] text-white leading-[1.1] mb-4">
            {aboutPage.hero.headline}
          </h1>
          <p className="max-w-[700px] text-[18px] md:text-[20px] text-white/90 leading-relaxed">
            {aboutPage.hero.subheadline}
          </p>
        </div>
      </section>

      {/* Breadcrumb & Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <Breadcrumb items={[{ label: 'About', href: '/about' }]} />
        </div>

        {/* Our Story */}
        <section className="py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-serif text-[36px] md:text-[48px] text-black leading-[1.2] mb-8">
                {aboutPage.story.title}
              </h2>
              <div className="space-y-6">
                {aboutPage.story.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-[16px] text-gray-600 leading-[1.8]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 relative aspect-[4/5] bg-gray-100">
              <Image
                src={aboutPage.story.image}
                alt="Our story"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-24 border-t border-gray-200">
          <h2 className="font-serif text-[32px] md:text-[40px] text-black text-center mb-16">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {aboutPage.values.map((value) => {
              const Icon = iconMap[value.icon as keyof typeof iconMap];
              return (
                <div key={value.title} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-[#013220]" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-medium text-[18px] text-black mb-3">
                    {value.title}
                  </h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Process */}
        <section className="py-16 lg:py-24 border-t border-gray-200">
          <h2 className="font-serif text-[32px] md:text-[40px] text-black text-center mb-16">
            {aboutPage.process.title}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutPage.process.steps.map((step) => (
              <div key={step.number} className="text-center">
                <span className="font-serif text-[48px] md:text-[64px] text-[#013220]/20 leading-none">
                  {step.number}
                </span>
                <h3 className="font-medium text-[20px] text-black mt-4 mb-3">
                  {step.title}
                </h3>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="bg-[#013220] py-20">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <h2 className="font-serif text-[32px] md:text-[40px] text-white mb-4">
            {aboutPage.cta.title}
          </h2>
          <p className="text-[18px] text-white/80 mb-8">
            {aboutPage.cta.description}
          </p>
          <Link
            href={aboutPage.cta.buttonHref}
            className="inline-block px-10 py-4 text-[13px] font-medium tracking-[0.1em] uppercase bg-white text-[#013220] hover:bg-gray-100 transition-colors"
          >
            {aboutPage.cta.buttonText}
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
