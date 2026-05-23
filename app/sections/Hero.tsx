import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

async function getHeroImage(): Promise<string | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero_image')
      .single();
    return data?.value || null;
  } catch {
    return null;
  }
}

export default async function Hero() {
  const heroImage = await getHeroImage();

  return (
    <section className="relative w-full">
      {heroImage ? (
        <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[85vh] overflow-hidden">
          <img
            src={heroImage}
            alt="Hero banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-serif text-[40px] sm:text-[56px] lg:text-[72px] text-white mb-8 drop-shadow-lg">
              Fine Jewelry
            </h1>
            <Link
              href="/shop"
              className="inline-block bg-white text-[#013220] text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3 hover:bg-[#013220] hover:text-white transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white py-20 sm:py-28 lg:py-32">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-[36px] sm:text-[48px] lg:text-[56px] text-[#013220] mb-8">
              New Arrivals
            </h2>
            <Link
              href="/shop"
              className="inline-block bg-[#013220] text-white text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3 hover:bg-[#014225] transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
