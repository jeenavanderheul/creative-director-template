import { useEffect, useRef, useState, type ReactNode } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*/\\<>?";
const FRAME_MS = 40; // ~25fps stepped scramble — brutalist, not smooth
const TOTAL_MS = 900;
const START_DELAY_MS = 150;

function randGlyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

interface ScrambleTextProps {
  text: string;
  /** Rising edge (false → true) triggers a one-shot scramble that resolves to text. */
  trigger: boolean;
  /** Called when the scramble animation completes and text is fully readable. */
  onSettled?: () => void;
  /** Called the moment a new scramble starts (rising edge). */
  onScrambleStart?: () => void;
  /** Inline content rendered directly after the text inside the same span —
   *  keeps it glued to the last word so it never wraps alone to a new line. */
  trailing?: ReactNode;
}

/** One-shot kinetic scramble that ALWAYS completes its full cycle to the
 *  resolved text, even if `trigger` flips back to false mid-animation. The
 *  RAF loop is held in a ref so it survives prop/trigger changes; only a new
 *  rising edge can interrupt and restart it. */
export function ScrambleText({ text, trigger, onSettled, onScrambleStart, trailing }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number | null>(null);
  const prevTriggerRef = useRef(trigger);
  const textRef = useRef(text);
  const onSettledRef = useRef(onSettled);
  const onScrambleStartRef = useRef(onScrambleStart);

  // Keep refs in sync with latest props (so the long-running RAF reads fresh values)
  useEffect(() => {
    textRef.current = text;
    onSettledRef.current = onSettled;
    onScrambleStartRef.current = onScrambleStart;
  });

  // Resolve immediately when text changes while not animating
  useEffect(() => {
    if (frameRef.current === null) {
      setDisplay(text);
    }
  }, [text]);

  // Detect rising edge and start a fresh scramble. Does NOT cancel an in-flight
  // animation on falling edge — let it complete naturally to the resolved text.
  useEffect(() => {
    const rising = !prevTriggerRef.current && trigger;
    prevTriggerRef.current = trigger;
    if (!rising) return;

    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(textRef.current);
      return;
    }

    // Cancel any in-flight animation (rising edge restarts)
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    onScrambleStartRef.current?.();
    const start = performance.now();
    let lastTick = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      if (now - lastTick >= FRAME_MS) {
        lastTick = now;
        const currentText = textRef.current;
        const chars = Array.from(currentText);
        const lockWindow = TOTAL_MS - START_DELAY_MS;
        const perChar = lockWindow / Math.max(chars.length, 1);
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
        frameRef.current = window.requestAnimationFrame(tick);
      } else {
        setDisplay(textRef.current);
        onSettledRef.current?.();
        frameRef.current = null;
      }
    };

    frameRef.current = window.requestAnimationFrame(tick);
  }, [trigger]);

  // Cleanup on unmount only — never cancel because of trigger changes
  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  // Plain inline so the parent's natural text flow (and wrapping) is preserved.
  // Trailing content sits inside the same span — no whitespace between display
  // and trailing means the trailing element never wraps alone to a new line.
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {display}
      {trailing}
    </span>
  );
}
