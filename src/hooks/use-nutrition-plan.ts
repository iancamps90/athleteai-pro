"use client";

import { useEffect, useState, useMemo } from "react";
import { supabaseClient } from "@/lib/supabase-client";
import { nutritionSummary, type MacroBreakdown } from "@/lib/mock-data";

type Meal = {
  id: string;
  title: string;
  calories: number;
  macros: MacroBreakdown;
  time: string;
};

type NutritionPlan = {
  caloriesTarget: number;
  caloriesConsumed: number;
  macrosTarget: MacroBreakdown;
  macrosConsumed: MacroBreakdown;
  hydrationLiters: number;
  hydrationTarget: number;
  meals: Meal[];
};

export function useNutritionPlan() {
  const [nutrition, setNutrition] = useState<NutritionPlan>(nutritionSummary);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNutritionPlan() {
      try {
        // Obtener usuario actual
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const today = new Date().toISOString().split("T")[0];

        // Obtener objetivos nutricionales del día
        const { data: targetsData, error: targetsError } = await supabaseClient
          .from("nutrition_targets")
          .select("*")
          .eq("user_id", user.id)
          .eq("date", today)
          .single();

        // Obtener comidas del día
        const { data: mealsData, error: mealsError } = await supabaseClient
          .from("nutrition_logs")
          .select("*")
          .eq("user_id", user.id)
          .eq("date", today)
          .order("meal_time", { ascending: true });

        if (!targetsError && targetsData) {
          // Calcular macros consumidos desde las comidas
          let caloriesConsumed = 0;
          let proteinConsumed = 0;
          let carbsConsumed = 0;
          let fatsConsumed = 0;

          const meals: Meal[] = [];

          if (!mealsError && mealsData) {
            mealsData.forEach((meal) => {
              caloriesConsumed += meal.calories || 0;
              proteinConsumed += Number(meal.protein) || 0;
              carbsConsumed += Number(meal.carbs) || 0;
              fatsConsumed += Number(meal.fats) || 0;

              meals.push({
                id: meal.meal_id || meal.id,
                title: meal.meal_title,
                calories: meal.calories || 0,
                macros: {
                  protein: Number(meal.protein) || 0,
                  carbs: Number(meal.carbs) || 0,
                  fats: Number(meal.fats) || 0,
                },
                time: meal.meal_time || "",
              });
            });
          }

          setNutrition({
            caloriesTarget: targetsData.calories_target || 3200,
            caloriesConsumed,
            macrosTarget: {
              protein: Number(targetsData.protein_target) || 180,
              carbs: Number(targetsData.carbs_target) || 400,
              fats: Number(targetsData.fats_target) || 90,
            },
            macrosConsumed: {
              protein: proteinConsumed,
              carbs: carbsConsumed,
              fats: fatsConsumed,
            },
            hydrationLiters: Number(targetsData.hydration_consumed) || 0,
            hydrationTarget: Number(targetsData.hydration_target) || 3.5,
            meals: meals.length > 0 ? meals : nutritionSummary.meals, // Fallback a mock si no hay comidas
          });
        }
      } catch (error) {
        console.error("Error fetching nutrition plan:", error);
        // Mantener datos mock en caso de error
      } finally {
        setIsLoading(false);
      }
    }

    fetchNutritionPlan();
  }, []);

  return useMemo(() => ({ ...nutrition, isLoading }), [nutrition, isLoading]);
}

