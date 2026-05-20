import ProductCard from './ProductCard';
import { Product } from '@/app/types';

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

export default function RelatedProducts({
  products,
  title = 'You May Also Like',
}: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 border-t border-gray-100">
      <h2 className="font-serif text-[24px] text-[#013220] text-center mb-8">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
