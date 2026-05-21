# Supabase Setup Guide for BJÖRK & CO.

## Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `pylllchropayszuzfaoc`
3. Go to **Project Settings** → **API**
4. Copy these values:
   - `Project URL` (e.g., `https://pylllchropayszuzfaoc.supabase.co`)
   - `anon public` key (starts with `eyJ...`)

## Step 2: Create .env.local File

Create a file named `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://pylllchropayszuzfaoc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Run the Database Schema

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click **Run**

## Step 4: Seed the Database

1. In the SQL Editor, create another new query
2. Copy and paste the entire contents of `supabase/seed.sql`
3. Click **Run**

## Step 5: Create Storage Buckets

1. Go to Supabase Dashboard → **Storage**
2. Create these buckets:
   - `product-images` (Public)
   - `blog-images` (Public)
   - `page-media` (Public)
   - `hero-images` (Public)

## Step 6: Install Dependencies

```bash
npm install
```

## Step 7: Test the Connection

Start your dev server:
```bash
npm run dev
```

Your app should now connect to Supabase!

## Important Security Notes

- The `anon` key is safe to use in client-side code (it's public)
- RLS policies are configured to protect your data
- Only authenticated admin users can modify data
- Public can read published content only

## Troubleshooting

If you see "Error: Missing Supabase environment variables":
- Make sure `.env.local` file exists in project root
- Make sure variables are spelled correctly
- Restart your dev server after creating the file

## Next Steps

After setup is complete:
1. Build the admin authentication (Phase 3)
2. Create admin login and dashboard
3. Build admin CRUD interfaces for products, blog, etc.
4. Connect public pages to real Supabase data
