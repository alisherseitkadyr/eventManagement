import type { EventProject, EventStage } from "@/features/events/types";
import type { Guest } from "@/features/guests/types";
import { MOCK_EVENT } from "@/features/events/api";
import { MOCK_GUESTS } from "@/features/guests/api";
import { rsvpApi, type RSVPResponse } from "@/features/rsvp/api";

export interface InvitationData {
  event: EventProject;
  guest: Guest;
}

export interface InvitationPayload {
  event: EventProject;
  guest: Guest;
  visibleStages: EventStage[];
  response: RSVPResponse | null;
  invitationUrl: string;
}

export function buildInvitationPath(token: string): string {
  return `/i/${token}`;
}

export function buildInvitationUrl(token: string): string {
  const path = buildInvitationPath(token);
  const configuredBase = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  return configuredBase ? `${configuredBase}${path}` : path;
}

export function buildClientInvitationUrl(token: string): string {
  const stableUrl = buildInvitationUrl(token);

  if (/^https?:\/\//.test(stableUrl)) {
    return stableUrl;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}${stableUrl}`;
  }

  return stableUrl;
}

export async function getInvitationByToken(token: string): Promise<InvitationPayload> {
  const { event, guest } = await invitationApi.getByToken(token);
  const visibleStages =
    guest.assignedStageIds.length > 0
      ? event.stages.filter((stage) => guest.assignedStageIds.includes(stage.id))
      : event.stages;
  const response = await rsvpApi.getByToken(token);
  return { event, guest, visibleStages, response, invitationUrl: buildInvitationUrl(token) };
}

export const invitationApi = {
  getByToken: async (token: string): Promise<InvitationData> => {
    const guest = MOCK_GUESTS.find((g) => g.token === token);
    if (!guest) throw new Error("Invitation not found");
    return { event: MOCK_EVENT, guest };
  },

  markOpened: async (token: string): Promise<void> => {
    void token;
  },

  generatePdf: async (_token: string): Promise<string> => {
    return "/mock-invitation.pdf";
  },
};
