import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';

async function getHeroImage(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero_image')
      .single();
    if (error || !data) return null;
    return typeof data.value === 'string' ? data.value : null;
  } catch {
    return null;
  }
}

export default async function Hero() {
  const heroImage = await getHeroImage();

  if (heroImage) {
    return (
      <section className="relative w-full">
        <img
          src={heroImage}
          alt="Hero banner"
          className="w-full object-cover max-h-[80vh]"
        />
      </section>
    );
  }

  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
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
    </section>
  );
}
