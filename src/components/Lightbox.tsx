import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";
import { EASE_GENTLE, DUR_FAST } from "../lib/motion";

interface LightboxItem {
  type: "photo" | "video";
  src: string;
  videoId?: string;
  videoHash?: string;
  title?: string;
  caption?: string;
}

interface LightboxProps {
  item: LightboxItem | null;
  onClose: () => void;
}

export function Lightbox({ item, onClose }: LightboxProps) {
  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR_FAST }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6 md:p-12"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-6 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_GENTLE }}
            className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {item.type === "video" && item.videoId ? (
              <div className="w-[min(90vw,1600px)] aspect-video">
                <VideoPlayer videoId={item.videoId} videoHash={item.videoHash} title={item.title ?? "video"} />
              </div>
            ) : (
              <img
                src={item.src}
                alt={item.title ?? ""}
                className="max-w-full max-h-[85vh] object-contain"
                draggable={false}
              />
            )}

            {(item.title || item.caption) && (
              <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-300 text-center">
                {item.title && <div className="text-white">{item.title}</div>}
                {item.caption && <div className="text-neutral-500 mt-0.5">{item.caption}</div>}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
