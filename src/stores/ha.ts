import { create } from "zustand";
import type { HassEntity, ConnectionStatus } from "@/types/ha";
import { connect, subscribeToEntities, callHA, disconnect } from "@/lib/ha-client";
import type { Connection, HassEntities } from "home-assistant-js-websocket";

interface HAStore {
  entities: Record<string, HassEntity>;
  status: ConnectionStatus;
  connection: Connection | null;
  error: string | null;
  init: (url: string, token: string) => Promise<void>;
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: { entity_id: string | string[] }
  ) => Promise<void>;
  disconnect: () => void;
}

export const useHAStore = create<HAStore>((set, get) => ({
  entities: {},
  status: "disconnected",
  connection: null,
  error: null,

  init: async (url, token) => {
    set({ status: "connecting", error: null });
    try {
      const conn = await connect(url, token);
      set({ status: "connected", connection: conn });

      conn.addEventListener("disconnected", () => set({ status: "disconnected" }));
      conn.addEventListener("ready", () => set({ status: "connected" }));

      subscribeToEntities(conn, (entities: HassEntities) => {
        set({ entities: entities as unknown as Record<string, HassEntity> });
      });
    } catch (e) {
      set({ status: "error", error: (e as Error).message });
    }
  },

  callService: async (domain, service, data, target) => {
    const { connection } = get();
    if (!connection) return;
    await callHA(connection, domain, service, data, target);
  },

  disconnect: () => {
    disconnect();
    set({ status: "disconnected", connection: null, entities: {} });
  },
}));
