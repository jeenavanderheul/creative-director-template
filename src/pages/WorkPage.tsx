import { motion, useScroll, useInView, useTransform, useMotionValueEvent, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { LayoutGrid, List, Play, Info, X } from "lucide-react";
import { VideoPlayer } from "../components/VideoPlayer";
import { Reveal } from "../components/Reveal";
import { CornerBrackets } from "../components/CornerBracket";
import { EASE_STANDARD, DUR_BASE } from "../lib/motion";

const CASES = [
  {
    id: "erased-font", title: "The VANISHED TYPEFACE", image: "/placeholders/image.svg", type: "E-commerce / 2023", path: "/work/erased-font", videoId: "0",
    description: [
      { heading: "Challenge", body: "Censorship and journalist imprisonment are rising globally, with 363 journalists currently jailed\u2014three times more than in 2000. Despite the urgency, it\u2019s difficult for an NGO like GLOBAL ADVOCACY COALITION to continuously capture attention for individual cases, especially with limited budget. They needed a way to make censorship visible again\u2014because you can\u2019t read what isn\u2019t published." },
      { heading: "Concept", body: "The ABSENCE TYPEFACE turns censorship into something you can actually see. A custom typeface that automatically removes one word for every imprisoned journalist\u2014making absence the message." },
      { heading: "How it works", body: "Uses ligatures to automatically erase specific words when the font is applied. Each erased word represents a jailed journalist and the topics they covered. Built with 4000+ handcrafted erased words across 6 languages. Distributed via GitHub, allowing easy adoption without downloads. Integrated with Open-Source Universal Type to work seamlessly across 2.24B websites. Includes an \u201cerase toggle\u201d to activate censorship across digital platforms." },
      { heading: "Results", body: "3M+ media impressions. +408% website traffic. Scaled globally, expanding to multiple languages and platforms. Successfully put censorship back into public conversation." },
    ],
  },
  {
    id: "showreel", title: "NORTHWAVE BIENNIAL\nOutlook is Everything", image: "/placeholders/image.svg", type: "Video / 2024", videoId: "0",
    description: [
      { heading: "Challenge", body: "PERSPECTIVE FESTIVAL wanted to reposition itself as a leading artistic institution within the documentary space. Documentaries were often perceived as raw or lo-fi rather than high art. The challenge was to shift this perception and show audiences that documentary filmmaking is a powerful, transformative art form, especially in the lead-up to the 2022 festival edition." },
      { heading: "Concept", body: "\u201CPerspectives Are Beautiful\u201D transforms documentary films into abstract art. Using the universal language of the Rorschach inkblot test, each film becomes a visual expression of perspective\u2014elevating documentaries from storytelling to art." },
      { heading: "How it works", body: "An AI-driven machine collects data from each film, including colour, emotion, duration, and language. This data is translated into colours in real-time. A robotic arm drops these colours into water, creating unique Rorschach inkblots. Each visual reflects the emotional and narrative perspective of the film, turning stories into abstract, perspective-based artworks." },
      { heading: "Results", body: "Elevated perception of documentaries as high art. Strengthened PERSPECTIVE FESTIVAL\u2019s position as an artistic institution. Created a distinctive visual system that translated storytelling into a universal and shareable format." },
    ],
  },
  {
    id: "project-03", title: "The Wearable RELIC", image: "/placeholders/image.svg", type: "Branding / 2023", videoId: "0",
    description: [
      { heading: "Challenge", body: "BOUTIQUE GRID.nl wanted to connect with a new generation of shoppers and remain relevant in a rapidly evolving digital landscape. With NFTs gaining traction, the challenge was to engage this audience without following the typical, often inaccessible rules of digital fashion and ownership." },
      { heading: "Concept", body: "The \u201CNFTee\u201D turns digital ownership into a physical experience. A wearable NFT embedded in a real T-shirt, unlocked through augmented reality, bridging the gap between digital hype and tangible fashion." },
      { heading: "How it works", body: "A physical T-shirt featuring the BOUTIQUE GRID.nl logo acts as a trigger. When scanned, it activates an AR experience revealing a hyper-real 3D NFT, created with artist Gab Bois. A limited NFT was auctioned on OpenSea, while 500 T-shirts were sold to unlock the AR version, combining exclusivity with accessibility." },
      { heading: "Results", body: "NFT artwork sold successfully. 10M+ media impressions. +25K website traffic. Positioned BOUTIQUE GRID.nl as an innovator in digital luxury fashion and connected with a new generation of consumers." },
    ],
  },
  {
    id: "ambrosia", title: "FRACTAL SNACKS Collisions \u2014 Livestream Showdown", image: "/placeholders/image.svg", type: "Art Direction / 2022", videoId: "0", videoHash: "1c4d46b536",
    description: [
      { heading: "Challenge", body: "FRACTAL SNACKS launched \u201CCollisions,\u201D combining two conflicting flavours in one product. The challenge was to bring this idea to life in a locally relevant way, while working with a limited production budget and still engaging a digital-first audience." },
      { heading: "Concept", body: "Bring collision to culture by merging two opposing YouTube worlds: gaming and beauty. Two rival influencers battle for attention in a live, interactive showdown driven by their fans." },
      { heading: "How it works", body: "Two creators from gaming and beauty are placed in one shared livestream environment. Fans join live and support their side, creating a digital tug-of-war for screen time. Teaser content from both influencers builds hype and divides audiences before the battle begins. The outcome is shaped entirely by real-time engagement." },
      { heading: "Results", body: "87,000 live viewers. Peak engagement of 40 comments per second. Strong community participation and real-time interaction across two distinct fanbases." },
    ],
  },
  {
    id: "project-05", title: "PRISMA ELECTRONICS\nThe Gaze Marathon", image: "/placeholders/image.svg", type: "Design / 2022", videoId: "0",
    description: [
      { heading: "Challenge", body: "PRISMA ELECTRONICS wanted to create awareness for its SMART TV and demonstrate its relevance in a world full of distractions. The challenge was to capture and hold attention in a meaningful, interactive way." },
      { heading: "Concept", body: "Turn attention into a game. The \u201CStare Battle\u201D challenges people to look at the PRISMA ELECTRONICS SMART TV for as long as possible without blinking\u2014making focus the ultimate competition." },
      { heading: "How it works", body: "Users join a custom YouTube platform to compete in a staring contest against Keenan Cahill. Eye-tracking via webcam detects blinking in real-time. Blink and you lose. The longest stare wins a PRISMA ELECTRONICS SMART TV. The campaign is amplified through social, print, and rich media, encouraging users to upload and share their attempts." },
      { heading: "Results", body: "347K+ video views. 5,500 user-generated videos. 500K YouTube visits. Over 1000 hours of interaction, equivalent to 2 months of total staring time." },
    ],
  },
  {
    id: "project6", title: "The Sketchful Intern", image: "/placeholders/image.svg", type: "System / 2021", videoId: "0",
    description: [
      { heading: "Challenge", body: "Muse, a small digital agency, wanted to attract top creative interns. However, most young creatives gravitate toward larger, more well-known agencies, making it difficult for a boutique agency to stand out." },
      { heading: "Concept", body: "Recruit talent through play. By using the DrawSomething app, Muse turned a popular social drawing game into a creative recruitment platform." },
      { heading: "How it works", body: "Participants download the DrawSomething app and play directly against the agency team. They are challenged to visually interpret words, similar to digital Pictionary. The most creative drawings are identified in real-time, and selected participants are invited to submit their portfolios, blending entertainment with recruitment." },
      { heading: "Results", body: "132 applicants from around the world. High engagement through a native platform. One standout creative hired for a 6-month internship." },
    ],
  },
  {
    id: "project7", title: "CIRCUIT BAZAAR\nCadence Takeover", image: "/placeholders/image.svg", type: "Digital / 2021", videoId: "0",
    description: [
      { heading: "Challenge", body: "Sinterklaas is a key retail moment in the Netherlands, where gifts are paired with rhymes. CIRCUIT BAZAAR wanted to integrate its product offering into this cultural behavior in a way that felt relevant and useful." },
      { heading: "Concept", body: "Turn rhyme-writing into a shopping experience. By embedding products directly into rhyming platforms, CIRCUIT BAZAAR became part of the gifting ritual." },
      { heading: "How it works", body: "Users visit rhyming websites to write Sinterklaas poems. When typing a word, a matching rhyme appears highlighted and linked to a CIRCUIT BAZAAR product via a banner. Users can directly click through to purchase, seamlessly turning their rhyme into a gift idea." },
      { heading: "Results", body: "47,769 product banner displays. 1.42% click-through rate. Directly connected cultural behavior with purchase intent during a key retail period." },
    ],
  },
  {
    id: "project8", title: "ORBIT\nHow Do You Brew Your Commute?", image: "/placeholders/image.svg", type: "Strategy / 2020", videoId: "0",
    description: [
      { heading: "Challenge", body: "ORBIT MOTORS wanted to get working professionals in the Netherlands to take test drives during office hours. The challenge was to create a compelling reason to leave the office and engage with the brand." },
      { heading: "Concept", body: "Connect driving behavior with coffee culture. \u201CHow Do You Drive Your Coffee?\u201D transforms a test drive into a personalized coffee experience based on how you drive." },
      { heading: "How it works", body: "A chip installed in the ORBIT MOTORS tracks driving data such as speed, acceleration, handling, and efficiency. After the test drive, this data is sent to a coffee bar, where a personalized coffee blend is created. Participants can also view their coffee-driving profile online, linking performance to personality." },
      { heading: "Results", body: "Fully booked within 2 weeks. 3000+ coffees served. 6106 km driven. 748 test drives across 50 companies. Generated 780 leads and strong brand engagement." },
    ],
  },
];

interface CaseItemProps {
  project: { id: string; title: string; image: string; type: string; path?: string; videoId?: string; videoHash?: string; description?: { heading: string; body: string }[] };
  setActiveId: (id: string) => void;
  showAllInfo?: boolean;
}

function CaseItem({ project, setActiveId, showAllInfo = false }: CaseItemProps) {
  const ref = useRef(null);
  const filterRef = useRef<SVGFEDisplacementMapElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  const isInView = useInView(ref, {
    amount: 0.5,
    margin: "-20% 0px -20% 0px"
  });

  useEffect(() => {
    if (isInView) {
      setActiveId(project.id);
    } else {
      if (isPlaying && !showInfo && !showAllInfo && !isMobile) setIsPlaying(false);
    }
  }, [isInView, project.id, setActiveId, isPlaying, showInfo, showAllInfo, isMobile]);

  useEffect(() => {
    if (showAllInfo) {
      setShowInfo(true);
    } else {
      setShowInfo(false);
    }
  }, [showAllInfo]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 1, 1, 1, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [35, 0, -35]);
  const distortion = useTransform(scrollYProgress, [0, 0.15, 0.35, 0.5, 0.65, 0.85, 1], [0, 50, 0, 0, 0, 50, 0]);


  useMotionValueEvent(distortion, "change", (v) => {
    if (filterRef.current) {
      filterRef.current.setAttribute("scale", String(v));
    }
  });

  const filterId = `barrel-${project.id}`;

  const infoContent = project.description && (
    <div className="flex flex-col items-center mt-6">
      {!showAllInfo && (
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
      )}
      {/* grid-rows trick: animates fr units (paint only, no layout per frame).
          Cheaper than height: 0 -> auto for large description blocks. */}
      <div
        className="grid w-full transition-[grid-template-rows,opacity] ease-out"
        style={{
          gridTemplateRows: (showInfo || showAllInfo) ? "1fr" : "0fr",
          opacity: (showInfo || showAllInfo) ? 1 : 0,
          transitionDuration: `${DUR_BASE * 1000}ms`,
        }}
        aria-hidden={!(showInfo || showAllInfo)}
      >
        <div className="overflow-hidden min-h-0">
          <div className="mt-10 flex flex-col">
            {project.description.map((section, i) => (
              <div key={section.heading}>
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 pb-8 grid grid-cols-[24px_1fr] xs:grid-cols-[40px_1fr] md:grid-cols-[50px_1fr] gap-x-0">
                  <span className="text-[10px] font-mono text-neutral-300 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-black dark:text-white mb-4">{section.heading}</h3>
                    <p className="text-base font-normal tracking-tight leading-relaxed text-justify text-neutral-600 dark:text-neutral-300">{section.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const videoThumbnail = (
    <div className="relative aspect-video z-10">
      <div className="absolute inset-0 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        {isPlaying && project.videoId ? (
          <VideoPlayer videoId={project.videoId} videoHash={project.videoHash} title={project.title} />
        ) : (
          <>
            <img
              src={project.image}
              alt={project.title}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            {project.videoId && (
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
                aria-label="Play video"
              >
                <div className="border border-white/40 rounded-full p-3 sm:p-2 hover:scale-110 hover:border-white/80 active:scale-110 active:border-white/80 transition-all">
                  <Play size={24} className="text-white/70 fill-white/70 sm:w-5 sm:h-5" />
                </div>
              </button>
            )}
          </>
        )}
      </div>
      <CornerBrackets outside />
    </div>
  );

  // Mobile / info expanded: scroll effects without opacity/scale kill
  const mobileScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const mobileOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 1, 1, 1, 0]);
  const mobileGrayscale = useTransform(scrollYProgress, [0, 0.35, 0.5, 0.65, 1], [1, 0, 0, 0, 1]);
  const mobileImgFilter = useTransform(mobileGrayscale, (v) => `grayscale(${v})`);

  // Info expanded: fully static, no effects at all
  if (showInfo || showAllInfo) {
    return (
      <div ref={ref} id={project.id} className="relative flex w-full flex-col items-center justify-center py-8">
        <div className="relative w-full max-w-[75vw] md:max-w-[55vw] lg:max-w-[45vw]">
          <h2 className="text-huge max-xs:text-[clamp(1.5rem,8vw,2.25rem)] font-bold text-center mb-4 whitespace-pre-line">{project.title}</h2>
          <div className="relative aspect-video z-10">
            <div className="absolute inset-0 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
              {isPlaying && project.videoId ? (
                <VideoPlayer videoId={project.videoId} videoHash={project.videoHash} title={project.title} />
              ) : (
                <>
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  {project.videoId && (
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
                      aria-label="Play video"
                    >
                      <div className="border border-white/40 rounded-full p-3 sm:p-2 hover:scale-110 hover:border-white/80 active:scale-110 active:border-white/80 transition-all">
                        <Play size={24} className="text-white/70 fill-white/70 sm:w-5 sm:h-5" />
                      </div>
                    </button>
                  )}
                </>
              )}
            </div>
            <CornerBrackets outside />
          </div>
          {infoContent}
        </div>
      </div>
    );
  }

  // Mobile: scroll effects on title + video, info text always straight
  if (isMobile) {
    return (
      <div ref={ref} id={project.id} className="relative flex w-full flex-col items-center justify-center py-[58px]" style={{ perspective: 1200 }}>
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
              <feImage
                result="displacement"
                xlinkHref="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Cdefs%3E%3CradialGradient id='g'%3E%3Cstop offset='0%25' stop-color='%23808080'/%3E%3Cstop offset='100%25' stop-color='%23000000'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='300' height='200' fill='url(%23g)'/%3E%3C/svg%3E"
              />
              <feDisplacementMap
                ref={filterRef}
                in="SourceGraphic"
                in2="displacement"
                scale="0"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
        <motion.div
          style={{
            y,
            scale: mobileScale,
            opacity: mobileOpacity,
            rotateX,
            transformOrigin: "center center",
            filter: `url(#${filterId})`,
          }}
          className="relative w-full max-w-[75vw] md:max-w-[55vw] lg:max-w-[45vw] will-change-transform"
        >
          <h2 className="text-huge max-xs:text-[clamp(1.5rem,8vw,2.25rem)] font-bold text-center mb-4 whitespace-pre-line">{project.title}</h2>
          <div className="relative aspect-video z-10">
            <div className="absolute inset-0 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
              {isPlaying && project.videoId ? (
                <VideoPlayer videoId={project.videoId} videoHash={project.videoHash} title={project.title} />
              ) : (
                <>
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    style={{ filter: mobileImgFilter }}
                    className="h-full w-full object-cover"
                  />
                  {project.videoId && (
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
                      aria-label="Play video"
                    >
                      <div className="border border-white/40 rounded-full p-3 sm:p-2 hover:scale-110 hover:border-white/80 active:scale-110 active:border-white/80 transition-all">
                        <Play size={24} className="text-white/70 fill-white/70 sm:w-5 sm:h-5" />
                      </div>
                    </button>
                  )}
                </>
              )}
            </div>
            <CornerBrackets outside />
          </div>
        </motion.div>
        <div className="w-full max-w-[75vw] md:max-w-[55vw] lg:max-w-[45vw]">
          {infoContent}
        </div>
      </div>
    );
  }

  // Normal scroll-animated layout
  return (
    <div
      ref={ref}
      id={project.id}
      className="relative flex w-full flex-col items-center justify-center py-[58px]"
      style={{ perspective: 1200 }}
    >
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feImage
              result="displacement"
              xlinkHref="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Cdefs%3E%3CradialGradient id='g'%3E%3Cstop offset='0%25' stop-color='%23808080'/%3E%3Cstop offset='100%25' stop-color='%23000000'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='300' height='200' fill='url(%23g)'/%3E%3C/svg%3E"
            />
            <feDisplacementMap
              ref={filterRef}
              in="SourceGraphic"
              in2="displacement"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <motion.div
        style={{
          y,
          scale,
          opacity,
          rotateX,
          transformOrigin: "center center",
          filter: `url(#${filterId})`,
        }}
        className="relative w-full max-w-[75vw] md:max-w-[55vw] lg:max-w-[45vw] will-change-transform"
      >
        <h2 className="text-huge max-xs:text-[clamp(1.5rem,8vw,2.25rem)] font-bold text-center mb-4 whitespace-pre-line">{project.title}</h2>
        {videoThumbnail}
        {infoContent}
      </motion.div>
    </div>
  );
}

function GridItem({ project, onPlay }: { project: typeof CASES[number]; onPlay?: (project: typeof CASES[number]) => void }) {
  return (
    <div className="group flex flex-col gap-4">
      <div className="aspect-video relative">
        <div className="absolute inset-0 overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-900">
          <Link to={project.path || "#"} className={project.path ? "" : "cursor-default"}>
            <img
              src={project.image}
              alt={project.title}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-active:scale-105 group-active:grayscale-0"
            />
            {project.videoId && (
              <button
                onClick={(e) => { e.preventDefault(); onPlay?.(project); }}
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                aria-label="Play video"
              >
                <div className="border border-white/40 rounded-full p-3 sm:p-2 transition-all hover:scale-110 hover:border-white/80 active:scale-110 active:border-white/80">
                  <Play size={20} className="text-white/70 fill-white/70 sm:w-4 sm:h-4" />
                </div>
              </button>
            )}
          </Link>
        </div>
        <CornerBrackets outside />
      </div>
      <h3 className="text-sm font-bold uppercase tracking-tight">{project.title.replace(/\n/g, " ")}</h3>
    </div>
  );
}

export default function WorkPage() {
  useEffect(() => {
    document.documentElement.style.overscrollBehaviorY = "none";
    return () => { document.documentElement.style.overscrollBehaviorY = ""; };
  }, []);

  const [activeId, setActiveId] = useState(CASES[0].id);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showAllInfo, setShowAllInfo] = useState(false);
  const [modalVideo, setModalVideo] = useState<typeof CASES[number] | null>(null);
  const footerRef = useRef(null);
  const footerInView = useInView(footerRef, { margin: "0px 0px 300px 0px" });
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black font-sans">
      {/* Header */}
      <Navbar />

      {/* View Toggle */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] sm:top-42 flex items-center gap-4">
        <button
          onClick={() => setShowAllInfo(!showAllInfo)}
          className={`flex items-center justify-center min-h-[44px] min-w-[44px] touch-manipulation transition-[color,transform] duration-150 cursor-pointer active:scale-90 ${showAllInfo ? 'text-black dark:text-white' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
          aria-label="Toggle info"
        >
          <Info size={18} />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center justify-center min-h-[44px] min-w-[44px] touch-manipulation transition-[color,transform] duration-150 cursor-pointer active:scale-90 ${viewMode === 'list' ? 'text-black dark:text-white' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
          aria-label="List view"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`flex items-center justify-center min-h-[44px] min-w-[44px] touch-manipulation transition-[color,transform] duration-150 cursor-pointer active:scale-90 ${viewMode === 'grid' ? 'text-black dark:text-white' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
          aria-label="Grid view"
        >
          <LayoutGrid size={18} />
        </button>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.main
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-[12vh] sm:pt-[16vh] pb-32 flex flex-col items-center"
          >
            {CASES.map((project) => (
              <CaseItem
                key={project.id}
                project={project}
                setActiveId={setActiveId}
                showAllInfo={showAllInfo}
              />
            ))}
          </motion.main>
        ) : (
          <motion.main
            key="grid-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto w-full max-w-full sm:max-w-[1440px] px-6 sm:px-8 pt-[12vh] sm:pt-[16vh] pb-32 md:px-12 lg:px-24"
          >
            <div className="grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
              {CASES.map((project, i) => (
                <Reveal key={project.id} delay={i * 0.06} skipBlur>
                  <GridItem project={project} onPlay={setModalVideo} />
                </Reveal>
              ))}
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Fixed Project Lists (Both Sides) - Only in List Mode */}
      {viewMode === 'list' && !footerInView && (
        <>
          <div className="fixed top-1/2 -translate-y-1/2 z-[90] hidden flex-col items-center lg:flex" style={{ left: "8rem" }}>
            <div className="flex flex-col gap-1 items-center">
              {CASES.map((project) => (
                <button
                  key={project.id}
                  onClick={() => scrollToSection(project.id)}
                  className={`text-[8px] font-bold uppercase tracking-wider transition-all duration-500 ease-out text-center ${
                    activeId === project.id
                      ? "text-black dark:text-white"
                      : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-400"
                  }`}
                >
                  {project.title.replace(/\n/g, " ")}
                </button>
              ))}
            </div>
          </div>
          <div className="fixed top-1/2 -translate-y-1/2 z-[90] hidden flex-col items-center lg:flex" style={{ right: "8rem" }}>
            <div className="flex flex-col gap-1 items-center">
              {CASES.map((project) => (
                <button
                  key={project.id}
                  onClick={() => scrollToSection(project.id)}
                  className={`text-[8px] font-bold uppercase tracking-wider transition-all duration-500 ease-out text-center ${
                    activeId === project.id
                      ? "text-black dark:text-white"
                      : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-400"
                  }`}
                >
                  {project.title.replace(/\n/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Footer sentinel — hides fixed nav before footer */}
      <div ref={footerRef} className="h-px" />

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {modalVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
            onClick={() => setModalVideo(null)}
          >
            <button
              onClick={() => setModalVideo(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <div className="w-[90vw] max-w-[1200px] aspect-video relative" onClick={(e) => e.stopPropagation()}>
              <VideoPlayer videoId={modalVideo.videoId!} videoHash={modalVideo.videoHash} title={modalVideo.title} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
