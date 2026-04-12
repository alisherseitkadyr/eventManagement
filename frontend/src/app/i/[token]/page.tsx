import { notFound } from "next/navigation";
import { getInvitationByToken } from "@/features/invitation/api";
import { InvitationExperience } from "@/features/invitation/components/invitation-experience";

interface InvitationPageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { token } = await params;

  try {
    const invitation = await getInvitationByToken(token);
    return <InvitationExperience invitation={invitation} />;
  } catch {
    notFound();
  }
}
