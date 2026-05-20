import { NavItem, FooterSection } from '@/app/types';

export const mainNavigation: NavItem[] = [
  {
    label: 'SHOP',
    href: '/shop',
    children: [
      { label: 'Necklaces', href: '/shop/necklaces' },
      { label: 'Bracelets', href: '/shop/bracelets' },
      { label: 'Pendants', href: '/shop/pendants' },
      { label: 'Rings', href: '/shop/rings' },
    ],
  },
  {
    label: 'BRIDAL',
    href: '/bridal',
    children: [
      { label: 'Ready to Ship', href: '/bridal/ready-to-ship' },
      { label: 'Engagement Ring Settings', href: '/bridal/engagement-settings' },
      { label: 'Eternity Bands', href: '/bridal/eternity-bands' },
    ],
  },
  {
    label: 'CUSTOM',
    href: '/custom',
    children: [
      { label: 'Custom Designs & Heirloom Revamps', href: '/custom/designs' },
      { label: 'Showroom Appointments', href: '/custom/appointments' },
      { label: 'Custom Designs Gallery', href: '/custom/gallery' },
    ],
  },
  { label: 'BLOG', href: '/blog' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
];

export const footerSections: FooterSection[] = [
  {
    title: 'CLIENT CONCIERGE',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
  {
    title: 'INFO',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Ring Size Guide', href: '/size-guide' },
      { label: 'Diamond Education', href: '/education' },
    ],
  },
  {
    title: 'APPOINTMENTS & EVENTS',
    links: [
      { label: 'Showroom Appointments', href: '/appointments' },
      { label: 'Heirloom Revamps', href: '/heirloom-revamps' },
    ],
  },
];
