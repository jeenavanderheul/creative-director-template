import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, List, Play } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { InfiniteCanvas } from "../components/InfiniteCanvas";
import { ParallaxLayer } from "../components/ParallaxLayer";
import { CanvasItem, type CanvasItemProps } from "../components/CanvasItem";
import { Lightbox } from "../components/Lightbox";
import { HeroReveal } from "../components/Reveal";
import { CornerBrackets } from "../components/CornerBracket";

type LayerItem = Omit<CanvasItemProps, "onOpen">;

// All thumbnails resolve to a neutral placeholder in the template.
// Swap with your own video thumbnails (point to your own URL or asset).
const thumb = (_id: string) => `/placeholders/video.svg`;

// Background layer — drifts slower, feels distant
const BACKGROUND_ITEMS: LayerItem[] = [
  { id: "model-collapse", type: "video", src: thumb("1043099373"),
    videoId: "0",
    title: "AI Model Collapse", caption: "AI · experimental",
    xPct: 15, yPct: 25, widthVw: 16, mobileWidthVw: 30, aspectRatio: "16/9", z: 1 },
  { id: "outpainting-jayz", type: "video", src: thumb("890824200"),
    videoId: "0",
    title: "AI Outpainting Jay Z Album", caption: "AI · outpainting",
    xPct: 82, yPct: 78, widthVw: 15, mobileWidthVw: 27, aspectRatio: "1/1", z: 1 },
  { id: "visual-library", type: "video", src: thumb("1189856674"),
    videoId: "0",
    title: "AI - VISUAL LIBRARY", caption: "AI - INTERNAL TASTE VAULT",
    xPct: 8, yPct: 50, widthVw: 16, mobileWidthVw: 30, aspectRatio: "16/9", z: 1 },
];

// Midground layer — normal parallax, primary content
const MIDGROUND_ITEMS: LayerItem[] = [
  { id: "humble-brag", type: "video", src: thumb("950566855"),
    videoId: "0",
    title: "AI-Generated LinkedIn Humble Brag songs", caption: "AI · music",
    xPct: 30, yPct: 60, widthVw: 19, mobileWidthVw: 38, aspectRatio: "16/9", z: 2 },
  { id: "hallunation", type: "video", src: thumb("890824007"),
    videoId: "0",
    title: "AI_HALLUNATION", caption: "AI · hallucination",
    xPct: 75, yPct: 35, widthVw: 17, mobileWidthVw: 34, aspectRatio: "16/9", z: 2 },
  { id: "multiverse-selfie", type: "video", src: thumb("890824244"),
    videoId: "0",
    title: "The AI-Multiverse-Selfie", caption: "AI · portrait",
    xPct: 20, yPct: 85, widthVw: 16, mobileWidthVw: 34, aspectRatio: "16/9", z: 2 },
  { id: "rider-prompt", type: "video", src: thumb("1189845802"),
    videoId: "0",
    title: "AI - RIDER NETWORK", caption: "AI - ONE SHOT PROMPT SEEDANCE TEST",
    xPct: 60, yPct: 50, widthVw: 18, mobileWidthVw: 35, aspectRatio: "16/9", z: 2 },
];

// Foreground layer — tracks 1:1 with camera, feels close
const FOREGROUND_ITEMS: LayerItem[] = [
  { id: "rick-morty", type: "video", src: thumb("890848291"),
    videoId: "0",
    title: "AI — Rick and Morty — Sure Thing", caption: "AI · music video",
    xPct: 52, yPct: 22, widthVw: 21, mobileWidthVw: 40, aspectRatio: "16/9", z: 3 },
  { id: "livecanvas", type: "video", src: thumb("890838444"),
    videoId: "0",
    title: "AI-LIVECANVAS", caption: "AI · live generative",
    xPct: 85, yPct: 58, widthVw: 19, mobileWidthVw: 38, aspectRatio: "16/9", z: 3 },
  { id: "fightclub", type: "video", src: thumb("890823531"),
    videoId: "0",
    title: "FightClub — Reimagined with AI", caption: "AI · trailer",
    xPct: 50, yPct: 85, widthVw: 22, mobileWidthVw: 40, aspectRatio: "16/9", z: 3 },
];

type OpenItem = Parameters<NonNullable<CanvasItemProps["onOpen"]>>[0];

type Breakpoint = "phone" | "tablet" | "desktop";

// Returns effective widthVw for a given breakpoint
function resolveWidth(item: LayerItem, bp: Breakpoint): number {
  if (bp === "desktop") return item.widthVw * 1.5;
  if (bp === "phone") return item.mobileWidthVw ?? item.widthVw;
  return item.widthVw; // tablet
}

// Canvas tile size per breakpoint — smaller on mobile so items cluster visibly
function canvasSizeFor(bp: Breakpoint): number {
  if (bp === "phone") return 700;
  if (bp === "tablet") return 1400;
  return 2400;
}

