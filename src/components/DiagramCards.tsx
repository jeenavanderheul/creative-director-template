// Shared style: stroke 0.5px dashed, nodes r=5, grain overlay
// All SVGs use viewBox + percentage width so they scale with card size

function GrainOverlay() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-[0.06] mix-blend-soft-light" aria-hidden="true">
      <defs>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <radialGradient id="grain-fade" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="grain-mask">
          <rect width="100%" height="100%" fill="url(#grain-fade)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" filter="url(#grain)" mask="url(#grain-mask)" />
    </svg>
  );
}

const S = 0.5;
const D = "3 3";
const CARD = "w-full h-full backdrop-blur-xl bg-gradient-to-br from-white/60 via-white/40 to-neutral-200/30 dark:from-neutral-900/60 dark:via-neutral-800/40 dark:to-neutral-900/30 border border-white/50 dark:border-neutral-700/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] p-[4%] sm:p-[5%] flex flex-col sm:flex-row relative overflow-hidden";

// Subtle grain texture on SVG diagram elements — soft blend, not a hard block
function SvgGrainFilter({ id }: { id: string }) {
  return (
    <defs>
      <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="noise" />
        <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
        <feComposite in="grayNoise" in2="SourceGraphic" operator="in" result="maskedNoise" />
        <feBlend in="SourceGraphic" in2="maskedNoise" mode="soft-light" />
      </filter>
    </defs>
  );
}

// Grays per section for visual distinction
const C = {
  define: "#2a2a2a",
  build: "#3d3d3d",
  scale: "#1a1a1a",
  accent: "#555555",
  light: "#7a7a7a",
};


export function StrategyCard() {
  return (
    <div className={CARD}>
      <GrainOverlay />
      <div className="flex flex-col justify-between w-full sm:w-[48%] z-10 overflow-hidden">
        <div>
          <span className="text-micro font-normal text-neutral-400">01 / Define</span>
          <h2 className="text-[clamp(12px,4vw,48px)] font-normal uppercase tracking-tight leading-none mt-2 sm:mt-4">Strategy</h2>
          <p className="text-[10px] sm:text-base text-neutral-400 font-normal mt-1 sm:mt-2">Defines direction</p>
        </div>
        <p className="text-[9px] sm:text-base font-normal tracking-tight leading-snug sm:leading-relaxed text-neutral-500 dark:text-neutral-400 pr-2 sm:pr-4">
          I identify where a <strong className="text-black dark:text-white font-normal">brand should go</strong> and why. Turning complexity into clear, actionable focus.
        </p>
      </div>
      <svg className="absolute -right-[2%] -bottom-[8%] w-[50%] h-[100%] hidden sm:block" viewBox="0 0 280 260" preserveAspectRatio="xMidYMid meet">
        <SvgGrainFilter id="sg-strategy" />
        <g filter="url(#sg-strategy)">
          {[0, 1, 2, 3, 4].map((i) => {
            const y = 15 + i * 55;
            const len = [140, 100, 140, 100, 140][i];
            const extra = i === 1 || i === 3;
            return (
              <g key={i}>
                <circle cx={20} cy={y} r={5} fill={C.accent} />
                <line x1={30} y1={y} x2={30 + len} y2={y} stroke={C.light} strokeWidth={S} strokeDasharray={D} />
                <polygon points={`${28 + len},${y - 3} ${33 + len},${y} ${28 + len},${y + 3}`} fill={C.accent} />
                {extra && (
                  <>
                    <line x1={42 + len} y1={y} x2={78 + len} y2={y} stroke={C.light} strokeWidth={S} strokeDasharray={D} />
                    <polygon points={`${76 + len},${y - 3} ${81 + len},${y} ${76 + len},${y + 3}`} fill={C.accent} />
                  </>
                )}
              </g>
            );
          })}
          <line x1={195} y1={125} x2={250} y2={125} stroke={C.define} strokeWidth={2} />
          <polygon points="250,115 268,125 250,135" fill={C.accent} />
        </g>
      </svg>
    </div>
  );
}

