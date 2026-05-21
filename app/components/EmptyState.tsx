interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = 'No products found',
  description = 'Check back soon for new arrivals in this collection.',
}: EmptyStateProps) {
  return (
    <div className="py-20 text-center">
      <h3 className="font-serif text-[20px] text-[#013220] mb-2">{title}</h3>
      <p className="text-[14px] text-gray-500">{description}</p>
    </div>
  );
}
