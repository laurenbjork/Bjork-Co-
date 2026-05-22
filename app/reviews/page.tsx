import { Metadata } from 'next';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Breadcrumb from '@/app/components/Breadcrumb';
import { Star, Quote } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Customer Reviews | BJÖRK & CO.',
  description: 'Read what our customers say about their experience with BJÖRK & CO. jewelry and services.',
};

const reviews = [
  {
    id: '1',
    name: 'Sarah M.',
    location: 'New York, NY',
    rating: 5,
    date: 'December 2024',
    text: 'Absolutely stunning engagement ring! The craftsmanship is impeccable and the team made the entire experience unforgettable. From the initial consultation to the final delivery, every step was perfect.',
    product: 'Custom Engagement Ring',
  },
  {
    id: '2',
    name: 'James & Emily R.',
    location: 'Los Angeles, CA',
    rating: 5,
    date: 'November 2024',
    text: 'We had my grandmother\'s vintage ring completely redesigned and the result is breathtaking. They preserved the sentimental value while creating something modern and wearable. Truly masterful work.',
    product: 'Heirloom Revamp',
  },
  {
    id: '3',
    name: 'Michael T.',
    location: 'Chicago, IL',
    rating: 5,
    date: 'October 2024',
    text: 'The attention to detail is remarkable. I\'ve purchased several pieces over the years and each one exceeds expectations. Their commitment to quality and customer service is unmatched.',
    product: 'Collection Pieces',
  },
  {
    id: '4',
    name: 'Amanda K.',
    location: 'Miami, FL',
    rating: 5,
    date: 'September 2024',
    text: 'My wedding band is exactly what I dreamed of. The team listened to every detail and created a piece that perfectly complements my engagement ring. I receive compliments everywhere I go.',
    product: 'Custom Wedding Band',
  },
  {
    id: '5',
    name: 'David & Lisa P.',
    location: 'Seattle, WA',
    rating: 5,
    date: 'August 2024',
    text: 'For our 25th anniversary, we commissioned matching bands. The process was seamless and the rings are exquisite. BJÖRK & CO. made this milestone truly special.',
    product: 'Anniversary Bands',
  },
  {
    id: '6',
    name: 'Rachel G.',
    location: 'Boston, MA',
    rating: 5,
    date: 'July 2024',
    text: 'I was nervous about buying jewelry online, but their virtual consultation put me at ease. The necklace arrived beautifully packaged and even more stunning in person.',
    product: 'Diamond Pendant',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-[#013220] text-[#013220]' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-8">
          <Breadcrumb items={[{ label: 'Reviews', href: '/reviews' }]} />
        </div>

        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-[40px] md:text-[56px] text-black leading-[1.1] mb-4">
            Customer Reviews
          </h1>
          <p className="max-w-[600px] mx-auto text-[16px] text-gray-600 leading-relaxed">
            Discover why customers choose BJÖRK & CO. for their most precious moments
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-[900px] mx-auto">
          <div className="text-center p-6 border border-gray-200">
            <p className="font-serif text-[48px] text-[#013220] leading-none mb-2">5.0</p>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#013220] text-[#013220]" />
              ))}
            </div>
            <p className="text-[14px] text-gray-600">Average Rating</p>
          </div>
          <div className="text-center p-6 border border-gray-200">
            <p className="font-serif text-[48px] text-[#013220] leading-none mb-2">500+</p>
            <p className="text-[14px] text-gray-600 mb-2">Happy Customers</p>
            <p className="text-[12px] text-gray-400">And growing</p>
          </div>
          <div className="text-center p-6 border border-gray-200">
            <p className="font-serif text-[48px] text-[#013220] leading-none mb-2">98%</p>
            <p className="text-[14px] text-gray-600 mb-2">Recommend Us</p>
            <p className="text-[12px] text-gray-400">To friends & family</p>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-8 pb-24">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 p-8 bg-white hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <StarRating rating={review.rating} />
                <Quote className="w-8 h-8 text-[#013220]/20" />
              </div>
              
              <p className="text-[15px] text-gray-700 leading-relaxed mb-6">
                &ldquo;{review.text}&rdquo;
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="font-medium text-[14px] text-black">{review.name}</p>
                  <p className="text-[12px] text-gray-500">{review.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] text-[#013220] font-medium">{review.product}</p>
                  <p className="text-[11px] text-gray-400">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center pb-24">
          <p className="text-[14px] text-gray-600 mb-4">
            Have you worked with us? We&apos;d love to hear from you.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] hover:bg-black transition-colors"
          >
            Share Your Experience
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
