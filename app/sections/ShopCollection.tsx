import Link from 'next/link';

async function getPublishedCategories() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const res = await fetch(
      `${supabaseUrl}/rest/v1/categories?select=id,name,slug,image&order=sort_order.asc&limit=6`,
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
  const categories = await getPublishedCategories();

  return (
    <section className="bg-[#F8F8F8] py-16 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-[24px] sm:text-[28px] text-[#013220] text-center mb-12">
          Shop by Category
        </h2>

        {categories.length === 0 ? (
          <p className="text-center text-gray-400 text-[14px]">No categories available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((category: any) => (
              <Link key={category.id} href={`/category/${category.slug}`} className="block group">
                <div className="relative aspect-[3/4] mb-4 bg-gray-100 overflow-hidden">
                  {category.image && category.image.startsWith('http') ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 border border-gray-200">
                      <span className="text-gray-400 text-[12px]">{category.name}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-[14px] font-medium text-black mb-1">{category.name}</h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
