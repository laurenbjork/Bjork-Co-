import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      return NextResponse.json({ error: 'Missing SUPABASE_URL' }, { status: 500 });
    }

    const authKey = serviceRoleKey || anonKey;
    if (!authKey) {
      return NextResponse.json({ error: 'Missing Supabase auth key' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `instagram-${Date.now()}.${fileExt}`;
    const filePath = `instagram/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();

    const uploadUrl = `${supabaseUrl}/storage/v1/object/product-images/${filePath}`;

    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authKey}`,
        'Content-Type': file.type,
        'x-upsert': 'false',
      },
      body: arrayBuffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error('Storage upload error:', uploadRes.status, errText);
      return NextResponse.json({ error: errText }, { status: 500 });
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${filePath}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Error in upload-instagram API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
