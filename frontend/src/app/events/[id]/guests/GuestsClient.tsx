"use client";

import React, { useDeferredValue, useState } from "react";
import { GuestFilters } from "@/features/guests/components/GuestFilters";
import { GuestTable } from "@/features/guests/components/GuestTable";
import type { Guest as GuestType } from "@/features/guests/types";
import type { EventProject } from "@/features/events/types";
import type { RSVPStatus } from "@/shared/types/common";
import { Card, SectionTitle } from "@/shared/components/ui";

export default function GuestsClient({ event, guests }: { event: EventProject; guests: GuestType[] }) {
  const [filter, setFilter] = useState<RSVPStatus | "all">("all");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const filteredGuests = guests.filter((guest) => {
    if (filter !== "all" && guest.status !== filter) return false;
    if (deferredSearch && !guest.name.toLowerCase().includes(deferredSearch.toLowerCase())) return false;
    return true;
  });

  const handleCopy = (guest: GuestType) => {
    navigator.clipboard.writeText(`${location.origin}/i/${guest.token}`);
    // visual feedback handled inside GuestTable
  };

  const handleRemind = (guest: GuestType) => {
    // placeholder: trigger remind
    // eslint-disable-next-line no-console
    console.log("remind", guest.id);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <SectionTitle>Гостевая база</SectionTitle>
      <div style={{ marginTop: 12 }}>
        <GuestFilters activeStatus={filter} onStatusChange={(s) => setFilter(s)} search={search} onSearchChange={setSearch} />
      </div>

      <div style={{ marginTop: 12 }}>
        <GuestTable guests={filteredGuests} onCopyLink={handleCopy} onRemind={handleRemind} />
      </div>
    </div>
  );
}
