import { EventDashboardView } from "@/features/events/components/event-dashboard";
import { getEventById, getEventStats, listGuestsByEvent } from "@/shared/lib/mock-store";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = getEventById(id);
  const stats = getEventStats(id);
  const guests = listGuestsByEvent(id);

  return <EventDashboardView event={event} guests={guests} stats={stats} />;
}
