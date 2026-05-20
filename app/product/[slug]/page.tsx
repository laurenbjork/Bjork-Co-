import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import Breadcrumb from '@/app/components/Breadcrumb';
import ProductGallery from '@/app/components/ProductGallery';
import ProductInfo from '@/app/components/ProductInfo';
import RelatedProducts from '@/app/components/RelatedProducts';
import { products, getProductBySlug, getRelatedProducts } from '@/app/data/products';

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.href.replace('/product/', ''),
  }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product | BJÖRK & CO.',
    };
  }

  return {
    title: `${product.name} | BJÖRK & CO.`,
    description: product.description || `Shop ${product.name} at BJÖRK & CO.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.id, product.category || '', 4);

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Shop', href: '/shop' },
              {
                label: product.category || 'Products',
                href: `/collections/${product.category?.toLowerCase().replace(/\s+/g, '-')}`,
              },
              { label: product.name },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-8 sm:py-12">
            {/* Product Gallery */}
            <ProductGallery productName={product.name} />

            {/* Product Info */}
            <ProductInfo product={product} />
          </div>

          {/* Related Products */}
          <RelatedProducts products={relatedProducts} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
