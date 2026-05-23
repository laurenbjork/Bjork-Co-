'use client';

import { useState, useEffect, useRef } from 'react';
import { Instagram, Plus, Trash2, GripVertical, Upload, X } from 'lucide-react';

interface InstagramPost {
  id: string;
  image_url: string;
  caption: string | null;
  link: string | null;
  sort_order: number;
  is_active: boolean;
}

export default function AdminInstagramPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    image_url: '',
    caption: '',
    link: '',
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/instagram');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch('/api/upload-instagram', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Upload failed');
      }

      const { url } = await res.json();
      setFormData({ ...formData, image_url: url });
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({ image_url: '', caption: '', link: '' });
        loadPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    try {
      const response = await fetch(`/api/instagram/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/instagram/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        loadPosts();
      }
    } catch (error) {
      console.error('Error toggling post:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] text-black">Instagram Feed</h1>
          <p className="text-gray-600 text-[14px] mt-1">
            Manage Instagram posts displayed on your homepage
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Post
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="font-serif text-[18px] text-black mb-4">Add Instagram Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-black mb-2">
                Image *
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                />
                {isUploading && (
                  <p className="text-[13px] text-gray-500">Uploading...</p>
                )}
              </div>
            </div>

            {formData.image_url && (
              <div className="pt-2">
                <label className="block text-[13px] font-medium text-black mb-2">Preview</label>
                <div className="relative inline-block">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={!formData.image_url || isUploading}
                className="px-6 py-3 bg-[#013220] text-white text-[13px] font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Feed
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ image_url: '', caption: '', link: '' });
                }}
                className="px-6 py-3 border border-gray-300 text-[13px] font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`relative group aspect-square bg-gray-100 rounded-lg overflow-hidden ${
                !post.is_active ? 'opacity-60' : ''
              }`}
            >
              <img
                src={post.image_url}
                alt={post.caption || 'Instagram post'}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                <div className="absolute top-2 left-2 p-1.5 bg-white/90 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                  <GripVertical className="w-4 h-4 text-gray-600" />
                </div>

                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleActive(post.id, post.is_active)}
                    className={`p-1.5 rounded text-[11px] font-medium ${
                      post.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {post.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-1.5 bg-red-100 rounded hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                {post.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white text-[11px] line-clamp-2">
                      {post.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
          <Instagram className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-[14px]">No Instagram posts yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-block mt-4 text-[#013220] hover:underline text-[14px]"
          >
            Add your first post
          </button>
        </div>
      )}
    </div>
  );
}
