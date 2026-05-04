"use client";

import { useEntity, useCallService } from "@/hooks/useEntity";

export function ClimateSection() {
  return (
    <section>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Climate</h2>
      <div className="flex flex-col gap-3">
        <ClimateCard entityId="climate.living_room" name="Heating" icon="🔥" />
        <ClimateCard entityId="climate.black_decker_5000_btu_air_conditioner" name="Air Con" icon="❄️" />
      </div>
    </section>
  );
}

function ClimateCard({ entityId, name, icon }: { entityId: string; name: string; icon: string }) {
  const entity = useEntity(entityId);
  const callService = useCallService();

  if (!entity) return null;

  const currentTemp = entity.attributes.current_temperature as number | undefined;
  const targetTemp = entity.attributes.temperature as number | undefined;
  const hvacAction = entity.attributes.hvac_action as string | undefined;
  const isOff = entity.state === "off";

  const adjustTemp = (delta: number) => {
    if (!targetTemp) return;
    callService("climate", "set_temperature", { temperature: targetTemp + delta }, { entity_id: entityId });
  };

  const togglePower = () => {
    const service = isOff ? "turn_on" : "turn_off";
    callService("climate", service, undefined, { entity_id: entityId });
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-1 p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-medium text-text-primary">{name}</p>
          <p className="text-xs text-text-muted">
            {isOff ? "Off" : `${hvacAction || entity.state}`}
            {currentTemp != null && ` · ${currentTemp}°`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isOff && targetTemp != null && (
          <>
            <button onClick={() => adjustTemp(-0.5)} className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-3 text-text-primary">−</button>
            <span className="w-10 text-center text-sm font-medium text-text-primary">{targetTemp}°</span>
            <button onClick={() => adjustTemp(0.5)} className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-3 text-text-primary">+</button>
          </>
        )}
        <button
          onClick={togglePower}
          className={`ml-2 h-8 w-8 rounded-full text-xs ${isOff ? "bg-surface-3 text-text-muted" : "bg-accent text-white"}`}
        >
          ⏻
        </button>
      </div>
    </div>
  );
}
