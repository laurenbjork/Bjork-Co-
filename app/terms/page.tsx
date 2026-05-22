import { Metadata } from 'next';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Breadcrumb from '@/app/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Terms of Service | BJÖRK & CO.',
  description: 'Terms of Service for BJÖRK & CO. jewelry website and services.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Header />

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-8">
          <Breadcrumb items={[{ label: 'Terms of Service', href: '/terms' }]} />
        </div>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-serif text-[40px] md:text-[48px] text-black leading-[1.1] mb-4">
            Terms of Service
          </h1>
          <p className="text-[14px] text-gray-500">
            Last Updated: December 1, 2024
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none pb-24">
          <section className="mb-10">
            <h2 className="font-serif text-[24px] text-black mb-4">1. Introduction</h2>
            <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
              Welcome to BJÖRK & CO. (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of our website, products, and services. By accessing or using our website at bjorkco.com, you agree to be bound by these Terms.
            </p>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              Please read these Terms carefully before making a purchase or using our services. If you do not agree to these Terms, please do not use our website or services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-[24px] text-black mb-4">2. Use of Our Website</h2>
            <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
              You must be at least 18 years old to use our website and make purchases. By using our website, you represent that you are of legal age to form a binding contract.
            </p>
            <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
              You agree to use our website only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[15px] text-gray-700">
              <li>Use our website in any way that violates applicable laws or regulations</li>
              <li>Attempt to interfere with the proper functioning of our website</li>
              <li>Engage in any fraudulent or deceptive practices</li>
              <li>Collect or harvest personal information from other users</li>
              <li>Transmit any viruses, malware, or other harmful code</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-[24px] text-black mb-4">3. Products and Services</h2>
            <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
              All products displayed on our website are subject to availability. We reserve the right to discontinue any product at any time. Prices for products are subject to change without notice.
            </p>
            <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
              We make every effort to display product colors and images accurately. However, we cannot guarantee that your computer monitor&apos;s display of any color will be accurate.
            </p>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              Custom and bespoke jewelry orders are subject to separate agreements and deposit requirements. All custom orders require a 50% deposit to begin production.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-[24px] text-black mb-4">4. Pricing and Payment</h2>
            <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
              All prices are in US dollars and are subject to change without notice. Payment must be made in full before shipping, except for custom orders which follow our deposit and payment schedule.
            </p>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              We accept major credit cards, wire transfers, and certified checks. For purchases over $2,000, we offer flexible payment plans with approved credit.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-[24px] text-black mb-4">5. Shipping and Delivery</h2>
            <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
              We ship via insured FedEx Priority Overnight with signature required. Domestic orders typically arrive within 1-2 business days after shipping. International orders take 3-5 business days.
            </p>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              Risk of loss and title for items purchased pass to you upon delivery to the carrier. You are responsible for filing any claims with carriers for damaged and/or lost shipments.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-[24px] text-black mb-4">6. Returns and Exchanges</h2>
            <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
              Ready-to-ship items may be returned within 14 days of delivery for a full refund or exchange. Items must be in original, unworn condition with all packaging and documentation.
            </p>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              Custom and personalized pieces are final sale and non-refundable. Please contact us within 14 days if you have any concerns about your custom order.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-[24px] text-black mb-4">7. Intellectual Property</h2>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              All content on our website, including text, graphics, logos, images, and software, is the property of BJÖRK & CO. or our content suppliers and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-[24px] text-black mb-4">8. Limitation of Liability</h2>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              To the fullest extent permitted by law, BJÖRK & CO. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our website or products.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-[24px] text-black mb-4">9. Governing Law</h2>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. You agree to submit to the personal jurisdiction of the courts located in New York County, New York.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-[24px] text-black mb-4">10. Changes to Terms</h2>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of our website following any changes constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-[24px] text-black mb-4">11. Contact Information</h2>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 text-[15px] text-gray-700">
              <p className="font-medium">BJÖRK & CO.</p>
              <p>123 Jewelry District Avenue</p>
              <p>New York, NY 10001</p>
              <p>Email: hello@bjorkco.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
