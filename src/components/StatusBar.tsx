"use client";

import { useEntity, useConnectionStatus } from "@/hooks/useEntity";

export function StatusBar() {
  const weather = useEntity("weather.forecast_jack_s_home");
  const status = useConnectionStatus();

  return (
    <div className="flex items-center justify-between text-xs text-text-secondary">
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${status === "connected" ? "bg-success" : "bg-warning"}`} />
        <span>{new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      {weather && (
        <span>{weather.state} · {weather.attributes.temperature as number}°</span>
      )}
    </div>
  );
}
