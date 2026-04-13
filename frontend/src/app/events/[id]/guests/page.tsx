import GuestsClient from "./GuestsClient";
import { getEventById, listGuestsByEvent } from "@/shared/lib/mock-store";

interface GuestsPageProps {
  params: Promise<{ id: string }>;
}

export default async function GuestsPage({ params }: GuestsPageProps) {
  const { id } = await params;
  const event = getEventById(id);
  const guests = listGuestsByEvent(id);

  return <GuestsClient event={event} guests={guests} />;
}
