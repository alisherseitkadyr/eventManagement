import { NextResponse } from "next/server";
import { createEvent, listEvents } from "@/shared/lib/mock-store";
import type { CreateEventInput } from "@/features/events/types";

export async function GET() {
  return NextResponse.json(listEvents());
}

export async function POST(request: Request) {
  const input = (await request.json()) as CreateEventInput;
  return NextResponse.json(createEvent(input), { status: 201 });
}
