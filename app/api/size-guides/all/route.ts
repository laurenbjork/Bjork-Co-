import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET all size guides (including inactive - for admin)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('size_guides')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching all size guides:', error);
      return NextResponse.json(
        { error: 'Failed to fetch size guides' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in admin size guides API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
