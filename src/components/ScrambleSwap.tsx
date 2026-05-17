import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "motion/react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*/\\<>?";
const FRAME_MS = 40; // ~25fps stepped scramble — brutalist, not smooth
const TOTAL_MS = 900;
const START_DELAY_MS = 150;

function randGlyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

interface ScrambleSwapProps {
  /** Initial word + part of the cycling pool */
  base: string;
  /** Additional words to cycle through */
  targets: readonly string[];
  /** Element shown only when the word is fully readable (e.g. blinking dot) */
  trailing?: ReactNode;
  /** Extra class on outer wrapper */
  className?: string;
  /** Time (ms) the word stays readable before auto-cycling to a new one.
   *  Set 0 to disable auto-cycle. Default 3500. */
  autoMs?: number;
}

/** Auto-cycling word scramble — picks a new random word from the pool
 *  every `autoMs` after the previous one settles. Hovering interrupts the
 *  wait and triggers an immediate swap. No forced revert on mouse leave —
 *  the cycle just continues from whichever word is current. */
export function ScrambleSwap({ base, targets, trailing, className, autoMs = 3500 }: ScrambleSwapProps) {
  const [target, setTarget] = useState(base);
  const [display, setDisplay] = useState(base);
  const [settled, setSettled] = useState(true);
  const isFirstRunRef = useRef(true);
  const autoTimerRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(wrapperRef, { margin: "0px 0px -10% 0px" });

  const pool = [base, ...targets];

  function pickDifferent(current: string): string {
    if (pool.length <= 1) return current;
    const others = pool.filter((w) => w !== current);
    return others[Math.floor(Math.random() * others.length)];
  }

  function clearAutoTimer() {
    if (autoTimerRef.current !== null) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }

  // Scramble animation — runs whenever `target` changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isFirstRunRef.current) {
      isFirstRunRef.current = false;
      setDisplay(target);
      setSettled(true);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      setSettled(true);
      return;
    }

    setSettled(false);
    const chars = Array.from(target);
    const lockWindow = TOTAL_MS - START_DELAY_MS;
    const perChar = lockWindow / Math.max(chars.length, 1);
    const start = performance.now();
    let frame = 0;
    let lastTick = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      if (now - lastTick >= FRAME_MS) {
        lastTick = now;
        const next = chars
          .map((ch, i) => {
            if (/\s/.test(ch)) return ch;
            const lockAt = START_DELAY_MS + i * perChar;
            return elapsed >= lockAt ? ch : randGlyph();
          })
          .join("");
        setDisplay(next);
      }
      if (elapsed < TOTAL_MS) {
        frame = window.requestAnimationFrame(tick);
      } else {
        setDisplay(target);
        setSettled(true);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target]);

  // Auto-cycle — once settled, schedule the next random pick.
  // Paused when out of viewport to save CPU/battery on mobile.
  useEffect(() => {
    if (!settled || autoMs <= 0 || !inView) return;
    clearAutoTimer();
    autoTimerRef.current = window.setTimeout(() => {
      setTarget((prev) => pickDifferent(prev));
    }, autoMs);
    return clearAutoTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settled, autoMs, inView]);

  function handleMouseEnter() {
    clearAutoTimer();
    setTarget((prev) => pickDifferent(prev));
  }

  return (
    <span
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleMouseEnter}
      className={`cursor-default inline-block whitespace-nowrap [text-wrap:nowrap] ${className ?? ""}`}
    >
      <span className="relative inline-block align-baseline" style={{ fontVariantNumeric: "tabular-nums" }}>
        <span aria-hidden className="invisible whitespace-nowrap">{target}</span>
        <span className="absolute inset-0 whitespace-nowrap">{display}</span>
      </span>
      {trailing && (
        <span className={`inline-block transition-opacity duration-150 ${settled ? "" : "opacity-0"}`}>
          {trailing}
        </span>
      )}
    </span>
  );
}
