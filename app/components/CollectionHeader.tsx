interface CollectionHeaderProps {
  title: string;
  description?: string;
  productCount?: number;
}

export default function CollectionHeader({
  title,
  description,
  productCount,
}: CollectionHeaderProps) {
  return (
    <div className="text-center py-12 sm:py-16 border-b border-gray-100">
      <h1 className="font-serif text-[32px] sm:text-[40px] text-[#013220] mb-4">
        {title}
      </h1>
      {description && (
        <p className="text-[14px] text-gray-600 max-w-2xl mx-auto mb-4">
          {description}
        </p>
      )}
      {productCount !== undefined && (
        <p className="text-[12px] text-gray-500 uppercase tracking-wider">
          {productCount} {productCount === 1 ? 'Product' : 'Products'}
        </p>
      )}
    </div>
  );
}
