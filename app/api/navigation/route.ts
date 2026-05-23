import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET all navigation items
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('navigation_items')
      .select(`
        *,
        children:navigation_items(*)
      `)
      .is('parent_id', null)
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching navigation:', error);
      return NextResponse.json(
        { error: 'Failed to fetch navigation' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in navigation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create navigation item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('navigation_items')
      .insert([{
        label: body.label,
        href: body.href,
        parent_id: body.parent_id || null,
        sort_order: body.sort_order || 0,
        is_visible: body.is_visible !== false,
        linked_category_id: body.linked_category_id || null,
        linked_collection_id: body.linked_collection_id || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating navigation item:', error);
      return NextResponse.json(
        { error: 'Failed to create navigation item' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in navigation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update navigation item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const { data, error } = await supabase
      .from('navigation_items')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating navigation item:', error);
      return NextResponse.json(
        { error: 'Failed to update navigation item' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in navigation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE navigation item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // First delete children
    await supabase
      .from('navigation_items')
      .delete()
      .eq('parent_id', id);

    // Then delete the item
    const { error } = await supabase
      .from('navigation_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting navigation item:', error);
      return NextResponse.json(
        { error: 'Failed to delete navigation item' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in navigation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
