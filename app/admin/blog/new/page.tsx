'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Bold, List, Link2, Image as ImageIcon } from 'lucide-react';
import { createBlogPost } from '@/app/lib/supabase-admin';
import { cn } from '@/app/lib/utils';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    status: 'draft',
    featured_image: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const postData = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      };

      const newPost = await createBlogPost(postData);
      if (newPost?.id) {
        router.push('/admin/blog');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create blog post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Rich text formatting helpers
  const insertTag = (tag: string) => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content;
    const selectedText = text.substring(start, end);
    
    let replacement = '';
    switch (tag) {
      case 'b':
        replacement = `<strong>${selectedText || 'bold text'}</strong>`;
        break;
      case 'ul':
        replacement = `<ul>\n  <li>${selectedText || 'item'}</li>\n  <li>item</li>\n</ul>`;
        break;
      case 'li':
        replacement = `<li>${selectedText || 'item'}</li>`;
        break;
      case 'a':
        replacement = `<a href="${selectedText || 'https://'}" class="text-[#013220] hover:underline">${selectedText || 'link text'}</a>`;
        break;
      case 'img':
        replacement = `<img src="${selectedText || 'https://'}" alt="" class="w-full my-4" />`;
        break;
    }

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setFormData({ ...formData, content: newText });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-[28px] text-black">New Blog Post</h1>
            <p className="text-gray-600 text-[14px]">Create a new blog article</p>
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
          {isLoading ? 'Saving...' : 'Save Post'}
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
                Post Information
              </h2>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="Enter post title..."
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
                  Leave empty to auto-generate from title
                </p>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="Brief summary for post cards..."
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="e.g., Jewelry Tips, Behind the Scenes"
                />
              </div>
            </div>

            {/* Content with Rich Text Toolbar */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <h2 className="font-serif text-[18px] text-black border-b border-gray-200 pb-3">
                Content (HTML supported)
              </h2>
              
              {/* Toolbar */}
              <div className="flex gap-2 p-2 bg-gray-50 border border-gray-200">
                <button
                  type="button"
                  onClick={() => insertTag('b')}
                  className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('ul')}
                  className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('li')}
                  className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200"
                  title="List Item"
                >
                  <span className="text-[12px] font-medium">LI</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('a')}
                  className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200"
                  title="Link"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('img')}
                  className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200"
                  title="Image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>

              <textarea
                id="content-textarea"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={12}
                required
                placeholder="Enter the post content... Use HTML for formatting: <strong>bold</strong>, <ul><li>list items</li></ul>, <a href='...'>links</a>, <img src='...' />"
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220] font-mono text-[13px]"
              />
              
              {/* Preview */}
              {formData.content && (
                <div className="mt-3 p-4 bg-gray-50 border border-gray-200">
                  <p className="text-[12px] text-gray-500 mb-2">Preview:</p>
                  <div 
                    className="text-[14px] text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                </div>
              )}
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
                  Post Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <h2 className="font-serif text-[18px] text-black border-b border-gray-200 pb-3">
                Featured Image
              </h2>
              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="https://..."
                />
                <p className="text-[12px] text-gray-500 mt-1">
                  Upload to Storage first, then paste URL
                </p>
              </div>
              {formData.featured_image && (
                <img
                  src={formData.featured_image}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
