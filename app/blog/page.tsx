import { Metadata } from 'next';
import { Amiri } from 'next/font/google';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Breadcrumb from '@/app/components/Breadcrumb';
import BlogCard from '@/app/components/BlogCard';
import { getAllBlogPosts } from '@/app/lib/supabase-queries';

const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BJÖRK & CO. Journal | Jewelry, Bridal & Craftsmanship',
  description: 'Explore our journal for insights on jewelry design, bridal trends, custom craftsmanship, and diamond education from BJÖRK & CO.',
};

export default async function BlogIndexPage() {
  const blogPosts = await getAllBlogPosts();
  
  // Get unique categories
  const categories = ['All', ...new Set(blogPosts.map((post) => post.category).filter(Boolean))];

  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-8">
          <Breadcrumb items={[{ label: 'Journal', href: '/blog' }]} />
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className={`${amiri.className} text-[40px] md:text-[56px] text-black leading-[1.1] mb-4`}>
            BJÖRK & CO. Journal
          </h1>
          <p className="max-w-[600px] mx-auto text-[16px] text-gray-600 leading-relaxed">
            Insights on jewelry design, bridal trends, custom craftsmanship, and the stories behind our creations.
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 text-[13px] tracking-[0.05em] uppercase border border-gray-300 text-gray-600 hover:border-[#013220] hover:text-[#013220] transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Blog Content */}
        {blogPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-[16px]">No blog posts yet.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {blogPosts[0] && (
              <div className="mb-16">
                <BlogCard post={blogPosts[0]} featured />
              </div>
            )}

            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
              {blogPosts.slice(1).map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
