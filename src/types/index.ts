export interface Restaurant {
  id: string; // UUID from Supabase
  name: string;
  slug: string;
  logo_url?: string;
  theme_color?: string;
  created_at?: string;
}

export interface Dish {
  id: string; // UUID from Supabase
  restaurant_id: string; // FK to Restaurant
  category: string;
  description: string;
  model_url: string;
  name: string;
  price: number;
  sku: string;
  status: "live" | "draft";
  thumbnail_url: string;
  created_at?: string;
}
