import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET all page content for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    let query = supabase
      .from('page_content')
      .select('*')
      .order('sort_order', { ascending: true });

    if (slug) {
      query = query.eq('page_slug', slug);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching page content:', error);
      return NextResponse.json(
        { error: 'Failed to fetch page content' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in admin page content API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
