import CategoryCard from '@/app/components/CategoryCard';
import { Category } from '@/app/types';

const categories: Category[] = [
  {
    id: '1',
    title: 'Ready to Ship',
    description: 'Bracelets stacked on a wrist',
    image: '',
    href: '/shop/ready-to-ship',
  },
  {
    id: '2',
    title: 'Custom Design',
    description: 'Hands with custom design rings',
    image: '',
    href: '/custom/designs',
  },
  {
    id: '3',
    title: 'Best Sellers',
    description: 'Woman wearing a best-selling necklace',
    image: '',
    href: '/shop/best-sellers',
  },
];

export default function FeaturedCategories() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
