import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

interface TypewriterCycleProps {
  /** Cycle of words to swap through (article 'a/an' is auto-derived per word). */
  roles: readonly string[];
  /** Hold time on a complete word before deleting (ms). Default 3500. */
  holdMs?: number;
  /** Delete speed per character (ms). Default 40. */
  deleteMs?: number;
  /** Type speed per character (ms). Default 80. */
  typeMs?: number;
  /** Pause when text is empty, before retyping (ms). Default 200. */
  swapMs?: number;
}

function getArticle(role: string): string {
  // "AI Enthusiast" starts with vowel sound → "an"; rest → "a"
  return /^[aeiouAEIOU]/.test(role) ? "an" : "a";
}

type Phase = "hold" | "delete" | "swap" | "type";

/** Typewriter cycle that backspaces the current role and types a new random one,
 *  rotating through `roles`. Auto-switches the leading article (a/an) when the
 *  word starts with a vowel. */
export function TypewriterCycle({
  roles,
  holdMs = 3500,
  deleteMs = 40,
  typeMs = 80,
  swapMs = 200,
}: TypewriterCycleProps) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState(roles[0] ?? "");
  const [phase, setPhase] = useState<Phase>("hold");
  const reducedRef = useRef(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(wrapperRef, { margin: "0px 0px -10% 0px" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (reducedRef.current) return; // static display, no animation
    if (!inView) return; // pause when off-screen to save CPU/battery

    let timer: number;
    const currentRole = roles[idx];

    if (phase === "hold") {
      timer = window.setTimeout(() => setPhase("delete"), holdMs);
    } else if (phase === "delete") {
      if (text.length > 0) {
        timer = window.setTimeout(() => setText((t) => t.slice(0, -1)), deleteMs);
      } else {
        timer = window.setTimeout(() => {
          // Pick a new random role different from the current one
          let next = idx;
          if (roles.length > 1) {
            do {
              next = Math.floor(Math.random() * roles.length);
            } while (next === idx);
          }
          setIdx(next);
          setPhase("type");
        }, swapMs);
      }
    } else if (phase === "type") {
      if (text.length < currentRole.length) {
        timer = window.setTimeout(() => setText(currentRole.slice(0, text.length + 1)), typeMs);
      } else {
        setPhase("hold");
      }
    }

    return () => window.clearTimeout(timer);
  }, [phase, text, idx, roles, holdMs, deleteMs, typeMs, swapMs, inView]);

  const currentRole = roles[idx] ?? "";
  // During delete, show the article of the OUTGOING role; during type/hold use the current role.
  const articleSource = phase === "delete" ? roles[idx] : currentRole;
  const article = getArticle(articleSource);

  return (
    <span ref={wrapperRef}>
      {article} {text}
      <span
        aria-hidden
        className={`ml-px inline-block w-px bg-current align-text-bottom transition-opacity duration-150 ${phase === "hold" ? "opacity-0" : "animate-blink-dot opacity-100"}`}
        style={{ height: "0.9em" }}
      />
    </span>
  );
}
