import { ConstructorView } from "@/features/events/components/constructor-view";
import { eventsApi } from "@/features/events/api";

interface ConstructorPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConstructorPage({ params }: ConstructorPageProps) {
  const { id } = await params;
  const event = await eventsApi.getById(id);

  return <ConstructorView event={event} />;
}
