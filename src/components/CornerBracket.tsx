type Position = "tl" | "tr" | "bl" | "br";
type OffsetKey = 2 | 3 | 4 | 5;

const INSIDE_CLASSES: Record<Position, string> = {
  tl: "top-2 left-2 border-l border-t",
  tr: "top-2 right-2 border-r border-t",
  bl: "bottom-2 left-2 border-l border-b",
  br: "bottom-2 right-2 border-r border-b",
};

// Tailwind JIT needs full literal classes — keep a static map per offset step.
const OUTSIDE_BY_OFFSET: Record<OffsetKey, Record<Position, string>> = {
  2: {
    tl: "-top-2 -left-2 border-l border-t",
    tr: "-top-2 -right-2 border-r border-t",
    bl: "-bottom-2 -left-2 border-l border-b",
    br: "-bottom-2 -right-2 border-r border-b",
  },
  3: {
    tl: "-top-3 -left-3 border-l border-t",
    tr: "-top-3 -right-3 border-r border-t",
    bl: "-bottom-3 -left-3 border-l border-b",
    br: "-bottom-3 -right-3 border-r border-b",
  },
  4: {
    tl: "-top-4 -left-4 border-l border-t",
    tr: "-top-4 -right-4 border-r border-t",
    bl: "-bottom-4 -left-4 border-l border-b",
    br: "-bottom-4 -right-4 border-r border-b",
  },
  5: {
    tl: "-top-5 -left-5 border-l border-t",
    tr: "-top-5 -right-5 border-r border-t",
    bl: "-bottom-5 -left-5 border-l border-b",
    br: "-bottom-5 -right-5 border-r border-b",
  },
};

interface CornerBracketProps {
  position: Position;
  /** When true: bracket sits past the parent's edge (parent must NOT be overflow-hidden). */
  outside?: boolean;
  /** Distance step when `outside` (Tailwind spacing: 2=8px, 3=12px, 4=16px, 5=20px). Default 4. */
  offset?: OffsetKey;
}

/** Single L-shaped corner registration bracket — research/HUD style. */
export function CornerBracket({ position, outside = false, offset = 4 }: CornerBracketProps) {
  const map = outside ? OUTSIDE_BY_OFFSET[offset] : INSIDE_CLASSES;
  return (
    <span
      aria-hidden
      className={`absolute z-30 h-3 w-3 ${map[position]} border-black/40 dark:border-white/40 pointer-events-none`}
    />
  );
}

/** Convenience: renders all 4 corner brackets. Place inside a `relative` parent.
 *  With `outside`, the parent must NOT be `overflow-hidden`. */
export function CornerBrackets({ outside = false, offset = 4 }: { outside?: boolean; offset?: OffsetKey } = {}) {
  return (
    <>
      <CornerBracket position="tl" outside={outside} offset={offset} />
      <CornerBracket position="tr" outside={outside} offset={offset} />
      <CornerBracket position="bl" outside={outside} offset={offset} />
      <CornerBracket position="br" outside={outside} offset={offset} />
    </>
  );
}
