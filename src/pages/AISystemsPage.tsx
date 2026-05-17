import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Info, LayoutGrid, List } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { type Workflow } from "../components/WorkflowTile";
import { ExperimentCard } from "../components/ExperimentCard";
import { ExperimentMenu } from "../components/ExperimentMenu";
import { Model3D } from "../components/Model3D";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Reveal, HeroReveal } from "../components/Reveal";
import { ScrambleSwap } from "../components/ScrambleSwap";
import { EASE_SNAPPY } from "../lib/motion";

interface Experiment {
  id: string;
  label: string;
  title: string;
  image: string;
  sliderItems?: { type?: "image" | "video" | "embed"; src: string; alt?: string; title?: string; subtitle?: string; objectPosition?: string }[];
  caseBlocks: { number: string; title: string; body: string }[];
}

const EXPERIMENT_01: Experiment = {
  id: "exp-01",
  label: "EXPERIMENT / 01",
  title: "What if AI could simulate\nthe future before it happens?",
  image: "/placeholders/image.svg",
  sliderItems: [
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
  ],
  caseBlocks: [
    {
      number: "01",
      title: "Signal",
      body: "AI is shifting from generating content to simulating reactions. To test this, I built a local multi-agent prediction system designed to simulate how markets, media, and public sentiment respond to geopolitical uncertainty before events fully unfold. The experiment focused on predicting how oil markets would react to escalating tension between the US and Iran over the next 76 hours.",
    },
    {
      number: "02",
      title: "How it's made",
      body: "The system ingests news articles, PDFs, geopolitical reports, and market narratives to build a contextual world model. A knowledge graph maps relationships between oil dependencies, financial markets, supply chains, media ecosystems, and public sentiment. From there, the engine generates 60+ autonomous AI personas including traders, economists, journalists, governments, and consumers that interact dynamically based on their own incentives and worldview.",
    },
    {
      number: "03",
      title: "Prediction",
      body: "The most interesting outcome wasn't the prediction itself, but how quickly narratives became market forces. Before any real supply disruption occurred, the fear of disruption already influenced speculative behavior and volatility. Systems like this suggest a future where organizations simulate crises, elections, market shocks, and cultural reactions before they happen shifting AI from generating answers to generating possible futures.",
    },
  ],
};

function placeholderExperiment(num: number, titleSuffix: string): Experiment {
  return {
    id: `exp-${String(num).padStart(2, "0")}`,
    label: `EXPERIMENT / ${String(num).padStart(2, "0")}`,
    title: `Experiment ${String(num).padStart(2, "0")}\n${titleSuffix}`,
    image: `/placeholders/image.svg`,
    sliderItems: Array.from({ length: 8 }, (_, i) => ({
      src: `/placeholders/image.svg`,
    })),
    caseBlocks: [
      {
        number: "01",
        title: "Signal",
        body: "Placeholder content for the signal block. Replace this with the actual narrative for what triggered this experiment, what cultural or technological shift you noticed, and why it mattered enough to spend a weekend prototyping a response.",
      },
      {
        number: "02",
        title: "How it's made",
        body: "Placeholder content for the build description. Explain the stack, the data sources, the agent architecture, and the key design decisions that made this prototype possible. Keep it concrete and specific to the experiment.",
      },
      {
        number: "03",
        title: "Prediction",
        body: "Placeholder content for the takeaway. What did the experiment reveal about the future direction of this technology, this market, or this creative practice? End with a clear thesis about what comes next.",
      },
    ],
  };
}

const EXPERIMENT_02: Experiment = {
  ...placeholderExperiment(2, "What if AI turned your references into strategic intelligence?"),
  title: "What if AI turned your references into strategic intelligence?",
  sliderItems: [
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
  ],
  caseBlocks: [
    {
      number: "01",
      title: "Signal",
      body: "Most people use AI for strategy by prompting the same public models trained on the same public information. The result is faster output, but often the same thinking. To operationalize a category-defining alternative, I built a local forecasting intelligence engine that transforms my own research, references, and signal collection into a connected second brain designed for strategy, trend forecasting, and creative thinking.",
    },
    {
      number: "02",
      title: "How it's made",
      body: "The system pulls signals from 80+ RSS feeds and any URL I drop in. Everything gets deep-fetched, cleaned, dated, converted into markdown, and indexed for AGENT-K search. It auto-maps every article to tensions, archetypes, and behavioral patterns without manual tagging. Ideas connect automatically, visualize as a graph, and evolve into a self-organizing knowledge system designed to surface emerging trends and unexpected relationships.",
    },
    {
      number: "03",
      title: "Prediction",
      body: "The next generation of strategists won't rely on generic AI outputs trained on public data, but on private intelligence systems built from their own research, references, and worldview. Strategy shifts from searching the internet for answers to navigating a second brain that continuously grows, connects ideas, and generates insights while you sleep.",
    },
  ],
};

