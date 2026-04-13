import { SendingView } from "@/features/events/components/sending-view";
import { eventsApi } from "@/features/events/api";
import { guestsApi } from "@/features/guests/api";

interface SendingPageProps {
  params: Promise<{ id: string }>;
}

export default async function SendingPage({ params }: SendingPageProps) {
  const { id } = await params;
  const [event, stats, guests] = await Promise.all([
    eventsApi.getById(id),
    eventsApi.getStats(id),
    guestsApi.getByEvent(id),
  ]);

  return <SendingView event={event} guests={guests} stats={stats} />;
}
