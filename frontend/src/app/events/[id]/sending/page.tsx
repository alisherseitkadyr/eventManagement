import { SendingView } from "@/features/events/components/sending-view";
import { getEventById, getEventStats, listGuestsByEvent } from "@/shared/lib/mock-store";

interface SendingPageProps {
  params: Promise<{ id: string }>;
}

export default async function SendingPage({ params }: SendingPageProps) {
  const { id } = await params;
  const event = getEventById(id);
  const stats = getEventStats(id);
  const guests = listGuestsByEvent(id);

  return <SendingView event={event} guests={guests} stats={stats} />;
}
