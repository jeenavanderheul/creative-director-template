import { motion } from "motion/react";
import { EASE_SNAPPY, DUR_BASE } from "../lib/motion";

interface ExperimentMenuProps {
  count: number;
  active: number;
  onSelect: (index: number) => void;
}

export function ExperimentMenu({ count, active, onSelect }: ExperimentMenuProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
      {Array.from({ length: count }, (_, i) => {
        const label = `EXPERIMENT / ${String(i + 1).padStart(2, "0")}`;
        const isActive = i === active;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={`relative text-micro font-mono uppercase tracking-wider transition-[color,transform] duration-150 cursor-pointer active:scale-95 ${
              isActive
                ? "text-black dark:text-white"
                : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            {label}
            {isActive && (
              <motion.span
                layoutId="experiment-menu-underline"
                className="absolute -bottom-1 left-0 right-0 h-px bg-black dark:bg-white"
                transition={{ duration: DUR_BASE, ease: EASE_SNAPPY }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
