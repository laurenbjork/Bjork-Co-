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

        {/* Two-Panel Contact Card */}
        <div className="max-w-[900px] mx-auto pb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left Panel - Contact Info (Dark) */}
              <div className="bg-[#013220] text-white p-6 md:p-8">
                <h2 className="font-serif text-[24px] mb-6">Contact Us</h2>
                
                <div className="space-y-5">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[15px] mb-1">Showroom</h3>
                      <p className="text-[14px] text-white/80">
                        {contactPage.info.address.street}<br />
                        {contactPage.info.address.city}
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[15px] mb-1">Hours</h3>
                      <div className="text-[14px] text-white/80 space-y-1">
                        {contactPage.info.hours.map((hour) => (
                          <div key={hour.day} className="flex justify-between gap-6">
                            <span>{hour.day}</span>
                            <span>{hour.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[15px] mb-1">Phone</h3>
                      <a
                        href={`tel:${contactPage.info.phone.replace(/\D/g, '')}`}
                        className="text-[14px] text-white/80 hover:text-white transition-colors"
                      >
                        {contactPage.info.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[15px] mb-1">Email</h3>
                      <a
                        href={`mailto:${contactPage.info.email}`}
                        className="text-[14px] text-white/80 hover:text-white transition-colors"
                      >
                        {contactPage.info.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Contact Form (White) */}
              <div className="p-6 md:p-8 bg-white">
                <h2 className="font-serif text-[24px] text-black mb-1">Get in Touch</h2>
                <p className="text-[13px] text-gray-500 mb-4">Feel free to drop us a line below!</p>
                <ContactForm />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="text-center pt-12">
            <h3 className="font-medium text-[16px] text-black mb-4">Follow Us</h3>
            <div className="flex justify-center gap-4">
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

      <Footer />
    </main>
  );
}
