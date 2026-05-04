import { useHAStore } from "@/stores/ha";
import type { HassEntity } from "@/types/ha";

export function useEntity(entityId: string): HassEntity | undefined {
  return useHAStore((s) => s.entities[entityId]);
}

export function useEntities(entityIds: string[]): (HassEntity | undefined)[] {
  return useHAStore((s) => entityIds.map((id) => s.entities[id]));
}

export function useConnectionStatus() {
  return useHAStore((s) => s.status);
}

export function useCallService() {
  return useHAStore((s) => s.callService);
}
