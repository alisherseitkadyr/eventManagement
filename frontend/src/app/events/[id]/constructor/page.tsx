import { ConstructorView } from "@/features/events/components/constructor-view";
import { getEventById, listGuestsByEvent } from "@/shared/lib/mock-store";

interface ConstructorPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConstructorPage({ params }: ConstructorPageProps) {
  const { id } = await params;
  const event = getEventById(id);
  const guests = listGuestsByEvent(id);

  return <ConstructorView event={event} guests={guests} />;
}
