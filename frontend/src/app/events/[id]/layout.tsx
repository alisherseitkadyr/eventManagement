import type { ReactNode } from "react";
import { OrganizerShell } from "@/features/events/components/organizer-shell";
import { getEventById, listEvents } from "@/shared/lib/mock-store";

interface EventLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function EventLayout({ children, params }: EventLayoutProps) {
  const { id } = await params;
  const event = getEventById(id);
  const allEvents = listEvents();

  return <OrganizerShell event={event} allEvents={allEvents}>{children}</OrganizerShell>;
}
