import { useState } from "react";
import { ScrambleText } from "./ScrambleText";

interface ScrambleHeadingProps {
  text: string;
  /** When true: render as an atomic inline-block so the heading can never wrap
   *  internally (use for short single-word headings like "Statements"). */
  noWrap?: boolean;
}

/** One-shot scramble heading wrapper — hover triggers a scramble that resolves
 *  back to `text`, with a blinking period rendered INSIDE the same inline span
 *  (via ScrambleText `trailing`) so it stays glued to the last word and never
 *  wraps alone to a new line. The dot hides during scramble and reappears when
 *  the word is fully readable. */
export function ScrambleHeading({ text, noWrap = false }: ScrambleHeadingProps) {
  const [hover, setHover] = useState(false);
  const [dotVisible, setDotVisible] = useState(true);

  const wrapperClass = noWrap
    ? "cursor-default inline-block whitespace-nowrap [text-wrap:nowrap] [word-break:keep-all] [overflow-wrap:normal] [hyphens:none]"
    : "cursor-default";

  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={() => setHover(true)}
      onTouchEnd={() => setHover(false)}
      className={wrapperClass}
    >
      <ScrambleText
        text={text}
        trigger={hover}
        onScrambleStart={() => setDotVisible(false)}
        onSettled={() => setDotVisible(true)}
        trailing={
          <span className={`transition-opacity duration-150 ${dotVisible ? "animate-blink-dot" : "opacity-0"}`}>
            .
          </span>
        }
      />
    </span>
  );
}
