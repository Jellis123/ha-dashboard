"use client";

import { useEffect, useRef } from "react";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";
import { useMultiHistory } from "@/hooks/useHistory";
import { rooms } from "@/lib/rooms";

const ROOM_COLORS = [
  "#6366f1",
  "#a78bfa",
  "#06b6d4",
  "#f59e0b",
  "#22c55e",
];

export function HumidityGraph() {
  const entityIds = rooms.map((r) => r.humiditySensor);
  const history = useMultiHistory(entityIds, 24);
  const chartRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<uPlot | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const now = Math.floor(Date.now() / 1000);
    const start = now - 24 * 60 * 60;
    const interval = (24 * 60 * 60) / 96;
    const times: number[] = [];
    for (let t = start; t <= now; t += interval) times.push(t);

    const series: (number | null)[][] = entityIds.map((id) => {
      const points = history[id] || [];
      if (points.length === 0) return times.map(() => null);
      return times.map((t) => {
        if (t <= points[0].time) return points[0].value;
        if (t >= points[points.length - 1].time) return points[points.length - 1].value;
        for (let i = 0; i < points.length - 1; i++) {
          if (points[i].time <= t && points[i + 1].time >= t) {
            const ratio = (t - points[i].time) / (points[i + 1].time - points[i].time);
            return points[i].value + ratio * (points[i + 1].value - points[i].value);
          }
        }
        return points[points.length - 1].value;
      });
    });

    const hasData = series.some((s) => s.some((v) => v !== null));
    if (!hasData) return;

    const data: uPlot.AlignedData = [times, ...series];
    const width = chartRef.current.clientWidth;
    const splinePaths = uPlot.paths.spline!();

    const opts: uPlot.Options = {
      width,
      height: 160,
      cursor: { show: true, x: true, y: false },
      select: { show: false, left: 0, top: 0, width: 0, height: 0 },
      legend: { show: false },
      axes: [
        {
          stroke: "#55556a",
          grid: { stroke: "#1f1f2e", width: 1 },
          ticks: { stroke: "#1f1f2e", width: 1 },
          values: (_, ticks) => ticks.map((t) => new Date(t * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })),
        },
        {
          stroke: "#55556a",
          grid: { stroke: "#1f1f2e", width: 1 },
          ticks: { stroke: "#1f1f2e", width: 1 },
          values: (_, ticks) => ticks.map((t) => t + "%"),
        },
      ],
      series: [
        {},
        ...rooms.map((room, i) => ({
          label: room.name,
          stroke: ROOM_COLORS[i],
          width: 2,
          fill: ROOM_COLORS[i] + "15",
          points: { show: false },
          paths: splinePaths,
        })),
      ],
    };

    if (plotRef.current) plotRef.current.destroy();
    plotRef.current = new uPlot(opts, data, chartRef.current);

    return () => { plotRef.current?.destroy(); plotRef.current = null; };
  }, [history, entityIds]);

  useEffect(() => {
    const handleResize = () => {
      if (plotRef.current && chartRef.current) {
        plotRef.current.setSize({ width: chartRef.current.clientWidth, height: 160 });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Humidity · 24h</h2>
      <div className="rounded-lg border border-border-subtle bg-surface-1 p-4 overflow-hidden">
        <div ref={chartRef} />
      </div>
    </section>
  );
}
