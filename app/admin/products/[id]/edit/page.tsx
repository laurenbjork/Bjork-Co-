'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateProduct, assignCategoriesToProduct, assignCollectionsToProduct, uploadImage, addProductImage, updateProductImagesOrder, setHeroImage, deleteProductImage, getProductImages } from '@/app/lib/supabase-admin';
import { getProductById, getAllCategories, getAllCollections } from '@/app/lib/supabase-queries';
import { ArrowLeft, Save, Upload, X, Star, GripHorizontal } from 'lucide-react';
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
    seo_title: '',
    seo_description: '',
  });
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [collections, setCollections] = useState<Array<{id: string, name: string}>>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<Array<{id: string, image_url: string, sort_order: number, is_hero: boolean}>>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProduct();
    loadCategories();
    loadCollections();
    loadProductImages();
  }, [id]);

  const loadProductImages = async () => {
    try {
      const images = await getProductImages(id);
      setProductImages(images);
    } catch (err) {
      console.error('Failed to load product images:', err);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Set hero_image from product images
      const heroImg = productImages.find(img => img.is_hero);
      const productData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        hero_image: heroImg?.image_url || productImages[0]?.image_url || '',
      };

      await updateProduct(id, productData);
      await assignCategoriesToProduct(id, selectedCategories);
      await assignCollectionsToProduct(id, selectedCollections);
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

  // === Image Upload Handlers ===
  const uploadFiles = async (files: File[]) => {
    setIsUploadingImages(true);
    try {
      for (const file of files) {
        const fileName = `${id}/${Date.now()}-${file.name}`;
        const publicUrl = await uploadImage(file, 'product-images', fileName);
        const isHero = productImages.length === 0;
        await addProductImage(id, publicUrl, isHero);
      }
      await loadProductImages();
    } catch (err) {
      console.error('Image upload failed:', err);
      setError('Failed to upload image(s)');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await uploadFiles(files);
    }
    e.target.value = '';
  };

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropZoneActive(true);
  };

  const handleDropZoneDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropZoneActive(false);
  };

  const handleDropZoneDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropZoneActive(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  // === Image Reorder Handlers ===
  const handleImageDragStart = (index: number) => {
    setDraggedImageIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedImageIndex === null || draggedImageIndex === index) return;

    const reordered = [...productImages];
    const [dragged] = reordered.splice(draggedImageIndex, 1);
    reordered.splice(index, 0, dragged);
    setProductImages(reordered);
    setDraggedImageIndex(index);
  };

  const handleImageDragEnd = async () => {
    setDraggedImageIndex(null);
    const updates = productImages.map((img, i) => ({ id: img.id, sort_order: i }));
    try {
      await updateProductImagesOrder(updates);
    } catch (err) {
      console.error('Failed to update image order:', err);
    }
  };

  const handleSetHero = async (imageId: string) => {
    try {
      await setHeroImage(id, imageId);
      await loadProductImages();
    } catch (err) {
      console.error('Failed to set hero image:', err);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteProductImage(imageId);
      setProductImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
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

      {/* Product Images - Full Width */}
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <h2 className="font-serif text-[18px] text-black">
            Product Images
          </h2>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingImages}
            className="flex items-center gap-2 px-3 py-2 bg-[#013220] text-white text-[13px] font-medium hover:bg-black transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {isUploadingImages ? 'Uploading...' : 'Upload Images'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDropZoneDragOver}
          onDragLeave={handleDropZoneDragLeave}
          onDrop={handleDropZoneDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
            isDropZoneActive
              ? 'border-[#013220] bg-[#013220]/5'
              : 'border-gray-300'
          )}
        >
          <p className="text-[13px] text-gray-500">
            Drag and drop images here, or click &quot;Upload Images&quot; above
          </p>
        </div>

        {/* Image Gallery */}
        {productImages.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {productImages.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => handleImageDragStart(index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDragEnd={handleImageDragEnd}
                className={cn(
                  'relative flex-shrink-0 w-36 h-36 group border-2 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing transition-all',
                  image.is_hero ? 'border-[#013220]' : 'border-gray-200',
                  draggedImageIndex === index ? 'opacity-50' : 'opacity-100'
                )}
              >
                <img
                  src={image.image_url}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Hero Badge */}
                {image.is_hero && (
                  <div className="absolute top-1 left-1 bg-[#013220] text-white px-1.5 py-0.5 text-[10px] font-medium rounded">
                    MAIN
                  </div>
                )}
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleSetHero(image.id)}
                    title="Set as main image"
                    className="p-1.5 bg-white rounded-full hover:bg-yellow-100 transition-colors"
                  >
                    <Star className={cn('w-4 h-4', image.is_hero ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700')} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.id)}
                    title="Delete image"
                    className="p-1.5 bg-white rounded-full hover:bg-red-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                {/* Drag Handle */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripHorizontal className="w-4 h-4 text-white" />
                </div>
              </div>
            ))}
          </div>
        )}

        {productImages.length === 0 && (
          <p className="text-[14px] text-gray-500 text-center py-4">No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
