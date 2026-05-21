import Link from 'next/link';
import { getAllProducts } from '@/app/lib/supabase-queries';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] text-black">Products</h1>
          <p className="text-gray-600 text-[14px] mt-1">
            Manage your product catalog ({products.length} products)
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Product
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Price
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Featured
              </th>
              <th className="px-4 py-3 text-right text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {product.hero_image ? (
                      <img
                        src={product.hero_image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-[10px]">No img</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-[14px] text-black">
                        {product.name}
                      </p>
                      <p className="text-[12px] text-gray-500">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-[12px] font-medium rounded ${
                      product.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : product.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-[14px] text-black">
                  {product.price
                    ? `$${product.price.toLocaleString()}`
                    : product.price_range || 'Inquiry'}
                </td>
                <td className="px-4 py-4">
                  {product.featured ? (
                    <span className="text-[#013220] text-[12px] font-medium">Yes</span>
                  ) : (
                    <span className="text-gray-400 text-[12px]">No</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/product/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-[#013220] transition-colors"
                      title="View on site"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2 text-gray-400 hover:text-[#013220] transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-[14px]">No products found.</p>
            <Link
              href="/admin/products/new"
              className="inline-block mt-4 text-[#013220] hover:underline text-[14px]"
            >
              Add your first product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
