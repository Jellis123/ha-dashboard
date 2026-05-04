"use client";

import { useEntity } from "@/hooks/useEntity";
import { rooms } from "@/lib/rooms";

export function TemperatureOverview() {
  return (
    <section className="mt-5">
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Room Temperatures</h2>
      <div className="flex flex-col gap-2">
        {rooms.map((room) => (
          <TempRow key={room.id} room={room} />
        ))}
      </div>
    </section>
  );
}

function TempRow({ room }: { room: (typeof rooms)[0] }) {
  const temp = useEntity(room.tempSensor);
  const humidity = useEntity(room.humiditySensor);
  if (!temp) return null;

  const t = parseFloat(temp.state);
  const barColor = t >= 22 ? "bg-danger" : t >= 18 ? "bg-success" : "bg-blue-400";
  const barWidth = Math.min(Math.max(((t - 10) / 20) * 100, 5), 100);

  return (
    <div className="rounded-lg border border-border-subtle bg-surface-1 p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-text-primary">{room.name}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-text-primary">{temp.state}°</span>
          {humidity && <span className="text-xs text-text-muted">{humidity.state}%</span>}
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-surface-3">
        <div className={`h-full rounded-full ${barColor} transition-all duration-500`} style={{ width: `${barWidth}%` }} />
      </div>
    </div>
  );
}
