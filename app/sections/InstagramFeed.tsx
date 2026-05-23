'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface InstagramPost {
  id: string;
  image_url: string;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstagramPosts();
  }, []);

  const loadInstagramPosts = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res = await fetch(
        `${supabaseUrl}/rest/v1/instagram_posts?select=id,image_url&is_active=eq.true&order=sort_order.asc&limit=5`,
        {
          headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
          cache: 'no-store',
        }
      );
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Error loading Instagram posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-[22px] sm:text-[26px] text-[#013220] text-center mb-10">
          @bjorkandco on Instagram
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com/bjorkandco"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square bg-gray-100 overflow-hidden group"
            >
              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt="Instagram post"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 border border-gray-300">
                  <span className="text-gray-400 text-[11px]">No image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
