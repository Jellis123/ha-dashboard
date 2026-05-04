"use client";

import { Card } from "@/components/ui/Card";
import { useEntity, useCallService } from "@/hooks/useEntity";
import { useUIStore } from "@/stores/ui";
import type { Room } from "@/types/ha";

export function RoomCard({ room }: { room: Room }) {
  const entity = useEntity(room.lightGroup);
  const temp = useEntity(room.tempSensor);
  const callService = useCallService();
  const openRoom = useUIStore((s) => s.openRoom);

  const isOn = entity?.state === "on";
  const brightness = entity?.attributes?.brightness as number | undefined;
  const pct = brightness ? Math.round((brightness / 255) * 100) : 0;

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const domain = room.lightGroup.split(".")[0];
    callService(domain, "toggle", undefined, { entity_id: room.lightGroup });
  };

  return (
    <Card
      active={isOn}
      accentColor={room.color}
      className="flex cursor-pointer flex-col gap-3"
      onClick={() => openRoom(room.id)}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-md text-lg"
          style={{ backgroundColor: isOn ? `${room.color}20` : "var(--color-surface-3)" }}
        >
          <span style={{ color: isOn ? room.color : "var(--color-text-muted)" }}>●</span>
        </div>
        <button
          onClick={toggle}
          className="h-8 w-8 rounded-full text-xs"
          style={{ backgroundColor: isOn ? room.color : "var(--color-surface-3)", color: isOn ? "#fff" : "var(--color-text-muted)" }}
        >
          {isOn ? "ON" : "OFF"}
        </button>
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">{room.name}</p>
        <p className="text-xs text-text-muted">
          {isOn ? `${pct}%` : "Off"}
          {temp ? ` · ${temp.state}°` : ""}
        </p>
      </div>
    </Card>
  );
}
