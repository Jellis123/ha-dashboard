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

    // Build aligned time series from history data
    const allTimes = new Set<number>();
    for (const id of entityIds) {
      for (const p of history[id] || []) allTimes.add(p.time);
    }
    const times = Array.from(allTimes).sort((a, b) => a - b);
    if (times.length < 2) return;

    const data: uPlot.AlignedData = [
      new Float64Array(times),
      ...entityIds.map((id) => {
        const points = history[id] || [];
        const values = new Float64Array(times.length);
        let pi = 0;
        for (let i = 0; i < times.length; i++) {
          while (pi < points.length - 1 && points[pi + 1].time <= times[i]) pi++;
          values[i] = points[pi]?.value ?? NaN;
        }
        return values;
      }),
    ];

    const width = chartRef.current.clientWidth;

    const opts: uPlot.Options = {
      width,
      height: 200,
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
          paths: (u: uPlot, seriesIdx: number) => {
            const s = u.series[seriesIdx];
            const xdata = u.data[0];
            const ydata = u.data[seriesIdx];
            const scaleX = u.scales.x;
            const scaleY = u.scales[s.scale!];
            if (!scaleX || !scaleY) return null;

            const path = new Path2D();
            let first = true;
            let prevX = 0, prevY = 0;

            for (let i = 0; i < xdata.length; i++) {
              const val = ydata[i];
              if (val == null || isNaN(val as number)) continue;
              const cx = u.valToPos(xdata[i], "x", true);
              const cy = u.valToPos(val as number, s.scale!, true);

              if (first) {
                path.moveTo(cx, cy);
                first = false;
              } else {
                const cpx = (prevX + cx) / 2;
                path.bezierCurveTo(cpx, prevY, cpx, cy, cx, cy);
              }
              prevX = cx;
              prevY = cy;
            }

            return { stroke: path, fill: undefined, clip: undefined, band: undefined, gaps: undefined, flags: 0 };
          },
        })),
      ],
    };

    if (plotRef.current) {
      plotRef.current.destroy();
    }
    plotRef.current = new uPlot(opts, data, chartRef.current);

    return () => {
      plotRef.current?.destroy();
      plotRef.current = null;
    };
  }, [history, entityIds]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (plotRef.current && chartRef.current) {
        plotRef.current.setSize({ width: chartRef.current.clientWidth, height: 200 });
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
