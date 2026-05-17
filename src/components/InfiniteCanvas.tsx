import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  animate,
  type MotionValue,
} from "motion/react";
import { useGesture } from "@use-gesture/react";

interface CanvasContextValue {
  rawX: MotionValue<number>;
  rawY: MotionValue<number>;
  canvasSize: number;
}

const CanvasContext = createContext<CanvasContextValue | null>(null);

export function useCanvas(): CanvasContextValue {
  const ctx = useContext(CanvasContext);
  if (!ctx) throw new Error("useCanvas must be used inside <InfiniteCanvas>");
  return ctx;
}

interface InfiniteCanvasProps {
  children: ReactNode;
  canvasSize?: number;
}

export function InfiniteCanvas({
  children,
  canvasSize = 2400,
}: InfiniteCanvasProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  // Only pan state — zoom is intentionally disabled
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Prevent browser wheel / pinch-zoom
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const prevent = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", prevent, { passive: false });
    return () => el.removeEventListener("wheel", prevent);
  }, []);

  // Keyboard a11y — pan only
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const step = 80;
      switch (e.key) {
        case "ArrowLeft": rawX.set(rawX.get() - step); break;
        case "ArrowRight": rawX.set(rawX.get() + step); break;
        case "ArrowUp": rawY.set(rawY.get() - step); break;
        case "ArrowDown": rawY.set(rawY.get() + step); break;
        case "Home":
          rawX.set(0);
          rawY.set(0);
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGesture(
    {
      onDrag: ({ delta: [dx, dy], pinching, last, velocity: [vx, vy], direction: [dirX, dirY] }) => {
        if (pinching) return;
        rawX.set(rawX.get() + dx);
        rawY.set(rawY.get() + dy);

        if (last) {
          const vxSigned = vx * dirX;
          const vySigned = vy * dirY;
          animate(rawX, rawX.get() + vxSigned * 350, {
            type: "decay",
            power: 0.7,
            timeConstant: 450,
          });
          animate(rawY, rawY.get() + vySigned * 350, {
            type: "decay",
            power: 0.7,
            timeConstant: 450,
          });
        }
      },
      onWheel: ({ event, delta: [dx, dy] }) => {
        // Ignore ctrl/meta+wheel (browser pinch-zoom signal) — zoom is disabled
        if (event.ctrlKey || event.metaKey) return;
        // Plain wheel = pan
        rawX.set(rawX.get() - dx);
        rawY.set(rawY.get() - dy);
      },
    },
    {
      target: viewportRef,
      eventOptions: { passive: false },
      drag: { filterTaps: true, pointer: { touch: true } },
    }
  );

  return (
    <CanvasContext.Provider value={{ rawX, rawY, canvasSize }}>
      <div
        ref={viewportRef}
        className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: "none" }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            willChange: "transform",
          }}
        >
          {children}
        </motion.div>
      </div>
    </CanvasContext.Provider>
  );
}
