import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

interface Model3DProps {
  src: string;
}

const IDLE_DELAY_MS = 1500;
const ROTATION_DAMPING = 0.06;
const MOUSE_TILT_RANGE = 0.6;
const IDLE_SWAY_RANGE = 0.4;
const IDLE_SWAY_PERIOD_MS = 8000;

/** Vertex shader — standard varyings + glitch-style mouse displacement.
    vLocalPos is derived from world position so the noise scale lines up with
    the blob (which used a unit-radius icosahedron, i.e. p in ~[-1,1]).
    Mouse displacement: near the cursor hit-point, vertices are pushed in
    pseudo-random 3D directions (snapped to a grid for "pixelated" feel).
    Inspired by Framer's pixel-displace effect. */
const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec3 uMouseWorld;
  uniform float uMouseStrength;
  uniform float uMouseRadius;
  uniform float uMouseAmount;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewDir;
  varying vec3 vLocalPos;
  varying float vGlitch;

  // cheap hash 3->3
  vec3 hash3(vec3 p) {
    p = vec3(
      dot(p, vec3(127.1, 311.7, 74.7)),
      dot(p, vec3(269.5, 183.3, 246.1)),
      dot(p, vec3(113.5, 271.9, 124.6))
    );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  void main() {
    vec3 p = position;
    vec4 worldPosBase = modelMatrix * vec4(p, 1.0);
    float distToMouse = length(worldPosBase.xyz - uMouseWorld);
    float falloff = smoothstep(uMouseRadius, 0.0, distToMouse) * uMouseStrength;

    // Pixelate / snap the seed coords to a coarse grid for blocky displacement
    vec3 grid = floor(p * 30.0) / 30.0;
    vec3 jitter = hash3(grid + floor(uTime * 4.0) * 0.137);

    // Scatter: almost purely along normal — micro-displacement only
    vec3 dir = normalize(mix(normal, jitter, 0.10));
    vec3 displacedLocal = p + dir * (falloff * uMouseAmount);

    vec4 worldPos = modelMatrix * vec4(displacedLocal, 1.0);
    vLocalPos = worldPos.xyz * 0.5;
    vNormal = normalize(normalMatrix * normal);
    vPosition = worldPos.xyz;
    vViewDir = normalize(worldPos.xyz - cameraPosition);
    vGlitch = falloff;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedLocal, 1.0);
  }
