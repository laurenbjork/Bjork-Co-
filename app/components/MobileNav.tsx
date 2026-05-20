'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { NavItem } from '@/app/types';
import { cn } from '@/app/lib/utils';

interface MobileNavProps {
  navigation: NavItem[];
}

export default function MobileNav({ navigation }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isExpanded = (label: string) => expandedItems.includes(label);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-black"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-[300px] bg-white z-50 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-[16px] font-serif tracking-wide">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-black"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="py-4">
              {navigation.map((item) => (
                <div key={item.label} className="border-b border-gray-100">
                  {item.children && item.children.length > 0 ? (
                    <>
                      <button
                        onClick={() => toggleExpanded(item.label)}
                        className="flex items-center justify-between w-full px-4 py-3 text-[14px] font-medium tracking-[0.05em] text-black"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 transition-transform',
                            isExpanded(item.label) && 'rotate-180'
                          )}
                        />
                      </button>
                      {isExpanded(item.label) && (
                        <div className="bg-gray-50">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-8 py-3 text-[14px] text-gray-600"
                              onClick={() => setIsOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center justify-between px-4 py-3 text-[14px] font-medium tracking-[0.05em] text-black"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
