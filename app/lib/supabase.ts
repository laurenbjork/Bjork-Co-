import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Types for our database tables
export type Product = {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  long_description: string;
  price_visibility: 'visible' | 'inquiry' | 'coming_soon';
  price: number | null;
  price_range: string | null;
  availability_note: string | null;
  hero_image: string;
  gallery_images: string[];
  video_url: string | null;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  created_at: string;
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  created_at: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

export type FormSubmission = {
  id: string;
  type: 'product_inquiry' | 'custom_request' | 'appointment' | 'contact';
  product_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'new' | 'in_progress' | 'completed' | 'archived';
  notes: string | null;
  created_at: string;
  updated_at: string;
};
