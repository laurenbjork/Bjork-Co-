import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import Breadcrumb from '@/app/components/Breadcrumb';
import CollectionHeader from '@/app/components/CollectionHeader';
import FilterBar from '@/app/components/FilterBar';
import ProductGrid from '@/app/components/ProductGrid';
import { getProductsByCategory } from '@/app/lib/supabase-queries';

const collectionMetadata: Record<string, { title: string; description: string }> = {
  necklaces: {
    title: 'Necklaces',
    description: 'Elegant necklaces crafted in gold, platinum, and adorned with precious gemstones.',
  },
  bracelets: {
    title: 'Bracelets',
    description: 'Timeless bracelets and bangles, from delicate chains to statement tennis bracelets.',
  },
  pendants: {
    title: 'Pendants',
    description: 'Stunning pendants featuring diamonds, gemstones, and precious metals.',
  },
  rings: {
    title: 'Rings',
    description: 'Exquisite rings for every occasion, from stackable bands to statement pieces.',
  },
  bridal: {
    title: 'Bridal Collection',
    description: 'Exceptional engagement rings and wedding bands to celebrate your love story.',
  },
  'ready-to-ship': {
    title: 'Ready to Ship',
    description: 'Beautiful pieces available for immediate delivery.',
  },
  'engagement-rings': {
    title: 'Engagement Rings',
    description: 'Find the perfect ring to begin your forever together.',
  },
  settings: {
    title: 'Ring Settings',
    description: 'Choose from classic solitaire to halo settings for your perfect ring.',
  },
  'eternity-bands': {
    title: 'Eternity Bands',
    description: 'Timeless bands symbolizing endless love, set with continuous diamonds.',
  },
  'custom-designs': {
    title: 'Custom Designs',
    description: 'Bespoke jewelry created uniquely for you through personal consultation.',
  },
  'heirloom-revamps': {
    title: 'Heirloom Revamps',
    description: 'Transform treasured family pieces into modern masterpieces.',
  },
};

const categoryMapping: Record<string, string> = {
  necklaces: 'Necklaces',
  bracelets: 'Bracelets',
  pendants: 'Pendants',
  rings: 'Rings',
  bridal: 'Bridal',
  'ready-to-ship': 'Ready to Ship',
  'engagement-rings': 'Bridal',
  settings: 'Bridal',
  'eternity-bands': 'Eternity Bands',
  'custom-designs': 'Custom Designs',
  'heirloom-revamps': 'Heirloom Revamps',
};

export function generateStaticParams() {
  return Object.keys(collectionMetadata).map((slug) => ({
    slug,
  }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = collectionMetadata[slug];

  if (!meta) {
    return {
      title: 'Collection | BJÖRK & CO.',
    };
  }

  return {
    title: `${meta.title} | BJÖRK & CO.`,
    description: meta.description,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const meta = collectionMetadata[slug];

  if (!meta) {
    notFound();
  }

  const collectionProducts = await getProductsByCategory(slug);

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Shop', href: '/shop' },
              { label: meta.title },
            ]}
          />
          <CollectionHeader
            title={meta.title}
            description={meta.description}
            productCount={collectionProducts.length}
          />
          <FilterBar />
          <ProductGrid products={collectionProducts} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
