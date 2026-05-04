"use client";

import { motion } from "framer-motion";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  accentColor?: string;
}

export function Toggle({ checked, onChange, accentColor }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition-colors ${checked ? "" : "bg-surface-3"}`}
      style={checked ? { backgroundColor: accentColor || "var(--color-accent)" } : undefined}
    >
      <motion.div
        className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
        animate={{ left: checked ? 26 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
