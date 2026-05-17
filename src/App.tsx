/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { X } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { CursorTrail } from "./components/CursorTrail";

import { StrategyCard, BrandCard, CultureCard, AudienceCard, FrameworksCard, BrandWorldsCard, SystemsCard, FunnelsCard, WorkflowsCard, ContentCard, PerformanceCard, GrowthCard } from "./components/DiagramCards";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Footer } from "./components/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HeroReveal, Reveal } from "./components/Reveal";
import { ScrambleSwap } from "./components/ScrambleSwap";
import { ScrambleText } from "./components/ScrambleText";
import { TypewriterCycle } from "./components/TypewriterCycle";
import { PageFallback } from "./components/PageFallback";
import { EASE_STANDARD } from "./lib/motion";
import { useLocation } from "react-router-dom";

const MorphingSystem = lazy(() => import("./components/MorphingSystem").then(m => ({ default: m.MorphingSystem })));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const WorkPage = lazy(() => import("./pages/WorkPage"));
const ErasedFontCasePage = lazy(() => import("./pages/ErasedFontCasePage"));
const PlayPage = lazy(() => import("./pages/PlayPage"));
const AISystemsPage = lazy(() => import("./pages/AISystemsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const PHRASES = [
  { from: "creativity", to: "business" },
  { from: "strategy", to: "execution" },
  { from: "brands", to: "growth" },
  { from: "platforms", to: "performance" },
];


function DrawCircle({
  size,
  progress,
  range,
  className,
}: {
  size: number;
  progress: import("motion/react").MotionValue<number>;
  range: [number, number];
  className?: string;
}) {
  const r = size / 2 - 0.5;
  const circumference = 2 * Math.PI * r;
  const dashOffset = useTransform(progress, [range[0], range[1], 1], [circumference, 0, 0]);
  const opacity = useTransform(progress, [range[0], range[1], 1], [0, 0.2, 0.2]);

  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={{ overflow: "visible" }}
    >
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray={circumference}
        style={{ strokeDashoffset: dashOffset, opacity }}
      />
    </svg>
  );
}

function TypewriterWord({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: import("motion/react").MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, [range[0], range[1], 1], [0, 1, 1]);
  const y = useTransform(progress, [range[0], range[1], 1], [6, 0, 0]);
  return (
    <motion.span className="block" style={{ opacity, y }}>
      {children}
    </motion.span>
  );
}

