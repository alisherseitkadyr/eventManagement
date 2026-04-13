import "server-only";

import { MOCK_EVENT } from "@/features/events/api";
import type { CreateEventInput, EventProject, EventStats } from "@/features/events/types";
import { MOCK_GUESTS } from "@/features/guests/api";
import type { AddGuestInput, Guest, GuestFilters } from "@/features/guests/types";
import type { RSVPResponse, RSVPSubmitInput } from "@/features/rsvp/api";

interface InvitationRecord {
  event: EventProject;
  guest: Guest;
  visibleStages: EventProject["stages"];
  response: RSVPResponse | null;
  invitationUrl: string;
}

interface MockDatabase {
  events: EventProject[];
  guests: Guest[];
  responses: Record<string, RSVPResponse>;
}

declare global {
  // eslint-disable-next-line no-var
  var __qonaqMockDb: MockDatabase | undefined;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function createSeedDatabase(): MockDatabase {
  return {
    events: [clone(MOCK_EVENT)],
    guests: clone(MOCK_GUESTS),
    responses: {},
  };
}

function getDb(): MockDatabase {
  if (!globalThis.__qonaqMockDb) {
    globalThis.__qonaqMockDb = createSeedDatabase();
  }

  return globalThis.__qonaqMockDb;
}

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function getEventRecord(id: string): EventProject | undefined {
  return getDb().events.find((event) => event.id === id);
}

function getGuestRecordByToken(token: string): Guest | undefined {
  return getDb().guests.find((guest) => guest.token === token);
}

export function listEvents(): EventProject[] {
  return clone(getDb().events);
}

export function getEventById(id: string): EventProject {
  const event = getEventRecord(id);

  if (event) {
    return clone(event);
  }

  return { ...clone(MOCK_EVENT), id };
}

export function createEvent(input: CreateEventInput): EventProject {
  const now = new Date().toISOString();
  const event: EventProject = {
    ...clone(MOCK_EVENT),
    id: generateId("evt"),
    type: input.type,
    title: clone(input.title),
    templateStyle: input.templateStyle,
    languages: [...input.languages],
    createdAt: now,
    updatedAt: now,
    published: false,
  };

  getDb().events.unshift(event);

  return clone(event);
}

export function updateEvent(id: string, data: Partial<EventProject>): EventProject {
  const db = getDb();
  const index = db.events.findIndex((event) => event.id === id);
  const current = index >= 0 ? db.events[index] : getEventById(id);
  const updated: EventProject = {
    ...current,
    ...clone(data),
    id,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    db.events[index] = updated;
  } else {
    db.events.unshift(updated);
  }

  return clone(updated);
}

export function setEventPublished(id: string, published: boolean): void {
  updateEvent(id, { published });
}

export function listGuestsByEvent(eventId: string, filters?: GuestFilters): Guest[] {
  let guests = getDb().guests.filter((guest) => guest.eventId === eventId);

  if (filters?.status) {
    guests = guests.filter((guest) => guest.status === filters.status);
  }

  if (filters?.side) {
    guests = guests.filter((guest) => guest.side === filters.side);
  }

  if (filters?.category) {
    guests = guests.filter((guest) => guest.category === filters.category);
  }

  if (filters?.search) {
    const query = filters.search.toLowerCase();
    guests = guests.filter((guest) => guest.name.toLowerCase().includes(query));
  }

  return clone(guests);
}

export function getGuestByToken(token: string): Guest {
  const guest = getGuestRecordByToken(token);

  if (!guest) {
    throw new Error("Guest not found");
  }

  return clone(guest);
}

export function addGuest(eventId: string, input: AddGuestInput): Guest {
  const event = getEventById(eventId);
  const guest: Guest = {
    id: generateId("gst"),
    eventId,
    name: input.name,
    count: input.count,
    side: input.side,
    category: input.category,
    status: "pending",
    phone: input.phone,
    token: generateId("invite"),
    isVip: input.isVip ?? false,
    isElder: input.isElder ?? false,
    hasChildren: false,
    assignedStageIds: input.assignedStageIds ?? event.stages.map((stage) => stage.id),
  };

  getDb().guests.unshift(guest);

  return clone(guest);
}

export function updateGuest(guestId: string, data: Partial<Guest>): Guest {
  const db = getDb();
  const index = db.guests.findIndex((guest) => guest.id === guestId);

  if (index < 0) {
    throw new Error("Guest not found");
  }

  const updated: Guest = {
    ...db.guests[index],
    ...clone(data),
    id: guestId,
  };

  db.guests[index] = updated;

  return clone(updated);
}

export function deleteGuest(guestId: string): void {
  const db = getDb();
  db.guests = db.guests.filter((guest) => guest.id !== guestId);
}

export function getEventStats(eventId: string): EventStats {
  const guests = listGuestsByEvent(eventId);

  return {
    totalGuests: guests.length,
    totalPeople: guests.reduce((sum, guest) => sum + guest.count, 0),
    confirmed: guests.filter((guest) => guest.status === "confirmed").length,
    confirmedPeople: guests
      .filter((guest) => guest.status === "confirmed")
      .reduce((sum, guest) => sum + guest.count, 0),
    declined: guests.filter((guest) => guest.status === "declined").length,
    maybe: guests.filter((guest) => guest.status === "maybe").length,
    pending: guests.filter((guest) => guest.status === "pending").length,
  };
}

export function getRsvpByToken(token: string): RSVPResponse | null {
  const response = getDb().responses[token];
  return response ? clone(response) : null;
}

export function submitRsvp(input: RSVPSubmitInput): RSVPResponse {
  const db = getDb();
  const guest = getGuestRecordByToken(input.token);

  if (!guest) {
    throw new Error("Guest not found");
  }

  const response: RSVPResponse = {
    guestId: guest.id,
    status: input.status,
    count: input.count ?? guest.count ?? 1,
    needsTransfer: input.needsTransfer ?? false,
    hasChildren: input.hasChildren ?? guest.hasChildren ?? false,
    dietaryRestrictions: input.dietaryRestrictions,
    comment: input.comment,
  };

  db.responses[input.token] = response;

  const guestIndex = db.guests.findIndex((item) => item.id === guest.id);
  if (guestIndex >= 0) {
    db.guests[guestIndex] = {
      ...db.guests[guestIndex],
      status: input.status,
      count: response.count,
      comment: input.comment,
      hasChildren: response.hasChildren,
      respondedAt: new Date().toISOString(),
    };
  }

  return clone(response);
}

export function markInvitationOpened(token: string): void {
  const db = getDb();
  const index = db.guests.findIndex((guest) => guest.token === token);

  if (index >= 0) {
    db.guests[index] = {
      ...db.guests[index],
      openedAt: new Date().toISOString(),
    };
  }
}

export function getInvitationRecord(token: string): InvitationRecord {
  const guest = getGuestByToken(token);
  const event = getEventById(guest.eventId);
  const visibleStages =
    guest.assignedStageIds.length > 0
      ? event.stages.filter((stage) => guest.assignedStageIds.includes(stage.id))
      : event.stages;

  return {
    event,
    guest,
    visibleStages,
    response: getRsvpByToken(token),
    invitationUrl: `/i/${token}`,
  };
}
