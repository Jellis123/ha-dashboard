"use client";

interface IconProps {
  path: string;
  size?: number;
  color?: string;
  className?: string;
}

export function Icon({ path, size = 24, color = "currentColor", className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
      <path d={path} fill={color} />
    </svg>
  );
}
