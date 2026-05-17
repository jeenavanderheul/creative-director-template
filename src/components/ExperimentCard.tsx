import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Info, X } from "lucide-react";
import { CinematicCarousel, type CinematicSlide } from "./CinematicCarousel";
import { EASE_STANDARD, DUR_BASE } from "../lib/motion";

export interface ExperimentCaseBlock {
  number: string;
  title: string;
  body: string;
}

interface ExperimentCardProps {
  label: string;
  title: string;
  image: string;
  caseBlocks: ExperimentCaseBlock[];
  showAllInfo?: boolean;
  sliderItems?: CinematicSlide[];
}

/** Typewriter title — reveals the LAST `typeLastNWords` words char-by-char.
    Each character is pre-rendered with opacity 0 and fades in smoothly when
    its turn comes (CSS opacity transition) — no DOM churn, no flicker. */
function TypewriterTitle({
  text,
  charDelay = 75,
  typeLastNWords = 3,
}: {
  text: string;
  charDelay?: number;
  typeLastNWords?: number;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  const [shownCount, setShownCount] = useState(0);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches,
  );

  // Detect viewport — animation only on desktop (md+ ≥768px); mobile shows static text
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mql.matches);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Split point: start of the (typeLastNWords)-th word from the end
  const { prefix, suffix } = (() => {
    const wordMatches = Array.from(text.matchAll(/\S+/g));
    if (wordMatches.length <= typeLastNWords) {
      return { prefix: "", suffix: text };
    }
    const splitAt = wordMatches[wordMatches.length - typeLastNWords].index ?? 0;
    return { prefix: text.slice(0, splitAt), suffix: text.slice(splitAt) };
  })();

  const suffixChars = Array.from(suffix);
  const done = shownCount >= suffixChars.length;

  useEffect(() => {
    if (!isDesktop) return;
    if (!containerRef.current) return;
    const node = containerRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStarted(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [isDesktop]);

  useEffect(() => {
    if (!isDesktop) return;
    if (!started) return;
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setShownCount(i);
      if (i >= suffixChars.length) window.clearInterval(timer);
    }, charDelay);
    return () => window.clearInterval(timer);
  }, [isDesktop, started, suffixChars.length, charDelay]);

  // Mobile: static text instantly, no typewriter
  if (!isDesktop) {
    return <span className="block whitespace-pre-line">{text}</span>;
  }

  return (
    <span ref={containerRef} className="relative inline-block w-full">
      {/* Layout reservation — invisible full-text twin keeps height stable */}
      <span aria-hidden className="invisible block whitespace-pre-line">{text}</span>
      {/* Visible: prefix instantly + fading chars + cursor that follows typing */}
      <span className="absolute inset-0 block whitespace-pre-line">
        {prefix}
        {suffixChars.slice(0, shownCount).map((ch, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, filter: "blur(3px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {ch}
          </motion.span>
        ))}
        {!done && <span className="inline-block opacity-60">|</span>}
      </span>
    </span>
  );
}

export function ExperimentCard({ label, title, image, caseBlocks, showAllInfo = false, sliderItems }: ExperimentCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setShowInfo(showAllInfo);
  }, [showAllInfo]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const grayscale = useTransform(scrollYProgress, [0, 0.35, 0.5, 0.65, 1], [1, 0, 0, 0, 1]);
  const imgFilter = useTransform(grayscale, (v) => `grayscale(${v})`);

  const infoOpen = showInfo || showAllInfo;

  return (
    <section
      ref={ref}
      className="px-8 pt-[8vh] pb-32 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-full sm:max-w-[75vw] md:max-w-7xl">
        {/* Title block — label is rendered by ExperimentMenu above the section */}
        <div className="mb-10">
          <h2 className="text-[clamp(1.75rem,6vw,4.5rem)] font-normal uppercase tracking-tight leading-[1] whitespace-pre-line text-center">
            <TypewriterTitle text={title} />
          </h2>
        </div>
      </div>

      {/* Hero visual — height matches active card + bottom space for pagination dots */}
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="overflow-hidden relative bg-neutral-200 dark:bg-neutral-800 h-[48vw] md:h-[36vw] lg:h-[31vw]">
          {sliderItems && sliderItems.length > 0 ? (
            <CinematicCarousel slides={sliderItems} label={label} />
          ) : (
            <motion.img
              src={image}
              alt={title}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              style={{ filter: imgFilter }}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="mx-auto max-w-full sm:max-w-[75vw] md:max-w-7xl">

        {/* Info toggle (only when not globally open) */}
        {!showAllInfo && (
          <div className="flex flex-col items-center mt-6">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center justify-center text-neutral-400 hover:text-black dark:hover:text-white transition-[color,transform] duration-150 cursor-pointer min-h-[44px] min-w-[44px] touch-manipulation active:scale-90"
              aria-label={showInfo ? "Hide info" : "Show info"}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={showInfo ? "x" : "info"}
                  initial={{ opacity: 0, rotate: -45, scale: 0.85 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.85 }}
                  transition={{ duration: 0.15, ease: EASE_STANDARD }}
                  className="flex items-center justify-center"
                >
                  {showInfo ? <X size={14} /> : <Info size={14} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        )}

        {/* Case blocks — grid-rows trick: animates fr units without triggering layout per frame.
            Cheaper than height: 0 -> auto, no jank on large content. */}
        <div
          className="grid transition-[grid-template-rows,opacity] ease-out"
          style={{
            gridTemplateRows: infoOpen ? "1fr" : "0fr",
            opacity: infoOpen ? 1 : 0,
            transitionDuration: `${DUR_BASE * 1000}ms`,
          }}
          aria-hidden={!infoOpen}
        >
          <div className="overflow-hidden min-h-0">
            <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-3 mt-10">
              {caseBlocks.map((block) => (
                <div
                  key={block.number}
                  className="pt-6 pb-8 grid grid-cols-[24px_1fr] xs:grid-cols-[32px_1fr] md:grid-cols-[36px_1fr] gap-x-0"
                >
                  <span className="text-[10px] font-mono text-neutral-300 pt-0.5">
                    {block.number}
                  </span>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-black dark:text-white mb-4">
                      {block.title}
                    </h3>
                    <p className="text-base font-normal tracking-tight leading-relaxed text-justify text-neutral-600 dark:text-neutral-300">
                      {block.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
