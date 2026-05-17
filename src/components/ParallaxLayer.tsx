import { type ReactNode } from "react";
import { motion, useTransform } from "motion/react";
import { useCanvas } from "./InfiniteCanvas";

interface ParallaxLayerProps {
  depth: number; // 0 = static, 1 = full speed, >1 = faster than camera
  children: ReactNode;
}

// Modulo that always returns a positive remainder
const wrap = (v: number, size: number) => {
  const r = v % size;
  return r < 0 ? r + size : r;
};

export function ParallaxLayer({ depth, children }: ParallaxLayerProps) {
  const { rawX, rawY, canvasSize } = useCanvas();

  // Each layer moves at `depth` × the camera — background (0.5) drifts slower,
  // foreground (1.0) tracks 1:1. Then wrap into a single tile so the 3×3 grid
  // creates a seamless infinite loop.
  const x = useTransform(rawX, (v) => wrap(v * depth, canvasSize) - canvasSize);
  const y = useTransform(rawY, (v) => wrap(v * depth, canvasSize) - canvasSize);

  // Render the children 9 times in a 3×3 grid so wrapping is invisible
  const offsets = [0, 1, 2];

  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        x,
        y,
        width: canvasSize,
        height: canvasSize,
        willChange: "transform",
        pointerEvents: "none",
      }}
    >
      {offsets.map((oy) =>
        offsets.map((ox) => (
          <div
            key={`${ox}-${oy}`}
            style={{
              position: "absolute",
              left: ox * canvasSize,
              top: oy * canvasSize,
              width: canvasSize,
              height: canvasSize,
              pointerEvents: "none",
            }}
          >
            {children}
          </div>
        ))
      )}
    </motion.div>
  );
}