export default function PlayPage() {
  const [lightboxItem, setLightboxItem] = useState<OpenItem | null>(null);
  const [bp, setBp] = useState<Breakpoint>("desktop");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  useEffect(() => {
    if (viewMode !== "list") return;
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overscrollBehavior = "";
      document.body.style.overscrollBehavior = "";
      document.body.style.overflow = "";
    };
  }, [viewMode]);

  useEffect(() => {
    const phoneMq = window.matchMedia("(max-width: 479px)");
    const tabletMq = window.matchMedia("(min-width: 480px) and (max-width: 767px)");
    const update = () => {
      if (phoneMq.matches) setBp("phone");
      else if (tabletMq.matches) setBp("tablet");
      else setBp("desktop");
    };
    update();
    phoneMq.addEventListener("change", update);
    tabletMq.addEventListener("change", update);
    return () => {
      phoneMq.removeEventListener("change", update);
      tabletMq.removeEventListener("change", update);
    };
  }, []);

  const { bg, mid, fg, canvasSize } = useMemo(() => {
    const applyWidth = (items: LayerItem[]) =>
      items.map((it) => ({ ...it, widthVw: resolveWidth(it, bp) }));
    return {
      bg: applyWidth(BACKGROUND_ITEMS),
      mid: applyWidth(MIDGROUND_ITEMS),
      fg: applyWidth(FOREGROUND_ITEMS),
      canvasSize: canvasSizeFor(bp),
    };
  }, [bp]);

  const allItems = useMemo(() => {
    const merged = [...BACKGROUND_ITEMS, ...MIDGROUND_ITEMS, ...FOREGROUND_ITEMS];
    const leading = [
      "rider-prompt",
      "visual-library",
      "humble-brag",
      "hallunation",
      "rick-morty",
      "livecanvas",
    ];
    const trailing = ["outpainting-jayz"];
    const byId = new Map(merged.map((it) => [it.id, it]));
    const pick = (ids: string[]) =>
      ids.map((id) => byId.get(id)).filter((it): it is LayerItem => Boolean(it));
    const used = new Set([...leading, ...trailing]);
    const middle = merged.filter((it) => !used.has(it.id));
    return [...pick(leading), ...middle, ...pick(trailing)];
  }, []);

  const openItem = (item: OpenItem) => setLightboxItem(item);
  const closeItem = () => setLightboxItem(null);

  return (
    <div
      className={`bg-white dark:bg-[#050505] ${
        viewMode === "list" ? "fixed inset-0 overflow-hidden" : "relative min-h-screen"
      }`}
    >
      <Navbar />

      <HeroReveal delay={0.10} skipBlur className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] sm:top-42 flex items-center gap-4">
        <button
          onClick={() => setViewMode("list")}
          aria-label="Canvas view"
          className={`flex items-center justify-center min-h-[44px] min-w-[44px] touch-manipulation transition-[color,transform] duration-150 cursor-pointer active:scale-90 ${
            viewMode === "list"
              ? "text-black dark:text-white"
              : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          }`}
        >
          <List size={18} />
        </button>
        <button
          onClick={() => setViewMode("grid")}
          aria-label="Grid view"
          className={`flex items-center justify-center min-h-[44px] min-w-[44px] touch-manipulation transition-[color,transform] duration-150 cursor-pointer active:scale-90 ${
            viewMode === "grid"
              ? "text-black dark:text-white"
              : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          }`}
        >
          <LayoutGrid size={18} />
        </button>
      </HeroReveal>

      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.div
            key="canvas-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <InfiniteCanvas canvasSize={canvasSize}>
              <ParallaxLayer depth={0.5}>
                {bg.map((item) => (
                  <CanvasItem key={item.id} {...item} onOpen={openItem} />
                ))}
              </ParallaxLayer>
              <ParallaxLayer depth={0.8}>
                {mid.map((item) => (
                  <CanvasItem key={item.id} {...item} onOpen={openItem} />
                ))}
              </ParallaxLayer>
              <ParallaxLayer depth={1.1}>
                {fg.map((item) => (
                  <CanvasItem key={item.id} {...item} onOpen={openItem} />
                ))}
              </ParallaxLayer>
            </InfiniteCanvas>
            <div className="fixed bottom-6 left-6 z-[50] text-[10px] font-mono opacity-50 uppercase tracking-wider pointer-events-none text-black dark:text-white max-xs:bottom-4 max-xs:left-4 max-xs:text-[8px]">
              Drag to pan · Tap to enlarge
            </div>
          </motion.div>
        ) : (
          <motion.main
            key="grid-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto w-full max-w-full sm:max-w-[1440px] px-6 sm:px-8 pt-[12vh] sm:pt-[16vh] pb-32 md:px-12 lg:px-24"
          >
            <div className="grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
              {allItems.map((item) => (
                <PlayGridItem key={item.id} item={item} onOpen={openItem} />
              ))}
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      <Lightbox item={lightboxItem} onClose={closeItem} />
    </div>
  );
}

function PlayGridItem({
  item,
  onOpen,
}: {
  item: LayerItem;
  onOpen: (i: OpenItem) => void;
}) {
  return (
    <button
      onClick={() =>
        onOpen({
          type: item.type,
          src: item.src,
          videoId: item.videoId,
          videoHash: item.videoHash,
          title: item.title,
          caption: item.caption,
        })
      }
      className="group flex flex-col gap-4 text-left cursor-pointer"
    >
      <div className="aspect-video relative">
        <div className="absolute inset-0 overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-900">
          <img
            src={item.src}
            alt={item.title ?? ""}
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-active:scale-105 group-active:grayscale-0"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border border-white/40 rounded-full p-3 sm:p-2 transition-all group-hover:scale-110 group-hover:border-white/80 group-active:scale-110 group-active:border-white/80">
              <Play size={20} className="text-white/70 fill-white/70 sm:w-4 sm:h-4" />
            </div>
          </div>
        </div>
        <CornerBrackets outside offset={3} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold uppercase tracking-tight text-black dark:text-white">
          {item.title}
        </h3>
        <p className="text-xs font-mono uppercase tracking-wider opacity-50 text-black dark:text-white">
          {item.caption}
        </p>
      </div>
    </button>
  );
}
