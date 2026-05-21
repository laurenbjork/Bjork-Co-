import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET comments for a blog post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const status = searchParams.get('status') || 'approved';

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('blog_comments')
      .select(`
        *,
        replies:blog_comments!parent_id(*)
      `)
      .eq('post_id', postId)
      .is('parent_id', null);

    // Only filter by status for public requests
    if (status === 'approved') {
      query = query.eq('status', 'approved');
    }

    const { data, error } = await query
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in comments API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { post_id, parent_id, name, email, comment } = body;

    // Validation
    if (!post_id || !name || !email || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check for spam (basic honeypot)
    if (body.website || body.url) {
      return NextResponse.json(
        { error: 'Spam detected' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('blog_comments')
      .insert([{
        post_id,
        parent_id: parent_id || null,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        comment: comment.trim(),
        status: 'pending', // All comments require moderation
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return NextResponse.json(
        { error: 'Failed to submit comment' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Comment submitted successfully and is awaiting moderation',
        comment: data 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in create comment API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
