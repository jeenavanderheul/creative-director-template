import { Children, isValidElement, cloneElement, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { EASE_STANDARD, DUR_SLOW } from "../lib/motion";

interface BaseRevealProps {
  children: ReactNode;
  /** Extra delay (seconds) on top of any stagger */
  delay?: number;
  /** Override duration (defaults to DUR_SLOW = 0.7s) */
  duration?: number;
  /** Skip the blur step (use for canvas, 3D, large images that look fuzzy mid-animate) */
  skipBlur?: boolean;
  className?: string;
  style?: CSSProperties;
}

const buildVariants = (skipBlur: boolean): Variants => ({
  hidden: {
    opacity: 0,
    y: 14,
    ...(skipBlur ? {} : { filter: "blur(4px)" }),
  },
  shown: {
    opacity: 1,
    y: 0,
    ...(skipBlur ? {} : { filter: "blur(0px)" }),
  },
});

/** Scroll-triggered reveal — Jakub materializing recipe (opacity + y + blur).
 *  Used for everything below the fold. Triggers once when ~15% in view or
 *  10% before the bottom edge enters viewport. */
export function Reveal({ children, delay = 0, duration = DUR_SLOW, skipBlur = false, className, style }: BaseRevealProps) {
  return (
    <motion.div
      variants={buildVariants(skipBlur)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      transition={{ duration, delay, ease: EASE_STANDARD }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/** Mount-triggered reveal — same recipe but animates on first paint, not on
 *  viewport. Use for hero sections that are above-the-fold. */
export function HeroReveal({ children, delay = 0, duration = DUR_SLOW, skipBlur = false, className, style }: BaseRevealProps) {
  return (
    <motion.div
      variants={buildVariants(skipBlur)}
      initial="hidden"
      animate="shown"
      transition={{ duration, delay, ease: EASE_STANDARD }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps extends BaseRevealProps {
  /** Seconds between children */
  stagger?: number;
  /** Mount on first paint (true) vs on viewport scroll-in (false, default) */
  asHero?: boolean;
}

/** Stagger wrapper — children animate one after another with `stagger` seconds
 *  between them. Each child must be a single ReactElement (not text/fragment).
 *  Set `asHero` to animate on mount instead of scroll-in. */
export function RevealStagger({
  children,
  stagger = 0.08,
  delay = 0,
  duration = DUR_SLOW,
  skipBlur = false,
  asHero = false,
  className,
}: StaggerProps) {
  const Wrapper = asHero ? HeroReveal : Reveal;
  return (
    <div className={className}>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        return (
          <Wrapper key={i} delay={delay + i * stagger} duration={duration} skipBlur={skipBlur}>
            {cloneElement(child as ReactElement)}
          </Wrapper>
        );
      })}
    </div>
  );
}
