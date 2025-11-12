"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uqigoqmgmptrpxymylvd.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxaWdvcW1nbXB0cnB4eW15bHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjI1MzYsImV4cCI6MjA3ODUzODUzNn0.J0tbjncdhLJIcSwTELNFRPpt9X02r7tZBgP-dBTY8wc";

export const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type SupabaseClient = typeof supabaseClient;
