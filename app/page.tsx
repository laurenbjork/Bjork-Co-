export const dynamic = 'force-dynamic';

import AnnouncementBar from "./sections/AnnouncementBar";
import Header from "./sections/Header";
import Hero from "./sections/Hero";
import FeaturedCategories from "./sections/FeaturedCategories";
import ShopCollection from "./sections/ShopCollection";
import InstagramFeed from "./sections/InstagramFeed";
import Footer from "./sections/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedCategories />
        <ShopCollection />
        <InstagramFeed />
      </main>
      <Footer />
    </div>
  );
}
