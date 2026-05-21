'use client';

import { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';

interface InstagramPost {
  id: string;
  image_url: string;
  caption: string | null;
  link: string | null;
  sort_order: number;
}

interface InstagramFeedProps {
  posts?: InstagramPost[];
  columns?: 3 | 4 | 5 | 6;
  showCaption?: boolean;
}

export default function InstagramFeed({
  posts: propPosts,
  columns = 5,
  showCaption = false,
}: InstagramFeedProps) {
  const [posts, setPosts] = useState<InstagramPost[]>(propPosts || []);
  const [isLoading, setIsLoading] = useState(!propPosts);

  useEffect(() => {
    if (!propPosts) {
      loadPosts();
    }
  }, [propPosts]);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/instagram');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error loading Instagram posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(columns)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  const gridCols = {
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <a
          href="https://instagram.com/bjorkco"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-[#013220] hover:text-black transition-colors"
        >
          <Instagram className="w-5 h-5" />
          @bjorkco
        </a>
      </div>

      {/* Grid */}
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {posts.slice(0, columns * 2).map((post) => (
          <a
            key={post.id}
            href={post.link || 'https://instagram.com/bjorkco'}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square bg-gray-100 overflow-hidden"
          >
            <img
              src={post.image_url}
              alt={post.caption || 'Instagram post'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Caption (optional) */}
            {showCaption && post.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-[12px] line-clamp-2">
                  {post.caption}
                </p>
              </div>
            )}
          </a>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center">
        <a
          href="https://instagram.com/bjorkco"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 border border-[#013220] text-[#013220] text-[13px] font-medium tracking-[0.05em] hover:bg-[#013220] hover:text-white transition-colors"
        >
          <Instagram className="w-4 h-4" />
          Follow Us on Instagram
        </a>
      </div>
    </div>
  );
}
