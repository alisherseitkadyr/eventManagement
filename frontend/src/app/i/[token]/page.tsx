import { notFound } from "next/navigation";
import { InvitationExperience } from "@/features/invitation/components/invitation-experience";
import { getInvitationRecord } from "@/shared/lib/mock-store";

interface InvitationPageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { token } = await params;

  try {
    const invitation = getInvitationRecord(token);
    return <InvitationExperience invitation={invitation} />;
  } catch {
    notFound();
  }
}
