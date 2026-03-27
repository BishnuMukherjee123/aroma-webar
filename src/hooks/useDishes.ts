"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Dish } from "@/types";

export function useDishes(restaurantId: string | undefined) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchDishes = async () => {
      setLoading(true);
      try {
        // Query dishes joined with the restaurant to filter by slug
        const { data, error } = await supabase
          .from("dishes")
          .select("*, restaurants!inner(slug)")
          .eq("restaurants.slug", restaurantId)
          .eq("status", "live");

        if (error) throw error;
        setDishes(data as Dish[]);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [restaurantId]);

  return { dishes, loading, error };
}
