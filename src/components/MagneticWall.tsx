import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

const NAMES = [
  "ZESTRA","AXIOM SPORT","PARADIGM GAMES","MERIDIAN HOPS","VEKTOR MOTORS","STATE & CO","PRISMA AUTO","DERMA LABS","POLARITY",
  "CORE BLOOM","OBLIQUE COURT","ATLAS DELIVERY","ORACLE","FRACTAL SNACKS","CADENCE INTERACTIVE","MARKETLINK","VENICE COUTURE","PULSE HYDRATION","ASCENT MOTORCYCLES",
  "STRATA TAILORS","PERSPECTIVE FESTIVAL","COVALENT BANK","MOMENTUM RETAIL","VECTOR EAU","BRAVURA LAGER","PRAGMA APOTHECARY","TIERRA NUEVA","SOLAR CHIPS",
  "ABUNDA","CIRCUIT BAZAAR","ORBIT MOTORS","FLUX SODA","HORIZON VOYAGES","STAATSLAND","STREAMVERSE","APEX ATHLETIX","NEWSPULSE",
  "ZENITH WATCHES","ECHO MOTORS","ORBIT MOTORSSTRY OF AFFAIRS","FIZZ COLLECTIVE","PIONEER MOTORS","ARCADE.OS","FORGE ATHLETICS","ROOT&BRANCH BANK","PINNACLE GAMES","PRISMA ELECTRONICS",
  "BREATHWORK","CONDUIT TELECOM","FLEET&FORK","BASTION CABLE","ANGULAR COLLECTIVE","BOUTIQUE GRID","CALLNODE","NIMBUS CABLE"
];

const FONT_FAMILY = `ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif`;

interface Tile {
  name: string;
  x: number; y: number;
  ox: number; oy: number;
  vx: number; vy: number;
  wob: number;
  size: number;
}

export function MagneticWall() {
  const { isDark } = useTheme();
  const themeRef = useRef({ fg: "0,0,0", bg: "#ffffff" });
  themeRef.current = { fg: isDark ? "255,255,255" : "0,0,0", bg: isDark ? "#0a0a0a" : "#ffffff" };
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const S = {
      dpr: 1, W: 0, H: 0, t: 0,
      tiles: [] as Tile[],
      pointer: { x: 0, y: 0, active: false, down: false },
    };

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const isMobile = () => matchMedia("(max-width:820px),(pointer:coarse)").matches;

    function buildGrid() {
      S.tiles = [];
      const pad = Math.min(S.W, S.H) * 0.09;
      const innerW = S.W - pad * 2;
      const innerH = S.H - pad * 2;
      const cols = isMobile() ? 2 : 4;
      const rows = Math.ceil(NAMES.length / cols);
      const cellW = innerW / cols;
      const cellH = innerH / rows;
      const fontSize = Math.max(14, Math.min(16, Math.floor(cellH * 0.28)));

      for (let i = 0; i < NAMES.length; i++) {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const cx = pad + c * cellW + cellW * 0.5;
        const cy = pad + r * cellH + cellH * 0.5;
        S.tiles.push({
          name: NAMES[i], x: cx, y: cy, ox: cx, oy: cy,
          vx: 0, vy: 0, wob: Math.random() * 1000, size: fontSize,
        });
      }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      S.dpr = Math.max(1, Math.min(2, devicePixelRatio || 1));
      S.W = Math.max(1, Math.floor(rect.width));
      S.H = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(S.W * S.dpr);
      canvas.height = Math.floor(S.H * S.dpr);
      ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
      buildGrid();
    }

    const setPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      S.pointer.x = e.clientX - rect.left;
      S.pointer.y = e.clientY - rect.top;
      S.pointer.active = true;
    };

    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      S.pointer.down = true;
      setPointer(e);
    };
    const onMove = (e: PointerEvent) => setPointer(e);
    const onUp = () => { S.pointer.down = false; };
    const onLeave = () => { S.pointer.active = false; S.pointer.down = false; };

    canvas.addEventListener("pointerdown", onDown, { passive: true });
    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerup", onUp, { passive: true });
    canvas.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();

    function stepPhysics(dt: number) {
      const pad = Math.min(S.W, S.H) * 0.09;
      const magRadius = Math.min(S.W, S.H) * 0.40;
      const magPull = S.pointer.down ? 2200 : 1400;

      for (const t of S.tiles) {
        t.vx += (t.ox - t.x) * 10.5 * dt;
        t.vy += (t.oy - t.y) * 10.5 * dt;

        if (S.pointer.active) {
          const dx = S.pointer.x - t.x;
          const dy = S.pointer.y - t.y;
          const d = Math.max(0.001, Math.hypot(dx, dy));
          if (d < magRadius) {
            const f = 1 - d / magRadius;
            t.vx += (dx / d) * magPull * f * dt;
            t.vy += (dy / d) * magPull * f * dt;
            const wob = Math.sin(S.t * 8 + t.wob) * 90 * f;
            t.vx += (-(dy / d)) * wob * dt;
            t.vy += ((dx / d)) * wob * dt;
          }
        }

        t.vx *= 0.84;
        t.vy *= 0.84;
        const vmag = Math.hypot(t.vx, t.vy);
        if (vmag > 900) { t.vx = (t.vx / vmag) * 900; t.vy = (t.vy / vmag) * 900; }
        t.x += t.vx * dt;
        t.y += t.vy * dt;
        t.x = clamp(t.x, pad, S.W - pad);
        t.y = clamp(t.y, pad, S.H - pad);
      }
    }

    function drawFrame() {
      ctx.fillStyle = themeRef.current.bg;
      ctx.fillRect(0, 0, S.W, S.H);

      for (const t of S.tiles) {
        ctx.font = `400 ${t.size}px ${FONT_FAMILY}`;
        ctx.letterSpacing = "-0.025em";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(${themeRef.current.fg},0.85)`;
        ctx.fillText(t.name, t.x, t.y);
      }
    }

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    }, { threshold: 0.1 });
    observer.observe(canvas);

    function loop(now: number) {
      if (!visible) { raf = 0; return; }
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      S.t += dt;
      stepPhysics(dt);
      drawFrame();
    }

    resize();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="w-full aspect-[3/4] sm:aspect-[4/3]">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ touchAction: "none", background: isDark ? "#0a0a0a" : "#ffffff" }}
      />
    </div>
  );
}
