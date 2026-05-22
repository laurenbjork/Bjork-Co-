import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET all FAQs with categories (admin - includes inactive)
export async function GET() {
  try {
    // Get all categories
    const { data: categories, error: catError } = await supabase
      .from('faq_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (catError) {
      console.error('Error fetching FAQ categories:', catError);
      return NextResponse.json(
        { error: 'Failed to fetch FAQ categories' },
        { status: 500 }
      );
    }

    // Get all FAQs (including inactive for admin)
    const { data: faqs, error: faqError } = await supabase
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true });

    if (faqError) {
      console.error('Error fetching FAQs:', faqError);
      return NextResponse.json(
        { error: 'Failed to fetch FAQs' },
        { status: 500 }
      );
    }

    // Group FAQs by category
    const groupedData = categories?.map((category) => ({
      ...category,
      faqs: faqs?.filter((faq) => faq.category_id === category.id) || [],
    })) || [];

    return NextResponse.json(groupedData);
  } catch (error) {
    console.error('Error in admin FAQs API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
