import Link from 'next/link';
import { getAllBlogPosts } from '@/app/lib/supabase-queries';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

export default async function AdminBlogPage() {
  const posts = await getAllBlogPosts();

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

      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Post
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Category
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Published
              </th>
              <th className="px-4 py-3 text-right text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-[10px]">No img</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-[14px] text-black">
                        {post.title}
                      </p>
                      <p className="text-[12px] text-gray-500">{post.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-[12px] font-medium rounded ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : post.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-[14px] text-black capitalize">
                  {post.category || '-'}
                </td>
                <td className="px-4 py-4 text-[14px] text-gray-600">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : '-'}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-[#013220] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="p-2 text-gray-400 hover:text-[#013220] transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
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
    </div>
  );
}
