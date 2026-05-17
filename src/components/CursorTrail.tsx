import { useRef, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

interface CursorTrailProps {
  images: ReactNode[];
  size?: number;
}

export function CursorTrail({ images, size = 960 }: CursorTrailProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [restScale, setRestScale] = useState(1);
  const idx = useRef(0);
  const h = Math.round(size * 9 / 16);

  useEffect(() => {
    if (images.length === 0) {
      setCurrentIndex(null);
      return;
    }
    setCurrentIndex(idx.current % images.length);
    setRestScale(idx.current % 2 === 0 ? 1 : 0.9);
    idx.current++;
  }, [images]);

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
      <AnimatePresence mode="wait">
        {currentIndex !== null && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 1, scale: restScale === 1 ? 0.9 : 1 }}
            animate={{ opacity: 1, scale: restScale }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute overflow-hidden"
            style={{
              width: `min(${size}px, 75vw)`,
              height: `min(${h}px, calc(75vw * 9 / 16))`,
            }}
          >
            {images[currentIndex]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
