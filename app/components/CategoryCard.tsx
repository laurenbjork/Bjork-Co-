import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/app/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={category.href} className="block group">
      <div className="relative aspect-[4/3] mb-4 bg-gray-100 overflow-hidden">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-[12px]">{category.title}</span>
          </div>
        )}
      </div>
      <h3 className="text-[14px] font-medium text-black text-center mb-1">
        {category.title}
      </h3>
      <p className="text-[12px] text-gray-500 text-center">
        {category.description}
      </p>
    </Link>
  );
}
