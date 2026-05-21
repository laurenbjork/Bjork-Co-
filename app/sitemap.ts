import { MetadataRoute } from 'next';
import { supabase } from '@/app/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bjorkco.com';

  // Static routes
  const staticRoutes = [
    '',
    '/shop',
    '/about',
    '/contact',
    '/blog',
    '/bridal',
    '/custom',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic content
  try {
    // Products
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('status', 'published');

    const productRoutes = (products || []).map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product.updated_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Collections
    const { data: collections } = await supabase
      .from('collections')
      .select('slug, updated_at');

    const collectionRoutes = (collections || []).map((collection) => ({
      url: `${baseUrl}/collections/${collection.slug}`,
      lastModified: new Date(collection.updated_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Categories
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at');

    const categoryRoutes = (categories || []).map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(category.updated_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Blog posts
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published');

    const blogRoutes = (posts || []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [
      ...staticRoutes,
      ...productRoutes,
      ...collectionRoutes,
      ...categoryRoutes,
      ...blogRoutes,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}
