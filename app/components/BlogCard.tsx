'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/app/data/blog';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group flex flex-col h-full">
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden mb-4">
        <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
          <Image
            src={post.featuredImage}
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
            {post.category}
          </span>
          <span className="text-gray-300">|</span>
          <span>{post.readTime}</span>
        </div>

        <h3 className="font-serif text-[20px] leading-[1.3] text-black mb-2 group-hover:text-[#013220] transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="text-[14px] text-gray-600 leading-relaxed line-clamp-2 mb-4 flex-grow">
          {post.excerpt}
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
