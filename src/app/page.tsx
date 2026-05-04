"use client";

import { useState } from "react";
import { HAProvider } from "@/components/HAProvider";
import { ConnectionBanner } from "@/components/ConnectionBanner";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomSheet } from "@/components/rooms/RoomSheet";
import { StatusBar } from "@/components/StatusBar";
import { WeatherCard } from "@/components/WeatherCard";
import { QuickActions } from "@/components/QuickActions";
import { PeopleSection } from "@/components/PeopleSection";
import { ClimateSection } from "@/components/climate/ClimateSection";
import { TemperatureOverview } from "@/components/climate/TemperatureOverview";
import { MediaSection } from "@/components/media/MediaSection";
import { MediaTab } from "@/components/media/MediaTab";
import { SecuritySection } from "@/components/security/SecuritySection";
import { ShoppingList } from "@/components/ShoppingList";
import { NavBar } from "@/components/NavBar";
import { rooms } from "@/lib/rooms";

export default function Home() {
  const [tab, setTab] = useState("home");

  return (
    <HAProvider>
      <ConnectionBanner />
      <main className="mx-auto max-w-lg px-4 pb-20 pt-4">
        <StatusBar />

        {tab === "home" && (
          <div className="mt-4 flex flex-col gap-5">
            <PeopleSection />
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
          <div className="mt-4 flex flex-col gap-5">
            <ClimateSection />
            <TemperatureOverview />
          </div>
        )}

        {tab === "media" && (
          <div className="mt-4">
            <MediaTab />
          </div>
        )}

        {tab === "more" && (
          <div className="mt-4 flex flex-col gap-5">
            <ShoppingList />
          </div>
        )}
      </main>
      <NavBar active={tab} onChange={setTab} />
      <RoomSheet />
    </HAProvider>
  );
}
