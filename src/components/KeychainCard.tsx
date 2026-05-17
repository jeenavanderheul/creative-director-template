import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
} from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import MaximilianPhoto from "../Maximilian.webp";

export function KeychainCard({
  cordHeight,
  scale = 1,
}: {
  cordHeight?: string;
  scale?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const { isDark } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cordRef = useRef<HTMLDivElement>(null);
  const cordBaseHeight = useRef(0);
  const [cordMeasured, setCordMeasured] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Measure cord base height for elastic calculations
  useEffect(() => {
    if (cordRef.current) {
      cordBaseHeight.current = cordRef.current.offsetHeight;
      setCordMeasured(true);
    }
  }, []);

  // ── Scroll ──
  const { scrollY, scrollYProgress } = useScroll();

  // Scroll-driven swing
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const swingRotate = useTransform(smoothVelocity, [-3000, 0, 3000], [-5, 0, 5]);

  // (scroll drop removed)

  // Mouse push — physical push effect (desktop only)
  const mousePush = useMotionValue(0);
  const smoothMousePush = useSpring(mousePush, { damping: 12, stiffness: 120 });

  // Combine scroll swing + mouse push + slight crookedness
  const combinedRotate = useTransform(
    [swingRotate, smoothMousePush],
    ([s, m]: number[]) => (s as number) + (m as number) + 1.5
  );

  // ── 3D card tilt from mouse ──
  const cardTiltX = useMotionValue(0);
  const cardTiltY = useMotionValue(0);
  const smoothTiltX = useSpring(cardTiltX, { damping: 20, stiffness: 150 });
  const smoothTiltY = useSpring(cardTiltY, { damping: 20, stiffness: 150 });

  // Lenticular parallax offsets (desktop only)
  const parallaxBgX = useTransform(smoothTiltY, (v: number) => v * -0.4);
  const parallaxBgY = useTransform(smoothTiltX, (v: number) => v * 0.4);
  const parallaxFgX = useTransform(smoothTiltY, (v: number) => v * 0.6);
  const parallaxFgY = useTransform(smoothTiltX, (v: number) => v * -0.6);

  // ── Catapult interaction ──
  const dragY = useMotionValue(0);
  const springDragY = useSpring(dragY, { damping: 10, stiffness: 120 });
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);

  // Elastic cord: height responds to spring (no clamp — allows overshoot)
  const elasticHeight = useTransform(springDragY, (v: number) => {
    const base = cordBaseHeight.current || 160;
    return Math.max(40, base + v);
  });


  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile || !wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const normalized = (e.clientX - centerX) / (rect.width / 2);
      const clamped = Math.max(-1, Math.min(1, normalized));
      mousePush.set(clamped * 8);

      if (cardRef.current && !isDraggingRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const cx = cardRect.left + cardRect.width / 2;
        const cy = cardRect.top + cardRect.height / 2;
        const nx = (e.clientX - cx) / (cardRect.width / 2);
        const ny = (e.clientY - cy) / (cardRect.height / 2);
        cardTiltY.set(Math.max(-1, Math.min(1, nx)) * 15);
        cardTiltX.set(Math.max(-1, Math.min(1, -ny)) * 10);
      }
    },
    [isMobile, mousePush, cardTiltX, cardTiltY]
  );

  const handleMouseLeave = useCallback(() => {
    mousePush.set(0);
    cardTiltX.set(0);
    cardTiltY.set(0);
  }, [mousePush, cardTiltX, cardTiltY]);

  const handleCardMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) return;
      e.preventDefault();
      isDraggingRef.current = true;
      dragStartYRef.current = e.clientY;
    },
    [isMobile]
  );

  useEffect(() => {
    if (isMobile) return;
    const handleMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const delta = Math.max(0, Math.min(150, e.clientY - dragStartYRef.current));
      dragY.set(delta);
    };
    const handleUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      dragY.set(0);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, [isMobile, dragY]);

  // Scroll-driven light reflection
  const lightX = useTransform(scrollYProgress, [0, 1], ["-120%", "220%"]);

  return (
    <motion.div
      ref={wrapperRef}
      className="flex flex-col items-center relative"
      style={{
        scale: scale,
        transformOrigin: "top center",
        overflow: "visible",
      }}
      initial={isMobile ? { opacity: 0, y: -40 } : undefined}
      animate={isMobile ? { opacity: 1, y: 0 } : undefined}
      transition={isMobile ? { duration: 0.6, ease: "easeOut" } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cord extension — always runs off-screen above, at wrapper level */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: "50%",
          transform: "translateX(-50%) translateY(-100%)",
          width: "14px",
          height: "300vh",
          background: "#dc5a0c",
          boxShadow:
            "inset 2px 0 0 rgba(255,255,255,0.08), inset -2px 0 0 rgba(0,0,0,0.15)",
        }}
      />

      {/* Elastic lanyard cord — single element, stretches/compresses with catapult */}
      <motion.div
        ref={cordRef}
        className="relative"
        style={{
          width: "14px",
          height: (isMobile || !cordMeasured) ? (cordHeight || "clamp(120px, 15vh, 200px)") : elasticHeight,
          background: "#dc5a0c",
          boxShadow:
            "0 0 8px rgba(234,88,12,0.2), inset 2px 0 0 rgba(255,255,255,0.08), inset -2px 0 0 rgba(0,0,0,0.15)",
        }}
      >
        {/* Strap edge stitching left */}
        <div
          className="absolute left-[2px] top-0 bottom-0 w-px"
          style={{ background: "rgba(255,200,150,0.12)" }}
        />
        {/* Strap edge stitching right */}
        <div
          className="absolute right-[2px] top-0 bottom-0 w-px"
          style={{ background: "rgba(255,200,150,0.12)" }}
        />
      </motion.div>

      {/* Swing pivot — scroll drop + swing + mouse push + catapult Y */}
      <motion.div
        style={isMobile ? undefined : { rotateZ: combinedRotate }}
        className={`flex flex-col items-center origin-top ${isMobile ? "animate-gentle-swing" : ""}`}
      >
        {/* ── Chrome Snap Hook Clasp + Swivel + Ring — one SVG, zero gaps ── */}
        <div className="relative flex flex-col items-center" style={{ marginTop: -8 }}>
          <svg width="50" height="130" viewBox="0 0 50 130" style={{ display: "block" }}>
            <defs>
              <linearGradient id={`kcSilv${uid}`} x1="0" y1="0" x2="50" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#a0a0a0" />
                <stop offset="30%" stopColor="#c8c8c8" />
                <stop offset="50%" stopColor="#d8d8d8" />
                <stop offset="70%" stopColor="#c8c8c8" />
                <stop offset="100%" stopColor="#a0a0a0" />
              </linearGradient>
            </defs>
            <path d="M6,50 L6,22 Q6,0 25,0 Q44,0 44,22 L44,50 L50,50 L50,70 Q50,72 48,72 L2,72 Q0,72 0,70 L0,50 Z" fill={`url(#kcSilv${uid})`} />
            <circle cx="12" cy="60" r="2" fill="#b0b0b0" />
            <circle cx="38" cy="60" r="2" fill="#b0b0b0" />
            <rect x="14" y="72" width="22" height="8" rx="2" fill={`url(#kcSilv${uid})`} />
            <rect x="18" y="80" width="14" height="1" fill="rgba(0,0,0,0.04)" />
            <rect x="16" y="81" width="18" height="7" rx="2" fill={`url(#kcSilv${uid})`} />
            <circle cx="25" cy="100" r="10" fill="none" stroke={`url(#kcSilv${uid})`} strokeWidth="5" />
            <path d="M16,50 L16,24 Q16,10 25,10 Q34,10 34,24 L34,50 Z" fill={isDark ? "#0a0a0a" : "white"} />
          </svg>

          {/* Layer 2: 3D Glass ID Card */}
          <div style={{ perspective: 800, marginTop: -28, zIndex: 1 }}>
            <motion.div
              ref={cardRef}
              className="relative"
              style={{
                transformStyle: "preserve-3d",
                rotateX: isMobile ? 0 : smoothTiltX,
                rotateY: isMobile ? 0 : smoothTiltY,
                width: "clamp(160px, 14vw, 210px)",
                aspectRatio: "3 / 4.2",
                cursor: isMobile ? undefined : "grab",
              }}
              onMouseDown={handleCardMouseDown}
            >
              {/* ── Front face ── */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  transform: "translateZ(2px)",
                  backfaceVisibility: "hidden",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(155deg, rgba(220,220,220,0.3) 0%, rgba(240,240,240,0.2) 25%, rgba(200,200,200,0.15) 50%, rgba(230,230,230,0.2) 75%, rgba(210,210,210,0.25) 100%)",
                  backdropFilter: "blur(32px)",
                  WebkitBackdropFilter: "blur(32px)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: `
                    0 15px 40px rgba(0,0,0,0.12),
                    0 4px 12px rgba(0,0,0,0.08),
                    inset 0 1px 0 rgba(255,255,255,0.4),
                    inset 0 -1px 0 rgba(0,0,0,0.04)
                  `,
                  maskImage:
                    "radial-gradient(ellipse 10px 6px at 50% 5px, transparent 98%, black 100%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 10px 6px at 50% 5px, transparent 98%, black 100%)",
                }}
              >
                {/* Punch hole shadow */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
                  style={{
                    top: "-1px",
                    width: "22px",
                    height: "14px",
                    boxShadow: "inset 0 1px 5px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(0,0,0,0.3)",
                  }}
                />

                {!isDark ? (
                  /* Light theme: video.svg — single centered video, no parallax */
                  <div
                    className="group absolute overflow-hidden rounded-lg bg-black"
                    style={{ top: 0, left: 0, right: 0, bottom: 0 }}
                  >
                    <video
                      src="/placeholders/video.svg"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      aria-label="Maximilian video portrait"
                      className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-500 [filter:grayscale(1)_contrast(1.06)_brightness(0.95)_saturate(0.92)] group-hover:[filter:grayscale(0)_contrast(1.06)_brightness(0.95)_saturate(0.92)]"
                      style={{ objectPosition: "center center" }}
                    />
                  </div>
                ) : (
                  /* Dark theme: video.svg — single centered video, no parallax */
                  <div
                    className="group absolute overflow-hidden rounded-lg bg-black"
                    style={{ top: 0, left: 0, right: 0, bottom: 0 }}
                  >
                    <video
                      src="/placeholders/video.svg"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      aria-label="Maximilian video portrait"
                      className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-500 [filter:grayscale(1)_contrast(1.06)_brightness(0.95)_saturate(0.92)] group-hover:[filter:grayscale(0)_contrast(1.06)_brightness(0.95)_saturate(0.92)]"
                      style={{ objectPosition: "center center" }}
                    />
                  </div>
                )}

                {/* Glass edge bevel */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: "14px",
                    border: "3px solid transparent",
                    borderImage: "linear-gradient(145deg, rgba(220,245,240,0.25) 0%, rgba(180,230,220,0.12) 25%, rgba(140,200,190,0.06) 50%, rgba(100,160,150,0.1) 75%, rgba(160,215,205,0.15) 100%) 1",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMaskComposite: "xor",
                  }}
                />
                {/* Glass edge inner highlight */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: "14px",
                    boxShadow: `
                      inset 2px 2px 0 rgba(255,255,255,0.12),
                      inset -2px -2px 0 rgba(0,0,0,0.08),
                      inset 3px 3px 6px rgba(200,240,235,0.06),
                      inset -3px -3px 6px rgba(0,0,0,0.06)
                    `,
                  }}
                />

                {/* Prismatic rainbow band 1 */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: "15%",
                    left: "-10%",
                    width: "70%",
                    height: "35%",
                    background:
                      "linear-gradient(115deg, transparent 10%, rgba(255,60,60,0.05) 20%, rgba(255,160,40,0.05) 30%, rgba(255,240,60,0.05) 40%, rgba(60,220,100,0.05) 50%, rgba(60,180,255,0.06) 60%, rgba(140,80,255,0.05) 70%, transparent 80%)",
                    transform: "rotate(-20deg)",
                    filter: "blur(8px)",
                    borderRadius: "50%",
                  }}
                />
                {/* Prismatic rainbow band 2 */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    bottom: "10%",
                    right: "-15%",
                    width: "60%",
                    height: "30%",
                    background:
                      "linear-gradient(115deg, transparent 15%, rgba(140,80,255,0.03) 25%, rgba(60,180,255,0.04) 35%, rgba(60,220,100,0.03) 45%, rgba(255,240,60,0.03) 55%, rgba(255,160,40,0.03) 65%, rgba(255,60,60,0.03) 75%, transparent 85%)",
                    transform: "rotate(155deg)",
                    filter: "blur(10px)",
                    borderRadius: "50%",
                  }}
                />

                {/* Etched typography */}
                <div
                  className="absolute left-3 right-3"
                  style={{ bottom: "14px" }}
                >
                  <p
                    className="font-light leading-none"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.2em",
                      color: "rgba(255,255,255,0.9)",
                      textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                    }}
                  >
                    Storm
                  </p>
                  <p
                    className="font-light leading-none mt-[2px]"
                    style={{
                      fontSize: "8px",
                      letterSpacing: "0.16em",
                      color: "rgba(255,255,255,0.7)",
                      textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                    }}
                  >
                    Future Bureau
                  </p>
                </div>

                {/* Scrolling light reflection */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    x: lightX,
                    background: `
                      linear-gradient(105deg, transparent 0%, rgba(255,100,100,0.03) 40%, rgba(255,200,100,0.03) 44%, rgba(255,255,255,0.12) 48%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.12) 52%, rgba(100,200,255,0.03) 56%, rgba(130,100,255,0.03) 60%, transparent 100%)
                    `,
                    width: "60%",
                    top: "-10%",
                    bottom: "-10%",
                  }}
                />

                {/* Glass edge highlight */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: "14px",
                    background:
                      "linear-gradient(140deg, rgba(255,255,255,0.1) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.04) 100%)",
                  }}
                />

                {/* Inner glass depth glow */}
                <div
                  className="absolute inset-px pointer-events-none"
                  style={{
                    borderRadius: "13px",
                    boxShadow: `
                      inset 0 0 30px rgba(255,255,255,0.03),
                      inset 0 0 60px rgba(160,220,215,0.025),
                      inset 0 0 15px rgba(200,240,235,0.02)
                    `,
                  }}
                />
              </div>

              {/* ── Back face ── */}
              <div
                className="absolute inset-0"
                style={{
                  borderRadius: "14px",
                  transform: "rotateY(180deg) translateZ(2px)",
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(155deg, rgba(15,25,22,0.92), rgba(8,14,12,0.96))",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "inset 0 0 30px rgba(0,0,0,0.3), inset 0 0 60px rgba(0,0,0,0.15)",
                }}
              />

              {/* ── Glass edges (4px depth) ── */}
              {/* Left edge */}
              <div
                className="absolute top-0 h-full"
                style={{
                  left: -2,
                  width: 4,
                  background: "linear-gradient(180deg, rgba(180,230,220,0.3), rgba(140,200,190,0.15), rgba(180,230,220,0.25))",
                  transform: "rotateY(-90deg)",
                }}
              />
              {/* Right edge */}
              <div
                className="absolute top-0 h-full"
                style={{
                  right: -2,
                  width: 4,
                  background: "linear-gradient(180deg, rgba(140,200,190,0.2), rgba(160,210,200,0.12), rgba(140,200,190,0.18))",
                  transform: "rotateY(90deg)",
                }}
              />
              {/* Top edge */}
              <div
                className="absolute left-0 w-full"
                style={{
                  top: -2,
                  height: 4,
                  background: "linear-gradient(90deg, rgba(180,230,220,0.25), rgba(200,240,235,0.3), rgba(180,230,220,0.25))",
                  transform: "rotateX(90deg)",
                }}
              />
              {/* Bottom edge */}
              <div
                className="absolute left-0 w-full"
                style={{
                  bottom: -2,
                  height: 4,
                  background: "linear-gradient(90deg, rgba(140,200,190,0.18), rgba(160,210,200,0.22), rgba(140,200,190,0.18))",
                  transform: "rotateX(-90deg)",
                }}
              />
            </motion.div>
          </div>

          {/* Layer 3: Ring top-half OVERLAY — sits ON TOP of card surface */}
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            className="pointer-events-none"
            style={{
              position: "absolute",
              top: -3,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2,
              clipPath: "inset(0 0 22px 0)",
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
            }}
          >
            <circle cx="17" cy="17" r="11" fill="none" stroke="#C0C0C0" strokeWidth="5" />
            <circle cx="17" cy="17" r="11" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="14 20" strokeDashoffset="-4" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}
