"use client";

import { useEntity } from "@/hooks/useEntity";

const weatherIcons: Record<string, string> = {
  sunny: "☀️", "clear-night": "🌙", partlycloudy: "⛅", cloudy: "☁️",
  rainy: "🌧️", pouring: "🌊", snowy: "❄️", fog: "🌫️",
  lightning: "⚡", "lightning-rainy": "⛈️", windy: "💨", exceptional: "⚠️",
};

export function WeatherCard() {
  const weather = useEntity("weather.forecast_jack_s_home");
  if (!weather) return null;

  const temp = weather.attributes.temperature as number;
  const icon = weatherIcons[weather.state] || "🌤️";
  const humidity = weather.attributes.humidity as number;
  const windSpeed = weather.attributes.wind_speed as number;

  return (
    <div className="rounded-lg bg-surface-1 border border-border-subtle p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light text-text-primary">{temp}°</span>
            <span className="text-sm text-text-secondary capitalize">{weather.state.replace(/-/g, " ")}</span>
          </div>
          <div className="mt-1 flex gap-3 text-xs text-text-muted">
            <span>💧 {humidity}%</span>
            <span>💨 {windSpeed} km/h</span>
          </div>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}
