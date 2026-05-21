import { Metadata } from 'next';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Breadcrumb from '@/app/components/Breadcrumb';
import ContactForm from '@/app/components/ContactForm';
import { contactPage } from '@/app/data/pages';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact BJÖRK & CO. | Get in Touch',
  description: 'Have a question about our jewelry or want to schedule a consultation? Contact BJÖRK & CO. via email, phone, or visit our showroom.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-8">
          <Breadcrumb items={[{ label: 'Contact', href: '/contact' }]} />
        </div>

        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-[40px] md:text-[56px] text-black leading-[1.1] mb-4">
            {contactPage.hero.title}
          </h1>
          <p className="max-w-[600px] mx-auto text-[16px] text-gray-600 leading-relaxed">
            {contactPage.hero.description}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 pb-24">
          {/* Left Column - Form */}
          <div>
            <h2 className="font-serif text-[28px] text-black mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-10">
            {/* Address */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#013220]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#013220]" />
              </div>
              <div>
                <h3 className="font-medium text-[16px] text-black mb-1">Showroom</h3>
                <p className="text-[15px] text-gray-600">
                  {contactPage.info.address.street}<br />
                  {contactPage.info.address.city}
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#013220]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#013220]" />
              </div>
              <div>
                <h3 className="font-medium text-[16px] text-black mb-1">Hours</h3>
                <div className="text-[15px] text-gray-600 space-y-1">
                  {contactPage.info.hours.map((hour) => (
                    <div key={hour.day} className="flex justify-between gap-8">
                      <span>{hour.day}</span>
                      <span>{hour.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#013220]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#013220]" />
              </div>
              <div>
                <h3 className="font-medium text-[16px] text-black mb-1">Phone</h3>
                <a
                  href={`tel:${contactPage.info.phone.replace(/\D/g, '')}`}
                  className="text-[15px] text-gray-600 hover:text-[#013220] transition-colors"
                >
                  {contactPage.info.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#013220]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#013220]" />
              </div>
              <div>
                <h3 className="font-medium text-[16px] text-black mb-1">Email</h3>
                <a
                  href={`mailto:${contactPage.info.email}`}
                  className="text-[15px] text-gray-600 hover:text-[#013220] transition-colors"
                >
                  {contactPage.info.email}
                </a>
              </div>
            </div>

            {/* Social */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-medium text-[16px] text-black mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href={`https://instagram.com/${contactPage.social.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-[#013220] hover:text-[#013220] transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a
                  href={`https://facebook.com/${contactPage.social.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:border-[#013220] hover:text-[#013220] transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="h-[400px] bg-gray-100 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-[#013220]/30 mx-auto mb-4" />
            <p className="text-gray-500 text-[14px]">Map integration placeholder</p>
            <p className="text-gray-400 text-[12px] mt-1">123 Jewelry District Avenue, New York, NY 10001</p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
