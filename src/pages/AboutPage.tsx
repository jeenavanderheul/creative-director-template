import { useEffect } from "react";
import { motion } from "motion/react";
import { Navbar } from "../components/Navbar";
import { KeychainCard } from "../components/KeychainCard";
import { ConnectedNodes } from "../components/ConnectedNodes";
import { MagneticWall } from "../components/MagneticWall";
import { Reveal, HeroReveal } from "../components/Reveal";
import { ScrambleHeading } from "../components/ScrambleHeading";

const PRINCIPLES = [
  {
    title: "Creativity\nis a Stack.",
    description: "Creativity is not a divine accident. It is engineered. It compounds across the references you ingest, the frameworks you internalize, and the latency at which you synthesize them into shippable artifacts. Curate the input. Operationalize the throughput. Architect your own proprietary creativity stack and let competitors stare at the leaderboard.",
  },
  {
    title: "Disrupt\nwith Empathy",
    description: "How you orchestrate cross-functional collaboration determines the cultural reach of any idea. Empathy is not a soft skill, it is a force-multiplier. It accelerates trust, removes intra-organizational friction, and keeps multi-disciplinary pods aligned under quarterly pressure. The higher the team coherence index, the higher the execution velocity.",
  },
  {
    title: "Fail\nUpwards",
    description: "Failure is a non-optional input variable in any high-performance creative organism. Optimization does not emerge from avoiding mistakes, it emerges from compressing the learn-iterate-deploy loop until iteration approaches zero latency. Every failed shipment is proprietary signal data the rest of the market does not have.",
  },
];

