"use client";

import { useEntity, useCallService } from "@/hooks/useEntity";
import { Slider } from "@/components/ui/Slider";

const ALL_PLAYERS = [
  { id: "media_player.living_room_tv", name: "Living Room TV", icon: "📺" },
  { id: "media_player.living_room_nest", name: "Living Room Nest", icon: "🔊" },
  { id: "media_player.bedroom_display", name: "Bedroom Display", icon: "🔊" },
  { id: "media_player.office_display", name: "Office Display", icon: "🔊" },
  { id: "media_player.kitchen_display", name: "Kitchen Display", icon: "🔊" },
];

export function MediaTab() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted">Media Players</h2>
      {ALL_PLAYERS.map((p) => (
        <FullMediaCard key={p.id} entityId={p.id} name={p.name} icon={p.icon} />
      ))}
    </div>
  );
}

function FullMediaCard({ entityId, name, icon }: { entityId: string; name: string; icon: string }) {
  const entity = useEntity(entityId);
  const callService = useCallService();

  if (!entity) return null;

  const isOff = ["off", "unavailable"].includes(entity.state);
  const isPlaying = entity.state === "playing";
  const title = entity.attributes.media_title as string || "";
  const artist = entity.attributes.media_artist as string || "";
  const volume = (entity.attributes.volume_level as number) ?? 0;
  const thumbnail = entity.attributes.entity_picture as string | undefined;

  const setVolume = (val: number) => {
    callService("media_player", "volume_set", { volume_level: val / 100 }, { entity_id: entityId });
  };

  const togglePlayPause = () => {
    callService("media_player", "media_play_pause", undefined, { entity_id: entityId });
  };

  return (
    <div className={`rounded-lg border bg-surface-1 p-4 ${isOff ? "border-border-subtle opacity-50" : "border-border-subtle"}`}>
      <div className="flex items-center gap-3">
        {thumbnail && !isOff ? (
          <img src={thumbnail} alt="" className="h-10 w-10 rounded-md object-cover" />
        ) : (
          <span className="text-xl">{icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary">{name}</p>
          <p className="truncate text-xs text-text-muted">
            {isOff ? "Off" : title ? `${title}${artist ? ` · ${artist}` : ""}` : entity.state}
          </p>
        </div>
        {!isOff && (
          <button onClick={togglePlayPause} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-3 text-text-primary">
            {isPlaying ? "⏸" : "▶"}
          </button>
        )}
      </div>
      {!isOff && (
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs text-text-muted">🔈</span>
          <Slider value={Math.round(volume * 100)} onChange={setVolume} min={0} max={100} />
          <span className="text-xs text-text-muted w-7">{Math.round(volume * 100)}%</span>
        </div>
      )}
    </div>
  );
}
