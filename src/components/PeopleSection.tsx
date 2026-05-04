"use client";

import { useEntity } from "@/hooks/useEntity";

const PEOPLE = [
  { id: "person.jack_ellis", name: "Jack", battery: "sensor.pixel_9_pro_xl_battery_level" },
  { id: "person.princess_poppy", name: "Poppy", battery: "sensor.iphone_battery_level" },
];

export function PeopleSection() {
  return (
    <div className="flex gap-3">
      {PEOPLE.map((p) => (
        <PersonChip key={p.id} {...p} />
      ))}
    </div>
  );
}

function PersonChip({ id, name, battery }: { id: string; name: string; battery: string }) {
  const person = useEntity(id);
  const bat = useEntity(battery);
  if (!person) return null;

  const isHome = person.state === "home";
  const batLevel = bat ? parseInt(bat.state) : null;
  const batColor = batLevel == null ? "text-text-muted" : batLevel > 50 ? "text-success" : batLevel > 20 ? "text-warning" : "text-danger";

  return (
    <div className="flex flex-1 items-center gap-3 rounded-lg border border-border-subtle bg-surface-1 p-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${isHome ? "bg-success/20 text-success" : "bg-surface-3 text-text-muted"}`}>
        {name[0]}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary">{name}</p>
        <p className="text-xs text-text-muted">
          {isHome ? "Home" : person.state}
          {batLevel != null && <span className={` ml-1 ${batColor}`}>· {batLevel}%</span>}
        </p>
      </div>
    </div>
  );
}
