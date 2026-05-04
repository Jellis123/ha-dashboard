"use client";

import { useEntity, useCallService } from "@/hooks/useEntity";
import { useHAStore } from "@/stores/ha";

const MEDIA_PLAYERS = [
  "media_player.living_room_tv",
  "media_player.living_room_nest",
  "media_player.bedroom_display",
  "media_player.office_display",
  "media_player.kitchen_display",
];

export function MediaSection() {
  const entities = useHAStore((s) => s.entities);
  const activePlayers = MEDIA_PLAYERS.filter((id) => {
    const e = entities[id];
    return e && !["off", "unavailable", "idle", "standby"].includes(e.state);
  });

  if (activePlayers.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Now Playing</h2>
      <div className="flex flex-col gap-3">
        {activePlayers.map((id) => (
          <MediaCard key={id} entityId={id} />
        ))}
      </div>
    </section>
  );
}

function MediaCard({ entityId }: { entityId: string }) {
  const entity = useEntity(entityId);
  const callService = useCallService();

  if (!entity) return null;

  const title = entity.attributes.media_title as string || "";
  const artist = entity.attributes.media_artist as string || "";
  const name = entity.attributes.friendly_name as string || entityId.split(".")[1];
  const thumbnail = entity.attributes.entity_picture as string | undefined;

  const togglePlayPause = () => {
    callService("media_player", "media_play_pause", undefined, { entity_id: entityId });
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-1 p-3">
      {thumbnail && (
        <img src={thumbnail} alt="" className="h-12 w-12 rounded-md object-cover" />
      )}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-text-primary">{title || name}</p>
        <p className="truncate text-xs text-text-muted">{artist || entity.state}</p>
      </div>
      <button
        onClick={togglePlayPause}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-3 text-text-primary"
      >
        {entity.state === "playing" ? "⏸" : "▶"}
      </button>
    </div>
  );
}
