import Image from 'next/image';

const instagramPosts = [
  { id: '1', alt: 'Instagram post 1' },
  { id: '2', alt: 'Instagram post 2' },
  { id: '3', alt: 'Instagram post 3' },
  { id: '4', alt: 'Instagram post 4' },
  { id: '5', alt: 'Instagram post 5' },
];

export default function InstagramFeed() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-[22px] sm:text-[26px] text-[#013220] text-center mb-10">
          @bjorkandco on Instagram
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com/bjorkandco"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square bg-gray-100 overflow-hidden group"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 border border-gray-300">
                <span className="text-gray-400 text-[11px]">{post.alt}</span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
