import GuestsClient from "./GuestsClient";
import { eventsApi } from "@/features/events/api";
import { guestsApi } from "@/features/guests/api";

interface GuestsPageProps {
  params: Promise<{ id: string }>;
}

export default async function GuestsPage({ params }: GuestsPageProps) {
  const { id } = await params;
  const [event, guests] = await Promise.all([eventsApi.getById(id), guestsApi.getByEvent(id)]);

  return <GuestsClient event={event} guests={guests} />;
}