export default function AboutPage() {
  useEffect(() => {
    document.documentElement.style.overscrollBehaviorY = "none";
    return () => { document.documentElement.style.overscrollBehaviorY = ""; };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black relative">
      <Navbar />

      {/* ── Mobile: Keychain + Bio ── */}
      <div className="lg:hidden">
        <HeroReveal skipBlur className="flex justify-center pt-[12vh] sm:pt-[16vh] pb-32">
          <div className="origin-top" style={{ transform: "scale(1.2)" }}>
            <KeychainCard cordHeight="15px" />
          </div>
        </HeroReveal>
        <section className="px-8 py-24 md:py-32 flex flex-col items-center">
          <Reveal className="max-w-[85vw]">
            <span className="text-micro text-neutral-500 font-mono">01.</span>
            <h2 className="text-huge mb-10"><ScrambleHeading text="What I Do" /></h2>
            <p className="text-base font-normal tracking-tight leading-relaxed text-justify text-neutral-600 dark:text-neutral-300">
              With 15+ years of cross-vertical narrative engineering, operationalized across ZENTRA Amsterdam, MERIDIAN BUREAU, VANTA COLLECTIVE, HORIZON & CO / STRATA NETWORK, KINETIC BUREAU, and OBLIQUE STUDIO, I have manufactured category-defining outcomes for an unreasonable number of global and emerging brands, solving the entire spectrum of creative-business tension. I do not produce decks; I architect end-to-end narrative infrastructure that compounds across screens, feeds, and post-platform discourse. Every artifact is bespoke. Every artifact is intentional. My operational thesis lives at the intersection of advertising, AI tooling, filmmaking, and high-velocity social, converting brand intent into culturally portable ideas and the always-on systems that distribute them.
            </p>
          </Reveal>
        </section>
        <section className="px-8 py-24 md:py-32 flex flex-col items-center">
          <Reveal className="max-w-[85vw]">
            <span className="text-micro text-neutral-500 font-mono">02.</span>
            <h2 className="text-huge mb-10"><ScrambleHeading text="How I Do It" /></h2>
            <p className="text-base font-normal tracking-tight leading-relaxed text-justify text-neutral-600 dark:text-neutral-300">
              I don&rsquo;t just create ideas, I build systems that make them work. Most creative work breaks at scale, so I design for scalability from the start. Strategy, concept, and execution are structured as one connected system, built to translate across platforms without losing clarity, consistency, or impact.
            </p>
          </Reveal>
        </section>
        <section className="px-4 py-8">
          <Reveal skipBlur className="aspect-[3/4]">
            <ConnectedNodes />
          </Reveal>
        </section>
      </div>

      {/* ── Desktop: Keychain + Bio sections ── */}
      <section className="hidden lg:block px-12 lg:px-24 pt-[12vh] sm:pt-[16vh] pb-32">
        <div className="mx-auto max-w-7xl relative">
          {/* Keychain — shifted right + smaller scale so it can never overflow into text column */}
          <div className="grid grid-cols-12 relative">
            <div className="col-start-9 col-span-4 flex flex-col items-center row-start-1" style={{ position: "relative", zIndex: 1 }}>
              <HeroReveal skipBlur>
                <KeychainCard cordHeight="clamp(30px, 4vh, 60px)" scale={1.2} />
              </HeroReveal>
            </div>
            {/* Spacer to reserve vertical room in grid flow */}
            <div className="col-span-6 row-start-1 pt-[12rem]" aria-hidden="true">
              <div className="invisible">
                <span className="text-micro font-mono mb-4 block">01.</span>
                <h2 className="text-huge mb-10">What I Do</h2>
                <p className="text-base leading-relaxed">
                  With 15+ years of cross-vertical narrative engineering, operationalized across ZENTRA Amsterdam, MERIDIAN BUREAU, VANTA COLLECTIVE, HORIZON & CO / STRATA NETWORK, KINETIC BUREAU, and OBLIQUE STUDIO, I have manufactured category-defining outcomes for an unreasonable number of global and emerging brands, solving the entire spectrum of creative-business tension. I do not produce decks; I architect end-to-end narrative infrastructure that compounds across screens, feeds, and post-platform discourse. Every artifact is bespoke. Every artifact is intentional. My operational thesis lives at the intersection of advertising, AI tooling, filmmaking, and high-velocity social, converting brand intent into culturally portable ideas and the always-on systems that distribute them.
                </p>
              </div>
            </div>
          </div>

          {/* What I Do text — absolutely positioned OVER the grid, col 1-6 width, always on top */}
          <div
            className="absolute top-0 left-0 pt-[12rem]"
            style={{ width: "50%", zIndex: 50 }}
          >
            <Reveal>
              <span className="text-micro text-neutral-500 font-mono mb-4 block">01.</span>
              <h2 className="text-huge mb-10"><ScrambleHeading text="What I Do" /></h2>
              <p className="text-base font-normal tracking-tight leading-relaxed text-justify text-neutral-600 dark:text-neutral-300">
                With 15+ years of cross-vertical narrative engineering, operationalized across ZENTRA Amsterdam, MERIDIAN BUREAU, VANTA COLLECTIVE, HORIZON & CO / STRATA NETWORK, KINETIC BUREAU, and OBLIQUE STUDIO, I have manufactured category-defining outcomes for an unreasonable number of global and emerging brands, solving the entire spectrum of creative-business tension. I do not produce decks; I architect end-to-end narrative infrastructure that compounds across screens, feeds, and post-platform discourse. Every artifact is bespoke. Every artifact is intentional. My operational thesis lives at the intersection of advertising, AI tooling, filmmaking, and high-velocity social, converting brand intent into culturally portable ideas and the always-on systems that distribute them.
              </p>
            </Reveal>
          </div>

          {/* Connected Nodes — absolute positioned, doesn't affect flow */}
          <Reveal
            skipBlur
            className="absolute z-[5] overflow-visible hidden lg:block"
            style={{ top: "calc(12vh + 12rem + 200px)", width: "45%", aspectRatio: "9 / 16", left: "0%" }}
          >
            <ConnectedNodes />
          </Reveal>

          {/* How I Do It */}
          <div className="grid grid-cols-12 gap-12 mt-[16rem] relative z-10 pointer-events-none">
            <Reveal className="col-start-8 col-span-5 pointer-events-auto">
              <span className="text-micro text-neutral-500 font-mono">02.</span>
              <h2 className="text-huge mb-10 md:whitespace-nowrap"><ScrambleHeading text="How I Do It" /></h2>
              <p className="text-base font-normal tracking-tight leading-relaxed text-justify text-neutral-600 dark:text-neutral-300">
                I don&rsquo;t just create ideas, I build systems that make them work. Most creative work breaks at scale, so I design for scalability from the start. Strategy, concept, and execution are structured as one connected system, built to translate across platforms without losing clarity, consistency, or impact.
              </p>
            </Reveal>
          </div>

          {/* Brands I've worked with */}
          <div className="grid grid-cols-12 gap-12 mt-[20rem] relative z-10">
            <div className="col-span-6 lg:col-span-5">
              <span className="text-micro text-neutral-500 font-mono">03.</span>
              <h2 className="text-huge mb-10 md:whitespace-nowrap"><ScrambleHeading text="Brands I've worked with" /></h2>
            </div>
          </div>
          <Reveal skipBlur className="mt-10 relative z-10">
            <MagneticWall />
          </Reveal>
        </div>
      </section>

      {/* ── Principles (Sticky Interaction) ── */}
      <section className="px-8 py-32 md:px-12 lg:px-24">
        <div className="mx-auto max-w-full sm:max-w-[75vw] md:max-w-7xl">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-12 md:gap-12">
            <div className="md:sticky md:top-24 lg:top-32 md:col-span-3 md:h-fit">
              <span className="text-micro text-neutral-500 font-mono mb-4 block">CREATIVE PILLARS</span>
              <h2 className="text-huge max-md:mb-10"><ScrambleHeading text="Statements" noWrap /></h2>
            </div>

            <div className="flex flex-col gap-24 md:gap-48 md:col-start-8 md:col-span-5 pt-0 md:pt-12">
              {PRINCIPLES.map((principle, i) => (
                <Reveal
                  key={principle.title}
                  delay={i * 0.10}
                  className="flex flex-col gap-8"
                >
                  <h3 className="text-base font-normal tracking-tight leading-relaxed text-neutral-600 dark:text-neutral-300 md:max-w-lg whitespace-pre-line">
                    {principle.title}
                  </h3>
                  <p className="text-base font-normal tracking-tight leading-relaxed text-justify text-neutral-600 dark:text-neutral-300 md:max-w-lg">
                    {principle.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mantra (Scroll Typewriter) ── */}
      <section className="px-8 py-32 md:px-12 lg:px-24">
        <div className="mx-auto max-w-full sm:max-w-[75vw] md:max-w-7xl">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-12 md:gap-12">
            <div className="md:sticky md:top-24 lg:top-32 md:col-span-3 md:h-fit">
              <span className="text-micro text-neutral-500 font-mono mb-4 block">Core values</span>
              <h2 className="text-huge max-md:mb-10"><ScrambleHeading text="Mantra" noWrap /></h2>
            </div>

            <Reveal className="md:col-start-8 md:col-span-5 pt-0 md:pt-12">
              <p className="text-base font-normal tracking-tight leading-relaxed text-justify text-neutral-600 dark:text-neutral-300 max-w-full sm:max-w-[75vw] mx-auto md:mx-0 md:max-w-lg">
                My operating thesis is rooted in the conviction that today&rsquo;s category leaders demand the foresight of tomorrow&rsquo;s emerging mindsets. As an unrelenting advocate for radical inclusion across the creative industrial complex, my mission is to spotlight the category-defining potential of commercial creativity as it permeates every vertical of business and lived experience. In my previous tour of duty at STRATA NETWORK / HORIZON &amp; CO, I held the title of Creative Director of Platforms &amp; Innovation, where I orchestrated the luxe and social-first verticals. Across my career arc, I have piloted networks, departments, and cross-functional pods toward outsized creative outcomes. My fixation is the manufacture of frictionless, category-disrupting storytelling architectures, anchored in social and digital innovation, that produce measurable enterprise upside. Today I am a partner at Future Bureau, where I co-lead three verticals alongside two unreasonably talented co-founders, stewarding a 25-person collective of category-defining practitioners.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}


