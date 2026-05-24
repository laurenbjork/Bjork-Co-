import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total views
    const { count: totalViews, error: totalError } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    if (totalError) {
      console.error('Error fetching total views:', totalError);
      return NextResponse.json({
        totalViews: 0,
        uniqueVisitors: 0,
        topPages: [],
        dailyViews: [],
        deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
      });
    }

    // Unique visitors (by session_id)
    const { data: uniqueData, error: uniqueError } = await supabase
      .from('page_views')
      .select('session_id')
      .gte('created_at', startDate.toISOString());

    const uniqueVisitors = uniqueError ? 0 : new Set(uniqueData?.map((d) => d.session_id)).size;

    // Top pages
    const { data: topPages } = await supabase
      .from('page_views')
      .select('page_path')
      .gte('created_at', startDate.toISOString());

    const pageCounts: { [key: string]: number } = {};
    topPages?.forEach((p) => {
      pageCounts[p.page_path] = (pageCounts[p.page_path] || 0) + 1;
    });

    const sortedPages = Object.entries(pageCounts)
      .map(([page_path, view_count]) => ({ page_path, view_count }))
      .sort((a, b) => b.view_count - a.view_count)
      .slice(0, 10);

    // Daily views
    const { data: dailyData } = await supabase
      .from('page_views')
      .select('created_at')
      .gte('created_at', startDate.toISOString());

    const dailyCounts: { [key: string]: number } = {};
    dailyData?.forEach((d) => {
      const date = new Date(d.created_at).toISOString().split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    const dailyViews = Object.entries(dailyCounts)
      .map(([date, view_count]) => ({ date, view_count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Device breakdown (simplified from user_agent)
    const { data: deviceData } = await supabase
      .from('page_views')
      .select('user_agent')
      .gte('created_at', startDate.toISOString());

    let desktop = 0;
    let mobile = 0;
    let tablet = 0;

    deviceData?.forEach((d) => {
      const ua = d.user_agent?.toLowerCase() || '';
      if (ua.includes('mobile')) {
        mobile++;
      } else if (ua.includes('tablet') || ua.includes('ipad')) {
        tablet++;
      } else {
        desktop++;
      }
    });

    return NextResponse.json({
      totalViews: totalViews || 0,
      uniqueVisitors,
      topPages: sortedPages,
      dailyViews,
      deviceBreakdown: { desktop, mobile, tablet },
    });
  } catch (error) {
    console.error('Error in analytics API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Record page view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page_path, referrer, user_agent, session_id } = body;

    const { error } = await supabase
      .from('page_views')
      .insert([{
        page_path,
        referrer,
        user_agent,
        session_id,
      }]);

    if (error) {
      console.error('Error recording page view:', error);
      return NextResponse.json(
        { error: 'Failed to record view' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in record view API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
