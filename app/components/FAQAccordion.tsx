'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { FAQItem } from '@/app/data/faq';

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-none overflow-hidden"
        >
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-[16px] text-black pr-4">
              {item.question}
            </span>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300',
                openId === item.id && 'rotate-180'
              )}
            />
          </button>

          <div
            className={cn(
              'overflow-hidden transition-all duration-300 ease-in-out',
              openId === item.id ? 'max-h-96' : 'max-h-0'
            )}
          >
            <div className="px-5 pb-5">
              <p className="text-[15px] text-gray-600 leading-relaxed whitespace-pre-line">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
