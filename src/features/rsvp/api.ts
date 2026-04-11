import type { RSVPStatus } from "@/shared/types/common";
import { api, useBackendApi } from "@/shared/lib/api";
import { MOCK_GUESTS } from "@/features/guests/api";

export interface RSVPResponse {
  guestId: string;
  status: RSVPStatus;
  count: number;
  needsTransfer: boolean;
  hasChildren: boolean;
  dietaryRestrictions?: string;
  comment?: string;
}

export interface RSVPSubmitInput {
  token: string;
  status: RSVPStatus;
  count?: number;
  comment?: string;
  needsTransfer?: boolean;
  hasChildren?: boolean;
  dietaryRestrictions?: string;
}

export const rsvpApi = {
  submit: async (input: RSVPSubmitInput): Promise<RSVPResponse> => {
    if (useBackendApi) {
      return api.post<RSVPResponse>(`/rsvp/${input.token}`, input);
    }

    const guest = MOCK_GUESTS.find((item) => item.token === input.token);

    return {
      guestId: guest?.id ?? "mock",
      status: input.status,
      count: input.count || guest?.count || 1,
      needsTransfer: input.needsTransfer || false,
      hasChildren: input.hasChildren || false,
      comment: input.comment,
    };
  },

  getByToken: async (token: string): Promise<RSVPResponse | null> => {
    if (useBackendApi) {
      return api.get<RSVPResponse | null>(`/rsvp/${token}`);
    }

    return null; // Not yet responded
  },
};
