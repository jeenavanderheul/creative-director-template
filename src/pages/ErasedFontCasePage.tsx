import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Reveal, HeroReveal } from "../components/Reveal";
import { nextCaseAfter } from "../data/caseOrder";


const PROJECT_DATA = [
  { label: "YEAR", value: "2024" },
  { label: "ROLE", value: "STRATEGY, DEVELOPMENT, UX, UI, DESIGN" },
  { label: "PLATFORM", value: "SHOPIFY PLUS" },
  { label: "INDUSTRY", value: "OUTDOOR" },
];

export default function ErasedFontCasePage() {
  const next = nextCaseAfter("erased-font");
  return (
    <div className="relative min-h-screen bg-neutral-100 dark:bg-[#0a0a0a] text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black font-sans overflow-x-hidden">
      <Navbar />

      {/* HERO — Title + Data Table */}
      <section className="relative w-full pt-32 md:pt-40 px-8 md:px-12 lg:px-24">
        <div className="max-w-[1440px] mx-auto">
          <HeroReveal delay={0.10}>
            <h1 className="text-huge mb-12">
              INSPIRED BY THE TRAIL
            </h1>
          </HeroReveal>

          {/* Hero Image */}
          <HeroReveal delay={0.20} skipBlur className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 mb-12">
            <img
              src="/placeholders/image.svg"
              alt="Hero image"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </HeroReveal>

          {/* Data Table */}
          <HeroReveal delay={0.30} className="w-full">
            {PROJECT_DATA.map((row) => (
              <div key={row.label} className="border-b border-neutral-300 dark:border-neutral-700 py-6 grid grid-cols-[1fr_1.5fr] gap-8">
                <span className="text-sm font-bold uppercase tracking-tight text-neutral-500">{row.label}</span>
                <span className="text-base font-normal uppercase tracking-tight">{row.value}</span>
              </div>
            ))}

            {/* Opportunity */}
            <div className="border-b border-neutral-300 dark:border-neutral-700 py-6 grid grid-cols-[1fr_1.5fr] gap-8">
              <span className="text-sm font-bold uppercase tracking-tight text-neutral-500">OPPORTUNITY</span>
              <span className="text-base font-normal uppercase tracking-tight leading-relaxed">
                When the client announced a multi-year partnership with world-renowned athletes, they reached out to us to create a digital experience celebrating this legendary collaboration. The brief was to focus on the authentic connection between the brand and the trail, which has been at the heart of their products since they were founded.
              </span>
            </div>

            {/* Solution */}
            <div className="py-6 grid grid-cols-[1fr_1.5fr] gap-8">
              <span className="text-sm font-bold uppercase tracking-tight text-neutral-500">SOLUTION</span>
              <span className="text-base font-normal uppercase tracking-tight leading-relaxed">
                We built a digital experience for a global audience that works seamlessly within the brand's existing ecosystem. One part captures the essence of the partnership by focusing on how athletes use the products in their daily training. The other provides a direct path to purchase the collection, featuring the new technical footwear and apparel.
              </span>
            </div>
          </HeroReveal>
        </div>
      </section>

      {/* SECTION 2: TEXT & IMAGES */}
      <section className="w-full px-8 md:px-12 lg:px-24 mt-16 md:mt-24 mb-24 md:mb-48 lg:mb-64">
        <div className="max-w-[1440px] mx-auto">
          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24 md:mb-48">
            <div className="lg:col-span-4 flex flex-col justify-start">
              <h2 className="text-sm font-bold uppercase tracking-tight text-neutral-500 mb-8">Talent, Dedication and Heart</h2>
              <p className="text-base font-normal uppercase tracking-tight leading-relaxed">
                The trail, the athlete, and the signature performance gear take center stage in the partnership page design. Photos and video content tell the collaboration story and ensure customer visual engagement throughout the digital experience.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="aspect-[16/10] overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-900">
                <img
                  src="/placeholders/image.svg"
                  alt="Action photo"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24 md:mb-48">
            <div className="lg:col-span-8 order-2 lg:order-1">
              <div className="aspect-[16/10] overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-900">
                <img
                  src="/placeholders/image.svg"
                  alt="Process photo"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-start order-1 lg:order-2">
              <h2 className="text-sm font-bold uppercase tracking-tight text-neutral-500 mb-8">Start Early, Stay Late</h2>
              <p className="text-base font-normal uppercase tracking-tight leading-relaxed">
                The client's deep involvement in the design process appears throughout the digital experience, including the collaboration with the team on the collection's finishes, materials, and colors. One mantra, "Start Early, Stay Late," appears on four of the products.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 3: FULL WIDTH & FINAL TEXT */}
      <section className="w-full px-8 md:px-12 lg:px-24 mb-24 md:mb-48 lg:mb-64">
        <div className="max-w-[1440px] mx-auto">
          <Reveal skipBlur className="aspect-[21/9] w-full overflow-hidden rounded-sm bg-neutral-100 mb-32">
            <img
              src="/placeholders/image.svg"
              alt="Wide shot"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </Reveal>
          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            <div className="lg:col-span-4">
              <h2 className="text-sm font-bold uppercase tracking-tight text-neutral-500">The Greatest of All Time</h2>
            </div>
            <div className="lg:col-span-8">
              <p className="text-base font-normal uppercase tracking-tight leading-relaxed">
                We designed and developed the partnership and product collection pages to work effortlessly within the existing framework of the brand's global site. The experience celebrates the connection to nature, community, and the shared joy of movement.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* NEXT PROJECT */}
      <section className="relative bg-white dark:bg-[#0a0a0a] text-black dark:text-white px-8 md:px-12 lg:px-24 py-24 md:py-48 lg:py-64 overflow-hidden border-t border-neutral-100 dark:border-neutral-800">
        <Reveal className="max-w-[1440px] mx-auto flex flex-col items-center text-center">
          <span className="text-micro text-neutral-400 mb-12">Up Next</span>
          <Link to={next.path ?? "/work"} className="group flex flex-col items-center transition-transform duration-150 active:scale-[0.98]">
            <h2 className="text-[10vw] md:text-[7vw] leading-[0.8] font-medium tracking-tighter uppercase mb-12 transition-opacity group-hover:opacity-50">
              {next.title}
            </h2>
            <p className="text-base font-normal uppercase tracking-tight leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-lg mb-12">
              We love working with passionate people and brands. Let's collaborate.
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm font-bold uppercase tracking-widest border-b border-current pb-1">View Case</span>
            </div>
          </Link>
        </Reveal>
      </section>

    </div>
  );
}
