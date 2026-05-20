'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import NavDropdown from '@/app/components/NavDropdown';
import MobileNav from '@/app/components/MobileNav';
import { mainNavigation } from '@/app/data/navigation';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex justify-center pt-6 pb-4">
          <Link href="/" className="block">
            <Image
              src="/logo.svg"
              alt="BJÖRK & CO."
              width={300}
              height={60}
              className="h-[28px] sm:h-[36px] w-auto"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pb-4">
          <MobileNav navigation={mainNavigation} />

          <nav className="hidden lg:flex items-center justify-center gap-8 flex-1">
            {mainNavigation.map((item) => (
              <NavDropdown key={item.label} item={item} />
            ))}
          </nav>

          <button
            className="p-2 text-black hover:text-[#013220] transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
