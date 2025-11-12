import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

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
    const { date, readiness_score, readiness_trend, readiness_message, hrv_value, sleep_hours, stress_level } = body;

    const { data, error } = await supabase
      .from("user_metrics")
      .upsert({
        user_id: user.id,
        date: date || new Date().toISOString().split("T")[0],
        readiness_score,
        readiness_trend,
        readiness_message,
        hrv_value,
        sleep_hours,
        stress_level,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating/updating metrics" },
      { status: 500 }
    );
  }
}

