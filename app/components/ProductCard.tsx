import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/app/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
          <span className="text-[14px] text-gray-700">{formatPrice(product.price)}</span>
        ) : null;
      case 'inquiry':
        return (
          <span className="text-[14px] text-gray-500 italic">Inquire for price</span>
        );
      case 'coming_soon':
        return (
          <span className="text-[14px] text-gray-500">Coming Soon</span>
        );
      default:
        return null;
    }
  };

  return (
    <Link href={product.href} className="block group">
      <div className="relative aspect-[3/4] mb-4 bg-gray-100 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 border border-gray-200">
            <div className="text-center">
              <span className="text-gray-400 text-[12px] block">{product.name}</span>
              <span className="text-gray-300 text-[10px] block mt-1">Image Placeholder</span>
            </div>
          </div>
        )}
      </div>
      <h3 className="text-[14px] font-medium text-black mb-1">
        {product.name}
      </h3>
      {renderPrice()}
    </Link>
  );
}
