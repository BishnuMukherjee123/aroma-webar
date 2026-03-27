"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Restaurant } from "@/types";

export function useRestaurant(id: string) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("restaurants")
          .select("*")
          .eq("slug", id)
          .single();

        if (error) throw error;
        setRestaurant(data as Restaurant);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  return { restaurant, loading, error };
}