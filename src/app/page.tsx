"use client";

import { useState } from "react";
import { HAProvider } from "@/components/HAProvider";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomSheet } from "@/components/rooms/RoomSheet";
import { StatusBar } from "@/components/StatusBar";
import { WeatherCard } from "@/components/WeatherCard";
import { QuickActions } from "@/components/QuickActions";
import { ClimateSection } from "@/components/climate/ClimateSection";
import { MediaSection } from "@/components/media/MediaSection";
import { SecuritySection } from "@/components/security/SecuritySection";
import { NavBar } from "@/components/NavBar";
import { rooms } from "@/lib/rooms";

export default function Home() {
  const [tab, setTab] = useState("home");

  return (
    <HAProvider>
      <main className="mx-auto max-w-lg px-4 pb-20 pt-4">
        <StatusBar />

        {tab === "home" && (
          <div className="mt-4 flex flex-col gap-5">
            <WeatherCard />
            <QuickActions />
            <section>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Rooms</h2>
              <div className="grid grid-cols-2 gap-3">
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            </section>
            <MediaSection />
            <SecuritySection />
          </div>
        )}

        {tab === "climate" && (
          <div className="mt-4">
            <ClimateSection />
          </div>
        )}

        {tab === "media" && (
          <div className="mt-4">
            <MediaSection />
          </div>
        )}

        {tab === "more" && (
          <div className="mt-4 text-sm text-text-muted">
            <p>More features coming soon...</p>
          </div>
        )}
      </main>
      <NavBar active={tab} onChange={setTab} />
      <RoomSheet />
    </HAProvider>
  );
}
