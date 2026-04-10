import { PreviewView } from "@/features/events/components/organizer-pages";
import { eventsApi } from "@/features/events/api";
import { guestsApi } from "@/features/guests/api";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  const [event, guests] = await Promise.all([eventsApi.getById(id), guestsApi.getByEvent(id)]);

  return <PreviewView event={event} guests={guests} />;
}
