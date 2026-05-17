import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`${isDark ? "bg-[#0a0a0a] text-white" : "bg-white text-black"} pt-12 pb-12 md:pt-24 md:pb-16 overflow-hidden`}>
      {/* Navigation Grid */}
      <div className="px-8 md:px-12 lg:px-24 mt-8 md:mt-12">
        <div className="grid grid-cols-2 gap-4 text-sm md:text-base md:grid-cols-4 md:gap-8">
          {/* Column 1 — Pages */}
          <div className="flex flex-col gap-0">
            <Link to="/ai-systems" className={`text-base font-normal uppercase tracking-tight leading-relaxed transition-colors ${isDark ? "hover:text-neutral-500" : "hover:text-neutral-400"}`}>AI SYSTEMS</Link>
            <Link to="/work" className={`text-base font-normal uppercase tracking-tight leading-relaxed transition-colors ${isDark ? "hover:text-neutral-500" : "hover:text-neutral-400"}`}>WORK</Link>
            <Link to="/play" className={`text-base font-normal uppercase tracking-tight leading-relaxed transition-colors ${isDark ? "hover:text-neutral-500" : "hover:text-neutral-400"}`}>PLAY</Link>
            <Link to="/about" className={`text-base font-normal uppercase tracking-tight leading-relaxed transition-colors ${isDark ? "hover:text-neutral-500" : "hover:text-neutral-400"}`}>ABOUT</Link>
          </div>

          {/* Column 2 — Socials */}
          <div className="flex flex-col gap-0">
            <a href="https://www.instagram.com/instamatak.mp4" target="_blank" rel="noopener noreferrer" className={`text-base font-normal uppercase tracking-tight leading-relaxed transition-colors ${isDark ? "hover:text-neutral-500" : "hover:text-neutral-400"}`}>INSTAGRAM</a>
            <a href="https://www.linkedin.com/in/your-handle/" target="_blank" rel="noopener noreferrer" className={`text-base font-normal uppercase tracking-tight leading-relaxed transition-colors ${isDark ? "hover:text-neutral-500" : "hover:text-neutral-400"}`}>LINKEDIN</a>
          </div>

          {/* Column 3 — Location */}
          <div className="flex flex-col gap-0">
            <span className="text-base font-normal uppercase tracking-tight leading-relaxed whitespace-nowrap">
              AMSTERDAM, THE NETHERLANDS
            </span>
            <button onClick={() => { navigator.clipboard.writeText("hello@example.com"); }} className={`text-base font-normal uppercase tracking-tight leading-relaxed transition-colors cursor-pointer text-left ${isDark ? "text-neutral-500 hover:text-white" : "text-neutral-400 hover:text-black"}`}>
              MAXIMILIAN.STORM@EXAMPLE.COM
            </button>
          </div>

          {/* Column 4 — Legal */}
          <div className="hidden sm:flex flex-col gap-0">
            <span className={`text-base font-normal uppercase tracking-tight leading-relaxed ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
              © 2026 ALL RIGHTS RESERVED
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
