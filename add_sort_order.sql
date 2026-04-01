-- Add sort_order column for custom sorting priority (Higher number = shows up first)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE public.blood_test_types ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
