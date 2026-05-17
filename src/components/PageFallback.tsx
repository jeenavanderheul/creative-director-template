import { useEffect, useState } from "react";

interface PageFallbackProps {
  /** Don't show the loading bar before this many ms — avoids flash on fast chunk loads */
  delay?: number;
}

/** Suspense fallback for route-level lazy components. Hides until `delay` ms have passed,
 *  then renders a thin top-bar loading indicator. Prevents the white flash on fast navigations
 *  while still giving feedback on genuinely slow loads. */
export function PageFallback({ delay = 200 }: PageFallbackProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShow(true), delay);
    return () => window.clearTimeout(id);
  }, [delay]);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-0.5 overflow-hidden bg-black/5 dark:bg-white/5">
      <div className="h-full w-1/3 bg-black dark:bg-white animate-page-load-bar" />
    </div>
  );
}