const EXPERIMENT_03: Experiment = {
  ...placeholderExperiment(3, "What if the internet evolved from human-first to agent-first?"),
  title: "What if the internet evolved from human-first to agent-first?",
  sliderItems: [
    { src: "/placeholders/image.svg" },
  ],
  caseBlocks: [
    {
      number: "01",
      title: "Signal",
      body: "Most AI agents still depend on APIs, browser automation, or complex integrations to interact with websites. To operationalize a category-defining alternative, I built a AGENT-K Code workflow that turns almost any website into something AI agents can actually use. The experiment focused on Thuisbezorgd turning food ordering into a conversational AI experience directly inside AGENT-K.",
    },
    {
      number: "02",
      title: "How it's made",
      body: "Using Printing Press, I reverse-engineered Thuisbezorgd into a working CLI without using an API. A AGENT-K Code skill connected the CLI directly to chat, allowing the agent to ask contextual questions like postcode, cravings, and working hours before automatically building the basket. I also added Bayesian ranking to improve recommendations based on quality × review confidence, plus a Chrome extension that auto-fills saved orders in one click.",
    },
    {
      number: "03",
      title: "Prediction",
      body: "CLIs are evolving from developer tools into infrastructure for AI agents. Instead of humans browsing websites manually, agents will increasingly navigate the web on our behalf ordering food, managing finances, handling customer support, and interacting with other systems autonomously. The browser slowly shifts from a human interface into an operating system designed for AI agents.",
    },
  ],
};

const EXPERIMENT_04: Experiment = {
  ...placeholderExperiment(4, "What if creativity is just pattern recognition at scale?"),
  title: "What if creativity is just pattern recognition at scale?",
  sliderItems: [
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
  ],
  caseBlocks: [
    {
      number: "01",
      title: "Signal",
      body: "Most people think creativity is magic. To explore a different perspective, I built a structured creative intelligence system inside Obsidian trained on 101,552 Cannes Lions case studies. The idea was simple: creative directors don't necessarily have better imaginations they often have larger reference libraries and faster associative retrieval. Instead of searching for references, the system is designed to think through patterns, tensions, emotions, and unexpected creative combinations.",
    },
    {
      number: "02",
      title: "How it's made",
      body: "The system maps every campaign into structured relationships between mechanisms, emotions, cultural tensions, and strategic patterns across industries. No vectors. No RAG. Just a connected creative brain designed to surface combinations instead of similarities. When running a brief through the system, it kills obvious ideas instantly, generates unexpected connections, benchmarks concepts against award-winning work, and produces associative thinking faster than traditional creative workflows.",
    },
    {
      number: "03",
      title: "Prediction",
      body: "As AI becomes better at memory, retrieval, and associative thinking, parts of creativity become increasingly computational. Human ingenuity, taste, and creativity won't disappear but their role shifts from generating everything manually to curating, steering, and selecting from systems that can out-think humans at scale. The future creative advantage won't be who can generate the most ideas, but who has the judgment to recognize which ideas actually matter.",
    },
  ],
};

