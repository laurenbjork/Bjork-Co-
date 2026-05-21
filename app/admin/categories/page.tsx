import Link from 'next/link';
import { getAllCategories } from '@/app/lib/supabase-queries';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] text-black">Categories</h1>
          <p className="text-gray-600 text-[14px] mt-1">
            Manage product categories ({categories.length} categories)
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Category
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
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-[10px]">No img</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-[14px] text-black">
                        {category.name}
                      </p>
                      <p className="text-[12px] text-gray-500">{category.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-[14px] text-gray-600 max-w-md truncate">
                  {category.description || '-'}
                </td>
                <td className="px-4 py-4 text-[14px] text-black">
                  {category.sort_order}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
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

        {categories.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-[14px]">No categories found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
