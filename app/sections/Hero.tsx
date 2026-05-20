import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-[36px] sm:text-[48px] lg:text-[56px] text-[#013220] mb-8">
          New Arrivals
        </h2>
        <Link
          href="/shop"
          className="inline-block bg-[#013220] text-white text-[13px] font-medium tracking-[0.1em] uppercase px-8 py-3 hover:bg-[#014225] transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
