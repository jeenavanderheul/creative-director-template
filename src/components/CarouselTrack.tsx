import { CarouselCard } from "./CarouselCard";
import type { CinematicSlide } from "./CinematicCarousel";

interface CarouselTrackProps {
  slides: CinematicSlide[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

function signedOffset(index: number, active: number, total: number): number {
  const raw = index - active;
  const half = total / 2;
  if (raw > half) return raw - total;
  if (raw < -half) return raw + total;
  return raw;
}

export function CarouselTrack({ slides, activeIndex, onSelect }: CarouselTrackProps) {
  return (
    <div
      className="relative w-full h-full"
      style={{ perspective: "1600px", perspectiveOrigin: "center center" }}
    >
      {slides.map((slide, i) => (
        <CarouselCard
          key={i}
          slide={slide}
          offset={signedOffset(i, activeIndex, slides.length)}
          onSelect={() => onSelect(i)}
        />
      ))}
    </div>
  );
}
