'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SiteSettings {
  social_instagram: string;
  social_facebook: string;
  social_tiktok: string;
  contact_email: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({
    social_instagram: '',
    social_facebook: '',
    social_tiktok: '',
    contact_email: '',
  });

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        setSettings({
          social_instagram: data.social_instagram || '',
          social_facebook: data.social_facebook || '',
          social_tiktok: data.social_tiktok || '',
          contact_email: data.contact_email || '',
        });
      })
      .catch((err) => console.error('Error loading site settings:', err));
  }, []);

  return (
    <footer className="bg-[#013220] text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* 5 Column Grid - Logo + 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 md:gap-x-6 gap-y-8 items-start">
          {/* LOGO */}
          <div className="flex items-center justify-start h-full">
            <Link href="/" className="block">
              <Image
                src="/logo.svg"
                alt="BJÖRK & CO."
                width={140}
                height={28}
                className="h-[24px] w-auto brightness-0 invert"
                priority
              />
            </Link>
          </div>

          {/* CLIENT CONCIERGE */}
          <div>
            <h3 className="text-[11px] font-medium tracking-[0.15em] uppercase mb-3 text-white/80">
              Client Concierge
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/contact" className="text-[13px] text-white/70 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[13px] text-white/70 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-[13px] text-white/70 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* INFO */}
          <div>
            <h3 className="text-[11px] font-medium tracking-[0.15em] uppercase mb-3 text-white/80">
              Info
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/about" className="text-[13px] text-white/70 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/ring-size-guide" className="text-[13px] text-white/70 hover:text-white transition-colors">
                  Ring Size Guide
                </Link>
              </li>
              <li>
                <Link href="/diamond-education" className="text-[13px] text-white/70 hover:text-white transition-colors">
                  Diamond Education
                </Link>
              </li>
            </ul>
          </div>

          {/* APPOINTMENTS & EVENTS */}
          <div>
            <h3 className="text-[11px] font-medium tracking-[0.15em] uppercase mb-3 text-white/80">
              Appointments & Events
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/contact" className="text-[13px] text-white/70 hover:text-white transition-colors">
                  Showroom Appointments
                </Link>
              </li>
              <li>
                <Link href="/collections/custom-designs" className="text-[13px] text-white/70 hover:text-white transition-colors">
                  Heirloom Revamps
                </Link>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-[11px] font-medium tracking-[0.15em] uppercase mb-3 text-white/80">
              Newsletter
            </h3>
            <form className="flex items-center gap-2 mb-4">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 bg-transparent border-b border-white/30 text-white text-[13px] py-2 placeholder:text-white/40 focus:outline-none focus:border-white/60 min-w-0"
              />
              <button
                type="submit"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Subscribe"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </form>

            {/* Social Icons - Circular Outline */}
            <div className="flex gap-3">
              {settings.social_instagram && (
                <a
                  href={`https://instagram.com/${settings.social_instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-white/40 rounded-full flex items-center justify-center hover:border-white hover:bg-white/10 transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}
              {settings.social_facebook && (
                <a
                  href={`https://facebook.com/${settings.social_facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-white/40 rounded-full flex items-center justify-center hover:border-white hover:bg-white/10 transition-all"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {settings.social_tiktok && (
                <a
                  href={`https://tiktok.com/@${settings.social_tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-white/40 rounded-full flex items-center justify-center hover:border-white hover:bg-white/10 transition-all"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </a>
              )}
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="w-9 h-9 border border-white/40 rounded-full flex items-center justify-center hover:border-white hover:bg-white/10 transition-all"
                  aria-label="Email"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-center text-[10px] tracking-[0.1em] uppercase text-white/60">
            © 2025 BJÖRK & CO. JEWELRY. ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
}
