"use client";

import { motion } from "framer-motion";

interface CardProps {
  active?: boolean;
  accentColor?: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Card({ active, accentColor, className = "", onClick, children }: CardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`rounded-lg border border-border-subtle bg-surface-1 p-4 ${active ? "border-accent/40" : ""} ${className}`}
      style={active && accentColor ? { borderColor: `${accentColor}60` } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
