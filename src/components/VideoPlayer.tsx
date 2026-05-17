import { motion } from "motion/react";

interface VideoPlayerProps {
  videoId: string;
  videoHash?: string;
  title: string;
}

export function VideoPlayer({ videoId, videoHash, title }: VideoPlayerProps) {
  const hashParam = videoHash ? `&h=${videoHash}` : "";
  return (
    <motion.iframe
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      src={`https://player.vimeo.com/video/${videoId}?autoplay=1&muted=0&autopause=0&title=0&byline=0&portrait=0&pip=0&transparent=0&color=ffffff${hashParam}`}
      className="absolute inset-0 w-full h-full"
      allow="autoplay; fullscreen"
      allowFullScreen
      title={title}
      style={{ border: 0 }}
    />
  );
}
