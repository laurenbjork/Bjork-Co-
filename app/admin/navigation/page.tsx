'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronRight, Link2, FolderOpen } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  parent_id: string | null;
  sort_order: number;
  is_visible: boolean;
  linked_category_id: string | null;
  linked_collection_id: string | null;
  children?: NavigationItem[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
}

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    label: '',
    href: '',
    parent_id: null as string | null,
    sort_order: 0,
    is_visible: true,
    linked_category_id: null as string | null,
    linked_collection_id: null as string | null,
  });

  useEffect(() => {
    loadNavigation();
    loadCategories();
    loadCollections();
  }, []);

  const loadNavigation = async () => {
    try {
      const response = await fetch('/api/navigation');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error loading navigation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      if (response.ok) {
        const data = await response.json();
        setCollections(data);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? '/api/navigation' : '/api/navigation';
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { ...formData, id: editingId } : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingId(null);
        resetForm();
        loadNavigation();
      }
    } catch (error) {
      console.error('Error saving navigation item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this navigation item? This will also delete any child items.')) return;

    try {
      const response = await fetch(`/api/navigation?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadNavigation();
      }
    } catch (error) {
      console.error('Error deleting navigation item:', error);
    }
  };

  const handleEdit = (item: NavigationItem) => {
    setEditingId(item.id);
    setFormData({
      label: item.label,
      href: item.href,
      parent_id: item.parent_id,
      sort_order: item.sort_order,
      is_visible: item.is_visible,
      linked_category_id: item.linked_category_id,
      linked_collection_id: item.linked_collection_id,
    });
    setShowForm(true);
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const resetForm = () => {
    setFormData({
      label: '',
      href: '',
      parent_id: null,
      sort_order: 0,
      is_visible: true,
      linked_category_id: null,
      linked_collection_id: null,
    });
  };

  const renderNavigationTree = (items: NavigationItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.id} className={cn('border-l-2', level > 0 ? 'border-gray-200 ml-4' : 'border-transparent')}>
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 hover:border-[#013220] transition-colors">
          {item.children && item.children.length > 0 && (
            <button
              onClick={() => toggleExpanded(item.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {expandedItems.has(item.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[14px] text-black">{item.label}</span>
              {item.linked_category_id && (
                <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded">Category</span>
              )}
              {item.linked_collection_id && (
                <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded">Collection</span>
              )}
              {!item.is_visible && (
                <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded">Hidden</span>
              )}
            </div>
            <div className="text-[12px] text-gray-500">{item.href}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(item)}
              className="p-2 text-gray-400 hover:text-[#013220] transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        {item.children && item.children.length > 0 && expandedItems.has(item.id) && (
          <div className="mt-2">
            {renderNavigationTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading navigation...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] text-black flex items-center gap-2">
            <Link2 className="w-7 h-7 text-[#013220]" />
            Navigation Management
          </h1>
          <p className="text-gray-600 text-[14px] mt-1">
            Manage navbar links and dropdown menus
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
          Add Navigation Item
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="font-serif text-[20px] text-black mb-4">
            {editingId ? 'Edit Navigation Item' : 'New Navigation Item'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[13px] font-medium text-black mb-2">
                  Label *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="e.g., SHOP"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[13px] font-medium text-black mb-2">
                  URL / Href *
                </label>
                <input
                  type="text"
                  value={formData.href}
                  onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="/shop or https://..."
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Parent Item
                </label>
                <select
                  value={formData.parent_id || ''}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                >
                  <option value="">None (Top Level)</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Link to Category (Optional)
                </label>
                <select
                  value={formData.linked_category_id || ''}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      linked_category_id: e.target.value || null,
                      linked_collection_id: null // Clear collection if category selected
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                >
                  <option value="">None</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Link to Collection (Optional)
                </label>
                <select
                  value={formData.linked_collection_id || ''}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      linked_collection_id: e.target.value || null,
                      linked_category_id: null // Clear category if collection selected
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                >
                  <option value="">None</option>
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>{col.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_visible"
                  checked={formData.is_visible}
                  onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                  className="w-4 h-4 border-gray-300 rounded focus:ring-[#013220]"
                />
                <label htmlFor="is_visible" className="text-[13px] text-black">
                  Visible in navigation
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-[#013220] text-white text-[13px] font-medium hover:bg-black transition-colors"
              >
                {editingId ? 'Save Changes' : 'Create Item'}
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

      {/* Navigation Tree */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
            <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-[14px]">No navigation items yet.</p>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                resetForm();
              }}
              className="inline-block mt-4 text-[#013220] hover:underline text-[14px]"
            >
              Create your first navigation item
            </button>
          </div>
        ) : (
          renderNavigationTree(items)
        )}
      </div>
    </div>
  );
}
