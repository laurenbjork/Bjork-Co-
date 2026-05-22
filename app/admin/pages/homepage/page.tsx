'use client';

import { useState, useEffect, useRef } from 'react';
import { Home, Image, ShoppingBag, Eye, ArrowRight, Upload, X, Save } from 'lucide-react';
import { getFeaturedProducts, getAllCollections } from '@/app/lib/supabase-queries';
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';

export default function AdminHomepagePage() {
  const [featuredCount, setFeaturedCount] = useState(0);
  const [collectionCount, setCollectionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState<string>('');
  const [heroHeading, setHeroHeading] = useState<string>('New Arrivals');
  const [heroButtonLink, setHeroButtonLink] = useState<string>('/shop');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadStats();
    loadHeroSettings();
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

  const loadHeroSettings = async () => {
    try {
      const res = await fetch('/api/site-settings');
      if (!res.ok) return;
      const map = await res.json();
      if (map['hero_image']) setHeroImage(map['hero_image']);
      if (map['hero_heading']) setHeroHeading(map['hero_heading']);
      if (map['hero_button_link']) setHeroButtonLink(map['hero_button_link']);
    } catch (err) {
      console.error('Error loading hero settings:', err);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = `homepage/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setHeroImage(publicUrl);
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
        body: JSON.stringify({ hero_image: heroImage, hero_heading: heroHeading, hero_button_link: heroButtonLink }),
      });

      if (!res.ok) throw new Error(await res.text());
      alert('Hero section saved!');
    } catch (err) {
      console.error('Error saving hero image:', err);
      alert('Failed to save hero image');
    } finally {
      setSaving(false);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[13px] font-medium text-gray-700">Heading Text</label>
            <input
              type="text"
              value={heroHeading}
              onChange={(e) => setHeroHeading(e.target.value)}
              placeholder="New Arrivals"
              className="w-full border border-gray-300 px-3 py-2 text-[13px] focus:outline-none focus:border-[#013220]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[13px] font-medium text-gray-700">Button Link</label>
            <input
              type="text"
              value={heroButtonLink}
              onChange={(e) => setHeroButtonLink(e.target.value)}
              placeholder="/shop"
              className="w-full border border-gray-300 px-3 py-2 text-[13px] focus:outline-none focus:border-[#013220]"
            />
          </div>
        </div>

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
          <button
            onClick={handleSaveHero}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-[13px] font-medium hover:bg-gray-50 transition-colors disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Hero Section'}
          </button>
        </div>
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
