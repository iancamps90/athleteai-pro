import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// Crear/actualizar objetivo nutricional
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      date,
      calories_target,
      protein_target,
      carbs_target,
      fats_target,
      hydration_target,
    } = body;

    const { data, error } = await supabase
      .from("nutrition_targets")
      .upsert({
        user_id: user.id,
        date: date || new Date().toISOString().split("T")[0],
        calories_target,
        protein_target,
        carbs_target,
        fats_target,
        hydration_target,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating/updating nutrition target" },
      { status: 500 }
    );
  }
}

// Agregar comida
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { meal_id, meal_title, meal_time, calories, protein, carbs, fats, date } = body;

    const { data, error } = await supabase
      .from("nutrition_logs")
      .upsert({
        user_id: user.id,
        date: date || new Date().toISOString().split("T")[0],
        meal_id,
        meal_title,
        meal_time,
        calories,
        protein,
        carbs,
        fats,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding meal" },
      { status: 500 }
    );
  }
}