function SystemDiagram() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(typeof window !== "undefined" && window.innerWidth < 640);
  const [hoveredCircle, setHoveredCircle] = useState<"define" | "build" | "scale" | null>(null);
  const [tappedCircle, setTappedCircle] = useState<"define" | "build" | "scale" | null>(null);
  const [tapIdx, setTapIdx] = useState(0);
  const [systemHover, setSystemHover] = useState(false);
  const [systemDotVisible, setSystemDotVisible] = useState(true);
  const [bodyShown, setBodyShown] = useState(typeof window !== "undefined" && window.innerWidth < 640);

  // Card-count map drives both auto-cycling and pagination dots.
  // Keep these in sync with the *Images arrays below.
  const CARD_COUNTS: Record<"define" | "build" | "scale", number> = { define: 4, build: 5, scale: 3 };

  const handleTap = (circle: "define" | "build" | "scale") => {
    if (tappedCircle === circle) {
      // Re-tap same circle → manual advance to next card
      setTapIdx((prev) => (prev + 1) % CARD_COUNTS[circle]);
    } else {
      // First tap on a circle → reset to first card
      setTapIdx(0);
      setTappedCircle(circle);
    }
  };

  // Auto-cycle through all cards for the current circle every 3s
  useEffect(() => {
    if (!tappedCircle) return;
    const count = CARD_COUNTS[tappedCircle];
    const id = window.setInterval(() => {
      setTapIdx((prev) => (prev + 1) % count);
    }, 3000);
    return () => window.clearInterval(id);
  }, [tappedCircle]);

  const getTapCard = () => {
    if (!tappedCircle) return null;
    const items = tappedCircle === "define" ? defineImages : tappedCircle === "build" ? buildImages : scaleImages;
    return items[tapIdx % items.length];
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.9 && !isComplete) setIsComplete(true);
    if (v >= 0.85 && !bodyShown) setBodyShown(true);
  });

  // Diagram cards per circle — M (80%) and L (100%) on desktop, always 100% on mobile
  const M = "full";
  const sizeClass: Record<string, string> = {
    "full": "w-full h-full",
    "md-80": "w-full h-full md:w-[80%] md:h-[80%]",
  };
  const wrap = (node: React.ReactNode, size: string) => (
    <div className="w-full h-full flex items-center justify-center">
      <div className={sizeClass[size]}>{node}</div>
    </div>
  );
  const defineImages = [
    wrap(<StrategyCard key="strategy" />, M),
    wrap(<BrandCard key="brand" />, M),
    wrap(<CultureCard key="culture" />, M),
    wrap(<AudienceCard key="audience" />, M),
  ];
  const buildImages = [
    wrap(<FrameworksCard key="frameworks" />, M),
    wrap(<BrandWorldsCard key="brandworlds" />, M),
    wrap(<SystemsCard key="systems" />, M),
    wrap(<FunnelsCard key="funnels" />, M),
    wrap(<WorkflowsCard key="workflows" />, M),
  ];
  const scaleImages = [
    wrap(<ContentCard key="content" />, M),
    wrap(<PerformanceCard key="performance" />, M),
    wrap(<GrowthCard key="growth" />, M),
  ];

  // Title
  const titleOpacity = useTransform(scrollYProgress, [0, 0.05, 1], [0, 1, 1]);

  // Background circle outlines — drawn in circular motion (SVG stroke)

  // DEFINE circle — HARD RULE: only after outlines are 100% drawn (0.26)
  const defineOpacity = useTransform(scrollYProgress, [0.30, 0.40, 1], [0, 1, 1]);
  const defineScale = useTransform(scrollYProgress, [0.30, 0.40, 1], [0.8, 1, 1]);

  // BUILD circle — after DEFINE text finishes (~0.52)
  const buildOpacity = useTransform(scrollYProgress, [0.52, 0.62, 1], [0, 1, 1]);
  const buildScale = useTransform(scrollYProgress, [0.52, 0.62, 1], [0.5, 1, 1]);

  // SCALE circle — after BUILD text finishes (~0.72), fades in + scales up
  const scaleOpacity = useTransform(scrollYProgress, [0.72, 0.82, 1], [0, 1, 1]);
  const scaleCircleScale = useTransform(scrollYProgress, [0.72, 0.82, 1], [0.8, 1, 1]);

  if (isComplete) {
    return (
      <div ref={sectionRef} className="relative sm:min-h-[300vh]">
        <div className="sm:sticky sm:top-0 flex sm:min-h-screen items-center overflow-hidden bg-white dark:bg-[#0a0a0a] px-8 md:px-12 lg:px-24 py-16 sm:py-0">
          <div className="relative mx-auto w-full max-w-7xl">
            <div className="mb-12 sm:mb-12">
              <p className="mb-2 text-base font-normal uppercase tracking-tight leading-relaxed text-neutral-400">FROM INPUT TO OUTPUT</p>
              <h2 className="text-huge">
                <span
                  onMouseEnter={() => setSystemHover(true)}
                  onMouseLeave={() => setSystemHover(false)}
                  onTouchStart={() => setSystemHover(true)}
                  onTouchEnd={() => setSystemHover(false)}
                  className="cursor-default"
                >
                  <ScrambleText
                    text="SYSTEM IN MOTION"
                    trigger={systemHover}
                    onScrambleStart={() => setSystemDotVisible(false)}
                    onSettled={() => setSystemDotVisible(true)}
                    trailing={
                      <span className={`transition-opacity duration-150 ${systemDotVisible ? "animate-blink-dot" : "opacity-0"}`}>.</span>
                    }
                  />
                </span>
              </h2>
              <p className="text-micro mt-4 text-neutral-400">Define. Build. Scale.</p>
            </div>
            <div className="relative flex flex-col items-center justify-center gap-8 overflow-hidden lg:overflow-visible lg:h-[672px] lg:flex-row lg:gap-0">
              <div className="absolute inset-0 pointer-events-none hidden opacity-20 lg:block">
                <div className="absolute left-[calc(50%-269px)] top-1/2 h-[442px] w-[442px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black dark:border-white" />
                <div className="absolute left-1/2 top-1/2 h-[557px] w-[557px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black dark:border-white" />
                <div className="absolute left-[calc(50%+269px)] top-1/2 h-[442px] w-[442px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black dark:border-white" />
              </div>
              <div className="relative z-10 flex h-48 w-48 flex-col items-center justify-center rounded-full border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-5 text-center shadow-sm sm:h-64 sm:w-64 lg:-mr-16 lg:h-[307px] lg:w-[307px]"
                onMouseEnter={() => setHoveredCircle("define")}
                onMouseLeave={() => setHoveredCircle(null)}
                onClick={() => handleTap("define")}
              >
                <span className="text-micro text-neutral-400">01 / DEFINE</span>
                <h3 className="mt-4 text-diagram font-medium uppercase leading-tight">
                  Strategy <br /> Brand <br /> Culture <br /> Audience
                </h3>
              </div>
              <div className="relative z-20 flex h-48 w-48 flex-col items-center justify-center rounded-full border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-5 text-center shadow-sm sm:h-72 sm:w-72 lg:h-[384px] lg:w-[384px]"
                onMouseEnter={() => setHoveredCircle("build")}
                onMouseLeave={() => setHoveredCircle(null)}
                onClick={() => handleTap("build")}
              >
                <span className="text-micro text-neutral-400">02 / BUILD</span>
                <h3 className="mt-4 text-diagram font-medium uppercase leading-tight">
                  Brand Worlds <br /> Frameworks <br /> Workflows <br /> Systems <br /> Funnels
                </h3>
              </div>
              <div className="relative z-10 flex h-48 w-48 flex-col items-center justify-center rounded-full border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-5 text-center shadow-sm sm:h-64 sm:w-64 lg:-ml-16 lg:h-[307px] lg:w-[307px]"
                onMouseEnter={() => setHoveredCircle("scale")}
                onMouseLeave={() => setHoveredCircle(null)}
                onClick={() => handleTap("scale")}
              >
                <span className="text-micro text-neutral-400">03 / SCALE</span>
                <h3 className="mt-4 text-diagram font-medium uppercase leading-tight">
                  Content <br /> Performance <br /> Growth
                </h3>
              </div>
              {/* Mobile tap overlay — backdrop dims circles, card crossfades between
                  all cards for that circle, auto-cycles every 3s, dots show progress. */}
              <AnimatePresence>
                {tappedCircle && (
                  <motion.div
                    key="tap-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: EASE_STANDARD }}
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 sm:gap-8 overflow-y-auto bg-white/15 dark:bg-[#0a0a0a]/15 backdrop-blur-lg"
                    onClick={() => setTappedCircle(null)}
                  >
                    {/* Close button — top-left, exits tap mode */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setTappedCircle(null); }}
                      aria-label="Close"
                      className="absolute top-6 left-6 z-10 flex h-11 w-11 items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white transition-[color,transform] duration-150 cursor-pointer touch-manipulation active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/60 dark:focus-visible:ring-white/60"
                    >
                      <X size={18} />
                    </button>

                    {/* Card stage — capped width so the bar always fits below */}
                    <div
                      className="relative w-[92vw] max-w-[1000px] aspect-video"
                      onClick={(e) => { e.stopPropagation(); handleTap(tappedCircle); }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${tappedCircle}-${tapIdx}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.28, ease: EASE_STANDARD }}
                          className="absolute inset-0 rounded overflow-hidden shadow-lg"
                        >
                          {getTapCard()}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Segmented progress bar — sits below the card, never inside */}
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: CARD_COUNTS[tappedCircle] }).map((_, i) => {
                        const isActive = i === tapIdx;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setTapIdx(i); }}
                            className={`relative h-px transition-all duration-300 ease-out cursor-pointer touch-manipulation before:absolute before:inset-x-0 before:-inset-y-4 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-black/60 dark:focus-visible:ring-white/60 ${
                              isActive
                                ? "w-10 h-0.5 bg-black dark:bg-white"
                                : "w-6 bg-neutral-400/40 dark:bg-neutral-600/50 hover:bg-neutral-500/70"
                            }`}
                            aria-label={`Card ${i + 1} of ${CARD_COUNTS[tappedCircle]}`}
                            aria-current={isActive}
                          />
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Desktop hover overlay */}
              <div className="hidden lg:block">
                <CursorTrail images={hoveredCircle === "define" ? defineImages : hoveredCircle === "build" ? buildImages : hoveredCircle === "scale" ? scaleImages : []} />
              </div>
            </div>
            {/* Body copy — pinned with the circles. Fades in once visible, then stays. */}
            <div
              className={`mt-8 sm:mt-12 flex justify-center text-center transition-opacity duration-700 ease-out xl:[margin-left:calc(50%-50vw)] xl:[margin-right:calc(50%-50vw)] ${bodyShown ? "opacity-100" : "opacity-0"}`}
            >
              <p className="max-w-3xl md:max-w-4xl xl:max-w-none px-4 sm:px-0 text-base sm:text-lg md:text-xl font-normal tracking-tight leading-relaxed text-neutral-600 dark:text-neutral-300">
                <span className="xl:whitespace-nowrap">My specialty is operationalizing aspirational brand purpose into measurably scalable narrative infrastructure.</span><br /><span className="xl:whitespace-nowrap">I architect frictionless ecosystems where omnichannel storytelling and KPI extraction co-elevate one another in real time.</span><br /><span className="xl:whitespace-nowrap">Not campaigns that briefly peak, but always-on systems engineered to compound forever.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative min-h-[300vh] medium-short:min-h-0">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden bg-white dark:bg-[#0a0a0a] px-8 md:px-12 lg:px-24 medium-short:static medium-short:min-h-0 medium-short:py-16">
        <div className="relative mx-auto w-full max-w-7xl">
          {/* Title */}
          <motion.div style={{ opacity: titleOpacity }} className="relative z-0 mb-12">
            <p className="mb-2 text-base font-normal uppercase tracking-tight leading-relaxed text-neutral-400">FROM INPUT TO OUTPUT</p>
            <h2 className="text-huge">
              <span
                onMouseEnter={() => setSystemHover(true)}
                onMouseLeave={() => setSystemHover(false)}
                onTouchStart={() => setSystemHover(true)}
                onTouchEnd={() => setSystemHover(false)}
                className="cursor-default"
              >
                <ScrambleText
                  text="SYSTEM IN MOTION"
                  trigger={systemHover}
                  onScrambleStart={() => setSystemDotVisible(false)}
                  onSettled={() => setSystemDotVisible(true)}
                  trailing={
                    <span className={`transition-opacity duration-150 ${systemDotVisible ? "animate-blink-dot" : "opacity-0"}`}>.</span>
                  }
                />
              </span>
            </h2>
            <p className="text-micro mt-4 text-neutral-400">Define. Build. Scale.</p>
          </motion.div>

          <div className="relative flex flex-col items-center justify-center gap-12 lg:h-[672px] lg:flex-row lg:gap-0">
            {/* Background circle outlines — drawn one by one in circular motion */}
            <div className="absolute inset-0 pointer-events-none hidden lg:block">
              <DrawCircle size={442} progress={scrollYProgress} range={[0.02, 0.10]} className="absolute left-[calc(50%-269px)] top-1/2 -translate-x-1/2 -translate-y-1/2" />
              <DrawCircle size={557} progress={scrollYProgress} range={[0.10, 0.18]} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
              <DrawCircle size={442} progress={scrollYProgress} range={[0.18, 0.26]} className="absolute left-[calc(50%+269px)] top-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* DEFINE — fades in + scales up, then text types */}
            <div className="flex flex-col items-center lg:contents">
              <motion.div
                style={{
                  opacity: defineOpacity,
                  scale: defineScale,
                }}
                className="relative z-10 flex h-56 w-56 flex-col items-center justify-center rounded-full border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-6 text-center shadow-sm will-change-transform sm:h-72 sm:w-72 lg:-mr-16 lg:h-[307px] lg:w-[307px]"
              >
                <TypewriterWord progress={scrollYProgress} range={[0.42, 0.44]}>
                  <span className="text-micro text-neutral-400">01 / DEFINE</span>
                </TypewriterWord>
                <h3 className="mt-4 text-diagram font-medium uppercase leading-tight">
                  <TypewriterWord progress={scrollYProgress} range={[0.44, 0.46]}>Strategy</TypewriterWord>
                  <TypewriterWord progress={scrollYProgress} range={[0.46, 0.48]}>Brand</TypewriterWord>
                  <TypewriterWord progress={scrollYProgress} range={[0.48, 0.50]}>Culture</TypewriterWord>
                  <TypewriterWord progress={scrollYProgress} range={[0.50, 0.52]}>Audience</TypewriterWord>
                </h3>
              </motion.div>
            </div>

            {/* BUILD */}
            <div className="flex flex-col items-center lg:contents">
              <motion.div
                style={{
                  opacity: buildOpacity,
                  scale: buildScale,
                }}
                className="relative z-20 flex h-56 w-56 flex-col items-center justify-center rounded-full border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-6 text-center shadow-sm will-change-transform sm:h-80 sm:w-80 lg:h-[384px] lg:w-[384px]"
              >
                <TypewriterWord progress={scrollYProgress} range={[0.63, 0.65]}>
                  <span className="text-micro text-neutral-400">02 / BUILD</span>
                </TypewriterWord>
                <h3 className="mt-4 text-diagram font-medium uppercase leading-tight">
                  <TypewriterWord progress={scrollYProgress} range={[0.65, 0.67]}>Brand Worlds</TypewriterWord>
                  <TypewriterWord progress={scrollYProgress} range={[0.66, 0.68]}>Frameworks</TypewriterWord>
                  <TypewriterWord progress={scrollYProgress} range={[0.67, 0.69]}>Workflows</TypewriterWord>
                  <TypewriterWord progress={scrollYProgress} range={[0.68, 0.70]}>Systems</TypewriterWord>
                  <TypewriterWord progress={scrollYProgress} range={[0.69, 0.71]}>Funnels</TypewriterWord>
                </h3>
              </motion.div>
            </div>

            {/* SCALE */}
            <div className="flex flex-col items-center lg:contents">
              <motion.div
                style={{
                  opacity: scaleOpacity,
                  scale: scaleCircleScale,
                }}
                className="relative z-10 flex h-56 w-56 flex-col items-center justify-center rounded-full border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] p-6 text-center shadow-sm will-change-transform sm:h-72 sm:w-72 lg:-ml-16 lg:h-[307px] lg:w-[307px]"
              >
                <TypewriterWord progress={scrollYProgress} range={[0.83, 0.85]}>
                  <span className="text-micro text-neutral-400">03 / SCALE</span>
                </TypewriterWord>
                <h3 className="mt-4 text-diagram font-medium uppercase leading-tight">
                  <TypewriterWord progress={scrollYProgress} range={[0.85, 0.86]}>Content</TypewriterWord>
                  <TypewriterWord progress={scrollYProgress} range={[0.86, 0.87]}>Performance</TypewriterWord>
                  <TypewriterWord progress={scrollYProgress} range={[0.87, 0.88]}>Growth</TypewriterWord>
                </h3>
              </motion.div>
            </div>
            {/* No diagram card interactions during scroll animation — only after isComplete */}
          </div>
          {/* Body copy — pinned with the circles. Fades in once visible, then stays. */}
          <div className={`mt-8 sm:mt-12 flex justify-center text-center transition-opacity duration-700 ease-out ${bodyShown ? "opacity-100" : "opacity-0"}`}>
            <p className="max-w-none px-4 sm:px-0 text-xl font-normal tracking-tight leading-relaxed text-neutral-600 dark:text-neutral-300">
              <span className="whitespace-nowrap">My specialty is operationalizing aspirational brand purpose into measurably scalable narrative infrastructure.</span><br /><span className="whitespace-nowrap">I architect frictionless ecosystems where omnichannel storytelling and KPI extraction co-elevate one another in real time.</span><br /><span className="whitespace-nowrap">Not campaigns that briefly peak, but always-on systems engineered to compound forever.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHRASES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="main" className="min-h-screen selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black dark:bg-[#0a0a0a] dark:text-white">
      <Navbar />
      {/* SECTION 1 — HERO */}
      <section className="relative flex sm:min-h-screen flex-col items-center justify-center short:sm:min-h-0 short:sm:justify-start short:sm:py-32 px-12 sm:px-8 pt-[16vh] pb-24 text-center">
        <div className="max-w-7xl px-4 sm:px-0">
          <h1 className="max-sm:text-[clamp(2.5rem,12vw,6rem)] max-xs:text-[clamp(1.5rem,9vw,2.25rem)]">
            {[
              <>DISRUPTIVE NARRATIVES</>,
              <>
                <span className="sm:whitespace-nowrap">WITHOUT<span className="hidden sm:inline"> OMNICHANNEL</span></span>
                <br className="sm:hidden" />
                <span className="sm:hidden">OMNICHANNEL</span>
              </>,
              <span className="whitespace-nowrap">
                ARE{" "}
                <ScrambleSwap
                  base="SUBOPTIMAL"
                  targets={["EXTRACTIVE", "PERFORMATIVE", "NON-DIFFERENTIATED", "DECORATIVE", "UNFUNDABLE", "ASPIRATIONAL"]}
                  autoMs={3000}
                  trailing={<span className="animate-blink-dot inline-block">.</span>}
                />
              </span>,
            ].map((line, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: EASE_STANDARD }}
              >
                {line}
              </motion.span>
            ))}
          </h1>
        </div>
        <HeroReveal delay={0.55} className="mt-8 sm:mt-12 max-w-5xl px-4 sm:px-0">
          <p className="text-xl font-normal tracking-tight leading-relaxed text-neutral-600 dark:text-neutral-300">
            My name is Maximilian Storm,{" "}
            <TypewriterCycle
              roles={[
                "creative director",
                "narrative strategist",
                "AI futurist",
                "synergy architect",
                "thought leader",
                "innovation evangelist",
                "ecosystem alchemist",
                "purpose engineer",
                "brand whisperer",
                "growth mystic",
                "culture hacker",
                "post-platform thinker",
                "Cannes hopeful",
                "LinkedIn devotee",
                "manifesto enjoyer",
              ]}
              holdMs={2000}
              deleteMs={30}
              typeMs={55}
            />
            {" "}headquartered in a vague international metropolis, operating at the convergence of advertising, AI proliferation, content velocity, and post-cultural narrative engineering.
          </p>
        </HeroReveal>

        {/* Circular System Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="relative mt-40 flex h-[260px] w-[260px] items-center justify-center xs:h-[300px] xs:w-[300px] sm:mt-48 sm:h-[360px] sm:w-[360px] md:mt-64 md:h-[600px] md:w-[600px]"
        >
          {/* Subtle thin circular lines */}
          <div className="absolute inset-0 rounded-full border border-neutral-100 dark:border-neutral-800" />
          <div className="absolute inset-8 rounded-full border border-neutral-100 dark:border-neutral-800 md:inset-12" />
          <div className="absolute inset-16 rounded-full border border-neutral-100 dark:border-neutral-800 md:inset-24" />

          {/* Morphing System (Spills over the inner circle, never cropped) */}
          {/* ErrorBoundary wraps the whole wrapper so the void collapses if WebGL fails */}
          <ErrorBoundary label="MorphingSystem" fallback={null}>
            <div className="absolute inset-[-20px] xs:inset-[-40px] sm:inset-[-80px] md:inset-[-240px] pointer-events-none dark:invert dark:brightness-200">
              <Suspense fallback={null}>
                <MorphingSystem />
              </Suspense>
            </div>
          </ErrorBoundary>

          {/* Inner Content */}
          <div className="relative z-50 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-white md:text-base">Core Focus</span>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-[0.3em] text-[9px] font-bold uppercase tracking-wider text-neutral-400 sm:text-[10px] md:text-[11px]">
              <span>FROM INPUT TO OUTPUT turn</span>
              <div className="relative inline-flex h-[1.5em] items-center overflow-hidden transition-all duration-500 ease-in-out">
                {/* Hidden span to measure width */}
                <span className="invisible pointer-events-none select-none font-semibold">
                  {PHRASES[index].from}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`from-${index}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.8, ease: EASE_STANDARD }}
                    className="absolute inset-0 flex items-center justify-center font-semibold text-neutral-400"
                  >
                    {PHRASES[index].from}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span>into</span>
              <div className="relative inline-flex h-[1.5em] items-center overflow-hidden transition-all duration-500 ease-in-out">
                {/* Hidden span to measure width */}
                <span className="invisible pointer-events-none select-none font-semibold">
                  {PHRASES[index].to}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`to-${index}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.8, ease: EASE_STANDARD, delay: 0.15 }}
                    className="absolute inset-0 flex items-center justify-center font-semibold text-neutral-400"
                  >
                    {PHRASES[index].to}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Orbiting Ring Labels (Interactive) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 z-10"
            style={{ pointerEvents: 'none' }}
          >
            {[
              { mobile: <>Creative<br/>ecosystems</>, desktop: "Creative ecosystems & funnels" },
              { mobile: <>Content<br/>factories</>, desktop: "Content factories" },
              { mobile: <>Content<br/>strategies</>, desktop: "Content strategies" },
              { mobile: <>AI workflows<br/>& systems</>, desktop: "AI workflows & systems" },
              { mobile: <>Strategic<br/>frameworks</>, desktop: "Strategic frameworks" },
            ].map((label, index) => {
              const angle = (index * 360) / 5;
              return (
                <div
                  key={label.desktop}
                  className="absolute inset-0"
                  style={{ rotate: `${angle}deg` }}
                >
                  {/* Connecting Line: Starts from inner ring edge to label, avoiding the center */}
                  <div className="absolute left-1/2 top-2 h-6 w-px -translate-x-1/2 -translate-y-6 bg-neutral-100 dark:bg-neutral-800 sm:top-3 sm:h-10 sm:-translate-y-10 md:top-6 md:h-[115px] md:-translate-y-[115px]" />
                  
                  {/* Label Container */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full pb-3 sm:pb-6 md:pb-24 flex flex-col items-center" style={{ pointerEvents: 'auto' }}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="cursor-pointer"
                      style={{ rotate: `-${angle}deg` }} // Counter-rotate to keep text upright
                    >
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                      >
                        <span className="text-[8px] max-xs:text-[7px] font-bold uppercase tracking-wider text-neutral-500 text-center leading-none sm:whitespace-nowrap transition-colors hover:text-black dark:hover:text-white sm:text-[10px] md:text-[11px]">
                          <span className="sm:hidden block" style={{ lineHeight: '1.1' }}>{label.mobile}</span>
                          <span className="hidden sm:inline">{label.desktop}</span>
                        </span>
                      </motion.div>
                    </motion.div>
                    {/* Small circle at the connection point */}
                    <div className="mt-2 h-1 w-1 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

      </section>

      {/* SECTION 2 — SYSTEM / PROCESS (Scroll-Pinned Assembly) */}
      <SystemDiagram />

    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: EASE_STANDARD }}
      >
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/erased-font" element={<ErasedFontCasePage />} />
            <Route path="/play" element={<PlayPage />} />
            <Route path="/ai-systems" element={<AISystemsPage />} />
            <Route path="/workflows" element={<Navigate to="/ai-systems" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:text-sm focus:font-bold focus:uppercase focus:tracking-wider focus:rounded"
      >
        Skip to content
      </a>
      <AnimatedRoutes />
      <Footer />
    </>
  );
}

