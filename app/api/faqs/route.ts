import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET all FAQs with categories (public)
export async function GET() {
  try {
    // Get categories with their FAQs
    const { data: categories, error: catError } = await supabase
      .from('faq_categories')
      .select('id, name, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (catError) {
      console.error('Error fetching FAQ categories:', catError);
      return NextResponse.json(
        { error: 'Failed to fetch FAQ categories' },
        { status: 500 }
      );
    }

    // Get all active FAQs
    const { data: faqs, error: faqError } = await supabase
      .from('faqs')
      .select('id, category_id, question, answer, sort_order')
      .eq('is_active', true)
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
      id: category.id,
      name: category.name,
      sort_order: category.sort_order,
      faqs: faqs?.filter((faq) => faq.category_id === category.id) || [],
    })) || [];

    // Only return categories that have FAQs
    const filteredData = groupedData.filter((cat) => cat.faqs.length > 0);

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Error in FAQs API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new FAQ (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category_id, question, answer, sort_order } = body;

    if (!category_id || !question || !answer) {
      return NextResponse.json(
        { error: 'Category, question, and answer are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('faqs')
      .insert([{
        category_id,
        question,
        answer,
        sort_order: sort_order || 0,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating FAQ:', error);
      return NextResponse.json(
        { error: 'Failed to create FAQ' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in create FAQ API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
