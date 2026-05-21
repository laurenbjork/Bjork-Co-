import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET page content (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Page slug is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_slug', slug)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching page content:', error);
      return NextResponse.json(
        { error: 'Failed to fetch page content' },
        { status: 500 }
      );
    }

    // Convert array to object keyed by section_key
    const content: { [key: string]: any } = {};
    data?.forEach((item) => {
      content[item.section_key] = {
        ...item.content,
        images: item.images,
      };
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error in page content API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new page content section (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page_slug, section_key, content, images } = body;

    if (!page_slug || !section_key) {
      return NextResponse.json(
        { error: 'Page slug and section key are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('page_content')
      .insert([{
        page_slug,
        section_key,
        content,
        images: images || [],
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating page content:', error);
      return NextResponse.json(
        { error: 'Failed to create page content' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in create page content API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
