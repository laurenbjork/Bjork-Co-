import { supabase } from './supabase';

// ==========================================
// PRODUCT QUERIES
// ==========================================

export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all products:', error.message);
    console.error('Error details:', error);
    return [];
  }

  console.log('getAllProducts returned:', data?.length || 0, 'products');
  return data || [];
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories:product_categories(category:categories(*)),
      collections:product_collections(collection:collections(*))
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }

  return data;
}

export async function getProductsByCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories!inner(product_categories!inner(categories!inner(slug)))
    `)
    .eq('categories.slug', categorySlug)
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return data || [];
}

export async function getFeaturedProducts(limit = 4) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data || [];
}

// ==========================================
// CATEGORY QUERIES
// ==========================================

export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data;
}

// ==========================================
// COLLECTION QUERIES
// ==========================================

export async function getAllCollections() {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching collections:', error);
    return [];
  }

  return data || [];
}

export async function getCollectionBySlug(slug: string) {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching collection:', error);
    return null;
  }

  return data;
}

// ==========================================
// BLOG QUERIES
// ==========================================

export async function getAllBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data || [];
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }

  return data;
}

export async function getBlogPostsByCategory(category: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', category)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts by category:', error);
    return [];
  }

  return data || [];
}

// ==========================================
// NAVIGATION QUERIES
// ==========================================

export async function getNavigationItems() {
  const { data, error } = await supabase
    .from('navigation_items')
    .select(`
      *,
      children:navigation_items(*)
    `)
    .is('parent_id', null)
    .eq('is_visible', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching navigation:', error);
    return [];
  }

  return data || [];
}

// ==========================================
// FORM SUBMISSIONS
// ==========================================

export async function submitContactForm(formData: {
  form_type: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  product_id?: string;
  product_name?: string;
}) {
  const { data, error } = await supabase
    .from('form_submissions')
    .insert([formData]);

  if (error) {
    console.error('Error submitting form:', error);
    throw error;
  }

  return data;
}
