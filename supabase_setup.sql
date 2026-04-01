-- 1. YOUT PRODUCTS TABLE UPGRADE
-- Adding the new 'mrp', 'image', and 'offer' columns to your existing products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS mrp NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS offer TEXT;

-- 2. DYNAMIC BLOOD TEST TYPES TABLE
-- This table will store your custom blood tests created from the admin panel
CREATE TABLE IF NOT EXISTS public.blood_test_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT,
  price NUMERIC NOT NULL,
  mrp NUMERIC,
  offer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for blood tests
ALTER TABLE public.blood_test_types ENABLE ROW LEVEL SECURITY;

-- Everyone can read blood test types
CREATE POLICY "Public can view blood test types" 
  ON public.blood_test_types FOR SELECT 
  USING (true);

-- Admins can manage blood test types (Uses existing logic or true for now, assuming admin logic is handled via app UI)
CREATE POLICY "Admins can manage blood test types" 
  ON public.blood_test_types FOR ALL 
  USING (true);

-- 3. GLOBAL SETTINGS TABLE
-- This table will store your delivery charge and future global configs
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings (for delivery charge in cart)
CREATE POLICY "Public can view settings" 
  ON public.admin_settings FOR SELECT 
  USING (true);

-- Admins can update settings
CREATE POLICY "Admins can update settings" 
  ON public.admin_settings FOR ALL 
  USING (true);

-- Insert a default global setting row with delivery_charge 50
INSERT INTO public.admin_settings (id, value) 
VALUES ('global', '{"delivery_charge": 50}')
ON CONFLICT (id) DO NOTHING;
