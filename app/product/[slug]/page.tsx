import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AnnouncementBar from '@/app/sections/AnnouncementBar';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import Breadcrumb from '@/app/components/Breadcrumb';
import ProductGallery from '@/app/components/ProductGallery';
import ProductInfo from '@/app/components/ProductInfo';
import RelatedProducts from '@/app/components/RelatedProducts';
import { getProductBySlug, getAllProducts, getFeaturedProducts } from '@/app/lib/supabase-queries';
import { getProductImages } from '@/app/lib/supabase-admin';
import { convertSupabaseProduct } from '@/app/types/supabase';

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabaseProduct = await getProductBySlug(slug);

  if (!supabaseProduct) {
    return {
      title: 'Product | BJÖRK & CO.',
    };
  }

  const product = convertSupabaseProduct(supabaseProduct);

  return {
    title: `${product.name} | BJÖRK & CO.`,
    description: product.shortDescription || `Shop ${product.name} at BJÖRK & CO.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).replace(/ /g, '-');
  const supabaseProduct = await getProductBySlug(decodedSlug);

  if (!supabaseProduct) {
    notFound();
  }

  const product = convertSupabaseProduct(supabaseProduct);

  // Fetch images from product_images table
  const productImages = await getProductImages(supabaseProduct.id);
  const imageUrls = productImages.map((img: any) => img.image_url).filter(Boolean);
  const galleryImages = imageUrls.length > 0 ? imageUrls : (supabaseProduct.hero_image ? [supabaseProduct.hero_image] : []);

  // Get featured products as related (since we don't have related products table yet)
  const relatedSupabaseProducts = await getFeaturedProducts(4);
  const relatedProducts = relatedSupabaseProducts
    .filter((p) => p.id !== product.id)
    .map(convertSupabaseProduct);

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Shop', href: '/shop' },
              { label: product.name },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-8 sm:py-12">
            {/* Product Gallery */}
            <ProductGallery images={galleryImages} productName={product.name} />

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
