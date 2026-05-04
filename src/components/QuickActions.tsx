"use client";

import { useCallService } from "@/hooks/useEntity";
import { motion } from "framer-motion";

interface Action {
  label: string;
  icon: string;
  onPress: () => void;
}

export function QuickActions() {
  const callService = useCallService();

  const actions: Action[] = [
    {
      label: "All Off",
      icon: "🌙",
      onPress: () => callService("light", "turn_off", undefined, { entity_id: "light.all_lights" }),
    },
    {
      label: "Evening",
      icon: "🌅",
      onPress: () => callService("light", "turn_on", { brightness: 77, kelvin: 2700 }, { entity_id: "light.all_lights" }),
    },
    {
      label: "Bright",
      icon: "☀️",
      onPress: () => callService("light", "turn_on", { brightness: 255, kelvin: 4000 }, { entity_id: "light.all_lights" }),
    },
    {
      label: "Kettle",
      icon: "☕",
      onPress: () => callService("water_heater", "turn_on", undefined, { entity_id: "water_heater.kettle_kettle" }),
    },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {actions.map((action) => (
        <motion.button
          key={action.label}
          whileTap={{ scale: 0.93 }}
          onClick={action.onPress}
          className="flex shrink-0 items-center gap-2 rounded-full bg-surface-2 px-4 py-2.5 text-sm text-text-primary"
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
