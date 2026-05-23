import Link from 'next/link';

interface HeroSettings {
  hero_image: string | null;
  hero_title: string;
  hero_title_font: string;
  hero_title_size: string;
  hero_title_color: string;
  hero_cta_text: string;
  hero_cta_color: string;
}

async function getHeroSettings(): Promise<HeroSettings> {
  const defaults: HeroSettings = {
    hero_image: null,
    hero_title: 'Fine Jewelry',
    hero_title_font: 'serif',
    hero_title_size: '72',
    hero_title_color: '#ffffff',
    hero_cta_text: 'Shop Now',
    hero_cta_color: '#013220',
  };

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const keys = ['hero_image', 'hero_title', 'hero_title_font', 'hero_title_size', 'hero_title_color', 'hero_cta_text', 'hero_cta_color'];
    const filter = keys.map(k => `key.eq.${k}`).join(',');
    const res = await fetch(
      `${supabaseUrl}/rest/v1/site_settings?select=key,value&or=(${filter})`,
      {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
        cache: 'no-store',
      }
    );
    if (!res.ok) return defaults;
    const rows: { key: string; value: string }[] = await res.json();
    const map = rows.reduce((acc, r) => { acc[r.key] = r.value; return acc; }, {} as Record<string, string>);
    return {
      hero_image: map.hero_image || null,
      hero_title: map.hero_title || defaults.hero_title,
      hero_title_font: map.hero_title_font || defaults.hero_title_font,
      hero_title_size: map.hero_title_size || defaults.hero_title_size,
      hero_title_color: map.hero_title_color || defaults.hero_title_color,
      hero_cta_text: map.hero_cta_text || defaults.hero_cta_text,
      hero_cta_color: map.hero_cta_color || defaults.hero_cta_color,
    };
  } catch {
    return defaults;
  }
}

export default async function Hero() {
  const settings = await getHeroSettings();

  const fontFamily =
    settings.hero_title_font === 'sans-serif' ? 'sans-serif' :
    settings.hero_title_font === 'monospace' ? 'monospace' :
    'Georgia, serif';

  const titleStyle = {
    fontFamily,
    fontSize: `clamp(32px, ${settings.hero_title_size}px, ${settings.hero_title_size}px)`,
    color: settings.hero_title_color,
  };

  const ctaStyle = {
    backgroundColor: settings.hero_cta_color,
    color: '#ffffff',
  };

  return (
    <section className="relative w-full">
      {settings.hero_image ? (
        <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[85vh] overflow-hidden">
          <img
            src={settings.hero_image}
            alt="Hero banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center px-4">
            <h1
              className="mb-8 drop-shadow-lg"
              style={titleStyle}
            >
              {settings.hero_title}
            </h1>
            <Link
              href="/shop"
              className="inline-block text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3 transition-colors hover:opacity-90"
              style={ctaStyle}
            >
              {settings.hero_cta_text}
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white py-20 sm:py-28 lg:py-32">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2
              className="mb-8"
              style={{ ...titleStyle, color: settings.hero_title_color === '#ffffff' ? '#013220' : settings.hero_title_color }}
            >
              {settings.hero_title}
            </h2>
            <Link
              href="/shop"
              className="inline-block text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3 transition-colors hover:opacity-90"
              style={ctaStyle}
            >
              {settings.hero_cta_text}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
