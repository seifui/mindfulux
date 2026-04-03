import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof (body as { email: unknown }).email === "string"
      ? (body as { email: string }).email.trim().toLowerCase()
      : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("book_waitlist").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Could not save email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