const EXPERIMENT_05: Experiment = {
  ...placeholderExperiment(5, "What if attention itself was forecastable, productized, and licensed?"),
  title: "What if attention itself was forecastable, productized, and licensed?",
  sliderItems: [
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
  ],
  caseBlocks: [
    {
      number: "01",
      title: "Signal",
      body: "The majority of post-production decisioning still remains tethered to legacy intuition heuristics, feedback theatre cycles, and lagging KPI extraction. To operationalize a category-defining alternative, I prototyped a sovereign on-prem orchestration layer on top of NEURO-MODEL v9 (BIG TECH LABS) that predicts neuro-signal latency from video and audio directly on a edge compute node. By interrogating the artifact frame-by-frame, the system estimates which brain regions activate over time including visual processing, emotion, language, reward, memorability, and cognitive load.",
    },
    {
      number: "02",
      title: "How it's made",
      body: "The platform operationalizes video and audio signals per second and maps them against predicted biometric narrative resonance like attention drop-off, emotional intensity, and memorability. Rough edits can be tested before client presentations, commercial versions compared side-by-side, and editing decisions evaluated shot-by-shot. Every analysis becomes part of an internal benchmark system, allowing future edits to be evaluated against accumulated response patterns instead of generic industry assumptions.",
    },
    {
      number: "03",
      title: "Prediction",
      body: "As simulated audience response combines with real-world performance data, the gap between creative intuition and measurable outcomes starts shrinking. Editing doesn't disappear, but parts of the workflow become increasingly automated through AI agents capable of generating rough cuts, testing variations, and optimizing pacing autonomously. The post-production practitioner repositions from manually crafting every frame toward designing the systems that decide what gets tested, what matters, and where human judgment still leads.",
    },
  ],
};

const EXPERIMENT_06: Experiment = {
  ...placeholderExperiment(6, "What if cinematic universes self-assembled from a one-sentence ambition?"),
  title: "What if AI could direct films\nfrom a single prompt?",
  sliderItems: [
    {
      type: "embed",
      src: "https://player.vimeo.com/video/0?background=1",
    },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
    { src: "/placeholders/image.svg" },
  ],
  caseBlocks: [
    {
      number: "01",
      title: "Signal",
      body: "The majority of incumbent generative video stacks still generate disconnected clips without consistency across shots, characters, or environments. To operationalize a category-defining alternative, I tested AGENT-X's latest multimodal image capabilities together with DIFFUSE-N to see whether a single structured prompt could generate a coherent 15-second cinematic sequence. The premise: a anonymous courier protagonist receives an unknown delivery.",
    },
    {
      number: "02",
      title: "How it's made",
      body: "The system combines detailed prompting, character sheets, environment design, and storyboard-style references into one connected visual workflow. AI receives instructions for faces, outfits, lighting, props, camera angles, materials, and world-building before translating them into a cohesive cinematic system. With strong omni references, the models begin maintaining visual consistency across shots while improving narrative pacing, atmosphere, and text understanding.",
    },
    {
      number: "03",
      title: "Prediction",
      body: "As AI video generation improves, the competitive advantage shifts away from the tools themselves toward storytelling, taste, and art direction. Fully AI-generated films that are nearly indistinguishable from traditional productions will likely emerge within the next few years. The future filmmaker may spend less time operating cameras and more time designing worlds, directing systems, and curating narrative behavior through prompts and visual frameworks.",
    },
  ],
};

const EXPERIMENT_07: Experiment = {
  ...placeholderExperiment(7, "What if the legacy holding-company model was reimagined as a fleet of always-on agentic pods?"),
  title: "What if the legacy holding-company model was reimagined as a fleet of always-on agentic pods?",
  sliderItems: [
    {
      type: "embed",
      src: "/placeholders/image.svg",
    },
  ],
  caseBlocks: [
    {
      number: "01",
      title: "Signal",
      body: "Most agencies still develop campaigns through human workshops, presentations, and subjective feedback loops. To operationalize a category-defining alternative, I simulated a full 6-week APEX ATHLETIX World Cup pitch using autonomous AI agency teams based on ZENTRA, NORTH & AXIS, and FUTURITY LABS. The challenge: APEX ATHLETIX has no FIFA license for 2026, cannot reference the official tournament, yet still needs to win attention during the biggest sports event on earth.",
    },
    {
      number: "02",
      title: "How it's made",
      body: "Each agency operated as a fully autonomous AI team including a strategist, cultural analyst, competitive analyst, Executive Creative Director, copywriter, art director, and account lead. The systems developed territories, generated campaign concepts, challenged weak ideas internally, and refined strategic directions before presenting final pitches. AI client personas evaluated the work based on originality, cultural relevance, executional strength, and brand fit to determine one winning agency.",
    },
    {
      number: "03",
      title: "Prediction",
      body: "The future of agencies won't be replacing creatives with AI, but using AI to simulate and pressure-test ideas before they reach clients. Strategic territories, campaigns, and audience reactions will increasingly be validated through synthetic environments built from behavioral and cultural data. As AI becomes better at generating, evaluating, and refining creative work, the human role shifts from producing every idea manually to directing, curating, and deciding which ideas deserve to exist in the real world.",
    },
  ],
};

