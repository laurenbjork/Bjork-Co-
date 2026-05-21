'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';

// Supabase blog post format
interface SupabaseBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  category: string | null;
  author: string | null;
  read_time: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
}

interface BlogCardProps {
  post: SupabaseBlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  // Convert Supabase format to display format
  const featuredImage = post.featured_image || '/images/blog-placeholder.jpg';
  const category = post.category || 'General';
  const readTime = post.read_time || '5 min read';
  const excerpt = post.excerpt || '';

  if (featured) {
    return (
      <article className="group grid md:grid-cols-2 gap-8 items-center">
        <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
          <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
            <Image
              src={featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </Link>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 text-[12px] text-gray-500 mb-3">
            <span className="uppercase tracking-[0.1em] text-[#013220] font-medium">
              {category}
            </span>
            <span className="text-gray-300">|</span>
            <span>{readTime}</span>
          </div>

          <h2 className="font-serif text-[32px] md:text-[40px] leading-[1.2] text-black mb-4 group-hover:text-[#013220] transition-colors">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h2>

          <p className="text-[16px] text-gray-600 leading-relaxed mb-6">
            {excerpt}
          </p>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-[14px] font-medium tracking-[0.05em] text-[#013220] hover:text-black transition-colors"
          >
            Read Article
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col h-full">
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden mb-4">
        <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
          <Image
            src={featuredImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-[12px] text-gray-500 mb-2">
          <span className="uppercase tracking-[0.1em] text-[#013220] font-medium">
            {category}
          </span>
          <span className="text-gray-300">|</span>
          <span>{readTime}</span>
        </div>

        <h3 className="font-serif text-[20px] leading-[1.3] text-black mb-2 group-hover:text-[#013220] transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="text-[14px] text-gray-600 leading-relaxed line-clamp-2 mb-4 flex-grow">
          {excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-[13px] font-medium tracking-[0.05em] text-[#013220] hover:text-black transition-colors"
        >
          Read More
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
