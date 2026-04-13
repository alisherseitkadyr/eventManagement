import { PreviewView } from "@/features/events/components/preview-view";
import { getEventById, listGuestsByEvent } from "@/shared/lib/mock-store";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  const event = getEventById(id);
  const guests = listGuestsByEvent(id);

  return <PreviewView event={event} guests={guests} />;
}