export function BrandCard() {
  return (
    <div className={CARD}>
      <GrainOverlay />
      <div className="flex flex-col justify-between w-full sm:w-[48%] z-10 overflow-hidden">
        <div>
          <span className="text-micro font-normal text-neutral-400">01 / Define</span>
          <h2 className="text-[clamp(12px,4vw,48px)] font-normal uppercase tracking-tight leading-none mt-2 sm:mt-4">Brand</h2>
          <p className="text-[10px] sm:text-base text-neutral-400 font-normal mt-1 sm:mt-2">Defines structure</p>
        </div>
        <p className="text-[9px] sm:text-base font-normal tracking-tight leading-snug sm:leading-relaxed text-neutral-500 dark:text-neutral-400 pr-2 sm:pr-4">
          I translate strategy into systems, identity and behavior. Making brands recognizable, scalable and consistent.
        </p>
      </div>
      <div className="absolute -right-[5%] -bottom-[8%] grid grid-cols-5" style={{ gap: "3%", width: "52%" }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square rounded ${i === 12 ? "bg-black/80" : "border border-neutral-400/50 dark:border-neutral-600/50"}`}
            style={{ borderStyle: i === 12 ? "none" : "dashed" }}
          />
        ))}
      </div>
    </div>
  );
}

export function CultureCard() {
  return (
    <div className={CARD}>
      <GrainOverlay />
      <div className="flex flex-col justify-between w-full sm:w-[42%] z-10">
        <div>
          <span className="text-micro font-normal text-neutral-400">01 / Define</span>
          <h2 className="text-[clamp(12px,4vw,48px)] font-normal uppercase tracking-tight leading-none mt-2 sm:mt-4">Culture</h2>
          <p className="text-[10px] sm:text-base text-neutral-400 font-normal mt-1 sm:mt-2">Defines relevance</p>
        </div>
        <p className="text-[9px] sm:text-base font-normal tracking-tight leading-snug sm:leading-relaxed text-neutral-500 dark:text-neutral-400 pr-2 sm:pr-4">
          I connect brands to what people care about. Ensuring ideas live within real-world context.
        </p>
      </div>
      <svg className="absolute -right-[10%] -bottom-[10%] w-[65%] h-[105%] hidden sm:block" viewBox="0 0 320 300" preserveAspectRatio="xMidYMid meet">
        <SvgGrainFilter id="sg-culture" />
        <g filter="url(#sg-culture)">
        <circle cx={200} cy={150} r={140} fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx={200} cy={150} r={100} fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx={200} cy={150} r={60} fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx={200} cy={150} r={18} fill={C.accent} />
        <line x1={0} y1={150} x2={182} y2={150} stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx={25} cy={150} r={3} fill={C.accent} />
        <circle cx={65} cy={150} r={3} fill={C.accent} />
        <circle cx={100} cy={150} r={3} fill={C.accent} />
        <circle cx={135} cy={150} r={3.5} fill={C.accent} />
        </g>
      </svg>
    </div>
  );
}

export function AudienceCard() {
  return (
    <div className={CARD}>
      <GrainOverlay />
      <div className="flex flex-col justify-between w-full sm:w-[48%] z-10 overflow-hidden">
        <div>
          <span className="text-micro font-normal text-neutral-400">01 / Define</span>
          <h2 className="text-[clamp(12px,4vw,48px)] font-normal uppercase tracking-tight leading-none mt-2 sm:mt-4">Audience</h2>
          <p className="text-[10px] sm:text-base text-neutral-400 font-normal mt-1 sm:mt-2">Defines connection</p>
        </div>
        <p className="text-[9px] sm:text-base font-normal tracking-tight leading-snug sm:leading-relaxed text-neutral-500 dark:text-neutral-400 pr-2 sm:pr-4">
          I design how people experience and engage. Turning attention into interaction and impact.
        </p>
      </div>
      <svg className="absolute -right-[6%] -bottom-[8%] w-[58%] h-[100%] hidden sm:block" viewBox="0 0 300 260" preserveAspectRatio="xMidYMid meet">
        <SvgGrainFilter id="sg-audience" />
        <g filter="url(#sg-audience)">
        {[
          [150,20,85,80],[150,20,220,60],[85,80,30,130],[85,80,150,110],[85,80,220,60],
          [220,60,275,110],[220,60,150,110],[30,130,110,160],[150,110,110,160],
          [150,110,220,160],[275,110,220,160],[275,110,290,160],[110,160,220,160],
          [220,160,255,225],[110,160,160,215],[160,215,220,160],
        ].map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        ))}
        {[[150,20],[85,80],[220,60],[30,130],[150,110],[275,110],[110,160],[220,160],[290,160],[255,225],[160,215]].map(([cx,cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={5} fill={C.accent} />
        ))}
        </g>
      </svg>
    </div>
  );
}

export function FrameworksCard() {
  return (
    <div className={CARD}>
      <GrainOverlay />
      <div className="flex flex-col justify-between w-full sm:w-[48%] z-10 overflow-hidden">
        <div>
          <span className="text-micro font-normal text-neutral-400">02 / Build</span>
          <h2 className="text-[clamp(12px,4vw,48px)] font-normal uppercase tracking-tight leading-none mt-2 sm:mt-4">Frameworks</h2>
          <p className="text-[10px] sm:text-base text-neutral-400 font-normal mt-1 sm:mt-2">Strategic structures</p>
        </div>
        <p className="text-[9px] sm:text-base font-normal tracking-tight leading-snug sm:leading-relaxed text-neutral-500 dark:text-neutral-400 pr-2 sm:pr-4">
          I build <strong className="text-black dark:text-white font-normal">strategic structures</strong> that define direction and focus. Turning complexity into clarity.
        </p>
      </div>
      <svg className="absolute -right-[8%] -bottom-[10%] w-[55%] h-[100%] hidden sm:block" viewBox="0 0 260 260" preserveAspectRatio="xMidYMid meet">
        <SvgGrainFilter id="sg-frameworks" />
        <g filter="url(#sg-frameworks)">
        <circle cx="130" cy="130" r="125" fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx="130" cy="130" r="90" fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx="130" cy="130" r="55" fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx="130" cy="130" r="20" fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx="130" cy="130" r="4" fill={C.accent} />
        </g>
      </svg>
    </div>
  );
}

export function BrandWorldsCard() {
  return (
    <div className={CARD}>
      <GrainOverlay />
      <div className="flex flex-col justify-between w-full sm:w-[48%] z-10 overflow-hidden">
        <div>
          <span className="text-micro font-normal text-neutral-400">02 / Build</span>
          <h2 className="text-[clamp(12px,4vw,48px)] font-normal uppercase tracking-tight leading-none mt-2 sm:mt-4">Brand Worlds</h2>
          <p className="text-[10px] sm:text-base text-neutral-400 font-normal mt-1 sm:mt-2">Immersive ecosystems</p>
        </div>
        <p className="text-[9px] sm:text-base font-normal tracking-tight leading-snug sm:leading-relaxed text-neutral-500 dark:text-neutral-400 pr-2 sm:pr-4">
          I create <strong className="text-black dark:text-white font-normal">immersive brand ecosystems</strong> that build meaning and recognition across every touchpoint.
        </p>
      </div>
      <svg className="absolute -right-[4%] -bottom-[4%] w-[52%] h-[92%] hidden sm:block" viewBox="0 0 280 260" preserveAspectRatio="xMidYMid meet">
        <SvgGrainFilter id="sg-brandworlds" />
        <g filter="url(#sg-brandworlds)">
        <circle cx="140" cy="130" r="120" fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx="95" cy="130" r="75" fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx="185" cy="130" r="75" fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <ellipse cx="140" cy="130" rx="28" ry="50" fill={C.accent} fillOpacity="0.8" />
        </g>
      </svg>
    </div>
  );
}

export function SystemsCard() {
  return (
    <div className={CARD}>
      <GrainOverlay />
      <div className="flex flex-col justify-between w-full sm:w-[48%] z-10 overflow-hidden">
        <div>
          <span className="text-micro font-normal text-neutral-400">02 / Build</span>
          <h2 className="text-[clamp(12px,4vw,48px)] font-normal uppercase tracking-tight leading-none mt-2 sm:mt-4">Systems</h2>
          <p className="text-[10px] sm:text-base text-neutral-400 font-normal mt-1 sm:mt-2">Scalable architecture</p>
        </div>
        <p className="text-[9px] sm:text-base font-normal tracking-tight leading-snug sm:leading-relaxed text-neutral-500 dark:text-neutral-400 pr-2 sm:pr-4">
          I design <strong className="text-black dark:text-white font-normal">scalable brand systems</strong> that ensure consistency, recognition and growth.
        </p>
      </div>
      <div className="absolute -right-[5%] -bottom-[8%] grid grid-cols-5" style={{ gap: "3%", width: "52%" }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square rounded ${i === 12 ? "bg-black/80" : "border border-neutral-400/50 dark:border-neutral-600/50"}`}
            style={{ borderStyle: i === 12 ? "none" : "dashed" }}
          />
        ))}
      </div>
    </div>
  );
}

