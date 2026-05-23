'use client';

import { useState, useEffect } from 'react';
import { getAllCollections } from '@/app/lib/supabase-queries';
import { createCollection, updateCollection } from '@/app/lib/supabase-admin';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCollection, setEditingCollection] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({ name: '', slug: '', description: '', image: '', sort_order: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<any>({ name: '', slug: '', description: '', image: '', sort_order: 0 });

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const cols = await getAllCollections();
      setCollections(cols);
    } catch (err) {
      console.error('Error loading collections:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] text-black">Collections</h1>
          <p className="text-gray-600 text-[14px] mt-1">
            Manage product collections ({collections.length} collections)
          </p>
        </div>
        <button
          onClick={() => {
            setCreating(true);
            setCreateForm({ name: '', slug: '', description: '', image: '', sort_order: 0 });
          }}
          className="flex items-center gap-2 px-4 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Collection
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 text-[14px]">Loading collections...</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                  Collection
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                  Sort Order
                </th>
                <th className="px-4 py-3 text-right text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {collections.map((collection) => (
                <tr key={collection.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {collection.image ? (
                        <img
                          src={collection.image}
                          alt={collection.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-[10px]">No img</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[14px] text-black">
                          {collection.name}
                        </p>
                        <p className="text-[12px] text-gray-500">{collection.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[14px] text-gray-600 max-w-md truncate">
                    {collection.description || '-'}
                  </td>
                  <td className="px-4 py-4 text-[14px] text-black">
                    {collection.sort_order}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingCollection(collection);
                          setEditForm({
                            name: collection.name || '',
                            slug: collection.slug || '',
                            description: collection.description || '',
                            image: collection.image || '',
                            sort_order: collection.sort_order || 0,
                          });
                        }}
                        className="p-2 text-gray-400 hover:text-[#013220] transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {collections.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-[14px]">No collections found.</p>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-[20px] text-black">Add Collection</h2>
              <button
                onClick={() => setCreating(false)}
                className="p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="e.g., Bridal"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={createForm.slug}
                  onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="e.g., bridal"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Description
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={createForm.image}
                  onChange={(e) => setCreateForm({ ...createForm, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="https://..."
                />
                <p className="text-[12px] text-gray-500 mt-1">
                  Used in navigation and collection pages
                </p>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={createForm.sort_order}
                  onChange={(e) => setCreateForm({ ...createForm, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCreating(false)}
                className="flex-1 py-3 border border-gray-300 text-[13px] font-medium tracking-[0.05em] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!createForm.name || !createForm.slug) {
                    alert('Name and slug are required');
                    return;
                  }
                  setIsSaving(true);
                  try {
                    await createCollection(createForm);
                    setCreating(false);
                    loadCollections();
                  } catch (err) {
                    console.error('Error creating collection:', err);
                    alert('Failed to create collection');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className={cn(
                  'flex-1 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] flex items-center justify-center gap-2',
                  isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black transition-colors'
                )}
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Creating...' : 'Create Collection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCollection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-[20px] text-black">Edit Collection</h2>
              <button
                onClick={() => setEditingCollection(null)}
                className="p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={editForm.slug}
                  onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="https://..."
                />
                <p className="text-[12px] text-gray-500 mt-1">
                  Used in navigation and collection pages
                </p>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={editForm.sort_order}
                  onChange={(e) => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditingCollection(null)}
                className="flex-1 py-3 border border-gray-300 text-[13px] font-medium tracking-[0.05em] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsSaving(true);
                  try {
                    await updateCollection(editingCollection.id, editForm);
                    setEditingCollection(null);
                    loadCollections();
                  } catch (err) {
                    console.error('Error saving collection:', err);
                    alert('Failed to save collection');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className={cn(
                  'flex-1 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] flex items-center justify-center gap-2',
                  isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black transition-colors'
                )}
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
