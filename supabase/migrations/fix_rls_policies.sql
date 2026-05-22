-- Fix RLS Policies for Categories and Collections
-- Re-enable RLS and create proper policies for authenticated users

-- Re-enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Public can view categories" ON categories;
DROP POLICY IF EXISTS "Only admin can modify categories" ON categories;
DROP POLICY IF EXISTS "Authenticated can view categories" ON categories;
DROP POLICY IF EXISTS "Authenticated can insert categories" ON categories;
DROP POLICY IF EXISTS "Authenticated can update categories" ON categories;
DROP POLICY IF EXISTS "Authenticated can delete categories" ON categories;

DROP POLICY IF EXISTS "Public can view collections" ON collections;
DROP POLICY IF EXISTS "Only admin can modify collections" ON collections;
DROP POLICY IF EXISTS "Authenticated can view collections" ON collections;
DROP POLICY IF EXISTS "Authenticated can insert collections" ON collections;
DROP POLICY IF EXISTS "Authenticated can update collections" ON collections;
DROP POLICY IF EXISTS "Authenticated can delete collections" ON collections;

-- Create proper RLS policies for authenticated users
CREATE POLICY "Authenticated can read categories" 
  ON categories FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated can insert categories" 
  ON categories FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated can update categories" 
  ON categories FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated can delete categories" 
  ON categories FOR DELETE 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated can read collections" 
  ON collections FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated can insert collections" 
  ON collections FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated can update collections" 
  ON collections FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated can delete collections" 
  ON collections FOR DELETE 
  TO authenticated 
  USING (true);
