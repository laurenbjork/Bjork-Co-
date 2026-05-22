import { supabase } from './supabase';

// ==========================================
// PRODUCT CRUD OPERATIONS
// ==========================================

export async function createProduct(product: any) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, updates: any) {
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==========================================
// CATEGORY CRUD
// ==========================================

export async function createCategory(category: any) {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, updates: any) {
  const { data, error } = await supabase
    .from('categories')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==========================================
// COLLECTION CRUD
// ==========================================

export async function createCollection(collection: any) {
  const { data, error } = await supabase
    .from('collections')
    .insert([collection])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCollection(id: string, updates: any) {
  const { data, error } = await supabase
    .from('collections')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCollection(id: string) {
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==========================================
// BLOG POST CRUD
// ==========================================

export async function createBlogPost(post: any) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBlogPost(id: string, updates: any) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==========================================
// FORM SUBMISSIONS
// ==========================================

export async function getFormSubmissions() {
  const { data, error } = await supabase
    .from('form_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function markSubmissionAsRead(id: string) {
  const { error } = await supabase
    .from('form_submissions')
    .update({ status: 'read' })
    .eq('id', id);

  if (error) throw error;
}

// ==========================================
// PRODUCT RELATIONSHIPS (Categories & Collections)
// ==========================================

export async function assignCategoriesToProduct(productId: string, categoryIds: string[]) {
  // First, remove existing assignments
  await supabase
    .from('product_categories')
    .delete()
    .eq('product_id', productId);

  // Then, add new assignments
  if (categoryIds.length > 0) {
    const assignments = categoryIds.map((categoryId) => ({
      product_id: productId,
      category_id: categoryId,
    }));

    const { error } = await supabase
      .from('product_categories')
      .insert(assignments);

    if (error) throw error;
  }
}

export async function assignCollectionsToProduct(productId: string, collectionIds: string[]) {
  // First, remove existing assignments
  await supabase
    .from('product_collections')
    .delete()
    .eq('product_id', productId);

  // Then, add new assignments
  if (collectionIds.length > 0) {
    const assignments = collectionIds.map((collectionId) => ({
      product_id: productId,
      collection_id: collectionId,
    }));

    const { error } = await supabase
      .from('product_collections')
      .insert(assignments);

    if (error) throw error;
  }
}

// ==========================================
// PRODUCT IMAGES
// ==========================================

export async function addProductImage(productId: string, imageUrl: string, isHero: boolean = false) {
  const { data, error } = await supabase
    .from('product_images')
    .insert([{
      product_id: productId,
      image_url: imageUrl,
      is_hero: isHero,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProductImagesOrder(images: { id: string; sort_order: number }[]) {
  // Update each image's sort order
  for (const image of images) {
    const { error } = await supabase
      .from('product_images')
      .update({ sort_order: image.sort_order })
      .eq('id', image.id);

    if (error) throw error;
  }
}

export async function setHeroImage(productId: string, imageId: string) {
  // First, unset all hero images for this product
  await supabase
    .from('product_images')
    .update({ is_hero: false })
    .eq('product_id', productId);

  // Then, set the new hero
  const { error } = await supabase
    .from('product_images')
    .update({ is_hero: true })
    .eq('id', imageId);

  if (error) throw error;
}

export async function deleteProductImage(imageId: string, imageUrl?: string) {
  // Delete from database
  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId);

  if (error) throw error;

  // Delete from storage if URL provided
  if (imageUrl) {
    const path = imageUrl.split('/').pop();
    if (path) {
      await deleteImageFromStorage('images', path);
    }
  }
}

export async function getProductImages(productId: string) {
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

// ==========================================
// STORAGE UPLOAD
// ==========================================

export async function uploadImage(file: File, bucket: string, path: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteImageFromStorage(bucket: string, path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}

export async function saveProductImages(productId: string, images: Array<{ url: string, sort_order: number, is_hero: boolean }>) {
  // Delete existing images
  await supabase
    .from('product_images')
    .delete()
    .eq('product_id', productId);

  // Insert new images
  if (images.length > 0) {
    const { error } = await supabase
      .from('product_images')
      .insert(images.map(img => ({
        product_id: productId,
        image_url: img.url,
        sort_order: img.sort_order,
        is_hero: img.is_hero
      })));

    if (error) throw error;
  }
}
