import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface NavbarProps {
  theme?: "light" | "dark";
}

function getAmsterdamTime() {
  try {
    return new Date().toLocaleTimeString("en-GB", {
      timeZone: "Europe/Amsterdam",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

function AmsterdamTime() {
  const [time, setTime] = useState(getAmsterdamTime);

  useEffect(() => {
    const id = setInterval(() => setTime(getAmsterdamTime()), 10000);
    return () => clearInterval(id);
  }, []);

  return <>{time}</>;
}

export function Navbar({ theme = "light" }: NavbarProps) {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState<number | null>(null);

  const openMenu = () => {
    setMenuHeight(window.innerHeight);
    setMenuOpen(true);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [menuOpen]);

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "AI SYSTEMS", path: "/ai-systems" },
    { label: "WORK", path: "/work" },
    { label: "PLAY", path: "/play" },
    { label: "ABOUT", path: "/about" },
  ];

  return (
    <>
      <nav className={`fixed top-0 z-[100] flex w-full items-start justify-between px-8 py-8 text-[11px] font-bold uppercase tracking-wider md:px-12 ${isDark ? "text-white" : "text-black"}`}>
        <div className="flex flex-col">
          <Link to="/" className="hover:opacity-50 transition-opacity tracking-tighter">
            Maximilian Storm
          </Link>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider opacity-40 hover:opacity-100 transition-[opacity,transform] duration-150 cursor-pointer min-h-[44px] -my-2 -mx-1 px-1 touch-manipulation active:scale-95"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={12} /> : <Moon size={12} />}
            {isDark ? "Light" : "Dark"}
          </button>
        </div>

        {/* Desktop nav */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative transition-opacity hover:opacity-50 ${isActive ? "" : "opacity-40"}`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className={`absolute -bottom-1 left-0 h-px w-full ${isDark ? "bg-white" : "bg-black"}`}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Hamburger button (mobile) */}
        <button
          onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
          className="relative flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden transition-transform duration-150 active:scale-90"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`block h-[1.5px] w-5 transition-all duration-300 origin-center ${isDark ? "bg-white" : "bg-black"} ${menuOpen ? "translate-y-[4px] rotate-45" : ""}`}
          />
          <span
            className={`block h-[1.5px] w-5 transition-all duration-300 origin-center ${isDark ? "bg-white" : "bg-black"} ${menuOpen ? "-translate-y-[4px] -rotate-45" : ""}`}
          />
        </button>

        <div className="hidden flex-col items-start text-left md:flex">
          <span className="tracking-tighter">Creative Director</span>
          <span className={`${isDark ? "text-neutral-500" : "text-neutral-400"} tracking-tighter`}>Amsterdam, <AmsterdamTime /></span>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-x-0 top-0 z-[150] flex flex-col overflow-y-auto overscroll-contain ${isDark ? "bg-[#0a0a0a] text-white" : "bg-white text-black"}`}
            style={{ height: menuHeight ? `${menuHeight}px` : "100dvh" }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute right-6 top-8 z-10 flex h-11 w-11 flex-col items-center justify-center gap-1.5"
              aria-label="Close menu"
            >
              <span className={`block h-[1.5px] w-5 translate-y-[4px] rotate-45 origin-center ${isDark ? "bg-white" : "bg-black"}`} />
              <span className={`block h-[1.5px] w-5 -translate-y-[4px] -rotate-45 origin-center ${isDark ? "bg-white" : "bg-black"}`} />
            </button>

            {/* Top ticker */}
            <div className="pt-20 max-xs:pt-16">
              <div className={`w-full overflow-hidden border-y ${isDark ? "border-neutral-800" : "border-neutral-200"} py-2`}>
                <div className="animate-ticker flex whitespace-nowrap">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className={`mx-6 font-normal uppercase leading-none tracking-tighter text-[clamp(1rem,6vw,3rem)] ${isDark ? "text-white" : "text-black"}`}>
                      STORM
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Nav items — wiskundig gecentreerd tussen tickers */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6 max-xs:gap-4 py-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="text-huge max-xs:text-[clamp(1.75rem,7vw,2.5rem)] leading-none transition-opacity hover:opacity-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Bottom ticker + contact */}
            <div className="px-8 pb-10 max-xs:pb-4 flex flex-col gap-2">
              <div className={`-mx-8 overflow-hidden border-y ${isDark ? "border-neutral-800" : "border-neutral-200"} py-2 mb-4`}>
                <div className="animate-ticker flex whitespace-nowrap">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className={`mx-6 font-normal uppercase leading-none tracking-tighter text-[clamp(1rem,6vw,3rem)] ${isDark ? "text-white" : "text-black"}`}>
                      STORM
                    </span>
                  ))}
                </div>
              </div>
              <a href="https://www.instagram.com/instamatak.mp4" target="_blank" rel="noopener noreferrer" className={`text-xl font-normal uppercase tracking-tight leading-relaxed transition-opacity hover:opacity-50 ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>Instagram</a>
              <a href="https://www.linkedin.com/in/your-handle/" target="_blank" rel="noopener noreferrer" className={`text-xl font-normal uppercase tracking-tight leading-relaxed transition-opacity hover:opacity-50 ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>LinkedIn</a>
              <a href="mailto:hello@example.com" onClick={(e) => { e.preventDefault(); window.open("mailto:hello@example.com", "_blank"); }} className={`text-xl font-normal uppercase tracking-tight leading-relaxed transition-opacity hover:opacity-50 cursor-pointer mt-4 ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>hello@example.com</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
