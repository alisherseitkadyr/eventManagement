import { NextResponse } from "next/server";
import { getRsvpByToken, submitRsvp } from "@/shared/lib/mock-store";
import type { RSVPSubmitInput } from "@/features/rsvp/api";

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { token } = await params;
  return NextResponse.json(getRsvpByToken(token));
}

export async function POST(request: Request, { params }: RouteContext) {
  const { token } = await params;
  const input = (await request.json()) as Omit<RSVPSubmitInput, "token">;
  return NextResponse.json(submitRsvp({ ...input, token }));
}
