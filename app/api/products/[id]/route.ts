import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete associated product images first
    const { error: imagesError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', id);

    if (imagesError) {
      console.error('Error deleting product images:', imagesError);
    }

    // Delete category assignments
    const { error: categoriesError } = await supabase
      .from('product_categories')
      .delete()
      .eq('product_id', id);

    if (categoriesError) {
      console.error('Error deleting product categories:', categoriesError);
    }

    // Delete collection assignments
    const { error: collectionsError } = await supabase
      .from('product_collections')
      .delete()
      .eq('product_id', id);

    if (collectionsError) {
      console.error('Error deleting product collections:', collectionsError);
    }

    // Delete the product
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in delete product API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
