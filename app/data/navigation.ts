import { NavItem, FooterSection } from '@/app/types';

export const mainNavigation: NavItem[] = [
  {
    label: 'SHOP',
    href: '/shop',
    children: [
      { label: 'Necklaces', href: '/collections/necklaces' },
      { label: 'Bracelets', href: '/collections/bracelets' },
      { label: 'Pendants', href: '/collections/pendants' },
      { label: 'Rings', href: '/collections/rings' },
    ],
  },
  {
    label: 'BRIDAL',
    href: '/collections/bridal',
    children: [
      { label: 'Bridal Collection', href: '/collections/bridal' },
      { label: 'Ready to Ship', href: '/collections/ready-to-ship' },
      { label: 'Engagement Rings', href: '/collections/engagement-rings' },
      { label: 'Ring Settings', href: '/collections/settings' },
      { label: 'Eternity Bands', href: '/collections/eternity-bands' },
    ],
  },
  {
    label: 'CUSTOM',
    href: '/collections/custom-designs',
    children: [
      { label: 'Custom Designs', href: '/collections/custom-designs' },
      { label: 'Heirloom Revamps', href: '/collections/heirloom-revamps' },
      { label: 'Showroom Appointments', href: '/contact' },
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
