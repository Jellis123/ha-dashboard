"use client";

import * as RadixSlider from "@radix-ui/react-slider";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  accentColor?: string;
}

export function Slider({ value, onChange, min = 0, max = 255, accentColor }: SliderProps) {
  return (
    <RadixSlider.Root
      className="relative flex h-10 w-full touch-none items-center"
      value={[value]}
      onValueChange={([v]) => onChange(v)}
      min={min}
      max={max}
    >
      <RadixSlider.Track className="relative h-2 w-full grow rounded-full bg-surface-3">
        <RadixSlider.Range
          className="absolute h-full rounded-full"
          style={{ backgroundColor: accentColor || "var(--color-accent)" }}
        />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="block h-5 w-5 rounded-full bg-text-primary shadow-md focus:outline-none" />
    </RadixSlider.Root>
  );
}
