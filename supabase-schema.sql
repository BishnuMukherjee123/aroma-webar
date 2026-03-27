-- Drop existing tables to recreate (optional, for safety during dev)
-- DROP TABLE IF EXISTS public.dishes;
-- DROP TABLE IF EXISTS public.restaurants;

-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  theme_color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create dishes table
CREATE TABLE public.dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  sku TEXT,
  thumbnail_url TEXT,
  model_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- IMPORTANT: Enable Row Level Security (RLS)
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;

-- Create Policies to grant full public access for demo purposes
-- Note: In a production app, you would restrict INSERT/UPDATE/DELETE to authenticated admins

CREATE POLICY "Enable read access for all users - restaurants" 
ON public.restaurants FOR SELECT TO public USING (true);

CREATE POLICY "Enable all access for all users - restaurants" 
ON public.restaurants FOR ALL TO public USING (true);

CREATE POLICY "Enable read access for all users - dishes" 
ON public.dishes FOR SELECT TO public USING (true);

CREATE POLICY "Enable all access for all users - dishes" 
ON public.dishes FOR ALL TO public USING (true);

-- Insert the Demo Restaurant so the Admin Dashboard has data to load
INSERT INTO public.restaurants (name, slug)
VALUES ('Aroma Test Kitchen', 'test-restaurant')
ON CONFLICT (slug) DO NOTHING;
