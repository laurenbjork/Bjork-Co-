'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateProduct, assignCategoriesToProduct, assignCollectionsToProduct, uploadImage, getProductImages, saveProductImages, deleteProductImage } from '@/app/lib/supabase-admin';
import { getProductById, getAllCategories, getAllCollections } from '@/app/lib/supabase-queries';
import { ArrowLeft, Save, Upload, X, GripVertical, Star } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import { cn } from '@/app/lib/utils';

interface EditProductPageProps {
  params: { id: string };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    long_description: '',
    price_visibility: 'visible',
    price: '',
    price_range: '',
    availability_note: '',
    cta_type: 'inquire',
    status: 'draft',
    featured: false,
    sort_order: 0,
    hero_image: '',
    seo_title: '',
    seo_description: '',
  });
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [collections, setCollections] = useState<Array<{id: string, name: string}>>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<Array<{id: string, url: string, sort_order: number, is_hero: boolean}>>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadProduct();
    loadCategories();
    loadCollections();
    loadProductImages();
  }, [id]);

  const loadProduct = async () => {
    try {
      const product = await getProductById(id);
      if (product) {
        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          short_description: product.short_description || '',
          long_description: product.long_description || '',
          price_visibility: product.price_visibility || 'visible',
          price: product.price?.toString() || '',
          price_range: product.price_range || '',
          availability_note: product.availability_note || '',
          cta_type: product.cta_type || 'inquire',
          status: product.status || 'draft',
          featured: product.featured || false,
          sort_order: product.sort_order || 0,
          hero_image: product.hero_image || '',
          seo_title: product.seo_title || '',
          seo_description: product.seo_description || '',
        });
        // Load assigned categories
        if (product.categories) {
          const assignedIds = product.categories.map((c: any) => c.category_id || c.id);
          setSelectedCategories(assignedIds);
        }
        // Load assigned collections
        const { data: collData } = await supabase
          .from('product_collections')
          .select('collection_id')
          .eq('product_id', id);
        if (collData) {
          setSelectedCollections(collData.map((c: any) => c.collection_id));
        }
      }
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setIsFetching(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await getAllCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadCollections = async () => {
    try {
      const cols = await getAllCollections();
      setCollections(cols);
    } catch (err) {
      console.error('Failed to load collections:', err);
    }
  };

  const loadProductImages = async () => {
    try {
      const images = await getProductImages(id);
      setProductImages(images);
    } catch (err) {
      console.error('Failed to load product images:', err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (productImages.length + files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setUploadingImage(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}-${file.name}`;
        const path = `products/${id}/${fileName}`;
        const url = await uploadImage(file, 'images', path);

        const newImage = {
          id: crypto.randomUUID(),
          url,
          sort_order: productImages.length + i,
          is_hero: productImages.length === 0 && i === 0
        };

        setProductImages(prev => [...prev, newImage]);
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      alert('Failed to upload images');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async (imageId: string, imageUrl: string) => {
    try {
      await deleteProductImage(imageId, imageUrl);
      setProductImages(prev => prev.filter(img => img.id !== imageId));
      
      // Update hero flag if the deleted image was hero
      const remainingImages = productImages.filter(img => img.id !== imageId);
      if (remainingImages.length > 0) {
        setProductImages(prev => prev.map((img, idx) => ({
          ...img,
          is_hero: idx === 0
        })));
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image');
    }
  };

  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    const reordered = [...productImages];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    // Update sort_order and hero flag
    const updated = reordered.map((img, idx) => ({
      ...img,
      sort_order: idx,
      is_hero: idx === 0
    }));

    setProductImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const productData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        hero_image: productImages.length > 0 ? productImages[0].url : '',
      };

      await updateProduct(id, productData);
      await assignCategoriesToProduct(id, selectedCategories);
      await assignCollectionsToProduct(id, selectedCollections);
      
      // Save product images
      await saveProductImages(id, productImages.map(img => ({
        url: img.url,
        sort_order: img.sort_order,
        is_hero: img.is_hero
      })));
      
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-[28px] text-black">Edit Product</h1>
            <p className="text-gray-600 text-[14px]">Update product details</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={cn(
            'flex items-center gap-2 px-4 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] transition-colors',
            isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black'
          )}
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-[14px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <h2 className="font-serif text-[18px] text-black border-b border-gray-200 pb-3">
                Basic Information
              </h2>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="e.g., Diamond Solitaire Ring"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="product-url-slug"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Short Description
                </label>
                <textarea
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="Brief description for product cards..."
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Full Description
                </label>
                <textarea
                  name="long_description"
                  value={formData.long_description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="Detailed product description..."
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <h2 className="font-serif text-[18px] text-black border-b border-gray-200 pb-3">
                Pricing
              </h2>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Price Visibility
                </label>
                <select
                  name="price_visibility"
                  value={formData.price_visibility}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                >
                  <option value="visible">Visible - Show exact price</option>
                  <option value="inquiry">Inquiry - Hide price, show &quot;Inquire for price&quot;</option>
                  <option value="coming_soon">Coming Soon - Show availability note</option>
                </select>
              </div>

              {formData.price_visibility === 'visible' && (
                <div>
                  <label className="block text-[13px] font-medium text-black mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                    placeholder="0.00"
                  />
                </div>
              )}

              {formData.price_visibility !== 'visible' && (
                <div>
                  <label className="block text-[13px] font-medium text-black mb-2">
                    Price Range / Availability Note
                  </label>
                  <input
                    type="text"
                    name="price_range"
                    value={formData.price_range}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                    placeholder="e.g., $5,000 - $8,000 or Coming Spring 2024"
                  />
                </div>
              )}

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Availability Note
                </label>
                <input
                  type="text"
                  name="availability_note"
                  value={formData.availability_note}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="e.g., Ships in 2-3 weeks"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  CTA Button Type
                </label>
                <select
                  name="cta_type"
                  value={formData.cta_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                >
                  <option value="inquire">Inquire</option>
                  <option value="request_details">Request Details</option>
                  <option value="book_appointment">Book Appointment</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <h2 className="font-serif text-[18px] text-black border-b border-gray-200 pb-3">
                Status
              </h2>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Product Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  id="featured"
                  className="w-4 h-4 border-gray-300 rounded focus:ring-[#013220]"
                />
                <label htmlFor="featured" className="text-[13px] text-black">
                  Featured product
                </label>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                />
              </div>
            </div>

            {/* Images */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <h2 className="font-serif text-[18px] text-black border-b border-gray-200 pb-3">
                Product Images ({productImages.length}/5)
              </h2>
              
              {/* Upload Button */}
              <div>
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage || productImages.length >= 5}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className={cn(
                    'flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded cursor-pointer transition-colors',
                    uploadingImage || productImages.length >= 5
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-[#013220] hover:bg-gray-50'
                  )}
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-[13px] font-medium">
                    {uploadingImage ? 'Uploading...' : 'Upload Images'}
                  </span>
                </label>
                <p className="text-[12px] text-gray-500 mt-1">
                  First image is the hero image. Drag to reorder.
                </p>
              </div>

              {/* Image Gallery */}
              {productImages.length > 0 && (
                <div className="space-y-2">
                  {productImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded bg-gray-50"
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('fromIndex', index.toString())}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fromIndex = parseInt(e.dataTransfer.getData('fromIndex'));
                        handleImageReorder(fromIndex, index);
                      }}
                    >
                      {/* Drag Handle */}
                      <div className="cursor-grab text-gray-400">
                        <GripVertical className="w-5 h-5" />
                      </div>

                      {/* Hero Indicator */}
                      {image.is_hero && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}

                      {/* Image Preview */}
                      <img
                        src={image.url}
                        alt={`Product image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />

                      {/* Image Info */}
                      <div className="flex-1">
                        <p className="text-[13px] font-medium text-black">
                          {image.is_hero ? 'Hero Image' : `Image ${index + 1}`}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {image.url.split('/').pop()}
                        </p>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleImageDelete(image.id, image.url)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Categories */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <h2 className="font-serif text-[18px] text-black border-b border-gray-200 pb-3">
                Categories
              </h2>
              <div className="space-y-2">
                {categories.length === 0 && (
                  <p className="text-gray-500 text-[14px]">No categories found.</p>
                )}
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 text-[14px] text-black cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories((prev) => [...prev, category.id]);
                        } else {
                          setSelectedCategories((prev) =>
                            prev.filter((id) => id !== category.id)
                          );
                        }
                      }}
                      className="w-4 h-4 border-gray-300 rounded focus:ring-[#013220]"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Collections */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <h2 className="font-serif text-[18px] text-black border-b border-gray-200 pb-3">
                Collections
              </h2>
              <div className="space-y-2">
                {collections.length === 0 && (
                  <p className="text-gray-500 text-[14px]">No collections found.</p>
                )}
                {collections.map((collection) => (
                  <label
                    key={collection.id}
                    className="flex items-center gap-2 text-[14px] text-black cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCollections.includes(collection.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCollections((prev) => [...prev, collection.id]);
                        } else {
                          setSelectedCollections((prev) =>
                            prev.filter((id) => id !== collection.id)
                          );
                        }
                      }}
                      className="w-4 h-4 border-gray-300 rounded focus:ring-[#013220]"
                    />
                    {collection.name}
                  </label>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <h2 className="font-serif text-[18px] text-black border-b border-gray-200 pb-3">
                SEO
              </h2>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="Custom page title..."
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  SEO Description
                </label>
                <textarea
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="Meta description..."
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
