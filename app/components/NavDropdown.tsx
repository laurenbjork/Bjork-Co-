'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { NavItem } from '@/app/types';
import { cn } from '@/app/lib/utils';

interface NavDropdownProps {
  item: NavItem;
}

export default function NavDropdown({ item }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.children || item.children.length === 0) {
    return (
      <Link
        href={item.href}
        className="text-[13px] font-medium tracking-[0.05em] text-black hover:text-[#013220] transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={cn(
          'flex items-center gap-1 text-[13px] font-medium tracking-[0.05em] transition-colors',
          isOpen ? 'text-[#013220]' : 'text-black hover:text-[#013220]'
        )}
      >
        {item.label}
        <ChevronDown
          className={cn(
            'w-3 h-3 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-white shadow-lg border border-gray-100 py-3 px-4 min-w-[220px]">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className="block py-2 text-[14px] text-gray-700 hover:text-[#013220] transition-colors"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