export function FunnelsCard() {
  return (
    <div className={CARD}>
      <GrainOverlay />
      <div className="flex flex-col justify-between w-full sm:w-[48%] z-10 overflow-hidden">
        <div>
          <span className="text-micro font-normal text-neutral-400">02 / Build</span>
          <h2 className="text-[clamp(12px,4vw,48px)] font-normal uppercase tracking-tight leading-none mt-2 sm:mt-4">Funnels</h2>
          <p className="text-[10px] sm:text-base text-neutral-400 font-normal mt-1 sm:mt-2">Conversion journeys</p>
        </div>
        <p className="text-[9px] sm:text-base font-normal tracking-tight leading-snug sm:leading-relaxed text-neutral-500 dark:text-neutral-400 pr-2 sm:pr-4">
          I architect <strong className="text-black dark:text-white font-normal">conversion journeys</strong> that turn attention into action and loyalty.
        </p>
      </div>
      <svg className="absolute right-[8%] bottom-[5%] w-[35%] h-[75%] hidden sm:block" viewBox="0 0 240 280" preserveAspectRatio="xMidYMid meet">
        <SvgGrainFilter id="sg-funnels" />
        <g filter="url(#sg-funnels)">
        <polygon points="20,0 220,0 170,160 70,160" fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <polygon points="70,160 170,160 145,260 95,260" fill={C.accent} fillOpacity="0.8" />
        <line x1="120" y1="165" x2="120" y2="278" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <polygon points="116,276 120,282 124,276" fill={C.accent} />
        </g>
      </svg>
    </div>
  );
}

