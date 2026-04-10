import type { RSVPStatus } from "@/shared/types/common";
import { api } from "@/shared/lib/api";

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
    // return api.post<RSVPResponse>(`/rsvp/${input.token}`, input);
    // Mock: return success
    return {
      guestId: "mock",
      status: input.status,
      count: input.count || 1,
      needsTransfer: input.needsTransfer || false,
      hasChildren: input.hasChildren || false,
      comment: input.comment,
    };
  },

  getByToken: async (token: string): Promise<RSVPResponse | null> => {
    // return api.get<RSVPResponse | null>(`/rsvp/${token}`);
    return null; // Not yet responded
  },
};