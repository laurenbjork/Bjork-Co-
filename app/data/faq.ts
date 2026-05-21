export interface FAQItem {
  id: string;
  category: 'General' | 'Orders' | 'Shipping' | 'Returns' | 'Jewelry Care';
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  // General
  {
    id: '1',
    category: 'General',
    question: 'What are your showroom hours?',
    answer: 'Our showroom is open Monday through Friday from 10:00 AM to 6:00 PM, and Saturday from 10:00 AM to 4:00 PM. We are closed on Sundays. Appointments are recommended for custom consultations but walk-ins are welcome for browsing.',
  },
  {
    id: '2',
    category: 'General',
    question: 'Do I need an appointment to visit the showroom?',
    answer: 'Appointments are recommended for custom design consultations, bridal appointments, and heirloom revamp discussions to ensure you have dedicated time with our team. For browsing and general inquiries, walk-ins are welcome during business hours.',
  },
  {
    id: '3',
    category: 'General',
    question: 'Where is your showroom located?',
    answer: 'Our flagship showroom is located in the heart of the jewelry district. The exact address is provided when you book an appointment. We also offer virtual consultations for clients unable to visit in person.',
  },
  {
    id: '4',
    category: 'General',
    question: 'How can I contact BJÖRK & CO.?',
    answer: 'You can reach us via email at hello@bjorkco.com, by phone at (555) 123-4567, or through the contact form on our website. For urgent inquiries, we recommend calling during business hours.',
  },

  // Orders
  {
    id: '5',
    category: 'Orders',
    question: 'How long does it take to create a custom piece?',
    answer: 'Custom design timelines vary based on complexity. Simple designs typically take 4-6 weeks, while elaborate pieces with multiple stones or intricate settings may take 8-12 weeks. We provide a detailed timeline during your consultation.',
  },
  {
    id: '6',
    category: 'Orders',
    question: 'Do you offer payment plans?',
    answer: 'Yes, we offer flexible payment plans for purchases over $2,000. A 50% deposit is required to begin custom work, with the balance due upon completion. We accept all major credit cards, wire transfers, and certified checks.',
  },
  {
    id: '7',
    category: 'Orders',
    question: 'Can I modify an existing design?',
    answer: 'Absolutely. Many of our pieces can be customized with different metals, stones, or proportions. Contact us to discuss modifications to any piece in our collection.',
  },
  {
    id: '8',
    category: 'Orders',
    question: 'How do I place a custom order?',
    answer: 'Begin by scheduling a consultation through our website or by phone. During the consultation, we discuss your vision, provide guidance on options, create sketches or renderings, and finalize the design before beginning production.',
  },

  // Shipping
  {
    id: '9',
    category: 'Shipping',
    question: 'What shipping methods do you offer?',
    answer: 'We ship all jewelry via insured FedEx Priority Overnight with signature required. This ensures your purchase arrives quickly and securely. International shipping is available via FedEx International Priority.',
  },
  {
    id: '10',
    category: 'Shipping',
    question: 'Is shipping insured?',
    answer: 'Yes, all shipments are fully insured for their full value from our door to yours. We use discreet, unmarked packaging for security. A signature is required for all deliveries.',
  },
  {
    id: '11',
    category: 'Shipping',
    question: 'How long does shipping take?',
    answer: 'Domestic orders typically arrive within 1-2 business days after shipping. International orders take 3-5 business days depending on the destination and customs processing.',
  },
  {
    id: '12',
    category: 'Shipping',
    question: 'Can I track my order?',
    answer: 'Yes, you will receive a tracking number via email as soon as your order ships. You can track your package through FedEx website or app.',
  },

  // Returns
  {
    id: '13',
    category: 'Returns',
    question: 'What is your return policy?',
    answer: 'We accept returns of unworn, undamaged items within 14 days of delivery for a full refund or exchange. Custom-designed pieces and engraved items are final sale. All returned items must include original packaging and certificates.',
  },
  {
    id: '14',
    category: 'Returns',
    question: 'Can I exchange an item?',
    answer: 'Yes, exchanges are welcome within 14 days. We can exchange for a different size, metal, or piece of equal or greater value. Price differences will be refunded or charged accordingly.',
  },
  {
    id: '15',
    category: 'Returns',
    question: 'How do I initiate a return?',
    answer: 'Contact us at hello@bjorkco.com to request a return authorization. We will provide instructions and a prepaid return shipping label. Items must be securely packaged in the original packaging.',
  },
  {
    id: '16',
    category: 'Returns',
    question: 'Are custom pieces returnable?',
    answer: 'Custom-designed pieces, including rings made to specific sizes and engraved items, are final sale and cannot be returned or exchanged. We ensure your complete satisfaction with the design before production begins.',
  },

  // Jewelry Care
  {
    id: '17',
    category: 'Jewelry Care',
    question: 'How should I clean my jewelry?',
    answer: 'Clean most jewelry by soaking in warm water with mild dish soap for 15-20 minutes, then gently brushing with a soft toothbrush. Rinse thoroughly and pat dry with a lint-free cloth. Avoid harsh chemicals and ultrasonic cleaners for delicate stones.',
  },
  {
    id: '18',
    category: 'Jewelry Care',
    question: 'How should I store my jewelry?',
    answer: 'Store pieces separately in soft pouches or a lined jewelry box to prevent scratching. Keep silver in anti-tarnish bags. Store chains flat or hanging to prevent tangling. Avoid exposing jewelry to direct sunlight for extended periods.',
  },
  {
    id: '19',
    category: 'Jewelry Care',
    question: 'Should I remove my jewelry for activities?',
    answer: 'Yes, remove jewelry before swimming (chlorine and salt water can damage metals), exercising, cleaning with chemicals, applying cosmetics or perfume, and before bed. These activities can cause damage, discoloration, or loss of stones.',
  },
  {
    id: '20',
    category: 'Jewelry Care',
    question: 'How often should I have my jewelry inspected?',
    answer: 'We recommend professional cleaning and inspection every 6-12 months. Regular inspections help identify loose stones, worn prongs, or other issues before they become serious. We offer complimentary cleaning and inspection for all BJÖRK & CO. pieces.',
  },
  {
    id: '21',
    category: 'Jewelry Care',
    question: 'Can I wear my jewelry in the shower?',
    answer: 'We recommend removing all fine jewelry before showering. Soap and shampoo can leave residue that dulls the sparkle of diamonds and gemstones. Water can also loosen settings over time.',
  },
];

export const faqCategories = ['General', 'Orders', 'Shipping', 'Returns', 'Jewelry Care'] as const;

export function getFAQsByCategory(category: string): FAQItem[] {
  return faqItems.filter((item) => item.category === category);
}
