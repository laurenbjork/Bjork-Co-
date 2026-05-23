'use client';

import { useState, useEffect, useRef } from 'react';
import { Home, Image, ShoppingBag, Eye, ArrowRight, Upload, X, Save, Type } from 'lucide-react';
import { getFeaturedProducts, getAllCollections } from '@/app/lib/supabase-queries';
import Link from 'next/link';

export default function AdminHomepagePage() {
  const [featuredCount, setFeaturedCount] = useState(0);
  const [collectionCount, setCollectionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingText, setSavingText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [heroTitle, setHeroTitle] = useState('Fine Jewelry');
  const [heroTitleFont, setHeroTitleFont] = useState('serif');
  const [heroTitleSize, setHeroTitleSize] = useState('72');
  const [heroTitleColor, setHeroTitleColor] = useState('#ffffff');
  const [heroCtaText, setHeroCtaText] = useState('Shop Now');
  const [heroCtaColor, setHeroCtaColor] = useState('#013220');
  const [heroCtaLink, setHeroCtaLink] = useState('/shop');

  useEffect(() => {
    loadStats();
    loadSettings();
  }, []);

  const loadStats = async () => {
    try {
      const [products, collections] = await Promise.all([
        getFeaturedProducts(100),
        getAllCollections(),
      ]);
      setFeaturedCount(products?.length || 0);
      setCollectionCount(collections?.length || 0);
    } catch (err) {
      console.error('Error loading homepage stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/site-settings');
      if (res.ok) {
        const s = await res.json();
        if (s.hero_image) setHeroImage(s.hero_image);
        if (s.hero_title) setHeroTitle(s.hero_title);
        if (s.hero_title_font) setHeroTitleFont(s.hero_title_font);
        if (s.hero_title_size) setHeroTitleSize(s.hero_title_size);
        if (s.hero_title_color) setHeroTitleColor(s.hero_title_color);
        if (s.hero_cta_text) setHeroCtaText(s.hero_cta_text);
        if (s.hero_cta_color) setHeroCtaColor(s.hero_cta_color);
        if (s.hero_cta_link) setHeroCtaLink(s.hero_cta_link);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload-hero', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Upload failed');
      }

      const { url } = await res.json();
      setHeroImage(url);

      const saveRes = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero_image: url }),
      });
      if (!saveRes.ok) {
        const saveErr = await saveRes.json();
        console.error('Save failed:', saveErr);
        alert(`Upload succeeded but save failed: ${saveErr.error}\n${JSON.stringify(saveErr.details)}`);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveHero = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero_image: heroImage }),
      });
      if (!res.ok) throw new Error('Failed to save');
      alert('Hero image saved!');
    } catch (err) {
      console.error('Error saving hero image:', err);
      alert('Failed to save hero image');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHeroText = async () => {
    setSavingText(true);
    try {
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hero_title: heroTitle,
          hero_title_font: heroTitleFont,
          hero_title_size: heroTitleSize,
          hero_title_color: heroTitleColor,
          hero_cta_text: heroCtaText,
          hero_cta_color: heroCtaColor,
          hero_cta_link: heroCtaLink,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      alert('Hero text saved!');
    } catch (err) {
      console.error('Error saving hero text:', err);
      alert('Failed to save hero text');
    } finally {
      setSavingText(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[28px] text-black flex items-center gap-2">
          <Home className="w-7 h-7 text-[#013220]" />
          Homepage Content
        </h1>
        <p className="text-gray-600 text-[14px] mt-1">
          Manage the content and sections displayed on your homepage
        </p>
      </div>

      {/* Hero Image Section */}
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="font-serif text-[20px] text-black border-b border-gray-200 pb-3 flex items-center gap-2">
          <Image className="w-5 h-5 text-[#013220]" />
          Hero Image
        </h2>

        <p className="text-[14px] text-gray-600">
          Upload the main banner image for your homepage. This will be displayed at the top of your site.
        </p>

        {heroImage && (
          <div className="relative">
            <img
              src={heroImage}
              alt="Hero preview"
              className="w-full h-48 object-cover rounded"
            />
            <button
              onClick={() => setHeroImage('')}
              className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] hover:bg-black transition-colors disabled:opacity-70"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
          {heroImage && (
            <button
              onClick={handleSaveHero}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-[13px] font-medium hover:bg-gray-50 transition-colors disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Hero Image'}
            </button>
          )}
        </div>
      </div>

      {/* Hero Text Section */}
      <div className="bg-white border border-gray-200 p-6 space-y-5">
        <h2 className="font-serif text-[20px] text-black border-b border-gray-200 pb-3 flex items-center gap-2">
          <Type className="w-5 h-5 text-[#013220]" />
          Hero Text & CTA
        </h2>

        {/* Live Preview */}
        <div
          className="relative w-full h-28 flex flex-col items-center justify-center text-center rounded overflow-hidden"
          style={{ background: '#6b7280' }}
        >
          <p
            className="drop-shadow-lg"
            style={{
              fontFamily: heroTitleFont === 'sans-serif' ? 'sans-serif' : heroTitleFont === 'monospace' ? 'monospace' : 'Georgia, serif',
              fontSize: `${Math.min(parseInt(heroTitleSize) || 72, 40)}px`,
              color: heroTitleColor,
            }}
          >
            {heroTitle || 'Fine Jewelry'}
          </p>
          <span
            className="mt-2 text-[11px] font-medium tracking-widest uppercase px-4 py-1.5"
            style={{ backgroundColor: heroCtaColor, color: '#fff' }}
          >
            {heroCtaText || 'Shop Now'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Title Text */}
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-gray-700 uppercase tracking-wide">Title Text</label>
            <input
              type="text"
              value={heroTitle}
              onChange={e => setHeroTitle(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 text-[14px] focus:outline-none focus:border-[#013220]"
              placeholder="Fine Jewelry"
            />
          </div>

          {/* Font */}
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-gray-700 uppercase tracking-wide">Font</label>
            <select
              value={heroTitleFont}
              onChange={e => setHeroTitleFont(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 text-[14px] focus:outline-none focus:border-[#013220]"
            >
              <option value="serif">Serif (Georgia)</option>
              <option value="sans-serif">Sans-Serif</option>
              <option value="monospace">Monospace</option>
            </select>
          </div>

          {/* Font Size */}
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-gray-700 uppercase tracking-wide">Font Size (px)</label>
            <input
              type="number"
              value={heroTitleSize}
              onChange={e => setHeroTitleSize(e.target.value)}
              min="16"
              max="200"
              className="w-full border border-gray-200 px-3 py-2 text-[14px] focus:outline-none focus:border-[#013220]"
            />
          </div>

          {/* Title Color */}
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-gray-700 uppercase tracking-wide">Title Color</label>
            <div className="flex items-center gap-2 border border-gray-200 px-3 py-2">
              <input
                type="color"
                value={heroTitleColor}
                onChange={e => setHeroTitleColor(e.target.value)}
                className="w-8 h-6 cursor-pointer border-none bg-transparent"
              />
              <span className="text-[13px] text-gray-600 font-mono">{heroTitleColor}</span>
            </div>
          </div>

          {/* CTA Text */}
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-gray-700 uppercase tracking-wide">CTA Button Text</label>
            <input
              type="text"
              value={heroCtaText}
              onChange={e => setHeroCtaText(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 text-[14px] focus:outline-none focus:border-[#013220]"
              placeholder="Shop Now"
            />
          </div>

          {/* CTA Link */}
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-gray-700 uppercase tracking-wide">CTA Button Link</label>
            <input
              type="text"
              value={heroCtaLink}
              onChange={e => setHeroCtaLink(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 text-[14px] focus:outline-none focus:border-[#013220]"
              placeholder="/shop"
            />
          </div>

          {/* CTA Color */}
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-gray-700 uppercase tracking-wide">CTA Button Color</label>
            <div className="flex items-center gap-2 border border-gray-200 px-3 py-2">
              <input
                type="color"
                value={heroCtaColor}
                onChange={e => setHeroCtaColor(e.target.value)}
                className="w-8 h-6 cursor-pointer border-none bg-transparent"
              />
              <span className="text-[13px] text-gray-600 font-mono">{heroCtaColor}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveHeroText}
          disabled={savingText}
          className="flex items-center gap-2 px-4 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] hover:bg-black transition-colors disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          {savingText ? 'Saving...' : 'Save Hero Text'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#013220]/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#013220]" />
            </div>
            <h2 className="font-serif text-[18px] text-black">Featured Products</h2>
          </div>
          <p className="text-[14px] text-gray-600">
            Products marked as featured will appear on the homepage. Currently {featuredCount} featured.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-gray-500 bg-gray-50 px-2 py-1">
              {featuredCount} products
            </span>
            <Link href="/admin/products" className="text-[13px] text-[#013220] hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#013220]/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-[#013220]" />
            </div>
            <h2 className="font-serif text-[18px] text-black">Collections</h2>
          </div>
          <p className="text-[14px] text-gray-600">
            Your collections are displayed on the homepage. Currently {collectionCount} collections.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-gray-500 bg-gray-50 px-2 py-1">
              {collectionCount} collections
            </span>
            <Link href="/admin/collections" className="text-[13px] text-[#013220] hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