export function WorkflowsCard() {
  return (
    <div className={CARD}>
      <GrainOverlay />
      <div className="flex flex-col justify-between w-full sm:w-[48%] z-10 overflow-hidden">
        <div>
          <span className="text-micro font-normal text-neutral-400">02 / Build</span>
          <h2 className="text-[clamp(12px,4vw,48px)] font-normal uppercase tracking-tight leading-none mt-2 sm:mt-4">Workflows</h2>
          <p className="text-[10px] sm:text-base text-neutral-400 font-normal mt-1 sm:mt-2">Optimized processes</p>
        </div>
        <p className="text-[9px] sm:text-base font-normal tracking-tight leading-snug sm:leading-relaxed text-neutral-500 dark:text-neutral-400 pr-2 sm:pr-4">
          I build <strong className="text-black dark:text-white font-normal">optimized processes</strong> that connect, execute and scale across teams.
        </p>
      </div>
      <svg className="absolute -right-[8%] top-1/2 -translate-y-1/2 w-[55%] hidden sm:block" viewBox="0 0 250 60" preserveAspectRatio="xMidYMid meet">
        <SvgGrainFilter id="sg-workflows" />
        <g filter="url(#sg-workflows)">
        <circle cx="30" cy="30" r="22" fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <line x1="53" y1="30" x2="88" y2="30" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <polygon points="86,27 91,30 86,33" fill={C.accent} />
        <circle cx="120" cy="30" r="22" fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <line x1="143" y1="30" x2="178" y2="30" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <polygon points="176,27 181,30 176,33" fill={C.accent} />
        <circle cx="230" cy="30" r="30" fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        </g>
      </svg>
    </div>
  );
}

