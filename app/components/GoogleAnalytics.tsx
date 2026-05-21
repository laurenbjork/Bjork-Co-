'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId?: string;
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  // Get GA ID from environment or prop
  const measurementId = gaId || process.env.NEXT_PUBLIC_GA_ID;

  if (!measurementId) {
    return null;
  }

  return (
    <>
      {/* GA4 Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true,
            custom_map: {
              'dimension1': 'user_type',
              'dimension2': 'page_category'
            }
          });
        `}
      </Script>
    </>
  );
}

// Helper function to track events
export function trackEvent(
  eventName: string,
  eventParams?: { [key: string]: any }
) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
}

// Common events
export const AnalyticsEvents = {
  // Ecommerce events
  viewItem: (product: { id: string; name: string; price?: number }) => {
    trackEvent('view_item', {
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
      }],
    });
  },

  addToCart: (product: { id: string; name: string; price?: number }) => {
    trackEvent('add_to_cart', {
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
      }],
    });
  },

  beginCheckout: () => {
    trackEvent('begin_checkout');
  },

  // Engagement events
  newsletterSignup: (source: string) => {
    trackEvent('newsletter_signup', { source });
  },

  contactFormSubmit: (type: string) => {
    trackEvent('contact_form_submit', { form_type: type });
  },

  search: (query: string) => {
    trackEvent('search', { search_term: query });
  },

  // Social events
  share: (platform: string, content_type: string) => {
    trackEvent('share', {
      method: platform,
      content_type: content_type,
    });
  },
};