`;

/** Fragment shader — copied verbatim from MorphingSystem's blob:
    rough volcanic grain blended with glossy obsidian + rim/spec/caustic. */
const FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewDir;
  varying vec3 vLocalPos;
  varying float vGlitch;

  vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+10.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.5 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m*m;
    return 105.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);
    float facing = abs(dot(n, -v));

    // Blend mask: smoother organic transition
    float maskLo = snoise(vLocalPos * 2.5 + uTime * 0.06) * 0.5 + 0.5;
    float maskHi = snoise(vLocalPos * 5.0 - uTime * 0.04) * 0.5 + 0.5;
    float mask = smoothstep(0.25, 0.75, maskLo * 0.65 + maskHi * 0.35);

    // Rough layer — fine volcanic grain
    float pore1 = snoise(vPosition * 50.0 + uTime * 0.04) * 0.5 + 0.5;
    float pore2 = snoise(vPosition * 100.0 - uTime * 0.025) * 0.5 + 0.5;
    float pore3 = snoise(vPosition * 200.0 + uTime * 0.015) * 0.5 + 0.5;
    float pores = pore1 * 0.45 + pore2 * 0.35 + pore3 * 0.2;

    float cavities = smoothstep(0.38, 0.52, pore1 * pore2) * 0.04;

    vec3 lightDir = normalize(vec3(0.5, 1.0, 0.8));
    float diffuse = dot(n, lightDir) * 0.5 + 0.5;
    float roughShade = diffuse * 0.07 + pores * 0.04 + cavities;

    float dustRim = pow(1.0 - facing, 2.5) * 0.05;
    vec3 roughColor = vec3(roughShade + dustRim) * vec3(0.92, 0.88, 0.84);

    // Glossy layer — refined obsidian
    float glossRim = pow(1.0 - facing, 5.0) * 0.55;

    vec3 lightDir2 = normalize(vec3(-0.3, 1.2, 0.6));
    vec3 halfVec = normalize(lightDir2 - v);
    float spec1 = pow(max(dot(n, halfVec), 0.0), 120.0) * 0.7;

    vec3 lightDir3 = normalize(vec3(0.8, 0.3, -0.5));
    vec3 halfVec2 = normalize(lightDir3 - v);
    float spec2 = pow(max(dot(n, halfVec2), 0.0), 60.0) * 0.2;

    float caustic = snoise(vLocalPos * 6.0 + uTime * 0.08) * 0.5 + 0.5;
    caustic = smoothstep(0.55, 0.85, caustic) * 0.03;

    float glossBase = 0.015;
    vec3 glossColor = vec3(glossBase + glossRim + spec1 + spec2 + caustic);

    vec3 color = mix(roughColor, glossColor, mask);

    float dripBias = smoothstep(-0.2, 0.6, -vLocalPos.y) * 0.1;
    color += dripBias * (glossColor - roughColor);

    // Radial gradient: light grey in the center (facing camera), fading to black at edges
    float radial = pow(facing, 1.6) * 0.7;
    color = mix(color, vec3(radial), 0.7);

    // Pure pixelated speckle — small monochrome pixel grid that flickers near cursor
    if (vGlitch > 0.0) {
      vec3 pixGrid = floor(vLocalPos * 80.0) / 80.0;
      float band = snoise(pixGrid * 12.0 + uTime * 1.0) * 0.5 + 0.5;
      float pixel = step(0.72, band) * vGlitch * 0.12;
      color += vec3(pixel);
    }

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

function createObsidianMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouseWorld: { value: new THREE.Vector3(0, 0, 100) },
      uMouseStrength: { value: 0 },
      uMouseRadius: { value: 0.18 },
      uMouseAmount: { value: 0.004 },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
  });
}

export function Model3D({ src }: Model3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = 0;
    let loaded = false;
    let disposed = false;
    const abort = new AbortController();
    const materials: THREE.ShaderMaterial[] = [];

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const maxDpr = window.innerWidth < 768 ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(maxDpr, window.devicePixelRatio));
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    // Rotation state
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let lastMoveAt = 0;

    // Mouse displacement state
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2();
    const mouseWorld = new THREE.Vector3(0, 0, 100); // far-away "no hit" default
    let mouseStrengthTarget = 0;
    let mouseStrengthCurrent = 0;

    // Raycast at most once per animation frame — pointermove can fire 1000/s
    // but BVH traversal is expensive; one hit-test per paint is plenty.
    let pendingHit: PointerEvent | null = null;
    const flushHit = () => {
      if (!pendingHit) return;
      const e = pendingHit;
      pendingHit = null;
      const rect = container.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseNDC, camera);
      const hits = raycaster.intersectObject(root, true);
      if (hits.length > 0) {
        mouseWorld.copy(hits[0].point);
        mouseStrengthTarget = 1;
      } else {
        mouseStrengthTarget = 0;
      }
    };
    const updateMouseHit = (e: PointerEvent) => {
      const wasIdle = pendingHit === null;
      pendingHit = e;
      if (wasIdle) requestAnimationFrame(flushHit);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRotY = nx * MOUSE_TILT_RANGE;
      targetRotX = ny * MOUSE_TILT_RANGE * 0.5;
      lastMoveAt = performance.now();
      updateMouseHit(e);
    };

    const onPointerLeave = () => {
      targetRotX = 0;
      mouseStrengthTarget = 0;
    };

    container.addEventListener("pointermove", onPointerMove, { signal: abort.signal });
    container.addEventListener("pointerleave", onPointerLeave, { signal: abort.signal });

    // Size handling
    const fit = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(container);

    // Lazy-load: only fetch GLB when container scrolls into view
    const loadModel = () => {
      if (loaded || disposed) return;
      loaded = true;
      const draco = new DRACOLoader();
      draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
      const loader = new GLTFLoader();
      loader.setDRACOLoader(draco);
      loader.load(
        src,
        (gltf) => {
          if (disposed) return;
          const model = gltf.scene;
          // Fit to bounding box → normalize to unit ~1.6
          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          box.getSize(size);
          box.getCenter(center);
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const scale = 1.6 / maxDim;
          model.scale.setScalar(scale);
          model.position.sub(center.multiplyScalar(scale));
          // Wrap so rotation pivots around the centered origin (avoids off-center drift)
          const orient = new THREE.Group();
          orient.add(model);
          orient.rotation.y = (3 * Math.PI) / 2; // 270° — quarter turn further
          root.add(orient);

          // Replace every mesh material with the obsidian shader
          model.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              const old = obj.material;
              if (Array.isArray(old)) old.forEach((m) => m.dispose());
              else old?.dispose();
              const mat = createObsidianMaterial();
              obj.material = mat;
              materials.push(mat);
            }
          });
        },
        undefined,
        (err) => {
          console.error("Model3D load error:", err);
        },
      );
    };

    // Lazy GLB load on first intersection
    const loadIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            loadModel();
            loadIO.disconnect();
            break;
          }
        }
      },
      { threshold: 0.1 },
    );
    loadIO.observe(container);

    // Pause the rAF loop when the canvas is off-screen — saves battery + paint budget
    let onScreen = true;
    const visibilityIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const wasOn = onScreen;
          onScreen = entry.isIntersecting;
          if (!wasOn && onScreen && !rafId && !prefersReducedMotion) {
            // Resume loop
            clock.start();
            rafId = requestAnimationFrame(animate);
          }
        }
      },
      { threshold: 0 },
    );
    visibilityIO.observe(container);

    // Respect prefers-reduced-motion — render once, no idle sway, no shader animation
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      if (!onScreen) {
        rafId = 0;
        return;
      }
      const now = performance.now();
      const idle = now - lastMoveAt > IDLE_DELAY_MS;

      if (idle) {
        // Slow left-right sway between -IDLE_SWAY_RANGE and +IDLE_SWAY_RANGE
        targetRotY = Math.sin((now / IDLE_SWAY_PERIOD_MS) * Math.PI * 2) * IDLE_SWAY_RANGE;
        targetRotX = 0;
      } else {
        // Clamp mouse-driven rotation to the same horizontal range — never show the back
        targetRotY = Math.max(-MOUSE_TILT_RANGE, Math.min(MOUSE_TILT_RANGE, targetRotY));
      }

      currentRotX += (targetRotX - currentRotX) * ROTATION_DAMPING;
      currentRotY += (targetRotY - currentRotY) * ROTATION_DAMPING;
      root.rotation.x = currentRotX;
      root.rotation.y = currentRotY;

      const t = clock.getElapsedTime();
      mouseStrengthCurrent += (mouseStrengthTarget - mouseStrengthCurrent) * 0.12;
      for (const m of materials) {
        m.uniforms.uTime.value = t;
        m.uniforms.uMouseWorld.value.copy(mouseWorld);
        m.uniforms.uMouseStrength.value = mouseStrengthCurrent;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    if (prefersReducedMotion) {
      // Single static render — no rAF loop, no shader animation, no idle sway
      const t = clock.getElapsedTime();
      for (const m of materials) {
        m.uniforms.uTime.value = t;
        m.uniforms.uMouseStrength.value = 0;
      }
      renderer.render(scene, camera);
    } else {
      animate();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      abort.abort();
      loadIO.disconnect();
      visibilityIO.disconnect();
      ro.disconnect();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          const material = obj.material;
          if (Array.isArray(material)) {
            material.forEach((m) => m.dispose());
          } else {
            material?.dispose();
          }
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [src]);

  return <div ref={containerRef} className="h-full w-full dark:invert dark:brightness-200" />;
}
