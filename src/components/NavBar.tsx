"use client";

import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "climate", label: "Climate", icon: "🌡️" },
  { id: "media", label: "Media", icon: "🎵" },
  { id: "more", label: "More", icon: "⋯" },
];

interface NavBarProps {
  active: string;
  onChange: (tab: string) => void;
}

export function NavBar({ active, onChange }: NavBarProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border-subtle bg-surface-0/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex flex-1 flex-col items-center gap-0.5 py-3"
          >
            <span className="text-lg">{tab.icon}</span>
            <span className={`text-[10px] ${active === tab.id ? "text-accent" : "text-text-muted"}`}>
              {tab.label}
            </span>
            {active === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute -top-px left-4 right-4 h-0.5 rounded-full bg-accent"
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
