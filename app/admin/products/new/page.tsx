'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProduct, assignCategoriesToProduct, assignCollectionsToProduct } from '@/app/lib/supabase-admin';
import { getAllCategories, getAllCollections } from '@/app/lib/supabase-queries';
import { ArrowLeft, Save } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    loadCategories();
    loadCollections();
  }, []);

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
      const productData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      };

      const newProduct = await createProduct(productData);
      if (newProduct?.id) {
        await assignCategoriesToProduct(newProduct.id, selectedCategories);
        await assignCollectionsToProduct(newProduct.id, selectedCollections);
      }
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
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
            <h1 className="font-serif text-[28px] text-black">Add Product</h1>
            <p className="text-gray-600 text-[14px]">Create a new product listing</p>
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
          {isLoading ? 'Saving...' : 'Save Product'}
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
                  placeholder="auto-generated-if-empty"
                />
                <p className="text-[12px] text-gray-500 mt-1">
                  Leave empty to auto-generate from name
                </p>
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

            {/* Image */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <h2 className="font-serif text-[18px] text-black border-b border-gray-200 pb-3">
                Hero Image
              </h2>
              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="hero_image"
                  value={formData.hero_image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="https://..."
                />
                <p className="text-[12px] text-gray-500 mt-1">
                  Upload to Storage first, then paste URL
                </p>
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
