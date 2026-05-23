// Supabase database types (snake_case)
export interface SupabaseProduct {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  long_description: string | null;
  price_visibility: 'visible' | 'inquiry' | 'coming_soon';
  price: number | null;
  price_range: string | null;
  availability_note: string | null;
  cta_type: 'inquire' | 'request_details' | 'book_appointment';
  hero_image: string | null;
  hover_image: string | null;
  gallery_images: string[] | null;
  video_url: string | null;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SupabaseCollection {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SupabaseBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  category: string | null;
  author: string | null;
  read_time: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

// Helper function to convert Supabase product to frontend Product format
export function convertSupabaseProduct(product: SupabaseProduct) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.short_description || '',
    longDescription: product.long_description || '',
    priceVisibility: product.price_visibility,
    price: product.price ?? undefined, // Convert null to undefined
    priceRange: product.price_range ?? undefined,
    availabilityNote: product.availability_note || '',
    ctaType: product.cta_type,
    heroImage: product.hero_image || '/images/placeholder.jpg',
    hoverImage: product.hover_image ?? undefined,
    galleryImages: product.gallery_images || [],
    videoUrl: product.video_url ?? undefined,
    status: product.status,
    featured: product.featured,
    sortOrder: product.sort_order,
    seoTitle: product.seo_title ?? undefined,
    seoDescription: product.seo_description ?? undefined,
    ogImage: product.og_image ?? undefined,
    publishedAt: product.published_at ?? undefined,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    // Properties needed by ProductCard
    image: product.hero_image || '/images/placeholder.jpg',
    href: `/product/${product.slug}`,
  };
}

export function convertSupabaseBlogPost(post: SupabaseBlogPost) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || '',
    content: post.content || '',
    featuredImage: post.featured_image || '/images/blog-placeholder.jpg',
    category: post.category || 'General',
    author: post.author || 'BJÖRK & CO.',
    readTime: post.read_time || '5 min read',
    status: post.status,
    publishedAt: post.published_at,
    seoTitle: post.seo_title,
    seoDescription: post.seo_description,
    ogImage: post.og_image,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
  };
}
