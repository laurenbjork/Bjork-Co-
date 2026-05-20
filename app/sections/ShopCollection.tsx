'use client';

import { useState } from 'react';
import ProductCard from '@/app/components/ProductCard';
import { Product } from '@/app/types';

const products: Product[] = [
  {
    id: '1',
    name: 'Emerald cut ring',
    price: 4500,
    priceVisibility: 'visible',
    image: '',
    href: '/product/emerald-ring',
  },
  {
    id: '2',
    name: 'Gold chain necklace',
    price: 2800,
    priceVisibility: 'visible',
    image: '',
    href: '/product/gold-chain',
  },
  {
    id: '3',
    name: 'Emerald cut ring',
    price: 5200,
    priceVisibility: 'visible',
    image: '',
    href: '/product/emerald-ring-2',
  },
];

export default function ShopCollection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="bg-[#F8F8F8] py-16 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-[24px] sm:text-[28px] text-[#013220] text-center mb-12">
          Shop the Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Carousel dots */}
        <div className="flex justify-center gap-2 mt-10">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? 'bg-[#013220]' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
