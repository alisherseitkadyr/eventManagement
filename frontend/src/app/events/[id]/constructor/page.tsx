import { ConstructorView } from "@/features/events/components/constructor-view";
<<<<<<< HEAD
import { getEventById, listGuestsByEvent } from "@/shared/lib/mock-store";
=======
import { eventsApi } from "@/features/events/api";
>>>>>>> ef87c9b (delete: unused features)

interface ConstructorPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConstructorPage({ params }: ConstructorPageProps) {
  const { id } = await params;
<<<<<<< HEAD
  const event = getEventById(id);
  const guests = listGuestsByEvent(id);
=======
  const event = await eventsApi.getById(id);
>>>>>>> ef87c9b (delete: unused features)

  return <ConstructorView event={event} />;
}
