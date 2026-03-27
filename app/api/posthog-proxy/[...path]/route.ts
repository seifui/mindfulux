import { NextRequest, NextResponse } from "next/server";

const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${POSTHOG_HOST}/${pathStr}${searchParams ? `?${searchParams}` : ""}`;

  const headers: Record<string, string> = {};
  const contentType = request.headers.get("Content-Type");
  if (contentType) headers["Content-Type"] = contentType;
  const contentEncoding = request.headers.get("Content-Encoding");
  if (contentEncoding) headers["Content-Encoding"] = contentEncoding;

  const fetchInit: RequestInit = { method: request.method, headers };

  if (request.method !== "GET" && request.method !== "HEAD") {
    fetchInit.body = await request.arrayBuffer();
  }

  const res = await fetch(url, fetchInit);

  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/json",
    },
  });
}

export const GET = handler;
export const POST = handler;
