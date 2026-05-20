'use client';

import { SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  sortOptions?: string[];
  onSortChange?: (value: string) => void;
}

export default function FilterBar({
  sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest'],
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100">
      <button className="flex items-center gap-2 text-[13px] text-gray-700 hover:text-[#013220] transition-colors">
        <SlidersHorizontal className="w-4 h-4" />
        Filter
      </button>

      <div className="flex items-center gap-2">
        <span className="text-[12px] text-gray-500">Sort by:</span>
        <select
          onChange={(e) => onSortChange?.(e.target.value)}
          className="text-[13px] text-gray-700 bg-transparent border-none focus:outline-none cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option} value={option.toLowerCase().replace(/\s+/g, '-')}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
