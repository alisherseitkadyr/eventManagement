import { ConstructorView } from "@/features/events/components/organizer-pages";
import { eventsApi } from "@/features/events/api";
import { guestsApi } from "@/features/guests/api";

interface ConstructorPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConstructorPage({ params }: ConstructorPageProps) {
  const { id } = await params;
  const [event, guests] = await Promise.all([eventsApi.getById(id), guestsApi.getByEvent(id)]);

  return <ConstructorView event={event} guests={guests} />;
}
