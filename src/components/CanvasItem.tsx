import { Play } from "lucide-react";
import { CornerBrackets } from "./CornerBracket";

export interface CanvasItemProps {
  id: string;
  type: "photo" | "video";
  src: string;
  videoId?: string;
  videoHash?: string;
  title?: string;
  caption?: string;
  xPct: number;
  yPct: number;
  widthVw: number;
  mobileWidthVw?: number; // data-only: read by PlayPage, ignored here
  aspectRatio?: string;
  z?: number;
  onOpen?: (item: {
    type: "photo" | "video";
    src: string;
    videoId?: string;
    videoHash?: string;
    title?: string;
    caption?: string;
  }) => void;
}

export function CanvasItem({
  type,
  src,
  videoId,
  videoHash,
  title,
  caption,
  xPct,
  yPct,
  widthVw,
  aspectRatio = "3/4",
  z = 1,
  onOpen,
}: CanvasItemProps) {
  const handleOpen = () => {
    onOpen?.({ type, src, videoId, videoHash, title, caption });
  };

  return (
    <div
      className="absolute group"
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        width: `${widthVw}vw`,
        transform: "translate(-50%, -50%)",
        zIndex: z,
        pointerEvents: "auto",
      }}
    >
      <div className="relative w-full" style={{ aspectRatio }}>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="relative block w-full h-full overflow-hidden cursor-pointer transition-transform duration-300 ease-out group-hover:scale-[1.03] group-hover:-translate-y-1 active:scale-[0.98]"
          aria-label={`Open ${title ?? "item"}`}
        >
          <img
            src={src}
            alt={title ?? ""}
            className="absolute inset-0 w-full h-full object-cover grayscale transition-[filter,opacity,transform] duration-500 group-hover:grayscale-0 group-hover:opacity-90 group-active:grayscale-0"
            draggable={false}
          />
          {type === "video" && videoId && (
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/90 group-hover:bg-white group-active:bg-white transition-colors">
                <Play className="w-4 h-4 md:w-5 md:h-5 text-black translate-x-[1px]" fill="currentColor" />
              </span>
            </span>
          )}
        </button>
        <CornerBrackets outside offset={3} />
      </div>

      {(title || caption) && (
        <div className="mt-2 font-mono text-[9px] leading-tight uppercase tracking-wider text-neutral-600 dark:text-neutral-400 pointer-events-none">
          {title && <div className="text-black dark:text-white">{title}</div>}
          {caption && <div className="text-neutral-500 mt-0.5">{caption}</div>}
        </div>
      )}
    </div>
  );
}