export function ContentCard() {
  return (
    <div className={CARD}>
      <GrainOverlay />
      <div className="flex flex-col justify-between w-full sm:w-[48%] z-10 overflow-hidden">
        <div>
          <span className="text-micro font-normal text-neutral-400">03 / Scale</span>
          <h2 className="text-[clamp(12px,4vw,48px)] font-normal uppercase tracking-tight leading-none mt-2 sm:mt-4">Content</h2>
          <p className="text-[10px] sm:text-base text-neutral-400 font-normal mt-1 sm:mt-2">Creative output</p>
        </div>
        <p className="text-[9px] sm:text-base font-normal tracking-tight leading-snug sm:leading-relaxed text-neutral-500 dark:text-neutral-400 pr-2 sm:pr-4">
          I produce <strong className="text-black dark:text-white font-normal">content that performs</strong> across channels. Built to engage, convert and scale.
        </p>
      </div>
      <svg className="absolute -right-[6%] -bottom-[6%] w-[58%] h-[100%] hidden sm:block" viewBox="0 0 300 280" preserveAspectRatio="xMidYMid meet">
        <SvgGrainFilter id="sg-content" />
        <g filter="url(#sg-content)">
        {/* 4:5 portrait card */}
        <rect x="10" y="5" width="80" height="100" rx="3" fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx="30" cy="35" r="8" fill={C.accent} />
        <line x1="45" y1="28" x2="78" y2="28" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <line x1="45" y1="36" x2="78" y2="36" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <line x1="45" y1="44" x2="68" y2="44" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <rect x="18" y="58" width="64" height="38" rx="2" fill={C.accent} fillOpacity="0.15" />

        {/* 1:1 square card */}
        <rect x="110" y="30" width="100" height="100" rx="3" fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx="135" cy="60" r="8" fill={C.accent} />
        <line x1="150" y1="53" x2="198" y2="53" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <line x1="150" y1="61" x2="198" y2="61" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <line x1="150" y1="69" x2="185" y2="69" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <rect x="118" y="85" width="84" height="36" rx="2" fill={C.accent} fillOpacity="0.15" />

        {/* 16:9 landscape card */}
        <rect x="30" y="155" width="240" height="110" rx="3" fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx="65" cy="190" r="10" fill={C.accent} />
        <line x1="85" y1="180" x2="245" y2="180" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <line x1="85" y1="190" x2="245" y2="190" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <line x1="85" y1="200" x2="200" y2="200" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <rect x="40" y="218" width="220" height="36" rx="2" fill={C.accent} fillOpacity="0.15" />
        </g>
      </svg>
    </div>
  );
}

