import { NextResponse } from "next/server";
import { getStats } from "@/lib/stats";

// Cached for 5 minutes; falls back to static values inside getStats() on failure.
export const revalidate = 300;

export async function GET() {
  const stats = await getStats();
  return NextResponse.json(stats);
}
