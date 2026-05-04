"use client";

import { useEntity } from "@/hooks/useEntity";

const SENSORS = [
  { id: "binary_sensor.back_door_contact_contact", name: "Back Door" },
  { id: "binary_sensor.kitchen_window_contact_contact", name: "Kitchen Window" },
];

export function SecuritySection() {
  const alert = useEntity("binary_sensor.security_alert_active");
  const isAlert = alert?.state === "on";

  return (
    <section>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Security</h2>
      <div className={`rounded-lg border p-4 ${isAlert ? "border-danger/40 bg-danger/5" : "border-border-subtle bg-surface-1"}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`h-2 w-2 rounded-full ${isAlert ? "bg-danger animate-pulse" : "bg-success"}`} />
          <span className="text-sm font-medium text-text-primary">
            {isAlert ? "Alert Active" : "All Secure"}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {SENSORS.map((sensor) => (
            <SensorRow key={sensor.id} entityId={sensor.id} name={sensor.name} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SensorRow({ entityId, name }: { entityId: string; name: string }) {
  const entity = useEntity(entityId);
  if (!entity) return null;

  const isOpen = entity.state === "on";

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-secondary">{name}</span>
      <span className={isOpen ? "text-danger" : "text-success"}>
        {isOpen ? "Open" : "Closed"}
      </span>
    </div>
  );
}
