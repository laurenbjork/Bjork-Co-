'use client';

import FAQAccordion from './FAQAccordion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  name: string;
  faqs: FAQItem[];
}

interface FAQContentProps {
  categories: FAQCategory[];
}

export default function FAQContent({ categories }: FAQContentProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No FAQs available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-24">
      {categories.map((category) => (
        <section key={category.id}>
          <h2 className="font-serif text-[28px] text-black mb-8 pb-4 border-b border-gray-200">
            {category.name}
          </h2>
          <FAQAccordion items={category.faqs} />
        </section>
      ))}
    </div>
  );
}
