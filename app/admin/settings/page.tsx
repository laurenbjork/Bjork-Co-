'use client';

import { useState } from 'react';
import { Save, Globe, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'BJÖRK & CO.',
    tagline: 'Fine Jewelry & Custom Designs',
    description: 'Handcrafted fine jewelry, engagement rings, and custom designs.',
    email: 'hello@bjorkco.com',
    phone: '+1 (555) 123-4567',
    address: '123 Jewelry Lane, New York, NY 10001',
    instagram: '@bjorkco',
    facebook: 'bjorkco',
    seoTitle: 'BJÖRK & CO. | Fine Jewelry & Custom Designs',
    seoDescription: 'Handcrafted fine jewelry, engagement rings, and custom designs for life\'s precious moments.',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Save to Supabase site_settings table
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setSaved(true);
    setIsLoading(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] text-black">Site Settings</h1>
          <p className="text-gray-600 text-[14px] mt-1">
            Manage global site configuration and SEO settings
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={cn(
            'flex items-center gap-2 px-4 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] transition-colors',
            isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black'
          )}
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Site Info */}
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="font-serif text-[18px] text-black border-b border-gray-200 pb-3 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Site Information
            </h2>

            <div>
              <label className="block text-[13px] font-medium text-black mb-2">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-black mb-2">
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-black mb-2">
                Site Description
              </label>
              <textarea
                name="description"
                value={settings.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="font-serif text-[18px] text-black border-b border-gray-200 pb-3 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </h2>

            <div>
              <label className="block text-[13px] font-medium text-black mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-black mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-black mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Business Address
              </label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="font-serif text-[18px] text-black border-b border-gray-200 pb-3">
              Social Media
            </h2>

            <div>
              <label className="block text-[13px] font-medium text-black mb-2 flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram Handle
              </label>
              <input
                type="text"
                name="instagram"
                value={settings.instagram}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-black mb-2 flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook Page
              </label>
              <input
                type="text"
                name="facebook"
                value={settings.facebook}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <h2 className="font-serif text-[18px] text-black border-b border-gray-200 pb-3">
              SEO Settings
            </h2>

            <div>
              <label className="block text-[13px] font-medium text-black mb-2">
                Default SEO Title
              </label>
              <input
                type="text"
                name="seoTitle"
                value={settings.seoTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-black mb-2">
                Default Meta Description
              </label>
              <textarea
                name="seoDescription"
                value={settings.seoDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
