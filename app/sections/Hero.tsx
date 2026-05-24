'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeroSlide {
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  image?: string;
}

interface HeroSettings {
  hero_image: string | null;
  hero_title: string;
  hero_title_font: string;
  hero_title_size: string;
  hero_title_color: string;
  hero_cta_text: string;
  hero_cta_color: string;
  hero_cta_link: string;
  use_slider: boolean;
  slides: HeroSlide[];
}

function getDefaultSettings(): HeroSettings {
  return {
    hero_image: null,
    hero_title: 'Fine Jewelry',
    hero_title_font: 'serif',
    hero_title_size: '72',
    hero_title_color: '#ffffff',
    hero_cta_text: 'Shop Now',
    hero_cta_color: '#013220',
    hero_cta_link: '/shop',
    use_slider: false,
    slides: [
      {
        title: 'Timeless Elegance',
        subtitle: 'Handcrafted fine jewelry for life\'s precious moments',
        button_text: 'Shop Collection',
        button_link: '/shop',
      },
      {
        title: 'Custom Design',
        subtitle: 'Create something uniquely yours',
        button_text: 'Start Your Design',
        button_link: '/custom',
      },
    ],
  };
}

async function fetchHeroSettings(): Promise<HeroSettings> {
  const defaults = getDefaultSettings();
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) return defaults;
    const keys = ['hero_image', 'hero_title', 'hero_title_font', 'hero_title_size', 'hero_title_color', 'hero_cta_text', 'hero_cta_color', 'hero_cta_link', 'use_slider', 'hero_slides'];
    const filter = keys.map(k => `key.eq.${k}`).join(',');
    const res = await fetch(
      `${supabaseUrl}/rest/v1/site_settings?select=key,value&or=(${filter})`,
      {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      }
    );
    if (!res.ok) return defaults;
    const rows: { key: string; value: string }[] = await res.json();
    if (!Array.isArray(rows)) return defaults;
    const map = rows.reduce((acc, r) => { acc[r.key] = r.value; return acc; }, {} as Record<string, string>);
    
    let slides = defaults.slides;
    if (map.hero_slides) {
      try {
        slides = JSON.parse(map.hero_slides);
      } catch {
        slides = defaults.slides;
      }
    }

    return {
      hero_image: map.hero_image || null,
      hero_title: map.hero_title || defaults.hero_title,
      hero_title_font: map.hero_title_font || defaults.hero_title_font,
      hero_title_size: map.hero_title_size || defaults.hero_title_size,
      hero_title_color: map.hero_title_color || defaults.hero_title_color,
      hero_cta_text: map.hero_cta_text || defaults.hero_cta_text,
      hero_cta_color: map.hero_cta_color || defaults.hero_cta_color,
      hero_cta_link: map.hero_cta_link || defaults.hero_cta_link,
      use_slider: map.use_slider === 'true',
      slides,
    };
  } catch {
    return defaults;
  }
}

export default function Hero() {
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchHeroSettings().then(setSettings);
  }, []);

  const fontFamily =
    settings?.hero_title_font === 'sans-serif' ? 'sans-serif' :
    settings?.hero_title_font === 'monospace' ? 'monospace' :
    'Georgia, serif';

  const titleStyle = {
    fontFamily,
    fontSize: `clamp(32px, ${settings?.hero_title_size}px, ${settings?.hero_title_size}px)`,
    color: settings?.hero_title_color || '#ffffff',
  };

  const ctaStyle = {
    backgroundColor: settings?.hero_cta_color || '#013220',
    color: '#ffffff',
  };

  // Auto-advance slides - must be before any conditional returns
  useEffect(() => {
    if (!settings?.use_slider || !settings?.slides || settings.slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % settings.slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [settings?.use_slider, settings?.slides?.length]);

  if (!settings) return null;

  if (settings.use_slider && settings.slides.length > 0) {
    const slide = settings.slides[currentSlide];
    return (
      <section className="relative w-full">
        <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[85vh] overflow-hidden">
          {slide.image ? (
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
          )}
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center px-4">
            <h1
              className="mb-4 drop-shadow-lg"
              style={titleStyle}
            >
              {slide.title}
            </h1>
            <p className="text-white text-lg mb-8 drop-shadow-md max-w-2xl">
              {slide.subtitle}
            </p>
            <Link
              href={slide.button_link}
              className="inline-block text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3 transition-colors hover:opacity-90"
              style={ctaStyle}
            >
              {slide.button_text}
            </Link>
          </div>
          {/* Slide indicators */}
          {settings.slides.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
              {settings.slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Single hero image mode (fallback)
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
              href={settings.hero_cta_link}
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
              href={settings.hero_cta_link}
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
