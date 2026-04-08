import { NextResponse } from "next/server";
import { z } from "zod";

import { loops } from "@/lib/loops";
import { getSupabaseServer } from "@/lib/supabase/server";

const bodySchema = z.object({
  name: z.string().trim().min(1),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.string().email()),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { name, email } = parsed.data;

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("newsletter_subscribers").insert({
    email,
    name,
    source: "community_form",
    created_at: new Date().toISOString(),
  });

  const isDuplicateEmail = error?.code === "23505";

  if (error && !isDuplicateEmail) {
    return NextResponse.json(
      { error: "Could not save subscription" },
      { status: 500 }
    );
  }

  try {
    await loops.createContact({
      email,
      properties: {
        firstName: name,
        source: "MindfulUX Community Form",
      },
    });
  } catch (err) {
    console.error(err);
  }

  return NextResponse.json({ success: true });
}
