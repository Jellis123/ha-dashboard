"use client";

import { HAProvider } from "@/components/HAProvider";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomSheet } from "@/components/rooms/RoomSheet";
import { StatusBar } from "@/components/StatusBar";
import { rooms } from "@/lib/rooms";

export default function Home() {
  return (
    <HAProvider>
      <main className="mx-auto max-w-lg px-4 pb-8 pt-4">
        <StatusBar />
        <section className="mt-6">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Rooms</h2>
          <div className="grid grid-cols-2 gap-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>
      </main>
      <RoomSheet />
    </HAProvider>
  );
}
