import type { ReactNode } from "react";
import { OrganizerShell } from "@/features/events/components/organizer-shell";
import { eventsApi } from "@/features/events/api";

interface EventLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function EventLayout({ children, params }: EventLayoutProps) {
  const { id } = await params;
  const event = await eventsApi.getById(id);

  return <OrganizerShell event={event}>{children}</OrganizerShell>;
}
