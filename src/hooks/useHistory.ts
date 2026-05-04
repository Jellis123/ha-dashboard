"use client";

import { useEffect, useState } from "react";
import { useHAStore } from "@/stores/ha";

interface HistoryPoint {
  time: number;
  value: number;
}

export function useHistory(entityId: string, hours: number = 24): HistoryPoint[] {
  const connection = useHAStore((s) => s.connection);
  const [data, setData] = useState<HistoryPoint[]>([]);

  useEffect(() => {
    if (!connection) return;

    const start = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    const end = new Date().toISOString();

    connection
      .sendMessagePromise<Array<Array<{ state: string; last_changed: string }>>>({
        type: "history/history_during_period",
        start_time: start,
        end_time: end,
        entity_ids: [entityId],
        minimal_response: true,
        significant_changes_only: false,
      })
      .then((result) => {
        const states = result?.[entityId as unknown as number] || [];
        const points: HistoryPoint[] = [];
        for (const s of states as unknown as Array<{ s?: string; state?: string; lu?: number; last_changed?: string }>) {
          const val = parseFloat((s.s ?? s.state) || "");
          if (isNaN(val)) continue;
          const time = s.lu ? s.lu : new Date(s.last_changed || "").getTime() / 1000;
          points.push({ time, value: val });
        }
        setData(points);
      })
      .catch(() => {});
  }, [connection, entityId, hours]);

  return data;
}

export function useMultiHistory(entityIds: string[], hours: number = 24): Record<string, HistoryPoint[]> {
  const connection = useHAStore((s) => s.connection);
  const [data, setData] = useState<Record<string, HistoryPoint[]>>({});

  useEffect(() => {
    if (!connection) return;

    const start = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    const end = new Date().toISOString();

    connection
      .sendMessagePromise<Record<string, Array<{ s?: string; state?: string; lu?: number; last_changed?: string }>>>({
        type: "history/history_during_period",
        start_time: start,
        end_time: end,
        entity_ids: entityIds,
        minimal_response: true,
        significant_changes_only: false,
      })
      .then((result) => {
        const parsed: Record<string, HistoryPoint[]> = {};
        for (const id of entityIds) {
          const states = (result as Record<string, Array<{ s?: string; state?: string; lu?: number; last_changed?: string }>>)[id] || [];
          const raw: HistoryPoint[] = [];
          for (const s of states) {
            const val = parseFloat((s.s ?? s.state) || "");
            if (isNaN(val)) continue;
            const time = s.lu ? s.lu : new Date(s.last_changed || "").getTime() / 1000;
            raw.push({ time, value: val });
          }
          parsed[id] = downsample(raw, 100);
        }
        setData(parsed);
      })
      .catch(() => {});
  }, [connection, entityIds.join(","), hours]);

  return data;
}

function downsample(points: HistoryPoint[], maxPoints: number): HistoryPoint[] {
  if (points.length <= maxPoints) return points;
  const step = (points.length - 1) / (maxPoints - 1);
  const result: HistoryPoint[] = [];
  for (let i = 0; i < maxPoints; i++) {
    const idx = Math.round(i * step);
    result.push(points[idx]);
  }
  return result;
}
