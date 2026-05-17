import { motion } from "motion/react";
import type { CinematicSlide } from "./CinematicCarousel";
import { EASE_SNAPPY, DUR_SLOW } from "../lib/motion";

interface CarouselCardProps {
  slide: CinematicSlide;
  offset: number;
  onSelect: () => void;
}

const TRANSITION = { duration: DUR_SLOW, ease: EASE_SNAPPY };

function transformFor(offset: number) {
  const abs = Math.abs(offset);
  const dir = Math.sign(offset);

  // Coverflow-style: active card faces camera, neighbours tilt inward
  // and recede on Z for genuine 3D depth.
  if (abs === 0) {
    return { scale: 1, rotateY: 0, rotateX: 0, z: 0, opacity: 1, x: "0%" };
  }
  if (abs === 1) {
    return { scale: 0.62, rotateY: -dir * 28, rotateX: 0, z: -120, opacity: 0.7, x: `${dir * 30}%` };
  }
  if (abs === 2) {
    return { scale: 0.42, rotateY: -dir * 42, rotateX: 0, z: -260, opacity: 0.2, x: `${dir * 50}%` };
  }
  return { scale: 0.3, rotateY: -dir * 50, rotateX: 0, z: -360, opacity: 0, x: `${dir * 70}%` };
}

export function CarouselCard({ slide, offset, onSelect }: CarouselCardProps) {
  const t = transformFor(offset);
  const abs = Math.abs(offset);
  const isActive = abs === 0;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      animate={{
        scale: t.scale,
        rotateY: t.rotateY,
        rotateX: t.rotateX,
        x: t.x,
        opacity: t.opacity,
        translateZ: t.z,
      }}
      whileHover={!isActive ? { y: -4, scale: t.scale * 1.03 } : undefined}
      transition={TRANSITION}
      style={{
        zIndex: abs === 0 ? 50 : 10 - abs,
        transformStyle: "preserve-3d",
        pointerEvents: abs > 2 ? "none" : "auto",
        willChange: abs <= 2 ? "transform, opacity" : "auto",
      }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] md:w-[55vw] lg:w-[45vw] aspect-[16/9] cursor-pointer focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
    >
      <div
        className="relative w-full h-full overflow-hidden rounded-[18px] bg-white dark:bg-black transition-[filter] duration-500 ease-out"
        style={{ filter: isActive ? "grayscale(0)" : "grayscale(1)" }}
      >
        {slide.type === "video" ? (
          <video
            src={slide.src}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : slide.type === "embed" ? (
          /vimeo\.com|youtube\.com|youtu\.be/.test(slide.src) ? (
            <iframe
              src={slide.src}
              title={slide.title ?? "Embedded video"}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 h-full w-full pointer-events-none"
              style={{ border: 0 }}
            />
          ) : (
            <iframe
              src={slide.src}
              title={slide.title ?? "Embedded slide"}
              allow="autoplay; fullscreen"
              allowFullScreen
              className="absolute"
              style={{ border: 0, top: "-5%", left: "-5%", width: "110%", height: "122%" }}
            />
          )
        ) : (
          <img
            src={slide.src}
            alt={slide.title ?? ""}
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            style={{ objectPosition: slide.objectPosition ?? "center" }}
          />
        )}

        {(slide.title || slide.subtitle) && (
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
            {slide.subtitle && (
              <span className="block text-nano font-mono uppercase tracking-widest text-white/70 mb-2">
                {slide.subtitle}
              </span>
            )}
            {slide.title && (
              <h3 className="text-lg sm:text-2xl font-normal tracking-tight text-white">
                {slide.title}
              </h3>
            )}
          </div>
        )}
      </div>
    </motion.button>
  );
}
