export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: 'Bridal' | 'Custom' | 'Education' | 'News';
  author: string;
  publishDate: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-choose-engagement-ring',
    title: 'How to Choose the Perfect Engagement Ring',
    excerpt: 'A comprehensive guide to selecting an engagement ring that reflects your unique love story, from diamond selection to band styles.',
    content: `
      Choosing an engagement ring is one of the most significant purchases you'll make. At BJÖRK & CO., we believe the perfect ring reflects not just your love, but your individual style and values.

      ## Understanding the 4Cs

      The quality of a diamond is determined by the 4Cs: Cut, Color, Clarity, and Carat weight. While all four matter, we believe cut is the most important factor as it determines how brilliantly your diamond sparkles.

      ## Selecting the Right Metal

      From classic platinum to warm rose gold, the metal you choose sets the tone for your ring. Consider your lifestyle, skin tone, and existing jewelry when making this decision.

      ## Finding Your Style

      Whether you prefer timeless solitaires, vintage-inspired halos, or modern tension settings, your ring should feel like an extension of your personal aesthetic.

      ## The BJÖRK & CO. Difference

      Our master jewelers work with you to create a piece that tells your unique story. From initial consultation to final delivery, we're with you every step of the way.
    `,
    featuredImage: '/images/blog/engagement-ring.jpg',
    category: 'Bridal',
    author: 'Elena Björk',
    publishDate: '2024-12-15',
    readTime: '8 min read',
  },
  {
    slug: 'art-of-custom-jewelry-design',
    title: 'The Art of Custom Jewelry Design',
    excerpt: 'Discover the meticulous process behind creating bespoke jewelry pieces that capture your vision and stand the test of time.',
    content: `
      Custom jewelry design is where artistry meets craftsmanship. At BJÖRK & CO., every custom piece begins with a conversation.

      ## The Consultation

      We start by understanding your vision, inspiration, and the story you want to tell. Bring us sketches, photos, or simply ideas—we'll help translate them into wearable art.

      ## Design & Rendering

      Our designers create detailed sketches and 3D renderings, allowing you to see your piece before it's crafted. This collaborative process ensures every detail is perfect.

      ## Craftsmanship

      Once approved, our master jewelers bring your design to life using traditional techniques and modern precision. Each piece undergoes rigorous quality control.

      ## A Legacy Piece

      Custom jewelry becomes part of your story, passed down through generations. That's why we use only the finest materials and techniques.
    `,
    featuredImage: '/images/blog/custom-design.jpg',
    category: 'Custom',
    author: 'Marcus Chen',
    publishDate: '2024-11-28',
    readTime: '6 min read',
  },
  {
    slug: 'caring-for-fine-jewelry',
    title: 'Caring for Your Fine Jewelry',
    excerpt: 'Expert tips on cleaning, storing, and maintaining your precious pieces to ensure they remain beautiful for generations.',
    content: `
      Fine jewelry deserves proper care. With the right maintenance, your pieces can remain as brilliant as the day you received them.

      ## Daily Care

      Remove jewelry before swimming, exercising, or applying cosmetics. Chemicals and physical impact can damage precious metals and stones.

      ## Cleaning at Home

      Most jewelry can be cleaned with warm water, mild soap, and a soft brush. Rinse thoroughly and dry with a lint-free cloth. For delicate pieces, professional cleaning is recommended.

      ## Proper Storage

      Store pieces separately to prevent scratching. Use soft pouches or lined jewelry boxes. Keep silver in anti-tarnish bags.

      ## Professional Maintenance

      Visit us annually for professional cleaning and inspection. We'll check settings, clasps, and overall condition to prevent loss or damage.
    `,
    featuredImage: '/images/blog/jewelry-care.jpg',
    category: 'Education',
    author: 'Sarah Mitchell',
    publishDate: '2024-11-10',
    readTime: '5 min read',
  },
  {
    slug: 'heirloom-revamp-stories',
    title: 'Heirloom Revamp: Stories of Transformation',
    excerpt: 'Heartwarming stories of family treasures transformed into modern pieces while preserving their sentimental value.',
    content: `
      There's something magical about transforming a grandmother's brooch into a modern necklace, or resetting vintage stones into a contemporary ring.

      ## Preserving History

      Every heirloom carries stories. Our approach honors that history while creating something you can wear and enjoy today.

      ## The Process

      We carefully evaluate each piece, discussing what elements to preserve and what to reimagine. Sometimes it's a complete transformation; other times, subtle refinements.

      ## Client Stories

      From Art Deco diamonds reset in minimalist settings to Victorian gold melted and reshaped into modern bands, each revamp is unique.

      ## Start Your Journey

      Have a family treasure gathering dust? Let's discuss how to give it new life while honoring its past.
    `,
    featuredImage: '/images/blog/heirloom-revamp.jpg',
    category: 'Custom',
    author: 'Elena Björk',
    publishDate: '2024-10-22',
    readTime: '7 min read',
  },
  {
    slug: '2024-bridal-trends',
    title: '2024 Bridal Jewelry Trends',
    excerpt: 'From east-west settings to vintage revival, explore the bridal jewelry trends defining this year.',
    content: `
      This year's bridal jewelry combines timeless elegance with modern innovation. Here are the trends we're seeing in our showroom.

      ## East-West Settings

      Horizontal stone orientations are making a statement, offering a fresh take on classic shapes.

      ## Vintage Revival

      Art Deco and Victorian influences are everywhere, from milgrain details to intricate gallery work.

      ## Mixed Metals

      Combining white, yellow, and rose gold creates unique, personalized pieces that defy convention.

      ## Sustainable Choices

      Lab-grown diamonds and recycled metals are increasingly popular among environmentally conscious couples.

      ## Toi et Moi

      The two-stone ring symbolizes two souls coming together—a romantic trend with deep meaning.
    `,
    featuredImage: '/images/blog/bridal-trends.jpg',
    category: 'Bridal',
    author: 'Marcus Chen',
    publishDate: '2024-10-05',
    readTime: '5 min read',
  },
  {
    slug: 'diamond-buying-guide',
    title: 'The Complete Diamond Buying Guide',
    excerpt: 'Everything you need to know about purchasing a diamond, from certification to budgeting to selecting the perfect stone.',
    content: `
      Purchasing a diamond is a significant investment. This guide will help you make an informed decision.

      ## Certification Matters

      Always buy certified diamonds from reputable labs like GIA or AGS. Certification ensures you're getting what you pay for.

      ## Budget Wisely

      The traditional "two months salary" rule is outdated. Spend what feels comfortable for your situation. Remember, the setting is equally important.

      ## Shape & Style

      Round brilliants are classic, but fancy shapes like oval, cushion, and emerald cuts offer unique appeal and often better value.

      ## Beyond the 4Cs

      Consider fluorescence, polish, symmetry, and the overall look of the stone. Sometimes a slightly lower grade stone looks better to the eye.

      ## Working with a Jeweler

      Build a relationship with a trusted jeweler who can guide you through options and help you find the best value.
    `,
    featuredImage: '/images/blog/diamond-guide.jpg',
    category: 'Education',
    author: 'Sarah Mitchell',
    publishDate: '2024-09-18',
    readTime: '10 min read',
  },
  {
    slug: 'gemstone-engagement-rings',
    title: 'Gemstone Engagement Rings: Beyond Diamonds',
    excerpt: 'Exploring stunning alternatives from sapphires to emeralds for couples seeking something unique.',
    content: `
      While diamonds are traditional, colored gemstones offer distinctive beauty and personality for engagement rings.

      ## Sapphires

      Available in nearly every color, sapphires are durable (9 on Mohs scale) and rich with royal history. Blue sapphires remain the most popular choice.

      ## Emeralds

      With their vivid green hue, emeralds make a dramatic statement. They require more care due to their softer nature but are breathtakingly beautiful.

      ## Rubies

      Symbolizing passion and love, rubies are nearly as hard as diamonds and make bold, romantic engagement rings.

      ## Morganite

      This peachy-pink gemstone pairs beautifully with rose gold for a soft, romantic aesthetic.

      ## Considerations

      Gemstones have different hardness levels and care requirements. We'll help you choose a stone that fits your lifestyle.
    `,
    featuredImage: '/images/blog/gemstone-rings.jpg',
    category: 'Bridal',
    author: 'Elena Björk',
    publishDate: '2024-08-30',
    readTime: '6 min read',
  },
  {
    slug: 'wedding-band-styling',
    title: 'Wedding Band Styling Guide',
    excerpt: 'How to choose and style wedding bands that complement your engagement ring and reflect your personal aesthetic.',
    content: `
      Your wedding band is a symbol of eternal commitment. Here's how to choose one you'll love wearing forever.

      ## Matching vs. Mixing

      While matching sets are traditional, many couples now mix metals and styles for a personalized look.

      ## Band Widths

      Consider your engagement ring's band width when selecting. Delicate rings often pair best with thinner bands, while statement rings can handle wider styles.

      ## Curved and Contoured Bands

      These are designed to fit around engagement rings with large stones or unique settings, creating a seamless look.

      ## Eternity Bands

      Stones all around the band offer sparkle from every angle. Consider half-eternity for comfort and resizing flexibility.

      ## Stacking

      Many modern brides stack multiple bands—anniversary bands, birthstone bands, or different metal combinations—for a unique look.
    `,
    featuredImage: '/images/blog/wedding-bands.jpg',
    category: 'Bridal',
    author: 'Marcus Chen',
    publishDate: '2024-08-12',
    readTime: '5 min read',
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = getBlogPostBySlug(currentSlug);
  if (!currentPost) return [];

  return blogPosts
    .filter((post) => post.slug !== currentSlug && post.category === currentPost.category)
    .slice(0, limit);
}
