'use client';

import { useEffect } from 'react';
import { X, Eye } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';

interface Product {
  id: string;
  name: string;
  price?: number;
  price_visibility?: string;
  price_range?: string;
  hero_image?: string;
  short_description?: string;
  slug: string;
  cta_type?: string;
}

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const getPriceDisplay = () => {
    if (product.price_visibility === 'inquiry') {
      return (
        <span className="text-[14px] text-gray-600">
          {product.price_range || 'Inquire for price'}
        </span>
      );
    }

    if (product.price_visibility === 'coming_soon') {
      return (
        <span className="text-[14px] text-gray-600">
          {product.price_range || 'Coming soon'}
        </span>
      );
    }

    if (product.price) {
      return (
        <span className="text-[18px] font-medium text-black">
          ${product.price.toLocaleString()}
        </span>
      );
    }

    return (
      <span className="text-[14px] text-gray-600">Price on request</span>
    );
  };

  const getCtaText = () => {
    switch (product.cta_type) {
      case 'book_appointment':
        return 'Book Appointment';
      case 'request_details':
        return 'Request Details';
      default:
        return 'Inquire Now';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
          aria-label="Close quick view"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-gray-100">
            {product.hero_image ? (
              <img
                src={product.hero_image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Eye className="w-12 h-12 text-gray-300" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col">
            {/* Product Name */}
            <h2 className="font-serif text-[24px] md:text-[28px] text-black mb-2">
              {product.name}
            </h2>

            {/* Price */}
            <div className="mb-4">
              {getPriceDisplay()}
            </div>

            {/* Description */}
            {product.short_description && (
              <p className="text-[15px] text-gray-600 leading-relaxed mb-6">
                {product.short_description}
              </p>
            )}

            {/* Actions */}
            <div className="mt-auto space-y-3">
              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className={cn(
                  'block w-full py-4 px-6 text-center text-[14px] font-medium tracking-[0.05em] transition-colors',
                  'bg-[#013220] text-white hover:bg-black'
                )}
              >
                {getCtaText()}
              </Link>

              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="block w-full py-3 px-6 text-center text-[14px] text-gray-600 hover:text-black transition-colors border border-gray-300 hover:border-gray-400"
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
