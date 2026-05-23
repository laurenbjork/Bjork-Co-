import Link from 'next/link';

async function getPublishedProducts() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?select=id,name,slug,price,price_visibility,hero_image&status=eq.published&order=sort_order.asc&limit=6`,
      {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
        cache: 'no-store',
      }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function ShopCollection() {
  const products = await getPublishedProducts();

  return (
    <section className="bg-[#F8F8F8] py-16 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-[24px] sm:text-[28px] text-[#013220] text-center mb-12">
          Shop the Collection
        </h2>

        {products.length === 0 ? (
          <p className="text-center text-gray-400 text-[14px]">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product: any) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="block group">
                <div className="relative aspect-[3/4] mb-4 bg-gray-100 overflow-hidden">
                  {product.hero_image && product.hero_image.startsWith('http') ? (
                    <img
                      src={product.hero_image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 border border-gray-200">
                      <span className="text-gray-400 text-[12px]">{product.name}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-[14px] font-medium text-black mb-1">{product.name}</h3>
                {product.price_visibility === 'visible' && product.price ? (
                  <span className="text-[14px] text-gray-700">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(product.price)}
                  </span>
                ) : product.price_visibility === 'inquiry' ? (
                  <span className="text-[14px] text-gray-500 italic">Inquire for price</span>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
