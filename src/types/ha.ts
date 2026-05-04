export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

export interface HassConfig {
  url: string;
  token: string;
}

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export interface Room {
  id: string;
  name: string;
  icon: string;
  color: string;
  lightGroup: string;
  lights: string[];
  tempSensor: string;
  humiditySensor: string;
  mediaplayers: string[];
}
