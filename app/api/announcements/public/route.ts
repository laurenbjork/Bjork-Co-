import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  try {
    const now = new Date().toISOString();

    // Fetch only active announcements that should be visible now
    const { data, error } = await supabase
      .from('announcement_bars')
      .select('*')
      .eq('is_active', true)
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order('priority', { ascending: false });

    if (error) {
      console.error('Error fetching public announcements:', error);
      return NextResponse.json(
        { error: 'Failed to fetch announcements' },
        { status: 500 }
      );
    }

    // Filter out announcements that have expired
    const validAnnouncements = (data || []).filter((announcement) => {
      // Check if end date has passed
      if (announcement.end_date && new Date(announcement.end_date) < new Date()) {
        return false;
      }
      return true;
    });

    return NextResponse.json(validAnnouncements);
  } catch (error) {
    console.error('Error in public announcements API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
