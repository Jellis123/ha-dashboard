"use client";

import { Sheet } from "@/components/ui/Sheet";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";
import { useEntity, useCallService } from "@/hooks/useEntity";
import { useUIStore } from "@/stores/ui";
import { rooms } from "@/lib/rooms";

export function RoomSheet() {
  const activeRoom = useUIStore((s) => s.activeRoom);
  const closeRoom = useUIStore((s) => s.closeRoom);
  const room = rooms.find((r) => r.id === activeRoom);

  if (!room) return <Sheet open={false} onClose={closeRoom}><div /></Sheet>;

  return (
    <Sheet open={!!activeRoom} onClose={closeRoom} title={room.name}>
      <RoomContent room={room} />
    </Sheet>
  );
}

function RoomContent({ room }: { room: (typeof rooms)[0] }) {
  const temp = useEntity(room.tempSensor);
  const humidity = useEntity(room.humiditySensor);

  return (
    <div className="flex flex-col gap-5">
      {/* Environment */}
      <div className="flex gap-4 text-sm text-text-secondary">
        {temp && <span>{temp.state}°C</span>}
        {humidity && <span>{humidity.state}%</span>}
      </div>

      {/* Individual lights */}
      <div className="flex flex-col gap-3">
        {room.lights.map((entityId) => (
          <LightRow key={entityId} entityId={entityId} accentColor={room.color} />
        ))}
      </div>
    </div>
  );
}

function LightRow({ entityId, accentColor }: { entityId: string; accentColor: string }) {
  const entity = useEntity(entityId);
  const callService = useCallService();

  if (!entity) return null;

  const isOn = entity.state === "on";
  const brightness = (entity.attributes?.brightness as number) || 0;
  const domain = entityId.split(".")[0];
  const name = (entity.attributes?.friendly_name as string) || entityId.split(".")[1].replace(/_/g, " ");

  const toggle = () => callService(domain, "toggle", undefined, { entity_id: entityId });
  const setBrightness = (val: number) => {
    if (domain === "light") {
      callService("light", "turn_on", { brightness: val }, { entity_id: entityId });
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-md bg-surface-2 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-primary capitalize">{name}</span>
        <Toggle checked={isOn} onChange={toggle} accentColor={accentColor} />
      </div>
      {isOn && domain === "light" && (
        <Slider value={brightness} onChange={setBrightness} accentColor={accentColor} />
      )}
    </div>
  );
}
