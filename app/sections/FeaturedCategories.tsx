import Link from 'next/link';

async function getFeaturedCollections() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const res = await fetch(
      `${supabaseUrl}/rest/v1/collections?select=id,name,slug,description,image&order=sort_order.asc&limit=3`,
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

export default async function FeaturedCategories() {
  const collections = await getFeaturedCollections();

  if (collections.length === 0) return null;

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
          {collections.map((col: any) => (
            <Link key={col.id} href={`/shop/${col.slug}`} className="block group">
              <div className="relative aspect-[4/3] mb-4 bg-gray-100 overflow-hidden">
                {col.image && col.image.startsWith('http') ? (
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200">
                    <span className="text-gray-400 text-[13px]">{col.name}</span>
                  </div>
                )}
              </div>
              <h3 className="font-serif text-[18px] text-[#013220] mb-1">{col.name}</h3>
              {col.description && (
                <p className="text-[13px] text-gray-500">{col.description}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
