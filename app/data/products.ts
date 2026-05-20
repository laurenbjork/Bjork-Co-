import { Product } from '@/app/types';

export const products: Product[] = [
  // Necklaces
  {
    id: 'n1',
    name: 'Diamond Solitaire Pendant',
    price: 3200,
    priceVisibility: 'visible',
    image: '',
    href: '/product/diamond-solitaire-pendant',
    category: 'Necklaces',
    description: 'A brilliant round-cut diamond set in 18k white gold.',
    details: ['18k White Gold', '1.0ct Diamond', '16-18" Chain'],
  },
  {
    id: 'n2',
    name: 'Pearl Strand Necklace',
    price: 1850,
    priceVisibility: 'visible',
    image: '',
    href: '/product/pearl-strand-necklace',
    category: 'Necklaces',
    description: 'Cultured South Sea pearls with 14k yellow gold clasp.',
    details: ['14k Yellow Gold', '8-9mm Pearls', '18" Length'],
  },
  {
    id: 'n3',
    name: 'Emerald Drop Necklace',
    priceVisibility: 'inquiry',
    image: '',
    href: '/product/emerald-drop-necklace',
    category: 'Necklaces',
    description: 'Colombian emeralds in a delicate drop setting.',
    details: ['18k Yellow Gold', 'Colombian Emeralds', 'Custom Chain'],
  },
  // Bracelets
  {
    id: 'b1',
    name: 'Gold Chain Bracelet',
    price: 1450,
    priceVisibility: 'visible',
    image: '',
    href: '/product/gold-chain-bracelet',
    category: 'Bracelets',
    description: 'Classic Cuban link chain in 14k yellow gold.',
    details: ['14k Yellow Gold', '7" Length', '4mm Width'],
  },
  {
    id: 'b2',
    name: 'Diamond Tennis Bracelet',
    price: 8500,
    priceVisibility: 'visible',
    image: '',
    href: '/product/diamond-tennis-bracelet',
    category: 'Bracelets',
    description: '3.5 carats of brilliant-cut diamonds.',
    details: ['18k White Gold', '3.5ct Diamonds', '7" Length'],
  },
  // Rings
  {
    id: 'r1',
    name: 'Emerald Cut Engagement Ring',
    price: 12500,
    priceVisibility: 'visible',
    image: '',
    href: '/product/emerald-cut-engagement-ring',
    category: 'Rings',
    description: 'Stunning 2ct emerald-cut diamond in platinum.',
    details: ['Platinum', '2ct Emerald Diamond', 'VS1 Clarity'],
  },
  {
    id: 'r2',
    name: 'Vintage Band Ring',
    price: 2800,
    priceVisibility: 'visible',
    image: '',
    href: '/product/vintage-band-ring',
    category: 'Rings',
    description: 'Art deco inspired band with milgrain detail.',
    details: ['18k Rose Gold', 'Vintage Style', 'Hand Engraved'],
  },
  {
    id: 'r3',
    name: 'Sapphire Statement Ring',
    priceVisibility: 'inquiry',
    image: '',
    href: '/product/sapphire-statement-ring',
    category: 'Rings',
    description: 'Ceylon blue sapphire with diamond halo.',
    details: ['18k White Gold', 'Ceylon Sapphire', 'Diamond Halo'],
  },
  // Pendants
  {
    id: 'p1',
    name: 'Gold Locket Pendant',
    price: 1200,
    priceVisibility: 'visible',
    image: '',
    href: '/product/gold-locket-pendant',
    category: 'Pendants',
    description: 'Classic oval locket in 14k yellow gold.',
    details: ['14k Yellow Gold', 'Engravable', '20" Chain'],
  },
  // Bridal
  {
    id: 'br1',
    name: 'Round Brilliant Solitaire',
    price: 8900,
    priceVisibility: 'visible',
    image: '',
    href: '/product/round-brilliant-solitaire',
    category: 'Bridal',
    description: 'Timeless 1.5ct round brilliant diamond.',
    details: ['Platinum', '1.5ct Diamond', 'H Color, VS2'],
  },
  {
    id: 'br2',
    name: 'Classic Eternity Band',
    price: 4500,
    priceVisibility: 'visible',
    image: '',
    href: '/product/classic-eternity-band',
    category: 'Eternity Bands',
    description: 'Full eternity band with round diamonds.',
    details: ['Platinum', '2.0ctw Diamonds', 'Size 6.5'],
  },
  // Custom
  {
    id: 'c1',
    name: 'Bespoke Diamond Ring',
    priceVisibility: 'inquiry',
    image: '',
    href: '/product/bespoke-diamond-ring',
    category: 'Custom Designs',
    description: 'Custom designed ring with heirloom diamonds.',
    details: ['Consultation Required', 'Heirloom Reset', 'Custom Design'],
  },
  {
    id: 'c2',
    name: 'Vintage Heirloom Revamp',
    priceVisibility: 'coming_soon',
    image: '',
    href: '/product/vintage-heirloom-revamp',
    category: 'Heirloom Revamps',
    description: 'Coming soon - new heirloom collection.',
    details: ['Coming Soon', 'Vintage Pieces', 'Modern Settings'],
  },
  // Ready to Ship
  {
    id: 'rs1',
    name: 'Stackable Gold Bands (Set of 3)',
    price: 950,
    priceVisibility: 'visible',
    image: '',
    href: '/product/stackable-gold-bands',
    category: 'Ready to Ship',
    description: 'Set of three 14k gold stacking bands.',
    details: ['14k Gold', 'Set of 3', 'Ready to Ship'],
  },
  {
    id: 'rs2',
    name: 'Minimalist Bar Necklace',
    price: 650,
    priceVisibility: 'visible',
    image: '',
    href: '/product/minimalist-bar-necklace',
    category: 'Ready to Ship',
    description: 'Clean, modern bar in 14k yellow gold.',
    details: ['14k Yellow Gold', '16" Chain', 'Ready to Ship'],
  },
];

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(p => p.category === category);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.href === `/product/${slug}`);
};

export const getRelatedProducts = (currentId: string, category: string, limit: number = 4): Product[] => {
  return products
    .filter(p => p.id !== currentId && (p.category === category || p.category === 'Ready to Ship'))
    .slice(0, limit);
};