export function PerformanceCard() {
  return (
    <div className={CARD}>
      <GrainOverlay />
      <div className="flex flex-col justify-between w-full sm:w-[48%] z-10 overflow-hidden">
        <div>
          <span className="text-micro font-normal text-neutral-400">03 / Scale</span>
          <h2 className="text-[clamp(12px,4vw,48px)] font-normal uppercase tracking-tight leading-none mt-2 sm:mt-4">Performance</h2>
          <p className="text-[10px] sm:text-base text-neutral-400 font-normal mt-1 sm:mt-2">Data-driven results</p>
        </div>
        <p className="text-[9px] sm:text-base font-normal tracking-tight leading-snug sm:leading-relaxed text-neutral-500 dark:text-neutral-400 pr-2 sm:pr-4">
          I measure and optimize for <strong className="text-black dark:text-white font-normal">real business impact</strong>. Turning data into decisions.
        </p>
      </div>
      <svg className="absolute -right-[8%] -bottom-[8%] w-[55%] h-[100%] hidden sm:block" viewBox="0 0 260 240" preserveAspectRatio="xMidYMid meet">
        <SvgGrainFilter id="sg-performance" />
        <g filter="url(#sg-performance)">
        <line x1="30" y1="220" x2="250" y2="220" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <line x1="30" y1="220" x2="30" y2="20" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <rect x="55" y="170" width="22" height="50" fill={C.accent} fillOpacity="0.8" />
        <rect x="95" y="140" width="22" height="80" fill={C.accent} fillOpacity="0.8" />
        <rect x="135" y="100" width="22" height="120" fill={C.accent} fillOpacity="0.8" />
        <rect x="175" y="60" width="22" height="160" fill={C.accent} fillOpacity="0.8" />
        <rect x="215" y="35" width="22" height="185" fill={C.accent} fillOpacity="0.8" />
        <path d="M 66,145 Q 130,80 226,15" fill="none" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <polygon points="224,10 230,15 224,20" fill={C.accent} />
        </g>
      </svg>
    </div>
  );
}

export function GrowthCard() {
  return (
    <div className={CARD}>
      <GrainOverlay />
      <div className="flex flex-col justify-between w-full sm:w-[48%] z-10 overflow-hidden">
        <div>
          <span className="text-micro font-normal text-neutral-400">03 / Scale</span>
          <h2 className="text-[clamp(12px,4vw,48px)] font-normal uppercase tracking-tight leading-none mt-2 sm:mt-4">Growth</h2>
          <p className="text-[10px] sm:text-base text-neutral-400 font-normal mt-1 sm:mt-2">Compounding momentum</p>
        </div>
        <p className="text-[9px] sm:text-base font-normal tracking-tight leading-snug sm:leading-relaxed text-neutral-500 dark:text-neutral-400 pr-2 sm:pr-4">
          I build systems that <strong className="text-black dark:text-white font-normal">compound over time</strong>. Scaling reach, relevance and revenue.
        </p>
      </div>
      <svg className="absolute -right-[6%] -bottom-[10%] w-[55%] h-[105%] hidden sm:block" viewBox="0 0 260 240" preserveAspectRatio="xMidYMid meet">
        <SvgGrainFilter id="sg-growth" />
        <g filter="url(#sg-growth)">
        <circle cx="30" cy="200" r="5" fill={C.accent} />
        <line x1="35" y1="197" x2="68" y2="180" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx="75" cy="177" r="5" fill={C.accent} />
        <line x1="80" y1="174" x2="108" y2="155" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx="115" cy="152" r="5" fill={C.accent} />
        <line x1="120" y1="148" x2="148" y2="120" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx="155" cy="117" r="5" fill={C.accent} />
        <line x1="160" y1="112" x2="188" y2="72" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <circle cx="195" cy="69" r="5" fill={C.accent} />
        <line x1="200" y1="62" x2="226" y2="28" stroke={C.light} strokeWidth={S} strokeDasharray={D} />
        <polygon points="224,23 232,28 224,33" fill={C.accent} />
        </g>
      </svg>
    </div>
  );
}
