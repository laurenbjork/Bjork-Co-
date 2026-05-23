'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllBlogPosts } from '@/app/lib/supabase-queries';
import { updateBlogPost } from '@/app/lib/supabase-admin';
import { Plus, Edit2, Trash2, Eye, X, Save } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editForm, setEditForm] = useState({ title: '', slug: '', content: '', excerpt: '', category: '', status: 'draft', featured_image: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getAllBlogPosts();
      setPosts(data);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] text-black">Blog Posts</h1>
          <p className="text-gray-600 text-[14px] mt-1">
            Manage blog content ({posts.length} posts)
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4" />
          Write Post
        </Link>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 text-[14px]">Loading posts...</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">Post</th>
                <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">Published</th>
                <th className="px-4 py-3 text-right text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {post.featured_image ? (
                        <img src={post.featured_image} alt={post.title} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-[10px]">No img</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[14px] text-black">{post.title}</p>
                        <p className="text-[12px] text-gray-500">{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-[12px] font-medium rounded ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' : post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[14px] text-black capitalize">{post.category || '-'}</td>
                  <td className="px-4 py-4 text-[14px] text-gray-600">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-[#013220] transition-colors">
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setEditForm({
                            title: post.title || '',
                            slug: post.slug || '',
                            content: post.content || '',
                            excerpt: post.excerpt || '',
                            category: post.category || '',
                            status: post.status || 'draft',
                            featured_image: post.featured_image || '',
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

          {posts.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-[14px]">No blog posts found.</p>
              <Link
                href="/admin/blog/new"
                className="inline-block mt-4 text-[#013220] hover:underline text-[14px]"
              >
                Write your first post
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-[20px] text-black">Edit Post</h2>
              <button onClick={() => setEditingPost(null)} className="p-2 text-gray-400 hover:text-black transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-[13px] font-medium text-black mb-2">Title</label><input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]" /></div>
              <div><label className="block text-[13px] font-medium text-black mb-2">Slug</label><input type="text" value={editForm.slug} onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })} className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]" /></div>
              <div><label className="block text-[13px] font-medium text-black mb-2">Excerpt</label><textarea value={editForm.excerpt} onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })} rows={2} className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]" /></div>
              <div><label className="block text-[13px] font-medium text-black mb-2">Content</label><textarea value={editForm.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} rows={6} className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]" /></div>
              <div><label className="block text-[13px] font-medium text-black mb-2">Category</label><input type="text" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]" /></div>
              <div><label className="block text-[13px] font-medium text-black mb-2">Status</label>
                <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]">
                  <option value="draft">Draft</option><option value="published">Published</option>
                </select>
              </div>
              <div><label className="block text-[13px] font-medium text-black mb-2">Featured Image URL</label><input type="url" value={editForm.featured_image} onChange={(e) => setEditForm({ ...editForm, featured_image: e.target.value })} className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]" /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditingPost(null)} className="flex-1 py-3 border border-gray-300 text-[13px] font-medium tracking-[0.05em] hover:bg-gray-50 transition-colors">Cancel</button>
              <button
                onClick={async () => {
                  setIsSaving(true);
                  try { await updateBlogPost(editingPost.id, editForm); setEditingPost(null); loadPosts(); } catch (err) { console.error(err); alert('Failed to save post'); } finally { setIsSaving(false); }
                }}
                disabled={isSaving}
                className={cn('flex-1 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] flex items-center justify-center gap-2', isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black transition-colors')}
              ><Save className="w-4 h-4" />{isSaving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
