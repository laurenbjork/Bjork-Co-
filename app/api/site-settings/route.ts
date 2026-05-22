import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

// GET all site settings
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('key', { ascending: true });

    if (error) {
      console.error('Error fetching site settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch site settings' },
        { status: 500 }
      );
    }

    // Convert to key-value object
    const settings = data?.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>) || {};

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error in site settings API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update site settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updates = [];

    const admin = getAdminClient();

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        updates.push(
          admin
            .from('site_settings')
            .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
        );
      }
    }

    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed?.error) throw failed.error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}