const EXPERIMENTS: Experiment[] = [
  EXPERIMENT_01,
  EXPERIMENT_02,
  EXPERIMENT_03,
  EXPERIMENT_04,
  EXPERIMENT_05,
  EXPERIMENT_06,
  EXPERIMENT_07,
];


const WORKFLOWS_A: Workflow[] = [
  { id: "wf-01", label: "WORKFLOW · N8N",
    title: "Auto-publish to Notion",
    description: "Slack message → GPT summary → Notion database row.",
    seed: "wf01" },
  { id: "wf-02", label: "WORKFLOW · ZAPIER",
    title: "Inbox triage",
    description: "Gmail → classifier → labels → priority drafts.",
    seed: "wf02" },
  { id: "wf-03", label: "WORKFLOW · CLAUDE",
    title: "Brand voice review",
    description: "Markdown in → tone-of-voice scoring → suggestions out.",
    seed: "wf03" },
  { id: "wf-04", label: "WORKFLOW · N8N",
    title: "Daily content digest",
    description: "RSS feeds → dedupe → email digest at 08:00.",
    seed: "wf04" },
  { id: "wf-05", label: "WORKFLOW · MAKE",
    title: "Asset renamer",
    description: "Drive uploads → AI tags → consistent filenames.",
    seed: "wf05" },
  { id: "wf-06", label: "WORKFLOW · CUSTOM",
    title: "Studio standup bot",
    description: "Linear issues → daily summary → posted to Slack.",
    seed: "wf06" },
];

const WORKFLOWS_B: Workflow[] = [
  { id: "wf-07", label: "WORKFLOW · CLAUDE",
    title: "Pitch deck generator",
    description: "Brief in → research → outline → Figma frames.",
    seed: "wf07" },
  { id: "wf-08", label: "WORKFLOW · N8N",
    title: "Client onboarding",
    description: "Form submission → contract → invoice → kickoff invite.",
    seed: "wf08" },
  { id: "wf-09", label: "WORKFLOW · GPT",
    title: "Moodboard scraper",
    description: "Keyword → image search → curated Pinterest board.",
    seed: "wf09" },
  { id: "wf-10", label: "WORKFLOW · CUSTOM",
    title: "Video transcript indexer",
    description: "MP4 → Whisper → embeddings → searchable archive.",
    seed: "wf10" },
  { id: "wf-11", label: "WORKFLOW · ZAPIER",
    title: "Invoice reminder",
    description: "Overdue invoice → polite nudge → escalation path.",
    seed: "wf11" },
  { id: "wf-12", label: "WORKFLOW · N8N",
    title: "Portfolio auto-update",
    description: "New case study commit → site rebuild → social post.",
    seed: "wf12" },
];

const expandGallery = (base: Workflow[], count: number): Workflow[] =>
  Array.from({ length: count }, (_, i) => ({
    ...base[i % base.length],
    id: `${base[i % base.length].id}-${i}`,
    seed: `${base[i % base.length].seed}-${i}`,
  }));

const GALLERY_A = expandGallery(WORKFLOWS_A, 12);
const GALLERY_B = expandGallery(WORKFLOWS_B, 12);


