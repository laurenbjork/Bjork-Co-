export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export type Product = {
  id: string;
  name: string;
  price?: number;
  priceVisibility: 'visible' | 'inquiry' | 'coming_soon';
  image: string;
  href: string;
  category?: string;
  description?: string;
  details?: string[];
};

export type Category = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};
