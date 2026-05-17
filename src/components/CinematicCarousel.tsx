import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, type PanInfo } from "motion/react";
import { CarouselTrack } from "./CarouselTrack";
import { DUR_BASE, EASE_SNAPPY } from "../lib/motion";
import { CornerBrackets } from "./CornerBracket";

export interface CinematicSlide {
  src: string;
  type?: "image" | "video" | "embed";
  title?: string;
  subtitle?: string;
  objectPosition?: string;
}

interface CinematicCarouselProps {
  slides: CinematicSlide[];
  /** Autoplay interval in ms. Default 6000. Set 0 to disable. */
  autoplayMs?: number;
  /** Label shown in HUD top-center (e.g. "EXPERIMENT / 01"). */
  label?: string;
}

const WHEEL_THROTTLE_MS = 350;

export function CinematicCarousel({ slides, autoplayMs = 6000, label }: CinematicCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const wheelLockRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "0px 0px -20% 0px" });

  const total = slides.length;

  const goTo = useCallback(
    (idx: number) => {
      if (total === 0) return;
      setActiveIndex(((idx % total) + total) % total);
    },
    [total],
  );

  // Detect window scroll — pause autoplay while user is scrolling the page
  useEffect(() => {
    let timer: number | null = null;
    const onScroll = () => {
      setScrolling(true);
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => setScrolling(false), 250);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  // Autoplay — only when in view, not paused, not scrolling, and current slide is not an embed (video/iframe)
  const activeIsEmbed = slides[activeIndex]?.type === "embed";
  useEffect(() => {
    if (!autoplayMs || paused || scrolling || !inView || total === 0 || activeIsEmbed) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, paused, scrolling, inView, total, activeIsEmbed]);

  // Wheel / trackpad navigation
  const handleWheel = (e: React.WheelEvent) => {
    const dx = e.deltaX;
    const dy = e.deltaY;
    const dominant = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    if (Math.abs(dominant) < 5) return;
    if (wheelLockRef.current) return;
    wheelLockRef.current = true;
    goTo(activeIndex + (dominant > 0 ? 1 : -1));
    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, WHEEL_THROTTLE_MS);
  };

  // Drag / swipe
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const distance = info.offset.x;
    const velocity = info.velocity.x;
    const threshold = 60;
    if (distance < -threshold || velocity < -400) {
      goTo(activeIndex + 1);
    } else if (distance > threshold || velocity > 400) {
      goTo(activeIndex - 1);
    }
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
      else if (e.key === "ArrowLeft") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, goTo]);

  if (total === 0) return null;

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-white dark:bg-[#0a0a0a] cursor-grab active:cursor-grabbing select-none [--fade-color:white] dark:[--fade-color:#0a0a0a]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onWheel={handleWheel}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.25}
      dragTransition={{ bounceStiffness: 280, bounceDamping: 28, power: 0.4 }}
      onDragEnd={handleDragEnd}
    >
      <CarouselTrack slides={slides} activeIndex={activeIndex} onSelect={goTo} />

      {/* HUD: corner registration brackets */}
      <CornerBrackets />

      {/* HUD: experiment label (top-center) */}
      {label && (
        <div
          aria-hidden
          className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-nano font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
        >
          {label}
        </div>
      )}

      {/* HUD: slide index (top-right) */}
      <div
        aria-hidden
        className="absolute top-3 right-6 z-30 pointer-events-none text-nano font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hidden sm:block"
      >
        SLIDE {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      {/* HUD: slide index (top-left) — same scale as EXPERIMENT / SLIDE labels */}
      <div
        aria-hidden
        className="absolute top-3 left-6 z-30 pointer-events-none text-nano font-mono uppercase tracking-wider leading-none text-neutral-500 dark:text-neutral-400 hidden sm:block"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={activeIndex}
            initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
            transition={{ duration: DUR_BASE, ease: EASE_SNAPPY }}
            className="block tabular-nums"
          >
            {String(activeIndex + 1).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Segmented progress bar (replaces pagination dots) */}
      <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30 pointer-events-auto">
        {slides.map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`relative h-px transition-all duration-300 ease-out cursor-pointer touch-manipulation before:absolute before:inset-x-0 before:-inset-y-4 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-black/60 dark:focus-visible:ring-white/60 ${
                isActive
                  ? "w-10 h-0.5 bg-black dark:bg-white"
                  : "w-6 bg-neutral-400/40 dark:bg-neutral-600/50 hover:bg-neutral-500/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={isActive}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
