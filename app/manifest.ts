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
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['shopping', 'lifestyle'],
    screenshots: [
      {
        src: '/screenshots/home.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: '/screenshots/product.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
    shortcuts: [
      {
        name: 'Shop',
        short_name: 'Shop',
        description: 'Browse our jewelry collection',
        url: '/shop',
        icons: [{ src: '/icons/shop-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'Bridal',
        short_name: 'Bridal',
        description: 'Engagement rings and wedding bands',
        url: '/bridal',
        icons: [{ src: '/icons/bridal-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'Contact',
        short_name: 'Contact',
        description: 'Get in touch with us',
        url: '/contact',
        icons: [{ src: '/icons/contact-96x96.png', sizes: '96x96' }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
