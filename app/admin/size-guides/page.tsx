'use client';

import { useState, useEffect } from 'react';
import { Ruler, Plus, Edit2, Eye, EyeOff, Trash2 } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface SizeGuide {
  id: string;
  category: 'rings' | 'necklaces' | 'bracelets';
  title: string;
  content: {
    description?: string;
    sizes?: Array<{
      label: string;
      value: string;
      measurement?: string;
    }>;
    tips?: string[];
  };
  image_url?: string;
  is_active: boolean;
  sort_order: number;
}

const categoryLabels = {
  rings: 'Rings',
  necklaces: 'Necklaces',
  bracelets: 'Bracelets',
};

export default function AdminSizeGuidesPage() {
  const [guides, setGuides] = useState<SizeGuide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SizeGuide>>({
    category: 'rings',
    title: '',
    content: { description: '', sizes: [], tips: [] },
    image_url: '',
    is_active: true,
  });

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    try {
      const response = await fetch('/api/size-guides/all');
      if (response.ok) {
        const data = await response.json();
        setGuides(data);
      }
    } catch (error) {
      console.error('Error loading size guides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/size-guides/${editingId}`
        : '/api/size-guides';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingId(null);
        resetForm();
        loadGuides();
      }
    } catch (error) {
      console.error('Error saving size guide:', error);
    }
  };

  const handleEdit = (guide: SizeGuide) => {
    setEditingId(guide.id);
    setFormData({
      category: guide.category,
      title: guide.title,
      content: guide.content,
      image_url: guide.image_url,
      is_active: guide.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    try {
      const response = await fetch(`/api/size-guides/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadGuides();
      }
    } catch (error) {
      console.error('Error deleting size guide:', error);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/size-guides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        loadGuides();
      }
    } catch (error) {
      console.error('Error toggling size guide:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'rings',
      title: '',
      content: { description: '', sizes: [], tips: [] },
      image_url: '',
      is_active: true,
    });
  };

  const addSize = () => {
    const sizes = formData.content?.sizes || [];
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        sizes: [...sizes, { label: '', value: '', measurement: '' }],
      },
    });
  };

  const updateSize = (index: number, field: string, value: string) => {
    const sizes = [...(formData.content?.sizes || [])];
    sizes[index] = { ...sizes[index], [field]: value };
    setFormData({
      ...formData,
      content: { ...formData.content, sizes },
    });
  };

  const removeSize = (index: number) => {
    const sizes = [...(formData.content?.sizes || [])];
    sizes.splice(index, 1);
    setFormData({
      ...formData,
      content: { ...formData.content, sizes },
    });
  };

  const addTip = () => {
    const tips = formData.content?.tips || [];
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        tips: [...tips, ''],
      },
    });
  };

  const updateTip = (index: number, value: string) => {
    const tips = [...(formData.content?.tips || [])];
    tips[index] = value;
    setFormData({
      ...formData,
      content: { ...formData.content, tips },
    });
  };

  const removeTip = (index: number) => {
    const tips = [...(formData.content?.tips || [])];
    tips.splice(index, 1);
    setFormData({
      ...formData,
      content: { ...formData.content, tips },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading size guides...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] text-black">Size Guides</h1>
          <p className="text-gray-600 text-[14px] mt-1">
            Manage size charts for rings, necklaces, and bracelets
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Size Guide
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="font-serif text-[18px] text-black mb-4">
            {editingId ? 'Edit Size Guide' : 'New Size Guide'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as any })
                  }
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                >
                  <option value="rings">Rings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="bracelets">Bracelets</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="e.g., Ring Size Guide"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-black mb-2">
                Description
              </label>
              <textarea
                value={formData.content?.description || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, description: e.target.value },
                  })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                placeholder="General description for the size guide..."
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-black mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={formData.image_url || ''}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                placeholder="https://..."
              />
            </div>

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-black">Size Chart</label>
                <button
                  type="button"
                  onClick={addSize}
                  className="text-[13px] text-[#013220] hover:underline"
                >
                  + Add Size
                </button>
              </div>
              <div className="space-y-2">
                {formData.content?.sizes?.map((size, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={size.label}
                      onChange={(e) => updateSize(index, 'label', e.target.value)}
                      placeholder="Label (e.g., Size 7)"
                      className="flex-1 px-3 py-2 border border-gray-300 text-[13px] focus:outline-none focus:border-[#013220]"
                    />
                    <input
                      type="text"
                      value={size.value}
                      onChange={(e) => updateSize(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-3 py-2 border border-gray-300 text-[13px] focus:outline-none focus:border-[#013220]"
                    />
                    <input
                      type="text"
                      value={size.measurement || ''}
                      onChange={(e) => updateSize(index, 'measurement', e.target.value)}
                      placeholder="Details"
                      className="flex-1 px-3 py-2 border border-gray-300 text-[13px] focus:outline-none focus:border-[#013220]"
                    />
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-black">Tips</label>
                <button
                  type="button"
                  onClick={addTip}
                  className="text-[13px] text-[#013220] hover:underline"
                >
                  + Add Tip
                </button>
              </div>
              <div className="space-y-2">
                {formData.content?.tips?.map((tip, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => updateTip(index, e.target.value)}
                      placeholder="Helpful tip..."
                      className="flex-1 px-3 py-2 border border-gray-300 text-[13px] focus:outline-none focus:border-[#013220]"
                    />
                    <button
                      type="button"
                      onClick={() => removeTip(index)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label htmlFor="is_active" className="text-[13px] text-black">
                Active
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-[#013220] text-white text-[13px] font-medium hover:bg-black transition-colors"
              >
                {editingId ? 'Save Changes' : 'Create Guide'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-6 py-3 border border-gray-300 text-[13px] font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Guides List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className={cn(
              'bg-white border border-gray-200 p-5',
              !guide.is_active && 'opacity-60'
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#013220]/10 rounded-full flex items-center justify-center">
                  <Ruler className="w-5 h-5 text-[#013220]" />
                </div>
                <div>
                  <h3 className="font-medium text-[14px] text-black">
                    {categoryLabels[guide.category]}
                  </h3>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-[11px]',
                      guide.is_active ? 'text-green-600' : 'text-gray-500'
                    )}
                  >
                    {guide.is_active ? (
                      <>
                        <Eye className="w-3 h-3" /> Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" /> Inactive
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <h4 className="font-serif text-[16px] text-black mb-2">{guide.title}</h4>

            {guide.content.description && (
              <p className="text-[13px] text-gray-600 mb-3 line-clamp-2">
                {guide.content.description}
              </p>
            )}

            <div className="text-[12px] text-gray-500 mb-4">
              {guide.content.sizes?.length || 0} sizes •{' '}
              {guide.content.tips?.length || 0} tips
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(guide)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-[13px] font-medium hover:bg-gray-200 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => toggleActive(guide.id, guide.is_active)}
                className={cn(
                  'p-2 transition-colors',
                  guide.is_active
                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {guide.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleDelete(guide.id)}
                className="p-2 bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {guides.length === 0 && (
        <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
          <Ruler className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-[14px]">No size guides configured.</p>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
            }}
            className="inline-block mt-4 text-[#013220] hover:underline text-[14px]"
          >
            Create your first size guide
          </button>
        </div>
      )}
    </div>
  );
}
