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
  // First get the category ID from slug
  const { data: categoryData, error: catError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (catError || !categoryData) {
    console.error('Category not found:', categorySlug, catError);
    return [];
  }

  // Get product IDs assigned to this category
  const { data: assignments, error: assignError } = await supabase
    .from('product_categories')
    .select('product_id')
    .eq('category_id', categoryData.id);

  if (assignError || !assignments || assignments.length === 0) {
    return [];
  }

  const productIds = assignments.map((a) => a.product_id);

  // Fetch the actual products
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds)
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

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

export async function getProductsByCollection(collectionSlug: string) {
  const { data: collectionData, error: colError } = await supabase
    .from('collections')
    .select('id')
    .eq('slug', collectionSlug)
    .single();

  if (colError || !collectionData) {
    console.error('Collection not found:', collectionSlug, colError);
    return [];
  }

  const { data: assignments, error: assignError } = await supabase
    .from('product_collections')
    .select('product_id')
    .eq('collection_id', collectionData.id);

  if (assignError || !assignments || assignments.length === 0) {
    return [];
  }

  const productIds = assignments.map((a) => a.product_id);

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds)
    .eq('status', 'published')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching products by collection:', error);
    return [];
  }

  return data || [];
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
