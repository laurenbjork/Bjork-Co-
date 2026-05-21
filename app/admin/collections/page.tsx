import Link from 'next/link';
import { getAllCollections } from '@/app/lib/supabase-queries';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default async function AdminCollectionsPage() {
  const collections = await getAllCollections();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] text-black">Collections</h1>
          <p className="text-gray-600 text-[14px] mt-1">
            Manage product collections ({collections.length} collections)
          </p>
        </div>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 px-4 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Collection
        </Link>
      </div>

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
                    <Link
                      href={`/admin/collections/${collection.id}/edit`}
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

        {collections.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-[14px]">No collections found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
