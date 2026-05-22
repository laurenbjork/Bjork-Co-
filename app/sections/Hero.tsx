import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';

async function getHeroSettings(): Promise<{ image: string | null; heading: string; buttonLink: string }> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['hero_image', 'hero_heading', 'hero_button_link']);

    if (error || !data) return { image: null, heading: 'New Arrivals', buttonLink: '/shop' };

    const map = data.reduce((acc, row) => { acc[row.key] = row.value; return acc; }, {} as Record<string, string>);

    return {
      image: map['hero_image'] || null,
      heading: map['hero_heading'] || 'New Arrivals',
      buttonLink: map['hero_button_link'] || '/shop',
    };
  } catch {
    return { image: null, heading: 'New Arrivals', buttonLink: '/shop' };
  }
}

export default async function Hero() {
  const { image, heading, buttonLink } = await getHeroSettings();

  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden">
      {image ? (
        <img
          src={image}
          alt="Hero banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[#013220]" />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center px-4">
        <h2 className="font-serif text-[36px] sm:text-[48px] lg:text-[56px] text-white mb-8 drop-shadow-md">
          {heading}
        </h2>
        <Link
          href={buttonLink}
          className="inline-block border border-white text-white text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3 hover:bg-white hover:text-black transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
