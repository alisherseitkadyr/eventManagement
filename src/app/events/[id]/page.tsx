import { EventDashboardView } from "@/features/events/components/organizer-pages";
import { eventsApi } from "@/features/events/api";
import { guestsApi } from "@/features/guests/api";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const [event, stats, guests] = await Promise.all([
    eventsApi.getById(id),
    eventsApi.getStats(id),
    guestsApi.getByEvent(id),
  ]);

  return <EventDashboardView event={event} guests={guests} stats={stats} />;
}