function ExperimentGridItem({ experiment }: { experiment: Experiment }) {
  return (
    <div className="group flex flex-col gap-4">
      <div className="aspect-video overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-900 relative">
        <img
          src={experiment.image}
          alt={experiment.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-active:scale-105 group-active:grayscale-0"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-mono uppercase tracking-wider opacity-50 text-black dark:text-white">
          {experiment.label}
        </span>
        <h3 className="text-sm font-bold uppercase tracking-tight whitespace-pre-line">
          {experiment.title}
        </h3>
      </div>
    </div>
  );
}

export default function AISystemsPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showAllInfo, setShowAllInfo] = useState(false);
  const [activeExp, setActiveExp] = useState(0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar />

      {/* Fixed Experiment Lists (Both Sides) - Only in List Mode */}
      {viewMode === "list" && (
        <>
          <div className="fixed top-1/2 -translate-y-1/2 z-[90] hidden flex-col items-center lg:flex" style={{ left: "8rem" }}>
            <div className="flex flex-col gap-1 items-center">
              {EXPERIMENTS.map((exp, i) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveExp(i)}
                  className={`text-[8px] font-bold uppercase tracking-wider transition-all duration-500 ease-out text-center cursor-pointer ${
                    activeExp === i
                      ? "text-black dark:text-white"
                      : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-400"
                  }`}
                >
                  {exp.label}
                </button>
              ))}
            </div>
          </div>
          <div className="fixed top-1/2 -translate-y-1/2 z-[90] hidden flex-col items-center lg:flex" style={{ right: "8rem" }}>
            <div className="flex flex-col gap-1 items-center">
              {EXPERIMENTS.map((exp, i) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveExp(i)}
                  className={`text-[8px] font-bold uppercase tracking-wider transition-all duration-500 ease-out text-center cursor-pointer ${
                    activeExp === i
                      ? "text-black dark:text-white"
                      : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-400"
                  }`}
                >
                  {exp.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* View Toggle */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] sm:top-42 flex items-center gap-4">
        <button
          onClick={() => setShowAllInfo(!showAllInfo)}
          className={`flex items-center justify-center min-h-[44px] min-w-[44px] touch-manipulation transition-[color,transform] duration-150 cursor-pointer active:scale-90 ${showAllInfo ? "text-black dark:text-white" : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"}`}
          aria-label="Toggle info"
        >
          <Info size={18} />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`flex items-center justify-center min-h-[44px] min-w-[44px] touch-manipulation transition-[color,transform] duration-150 cursor-pointer active:scale-90 ${viewMode === "list" ? "text-black dark:text-white" : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"}`}
          aria-label="List view"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={`flex items-center justify-center min-h-[44px] min-w-[44px] touch-manipulation transition-[color,transform] duration-150 cursor-pointer active:scale-90 ${viewMode === "grid" ? "text-black dark:text-white" : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"}`}
          aria-label="Grid view"
        >
          <LayoutGrid size={18} />
        </button>
      </div>

      {/* ── Hero ── About-style sticky left + paragraph right */}
      <section className="px-8 pt-0 sm:pt-[16vh] pb-[10vh] md:px-12 lg:px-24">
        <div className="mx-auto max-w-full sm:max-w-[75vw] md:max-w-7xl">
          <div className="relative grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-6 relative z-10">
              <HeroReveal delay={0}>
                <span className="text-micro text-neutral-500 font-mono mb-4 block">AI SYSTEMS / 2024 — 2026</span>
              </HeroReveal>
              <HeroReveal delay={0.10}>
                <h1 className="text-huge mb-10">
                  Every quarter I prototype agentic workflows to future-proof my{" "}
                  <ScrambleSwap
                    base="DECK"
                    targets={["KEYNOTE", "MANIFESTO", "MOODBOARD", "NORTH STAR", "ROADMAP", "WORKSTREAM", "BLUEPRINT", "ECOSYSTEM", "PIPELINE", "TASTE", "POV", "BRIEF", "SYNERGY"]}
                    autoMs={3000}
                    trailing={<span className="animate-blink-dot inline-block">.</span>}
                  />
                </h1>
              </HeroReveal>
              <HeroReveal delay={0.20}>
                <p className="text-base font-normal tracking-tight leading-relaxed text-justify text-neutral-600 dark:text-neutral-300 max-w-lg">
                  A curated portfolio of vertically integrated AI ecosystems, autonomous workstreams, and category-defining proof-of-concepts I prototype monthly to evaluate emerging fluencies across creativity, strategy, production, and post-platform discourse. The objective is not faster ideation but the systematic dismantling of friction between intent and artifact, deploying AI as a co-conspirator that can simulate, amplify, contest, or 10x any creative gesture before it is allowed into the wild.
                </p>
              </HeroReveal>
            </div>

            {/* 3D model — on mobile: in-flow above the headline; on desktop: absolute, off-canvas right */}
            {/* ErrorBoundary wraps the size-reservation so the whole block collapses if WebGL fails (no empty 1394px void) */}
            <ErrorBoundary label="Model3D" fallback={null}>
              <HeroReveal delay={0.30} skipBlur className="order-first -mt-12 mb-0 md:order-none md:absolute md:top-0 md:right-0 md:-mt-80 md:mb-0 z-0 pointer-events-none max-md:overflow-hidden max-md:h-[90vw] max-md:max-h-[480px] max-md:flex max-md:items-center max-md:justify-center">
                <div className="relative -mx-[60%] w-[220%] h-[140vw] max-h-[760px] shrink-0 md:mx-0 md:w-[2800px] md:h-[1394px] md:max-h-none md:translate-x-[1200px] md:pointer-events-auto md:shrink-0">
                  {/* Concentric ring backdrop — geometrically centered on the head (head sits at canvas center) */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[60vw] w-[60vw] max-h-[320px] max-w-[320px] md:h-[55vw] md:w-[55vw] md:max-h-[500px] md:max-w-[500px] lg:h-[900px] lg:w-[900px] lg:max-h-none lg:max-w-none"
                  >
                    <div className="absolute inset-0 rounded-full border border-neutral-300 dark:border-neutral-800" />
                    <div className="absolute inset-8 rounded-full border border-neutral-300 dark:border-neutral-800 md:inset-12" />
                    <div className="absolute inset-16 rounded-full border border-neutral-300 dark:border-neutral-800 md:inset-24" />
                  </div>
                  <div className="relative z-10 h-full w-full">
                    <Model3D src="/placeholders/image.svg" />
                  </div>
                </div>
              </HeroReveal>
            </ErrorBoundary>
          </div>
        </div>
      </section>

      {/* ── Experiments: list (with menu) or grid ── */}
      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Experiment menu — sits above the section, aligned with title */}
            <div className="px-8 pt-24 md:px-12 lg:px-24">
              <div className="mx-auto max-w-full sm:max-w-[75vw] md:max-w-7xl">
                <ExperimentMenu
                  count={EXPERIMENTS.length}
                  active={activeExp}
                  onSelect={setActiveExp}
                />
              </div>
            </div>

            {/* Active experiment — horizontal slide on change */}
            <AnimatePresence mode="wait">
              <motion.div
                key={EXPERIMENTS[activeExp].id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: EASE_SNAPPY }}
              >
                <ExperimentCard
                  label={EXPERIMENTS[activeExp].label}
                  title={EXPERIMENTS[activeExp].title}
                  image={EXPERIMENTS[activeExp].image}
                  sliderItems={EXPERIMENTS[activeExp].sliderItems}
                  caseBlocks={EXPERIMENTS[activeExp].caseBlocks}
                  showAllInfo={showAllInfo}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto w-full max-w-full sm:max-w-[1440px] px-6 sm:px-8 py-24 md:py-32 md:px-12 lg:px-24"
          >
            <div className="grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2 lg:grid-cols-3 pt-16">
              {EXPERIMENTS.map((exp) => (
                <ExperimentGridItem key={exp.id} experiment={exp} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ── Contact ── */}
      <section className="px-8 py-32 md:px-12 lg:px-24">
        <div className="mx-auto max-w-full sm:max-w-[75vw] md:max-w-7xl">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-12 md:gap-12">
            <Reveal className="md:sticky md:top-24 lg:top-32 md:col-span-3 md:h-fit">
              <span className="text-micro text-neutral-500 font-mono mb-4 block">END / SCROLL</span>
              <h2 className="text-huge max-md:mb-10">
                Got a process<br />that feels<br />
                <ScrambleSwap
                  base="HEAVY"
                  targets={["SLOW", "MANUAL", "OUTDATED", "COMPLEX", "CLUNKY", "BROKEN", "OVERBUILT"]}
                  autoMs={3000}
                  trailing={<span className="inline-block">?</span>}
                />
              </h2>
            </Reveal>

            <Reveal className="md:col-start-8 md:col-span-5 pt-0 md:pt-12">
              <p className="text-base font-normal tracking-tight leading-relaxed text-justify text-neutral-600 dark:text-neutral-300 max-w-lg mb-8">
                I deploy frictionless workflow architectures for cross-functional pods seeking to reclaim measurable capacity.
                After 15+ years operating across boutique hothouses and globally distributed multi-agency networks I have ingested the industry. That is why the majority of my experiments operationalize advertising workflows, creative and strategic verticals, social-first production stacks, and the systemic amplification of teams through agentic AI and intelligent automation.
                My north star is uncomplicated: equip humans with the tools, systems, and shared fluencies required to ship 10x faster without sacrificing distinctive creative voice.
                We are entering an era in which any individual can manifest virtually any artifact, anywhere, asynchronously. Which means the practitioners who synthesize creativity, lived experience, and authentic craft will be the ones architecting the next chapter. If you have questions, contrarian provocations, or simply wish to converse about the future of creative labor, my inbox is open.
              </p>
            </Reveal>
          </div>

        </div>
      </section>
    </div>
  );
}
