"use client";

import { useEffect, useRef } from "react";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";
import { useMultiHistory } from "@/hooks/useHistory";
import { rooms } from "@/lib/rooms";

const ROOM_COLORS = [
  "#6366f1", // living room
  "#a78bfa", // bedroom
  "#06b6d4", // office
  "#f59e0b", // kitchen
  "#22c55e", // library
];

export function TemperatureGraph() {
  const entityIds = rooms.map((r) => r.tempSensor);
  const history = useMultiHistory(entityIds, 24);
  const chartRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<uPlot | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Create a uniform time axis with fixed intervals
    const now = Math.floor(Date.now() / 1000);
    const start = now - 24 * 60 * 60;
    const interval = (24 * 60 * 60) / 96; // 96 points = every 15 min
    const times: number[] = [];
    for (let t = start; t <= now; t += interval) times.push(t);

    // Interpolate each series onto the uniform time axis
    const series: (number | null)[][] = entityIds.map((id) => {
      const points = history[id] || [];
      if (points.length === 0) return times.map(() => null);
      return times.map((t) => {
        // Find surrounding points
        let lo = 0, hi = points.length - 1;
        if (t <= points[0].time) return points[0].value;
        if (t >= points[hi].time) return points[hi].value;
        for (let i = 0; i < points.length - 1; i++) {
          if (points[i].time <= t && points[i + 1].time >= t) {
            lo = i; hi = i + 1; break;
          }
        }
        // Linear interpolation between points
        const ratio = (t - points[lo].time) / (points[hi].time - points[lo].time);
        return points[lo].value + ratio * (points[hi].value - points[lo].value);
      });
    });

    const hasData = series.some((s) => s.some((v) => v !== null));
    if (!hasData) return;

    const data: uPlot.AlignedData = [
      times,
      ...series,
    ];

    const width = chartRef.current.clientWidth;
    const splinePaths = uPlot.paths.spline!();

    const opts: uPlot.Options = {
      width,
      height: 220,
      cursor: { show: true, x: true, y: false },
      select: { show: false, left: 0, top: 0, width: 0, height: 0 },
      legend: { show: true },
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
          values: (_, ticks) => ticks.map((t) => t + "°"),
        },
      ],
      series: [
        {},
        ...rooms.map((room, i) => ({
          label: room.name,
          stroke: ROOM_COLORS[i],
          width: 2.5,
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
        plotRef.current.setSize({ width: chartRef.current.clientWidth, height: 220 });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Temperature · 24h</h2>
      <div className="rounded-lg border border-border-subtle bg-surface-1 p-4 overflow-hidden">
        <div ref={chartRef} />
      </div>
    </section>
  );
}
