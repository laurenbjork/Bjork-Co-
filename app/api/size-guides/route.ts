import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET size guides
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = supabase
      .from('size_guides')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (category) {
      const { data, error } = await supabase
        .from('size_guides')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching size guide:', error);
        return NextResponse.json(
          { error: 'Size guide not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching size guides:', error);
      return NextResponse.json(
        { error: 'Failed to fetch size guides' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in size guides API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new size guide (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('size_guides')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Error creating size guide:', error);
      return NextResponse.json(
        { error: 'Failed to create size guide' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in create size guide API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
