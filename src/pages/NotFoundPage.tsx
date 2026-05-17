import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { HeroReveal } from "../components/Reveal";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-black dark:text-white">
      <Navbar />
      <main id="main" className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <HeroReveal delay={0}>
          <p className="text-micro text-neutral-500 mb-4">Error 404</p>
        </HeroReveal>
        <HeroReveal delay={0.10}>
          <h1 className="text-huge mb-8">Page not found</h1>
        </HeroReveal>
        <HeroReveal delay={0.20}>
          <p className="text-base text-neutral-500 max-w-md mb-12">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </HeroReveal>
        <HeroReveal delay={0.30}>
          <Link
            to="/"
            className="text-[11px] font-bold uppercase tracking-wider border border-current px-6 py-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-[background-color,color,transform] duration-150 active:scale-95"
          >
            Back to home
          </Link>
        </HeroReveal>
      </main>
    </div>
  );
}
