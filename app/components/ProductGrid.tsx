import ProductCard from './ProductCard';
import EmptyState from './EmptyState';
import { SupabaseProduct, convertSupabaseProduct } from '@/app/types/supabase';

interface ProductGridProps {
  products: SupabaseProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState title="No products in this collection" />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={convertSupabaseProduct(product)} />
      ))}
    </div>
  );
}
