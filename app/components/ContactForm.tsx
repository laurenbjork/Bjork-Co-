'use client';

import { useState } from 'react';
import { cn } from '@/app/lib/utils';

interface ContactFormProps {
  onSubmit?: (data: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: 'General',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock submission - will be replaced with real API call in Phase 5
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (onSubmit) {
      onSubmit(formData);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#013220]/5 border border-[#013220]/20 p-8 text-center">
        <div className="w-12 h-12 bg-[#013220] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-[24px] text-black mb-2">Thank You</h3>
        <p className="text-gray-600">
          Your message has been received. We will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-[13px] font-medium tracking-[0.05em] text-black mb-2">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 text-[14px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#013220] transition-colors"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-[13px] font-medium tracking-[0.05em] text-black mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 text-[14px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#013220] transition-colors"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-[13px] font-medium tracking-[0.05em] text-black mb-2">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 text-[14px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#013220] transition-colors"
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-[13px] font-medium tracking-[0.05em] text-black mb-2">
          Subject *
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 text-[14px] text-black bg-white focus:outline-none focus:border-[#013220] transition-colors appearance-none cursor-pointer"
        >
          <option value="General">General Inquiry</option>
          <option value="Order">Order Question</option>
          <option value="Custom">Custom Design</option>
          <option value="Appointment">Book Appointment</option>
          <option value="Return">Returns & Exchanges</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-[13px] font-medium tracking-[0.05em] text-black mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 text-[14px] text-black placeholder:text-gray-400 focus:outline-none focus:border-[#013220] transition-colors resize-none"
          placeholder="How can we help you?"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full py-4 px-8 text-[13px] font-medium tracking-[0.1em] uppercase transition-all duration-300 rounded-full',
          'bg-[#013220] text-white hover:bg-black',
          isSubmitting && 'opacity-70 cursor-not-allowed'
        )}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
