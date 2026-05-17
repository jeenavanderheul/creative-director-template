import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";

const LABELS = [
  { key: "frameworks", label: "Strategic frameworks" },
  { key: "strategies", label: "Content strategies" },
  { key: "funnels", label: "Creative ecosystems & funnels" },
  { key: "factory", label: "Content factories" },
  { key: "ai", label: "AI workflows & systems" },
];

const FONT = `ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif`;

interface Node {
  key: string;
  label: string;
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  alpha: number;
  seed: number;
  pinned: boolean;
}

interface Link { a: Node; b: Node; k: number; rest: number }

export function ConnectedNodes() {
  const { isDark } = useTheme();
  const themeRef = useRef({ fg: "0,0,0", bg: "#ffffff" });
  themeRef.current = { fg: isDark ? "255,255,255" : "0,0,0", bg: isDark ? "#0a0a0a" : "#ffffff" };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    W: number; H: number; t: number; dpr: number;
    pointer: { x: number; y: number; active: boolean; down: boolean };
    nodes: Node[]; links: Link[];
    bounds: { x0: number; y0: number; x1: number; y1: number };
    drag: { node: Node | null; offX: number; offY: number; pointerId: number | null };
    noise: Map<string, { c: HTMLCanvasElement; size: number }>;
  }>({
    W: 0, H: 0, t: 0, dpr: 1,
    pointer: { x: 0, y: 0, active: false, down: false },
    nodes: [], links: [],
    bounds: { x0: 0, y0: 0, x1: 0, y1: 0 },
    drag: { node: null, offX: 0, offY: 0, pointerId: null },
    noise: new Map(),
  });

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  const makeNoise = useCallback((key: string, px = 160) => {
    const S = stateRef.current;
    if (S.noise.has(key)) return;
    const c = document.createElement("canvas");
    c.width = px; c.height = px;
    const g = c.getContext("2d")!;
    const img = g.createImageData(px, px);
    const d = img.data;
    let seed = 0;
    for (let i = 0; i < key.length; i++) seed = (seed * 31 + key.charCodeAt(i)) >>> 0;
    const rnd = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < d.length; i += 4) {
      const r = rnd();
      const a = r < 0.08 ? 40 : r < 0.92 ? 0 : 26;
      d[i] = 0; d[i + 1] = 0; d[i + 2] = 0; d[i + 3] = a;
    }
    g.putImageData(img, 0, 0);
    g.fillStyle = "rgba(0,0,0,0.05)";
    for (let y = 0; y < px; y += 6) g.fillRect(0, y, px, 1);
    S.noise.set(key, { c, size: px });
  }, []);

  const buildSystem = useCallback(() => {
    const S = stateRef.current;
    S.nodes = [];
    S.links = [];
    const cx = S.W * 0.5, cy = S.H * 0.5;
    const base = S.H;
    const Rx = base * 0.308, Ry = base * 0.246;
    const small = S.W < 820;
    const nodeR = base * (small ? 0.065 : 0.055);
    const pad = base * 0.015;
    const outX = nodeR + 12;
    const outTop = nodeR + 12;
    const outBottom = nodeR + 34;
    S.bounds = { x0: pad + outX, y0: pad + outTop, x1: S.W - pad - outX, y1: S.H - pad - outBottom };

    const positions: Record<string, { x: number; y: number }> = {
      ai: { x: cx, y: cy },
      funnels: { x: cx, y: cy - Ry },
      factory: { x: cx + Rx, y: cy },
      strategies: { x: cx, y: cy + Ry },
      frameworks: { x: cx - Rx, y: cy },
    };

    for (const { key, label } of LABELS) {
      S.nodes.push({
        key, label,
        x: clamp(positions[key].x, S.bounds.x0, S.bounds.x1),
        y: clamp(positions[key].y, S.bounds.y0, S.bounds.y1),
        vx: (Math.random() - 0.5) * 24, vy: (Math.random() - 0.5) * 24,
        r: nodeR, alpha: 0.18 + Math.random() * 0.42,
        seed: Math.random() * 1000, pinned: false,
      });
      makeNoise(key, small ? 140 : 180);
    }

    for (let i = 0; i < S.nodes.length; i++)
      for (let j = i + 1; j < S.nodes.length; j++)
        S.links.push({ a: S.nodes[i], b: S.nodes[j], k: 0.11, rest: base * 0.308 });
  }, [clamp, makeNoise]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    const S = stateRef.current;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      S.dpr = Math.max(1, Math.min(2, devicePixelRatio || 1));
      S.W = Math.max(1, Math.floor(rect.width));
      S.H = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(S.W * S.dpr);
      canvas.height = Math.floor(S.H * S.dpr);
      ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
      buildSystem();
    };

    const setPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      S.pointer.x = e.clientX - rect.left;
      S.pointer.y = e.clientY - rect.top;
      S.pointer.active = true;
    };

    const pickNode = (x: number, y: number) => {
      let best: Node | null = null, bestD = Infinity;
      for (const n of S.nodes) {
        const d = Math.hypot(n.x - x, n.y - y);
        if (d <= n.r * 1.15 && d < bestD) { best = n; bestD = d; }
      }
      return best;
    };

    const onMove = (e: PointerEvent) => setPointer(e);
    const onDown = (e: PointerEvent) => {
      setPointer(e);
      S.pointer.down = true;
      const n = pickNode(S.pointer.x, S.pointer.y);
      if (n) {
        canvas.setPointerCapture(e.pointerId);
        S.drag = { node: n, pointerId: e.pointerId, offX: S.pointer.x - n.x, offY: S.pointer.y - n.y };
        n.pinned = true; n.vx = 0; n.vy = 0;
        if (e.pointerType === "mouse") e.preventDefault();
      }
    };
    const onUp = (e: PointerEvent) => {
      S.pointer.down = false;
      if (S.drag.pointerId === e.pointerId) {
        if (S.drag.node) S.drag.node.pinned = false;
        S.drag = { node: null, offX: 0, offY: 0, pointerId: null };
        try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };
    const onLeave = () => { S.pointer.active = false; S.pointer.down = false; };

    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerdown", onDown, { passive: false });
    canvas.addEventListener("pointerup", onUp, { passive: true });
    canvas.addEventListener("pointercancel", onUp, { passive: true });
    canvas.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("resize", resize);

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    }, { threshold: 0.1 });
    observer.observe(canvas);

    const loop = (now: number) => {
      if (!visible) { raf = 0; return; }
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      S.t += dt;

      // Springs
      for (const L of S.links) {
        const dx = L.b.x - L.a.x, dy = L.b.y - L.a.y;
        const dist = Math.max(0.001, Math.hypot(dx, dy));
        const f = (dist - L.rest) * L.k;
        const nx = dx / dist, ny = dy / dist;
        L.a.vx += nx * f * dt; L.a.vy += ny * f * dt;
        L.b.vx -= nx * f * dt; L.b.vy -= ny * f * dt;
      }

      // Collisions
      for (let i = 0; i < S.nodes.length; i++)
        for (let j = i + 1; j < S.nodes.length; j++) {
          const a = S.nodes[i], b = S.nodes[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.max(0.001, Math.hypot(dx, dy));
          const min = (a.r + b.r) * 1.1;
          if (dist < min) {
            const push = (min - dist) * 1.15;
            const nx = dx / dist, ny = dy / dist;
            a.vx -= nx * push * dt; a.vy -= ny * push * dt;
            b.vx += nx * push * dt; b.vy += ny * push * dt;
          }
        }

      // Drag
      if (S.drag.node) {
        const n = S.drag.node;
        n.x = clamp(S.pointer.x - S.drag.offX, S.bounds.x0, S.bounds.x1);
        n.y = clamp(S.pointer.y - S.drag.offY, S.bounds.y0, S.bounds.y1);
        n.vx = 0; n.vy = 0;
      }

      // Integrate
      for (const n of S.nodes) {
        if (n.pinned) continue;
        const tt = S.t * 0.95 + n.seed;
        n.vx += Math.sin(tt * 1.05 + n.x * 0.0018) * 34 * dt;
        n.vy += Math.cos(tt * 0.92 + n.y * 0.0018) * 34 * dt;
        if (S.pointer.active && !S.drag.node) {
          const dx = S.pointer.x - n.x, dy = S.pointer.y - n.y;
          const d = Math.max(0.001, Math.hypot(dx, dy));
          const pr = Math.min(S.W, S.H) * 0.7;
          if (d < pr) {
            const s = 1 - d / pr;
            n.vx += (dx / d) * 520 * s * dt;
            n.vy += (dy / d) * 520 * s * dt;
          }
        }
        n.vx *= 0.93; n.vy *= 0.93;
        const v = Math.hypot(n.vx, n.vy);
        if (v > 160) { n.vx = (n.vx / v) * 160; n.vy = (n.vy / v) * 160; }
        n.x += n.vx * dt; n.y += n.vy * dt;
        n.x = clamp(n.x, S.bounds.x0, S.bounds.x1);
        n.y = clamp(n.y, S.bounds.y0, S.bounds.y1);
      }

      // Draw
      ctx.fillStyle = themeRef.current.bg;
      ctx.fillRect(0, 0, S.W, S.H);

      // Links
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${themeRef.current.fg},0.16)`;
      for (const L of S.links) {
        ctx.beginPath();
        ctx.moveTo(L.a.x, L.a.y);
        ctx.lineTo(L.b.x, L.b.y);
        ctx.stroke();
      }

      // Nodes — soft glossy sphere with feathered edge
      for (const n of S.nodes) {
        const fg = themeRef.current.fg;

        // Outer feathered glow
        const outer = ctx.createRadialGradient(n.x, n.y, n.r * 0.7, n.x, n.y, n.r * 1.1);
        outer.addColorStop(0, `rgba(${fg},${n.alpha * 0.9})`);
        outer.addColorStop(0.7, `rgba(${fg},${n.alpha * 0.4})`);
        outer.addColorStop(1, `rgba(${fg},0)`);
        ctx.fillStyle = outer;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 1.1, 0, Math.PI * 2);
        ctx.fill();

        // Solid core
        ctx.fillStyle = `rgba(${fg},${n.alpha * 0.95})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 0.75, 0, Math.PI * 2);
        ctx.fill();

        // Off-center highlight (glossy look)
        const gloss = ctx.createRadialGradient(
          n.x - n.r * 0.2, n.y - n.r * 0.25, 0,
          n.x - n.r * 0.2, n.y - n.r * 0.25, n.r * 0.7
        );
        const invFg = fg === "0,0,0" ? "255,255,255" : "0,0,0";
        gloss.addColorStop(0, `rgba(${invFg},0.18)`);
        gloss.addColorStop(0.5, `rgba(${invFg},0.04)`);
        gloss.addColorStop(1, `rgba(${invFg},0)`);
        ctx.fillStyle = gloss;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        // Grain texture
        const tex = S.noise.get(n.key);
        if (tex) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.clip();
          const dX = Math.sin(S.t * 0.8 + n.seed) * (n.r * 0.08);
          const dY = Math.cos(S.t * 0.7 + n.seed) * (n.r * 0.08);
          const scale = (n.r * 2) / tex.size;
          ctx.globalAlpha = 0.35;
          ctx.drawImage(tex.c, n.x - n.r + dX, n.y - n.r + dY, tex.size * scale, tex.size * scale);
          ctx.restore();
        }
      }

      // Labels
      const small = S.W < 820;
      ctx.fillStyle = `rgba(${themeRef.current.fg},0.90)`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${small ? 800 : 900} ${small ? 13 : 14}px ${FONT}`;
      for (const n of S.nodes) {
        ctx.fillText(n.label, n.x, n.y + n.r + (small ? 18 : 20));
      }
    };

    resize();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [buildSystem, clamp]);

  return (
    <div className="w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ touchAction: "pan-y", background: isDark ? "#0a0a0a" : "#ffffff" }}
      />
    </div>
  );
}
