'use client';

import { Product } from '@/app/types';
import Link from 'next/link';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderPrice = () => {
    switch (product.priceVisibility) {
      case 'visible':
        return product.price ? (
          <span className="text-[24px] text-[#013220] font-medium">
            {formatPrice(product.price)}
          </span>
        ) : null;
      case 'inquiry':
        return (
          <span className="text-[18px] text-gray-600 italic">
            Price available upon inquiry
          </span>
        );
      case 'coming_soon':
        return (
          <span className="text-[18px] text-gray-500">
            Coming Soon
          </span>
        );
      default:
        return null;
    }
  };

  const renderCTA = () => {
    switch (product.priceVisibility) {
      case 'visible':
        return (
          <button className="w-full bg-[#013220] text-white text-[13px] font-medium tracking-[0.1em] uppercase py-4 hover:bg-[#014225] transition-colors">
            Add to Cart
          </button>
        );
      case 'inquiry':
        return (
          <Link
            href="/contact"
            className="block w-full bg-[#013220] text-white text-[13px] font-medium tracking-[0.1em] uppercase py-4 text-center hover:bg-[#014225] transition-colors"
          >
            Inquire Now
          </Link>
        );
      case 'coming_soon':
        return (
          <button
            disabled
            className="w-full bg-gray-300 text-white text-[13px] font-medium tracking-[0.1em] uppercase py-4 cursor-not-allowed"
          >
            Coming Soon
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Label */}
      {product.category && (
        <Link
          href={`/collections/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
          className="inline-block text-[11px] uppercase tracking-[0.15em] text-gray-500 hover:text-[#013220] transition-colors"
        >
          {product.category}
        </Link>
      )}

      {/* Title */}
      <h1 className="font-serif text-[28px] sm:text-[36px] text-[#013220]">
        {product.name}
      </h1>

      {/* Price */}
      <div className="py-2">{renderPrice()}</div>

      {/* Description */}
      {product.description && (
        <p className="text-[14px] text-gray-600 leading-relaxed">
          {product.description}
        </p>
      )}

      {/* CTA */}
      {renderCTA()}

      {/* Details */}
      {product.details && product.details.length > 0 && (
        <div className="pt-6 border-t border-gray-100">
          <h2 className="text-[12px] uppercase tracking-[0.1em] text-gray-900 mb-3">
            Details
          </h2>
          <ul className="space-y-2">
            {product.details.map((detail, index) => (
              <li key={index} className="text-[13px] text-gray-600">
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
