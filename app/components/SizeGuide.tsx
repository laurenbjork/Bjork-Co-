'use client';

import { useState, useEffect } from 'react';
import { X, Ruler } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface SizeGuideData {
  id: string;
  category: string;
  title: string;
  content: {
    description?: string;
    sizes?: Array<{
      label: string;
      value: string;
      measurement?: string;
    }>;
    tips?: string[];
  };
  image_url?: string;
}

interface SizeGuideProps {
  category: 'rings' | 'necklaces' | 'bracelets';
  trigger?: React.ReactNode;
  className?: string;
}

export default function SizeGuide({ category, trigger, className }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [guide, setGuide] = useState<SizeGuideData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSizeGuide();
    }
  }, [isOpen, category]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const loadSizeGuide = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/size-guides?category=${category}`);
      if (response.ok) {
        const data = await response.json();
        setGuide(data);
      }
    } catch (error) {
      console.error('Error loading size guide:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultContent = {
    rings: {
      title: 'Ring Size Guide',
      description: 'To find your ring size, measure the circumference of your finger in millimeters or use a ring sizer. Our rings are available in US sizes 4-10 including half sizes.',
      sizes: [
        { label: 'Size 4', value: '46.8 mm', measurement: '14.9 mm diameter' },
        { label: 'Size 5', value: '49.3 mm', measurement: '15.7 mm diameter' },
        { label: 'Size 6', value: '51.9 mm', measurement: '16.5 mm diameter' },
        { label: 'Size 7', value: '54.4 mm', measurement: '17.3 mm diameter' },
        { label: 'Size 8', value: '57.0 mm', measurement: '18.2 mm diameter' },
        { label: 'Size 9', value: '59.5 mm', measurement: '19.0 mm diameter' },
        { label: 'Size 10', value: '62.1 mm', measurement: '19.8 mm diameter' },
      ],
      tips: [
        'Measure your finger at the end of the day when it\'s at its largest',
        'Ensure the ring sizer fits snugly but can slide over your knuckle',
        'Consider wider bands may require a slightly larger size',
        'If between sizes, we recommend sizing up',
      ],
    },
    necklaces: {
      title: 'Necklace Length Guide',
      description: 'Choose the perfect necklace length based on your style and neckline. All lengths include the clasp in the measurement.',
      sizes: [
        { label: 'Choker', value: '14-16"', measurement: 'Sits at base of neck' },
        { label: 'Princess', value: '17-19"', measurement: 'Sits at collarbone' },
        { label: 'Matinee', value: '20-24"', measurement: 'Sits at top of bust' },
        { label: 'Opera', value: '28-34"', measurement: 'Sits at bust line' },
        { label: 'Rope', value: '36-42"', measurement: 'Sits below bust' },
      ],
      tips: [
        'Consider your neckline - lower necklines work with longer chains',
        'Layer different lengths for a trendy look',
        'Petite frames may prefer shorter lengths',
        'Add a pendant to customize the drop length',
      ],
    },
    bracelets: {
      title: 'Bracelet Size Guide',
      description: 'Measure your wrist circumference and add 0.5-1 inch for a comfortable fit. Our bracelets are available in multiple sizes or adjustable designs.',
      sizes: [
        { label: 'Extra Small', value: '5.5-6"', measurement: '13.9-15.2 cm' },
        { label: 'Small', value: '6-6.5"', measurement: '15.2-16.5 cm' },
        { label: 'Medium', value: '6.5-7"', measurement: '16.5-17.8 cm' },
        { label: 'Large', value: '7-7.5"', measurement: '17.8-19.0 cm' },
        { label: 'Extra Large', value: '7.5-8"', measurement: '19.0-20.3 cm' },
      ],
      tips: [
        'Use a flexible measuring tape for accuracy',
        'Measure at the narrowest point of your wrist',
        'Add 0.5" for a snug fit, 1" for a loose fit',
        'Consider the bracelet style - bangles need to fit over your hand',
      ],
    },
  };

  const content = guide?.content || defaultContent[category];
  const title = guide?.title || defaultContent[category].title;
  const imageUrl = guide?.image_url || undefined;

  return (
    <>
      {/* Trigger */}
      {trigger ? (
        <button onClick={() => setIsOpen(true)} className={className}>
          {trigger}
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'inline-flex items-center gap-1.5 text-[13px] text-gray-600 hover:text-[#013220] transition-colors underline underline-offset-2',
            className
          )}
        >
          <Ruler className="w-4 h-4" />
          Size Guide
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="font-serif text-[24px] text-black flex items-center gap-2">
                <Ruler className="w-6 h-6 text-[#013220]" />
                {title}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close size guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isLoading ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Loading size guide...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Image */}
                  {imageUrl && (
                    <div className="mb-6">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full max-h-64 object-contain rounded-lg"
                      />
                    </div>
                  )}

                  {/* Description */}
                  {content.description && (
                    <p className="text-[15px] text-gray-600 leading-relaxed">
                      {content.description}
                    </p>
                  )}

                  {/* Size Table */}
                  {content.sizes && content.sizes.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-600 uppercase tracking-wider">
                              Size
                            </th>
                            <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-600 uppercase tracking-wider">
                              Circumference
                            </th>
                            <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-600 uppercase tracking-wider">
                              Details
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {content.sizes.map((size, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-[14px] font-medium text-black">
                                {size.label}
                              </td>
                              <td className="py-3 px-4 text-[14px] text-gray-700">
                                {size.value}
                              </td>
                              <td className="py-3 px-4 text-[14px] text-gray-600">
                                {size.measurement}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Tips */}
                  {content.tips && content.tips.length > 0 && (
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h3 className="font-medium text-[16px] text-black mb-3">
                        Helpful Tips
                      </h3>
                      <ul className="space-y-2">
                        {content.tips.map((tip, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-[14px] text-gray-600"
                          >
                            <span className="w-1.5 h-1.5 bg-[#013220] rounded-full mt-2 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 px-6 bg-[#013220] text-white text-[14px] font-medium tracking-[0.05em] hover:bg-black transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
