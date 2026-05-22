'use client';

import { useState, useEffect } from 'react';
import { Home, Image, ShoppingBag, Eye, ArrowRight } from 'lucide-react';
import { getFeaturedProducts, getAllCollections } from '@/app/lib/supabase-queries';
import Link from 'next/link';

export default function AdminHomepagePage() {
  const [featuredCount, setFeaturedCount] = useState(0);
  const [collectionCount, setCollectionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
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

  const sections = [
    {
      title: 'Hero Section',
      description: 'Manage the main banner image and headline on your homepage.',
      icon: Image,
      status: 'Configured via theme',
      link: null,
    },
    {
      title: 'Featured Products',
      description: `Products marked as featured will appear on the homepage. Currently ${featuredCount} featured.`,
      icon: ShoppingBag,
      status: `${featuredCount} products`,
      link: '/admin/products',
    },
    {
      title: 'Collections',
      description: `Your collections are displayed on the homepage. Currently ${collectionCount} collections.`,
      icon: Eye,
      status: `${collectionCount} collections`,
      link: '/admin/collections',
    },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white border border-gray-200 p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#013220]/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#013220]" />
                </div>
                <h2 className="font-serif text-[18px] text-black">{section.title}</h2>
              </div>

              <p className="text-[14px] text-gray-600">{section.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-[12px] text-gray-500 bg-gray-50 px-2 py-1">
                  {section.status}
                </span>
                {section.link && (
                  <Link
                    href={section.link}
                    className="text-[13px] text-[#013220] hover:underline flex items-center gap-1"
                  >
                    Manage <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 border border-dashed border-gray-300 p-8 text-center">
        <p className="text-gray-500 text-[14px]">
          For advanced homepage customization, contact your developer.
        </p>
      </div>
    </div>
  );
}
