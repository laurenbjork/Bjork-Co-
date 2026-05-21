import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Breadcrumb from '@/app/components/Breadcrumb';
import BlogCard from '@/app/components/BlogCard';
import { getBlogPostBySlug, getAllBlogPosts } from '@/app/lib/supabase-queries';
import { ArrowLeft, ArrowRight, Clock, Calendar } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | BJÖRK & CO.',
    };
  }

  return {
    title: `${post.title} | BJÖRK & CO. Journal`,
    description: post.excerpt || '',
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get related posts (exclude current, get 3 most recent)
  const allPosts = await getAllBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  // Format date
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Draft';

  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Header />

      <article>
        {/* Hero Image */}
        <div className="relative h-[50vh] min-h-[400px] bg-gray-100">
          <Image
            src={post.featured_image || '/images/blog-placeholder.jpg'}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          {/* Breadcrumb */}
          <div className="py-8">
            <Breadcrumb
              items={[
                { label: 'Journal', href: '/blog' },
                { label: post.title, href: `/blog/${post.slug}` },
              ]}
            />
          </div>

          {/* Post Header */}
          <div className="bg-white p-8 md:p-12 shadow-sm mb-12">
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-gray-500 mb-6">
              <span className="uppercase tracking-[0.1em] text-[#013220] font-medium">
                {post.category || 'General'}
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.read_time || '5 min read'}
              </span>
            </div>

            <h1 className="font-serif text-[32px] md:text-[48px] text-black leading-[1.2] mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
              <div className="w-12 h-12 bg-[#013220]/10 rounded-full flex items-center justify-center">
                <span className="text-[16px] font-medium text-[#013220]">
                  {(post.author || 'B').charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-[15px] text-black">{post.author || 'BJÖRK & CO.'}</p>
                <p className="text-[13px] text-gray-500">BJÖRK & CO.</p>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-16">
            <div className="text-[17px] text-gray-700 leading-[1.8] whitespace-pre-line">
              {post.content}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center py-8 border-t border-gray-200 mb-16">
            <Link
              href="/blog"
              className="inline-flex items-center text-[14px] font-medium text-gray-600 hover:text-[#013220] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Journal
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-serif text-[28px] text-black text-center mb-12">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <Footer />
    </main>
  );
}
