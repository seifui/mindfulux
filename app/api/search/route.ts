import { NextRequest } from "next/server";

import { getSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return Response.json([]);
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("principles")
      .select("id, slug, title, description, category")
      .ilike("title", `%${query}%`)
      .eq("published", true)
      .order("title", { ascending: true })
      .limit(10);

    if (error) {
      console.error("[search] Supabase error:", error.message);
      return Response.json([]);
    }

    return Response.json(data ?? []);
  } catch (err) {
    console.error("[search] Unexpected error:", err);
    return Response.json([]);
  }
}
