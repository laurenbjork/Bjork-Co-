import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BJÖRK & CO. | Fine Jewelry',
    short_name: 'BJÖRK & CO.',
    description: 'Handcrafted fine jewelry, engagement rings, and custom designs.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#013220',
    orientation: 'portrait',
    scope: '/',
    lang: 'en',
    dir: 'ltr',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    categories: ['shopping', 'lifestyle'],
    shortcuts: [
      {
        name: 'Shop',
        short_name: 'Shop',
        description: 'Browse our jewelry collection',
        url: '/shop',
      },
      {
        name: 'Bridal',
        short_name: 'Bridal',
        description: 'Engagement rings and wedding bands',
        url: '/bridal',
      },
      {
        name: 'Contact',
        short_name: 'Contact',
        description: 'Get in touch with us',
        url: '/contact',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
