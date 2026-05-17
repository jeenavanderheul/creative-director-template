import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const MorphingSystem: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    let rafId = 0;
    let intervalId = 0;
    let morphing = false;
    const abort = new AbortController();

    const scene = new THREE.Scene();
    scene.background = null; // Transparent background to show through

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const maxDpr = window.innerWidth < 768 ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(maxDpr, window.devicePixelRatio));
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.left = "50%";
    renderer.domElement.style.top = "50%";
    renderer.domElement.style.transform = "translate(-50%, -50%)";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.zIndex = "0";
    renderer.domElement.style.pointerEvents = "auto";
    renderer.domElement.style.cursor = "pointer";
    container.appendChild(renderer.domElement);

    const label = document.createElement("div");
    label.className = "vh-morph-label";
    label.style.position = "absolute";
    label.style.transform = "translate(-50%, -50%)";
    label.style.fontFamily = `"Helvetica Neue", Helvetica, Arial, sans-serif`;
    label.style.fontSize = "10px"; // Smaller for the inner circle
    label.style.fontWeight = "600";
    label.style.color = "#000";
    label.style.background = "rgba(255,255,255,0.8)";
    label.style.border = "1px solid rgba(0,0,0,0.1)";
    label.style.borderRadius = "999px";
    label.style.padding = "4px 8px";
    label.style.pointerEvents = "none";
    label.style.opacity = "0"; // Hide it by default as requested to be "behind"
    label.style.zIndex = "5";
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.justifyContent = "center";
    label.style.textAlign = "center";
    label.style.lineHeight = "1.2";
    label.style.maxWidth = "100px";
    label.style.whiteSpace = "normal";
    container.appendChild(label);

    const words = ["AI innovation", "Advertising", "Social content", "Filmmaking"];
    let wordIndex = 0;

    const base = new THREE.IcosahedronGeometry(1, 7);
    const count = base.attributes.position.count;
    const fromArr = new Float32Array(count * 3);
    const toArr = new Float32Array(count * 3);
    const sphereArr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = base.attributes.position.getX(i);
      const y = base.attributes.position.getY(i);
      const z = base.attributes.position.getZ(i);
      fromArr[i * 3] = x; fromArr[i * 3 + 1] = y; fromArr[i * 3 + 2] = z;
      toArr[i * 3] = x; toArr[i * 3 + 1] = y; toArr[i * 3 + 2] = z;
      const len = Math.sqrt(x * x + y * y + z * z) || 1;
      sphereArr[i * 3] = x / len;
      sphereArr[i * 3 + 1] = y / len;
      sphereArr[i * 3 + 2] = z / len;
    }

    base.setAttribute("aFrom", new THREE.BufferAttribute(fromArr, 3));
    base.setAttribute("aTo", new THREE.BufferAttribute(toArr, 3));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uMorph: { value: 0 },
        uTime: { value: 0 }
      },
      vertexShader: `
        uniform float uMorph;
        uniform float uTime;
        attribute vec3 aFrom;
        attribute vec3 aTo;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vViewDir;
        varying vec3 vLocalPos;
        float wobble(vec3 p){
          return sin(p.x*6.0 + uTime*2.2)
               * sin(p.y*5.0 + uTime*2.0)
               * sin(p.z*4.0 + uTime*1.8);
        }
        void main(){
          vec3 p = mix(aFrom, aTo, uMorph);
          float w = uMorph * (1.0 - uMorph);
          vec3 n = normalize(p + 0.0001);
          p += n * wobble(p) * 0.10 * w;
          vLocalPos = p;
          vNormal = normalize(normalMatrix * n);
          vec4 worldPos = modelMatrix * vec4(p, 1.0);
          vPosition = worldPos.xyz;
          vViewDir = normalize(worldPos.xyz - cameraPosition);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vViewDir;
        varying vec3 vLocalPos;

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

        void main(){
          vec3 n = normalize(vNormal);
          vec3 v = normalize(vViewDir);
          float facing = abs(dot(n, -v));

          // === Blend mask: smoother organic transition ===
          float maskLo = snoise(vLocalPos * 2.5 + uTime * 0.06) * 0.5 + 0.5;
          float maskHi = snoise(vLocalPos * 5.0 - uTime * 0.04) * 0.5 + 0.5;
          float mask = smoothstep(0.25, 0.75, maskLo * 0.65 + maskHi * 0.35);

          // === ROUGH LAYER — fine volcanic grain ===
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

          // === GLOSSY LAYER — refined obsidian ===
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

          // === COMBINE ===
          vec3 color = mix(roughColor, glossColor, mask);

          float dripBias = smoothstep(-0.2, 0.6, -vLocalPos.y) * 0.1;
          color += dripBias * (glossColor - roughColor);

          gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
        }
      `
    });

    const mesh = new THREE.Mesh(base, material);
    mesh.scale.set(2, 2, 2);
    scene.add(mesh);

    function fitCamera() {
      const worldR = 2;
      const fov = THREE.MathUtils.degToRad(camera.fov);
      const dist = (worldR * 2.2) / Math.sin(fov / 2);
      camera.position.set(0, 0, dist);
      camera.near = Math.max(0.01, dist - worldR * 6);
      camera.far = dist + worldR * 10;
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    }

    function resize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      const s = Math.min(w, h);
      renderer.setSize(s, s, false);
      renderer.domElement.style.width = s + "px";
      renderer.domElement.style.height = s + "px";
      fitCamera();
      updateLabel();
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    const EPS = 1e-6;
    function regularNgonPlanes(n: number, R: number) {
      const planes = [];
      const apothem = Math.cos(Math.PI / n) * R;
      for (let k = 0; k < n; k++) {
        const ang = (2 * Math.PI * k) / n;
        planes.push({ nx: Math.cos(ang), nz: Math.sin(ang), d: apothem });
      }
      return planes;
    }

    function insideNgonXZ(x: number, z: number, planes: any[]) {
      for (const p of planes) {
        if (p.nx * x + p.nz * z > p.d + 1e-5) return false;
      }
      return true;
    }

    function intersectRegularPrism(n: number, dir: any, R = 1, h = 0.9) {
      let bestT = Infinity;
      const planes = regularNgonPlanes(n, R);
      for (const p of planes) {
        const denom = p.nx * dir.x + p.nz * dir.z;
        if (denom <= EPS) continue;
        const t = p.d / denom;
        if (t <= EPS) continue;
        const y = t * dir.y;
        if (Math.abs(y) <= h && t < bestT) bestT = t;
      }
      if (Math.abs(dir.y) > EPS) {
        const tTop = h / dir.y;
        if (tTop > EPS) {
          const x = tTop * dir.x;
          const z = tTop * dir.z;
          if (insideNgonXZ(x, z, planes)) bestT = Math.min(bestT, tTop);
        }
        const tBot = -h / dir.y;
        if (tBot > EPS) {
          const x = tBot * dir.x;
          const z = tBot * dir.z;
          if (insideNgonXZ(x, z, planes)) bestT = Math.min(bestT, tBot);
        }
      }
      return bestT === Infinity ? 1 : bestT;
    }

    function intersectBox(dir: any, ax = 1, ay = 0.9, az = 1) {
      const slab = (d: number, min: number, max: number) => {
        if (Math.abs(d) < EPS) return [-Infinity, Infinity];
        const t1 = min / d;
        const t2 = max / d;
        return [Math.min(t1, t2), Math.max(t1, t2)];
      };
      const [tx1, tx2] = slab(dir.x, -ax, ax);
      const [ty1, ty2] = slab(dir.y, -ay, ay);
      const [tz1, tz2] = slab(dir.z, -az, az);
      const tmin = Math.max(tx1, ty1, tz1);
      const tmax = Math.min(tx2, ty2, tz2);
      return tmin > EPS ? tmin : tmax > EPS ? tmax : 1;
    }

    function computeTarget(type: string) {
      for (let i = 0; i < count; i++) {
        const vx = fromArr[i * 3], vy = fromArr[i * 3 + 1], vz = fromArr[i * 3 + 2];
        const len = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
        const dir = { x: vx / len, y: vy / len, z: vz / len };
        if (type === "sphere") {
          toArr[i * 3] = sphereArr[i * 3];
          toArr[i * 3 + 1] = sphereArr[i * 3 + 1];
          toArr[i * 3 + 2] = sphereArr[i * 3 + 2];
          continue;
        }
        let t = 1;
        if (type === "triangle") t = intersectRegularPrism(3, dir, 1, 0.9);
        if (type === "square") t = intersectBox(dir, 1, 0.9, 1);
        if (type === "rectangle") t = intersectBox(dir, 1.25, 0.9, 0.85);
        if (type === "pentagon") t = intersectRegularPrism(5, dir, 1, 0.9);
        toArr[i * 3] = dir.x * t;
        toArr[i * 3 + 1] = dir.y * t;
        toArr[i * 3 + 2] = dir.z * t;
      }
      (base.attributes.aTo as THREE.BufferAttribute).needsUpdate = true;
    }

    function easeInOut(t: number) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function commitFromCurrent() {
      const m = material.uniforms.uMorph.value;
      for (let i = 0; i < count * 3; i++) {
        fromArr[i] = fromArr[i] * (1 - m) + toArr[i] * m;
      }
      (base.attributes.aFrom as THREE.BufferAttribute).needsUpdate = true;
      material.uniforms.uMorph.value = 0;
    }

    const nonSphere = ["triangle", "square", "rectangle", "pentagon"];
    let nonIndex = 0;
    let sinceSphere = 0;

    function pickNextType() {
      if (sinceSphere >= 3) {
        sinceSphere = 0;
        return "sphere";
      }
      const t = nonSphere[nonIndex % nonSphere.length];
      nonIndex++;
      sinceSphere++;
      return t;
    }

    function bumpLabel() {
      label.textContent = words[wordIndex % words.length];
      wordIndex++;
    }

    function morphToNext() {
      if (morphing) return;
      morphing = true;
      commitFromCurrent();
      const nextType = pickNextType();
      computeTarget(nextType);
      bumpLabel();
      const start = performance.now();
      const dur = 1200;
      function tick(now: number) {
        const t = Math.min(1, (now - start) / dur);
        material.uniforms.uMorph.value = easeInOut(t);
        if (t < 1) requestAnimationFrame(tick);
        else morphing = false;
      }
      requestAnimationFrame(tick);
    }

    renderer.domElement.addEventListener("pointerdown", morphToNext, { signal: abort.signal });
    label.textContent = words[0];
    wordIndex = 1;
    intervalId = window.setInterval(() => {
      if (!morphing) morphToNext();
    }, 2200);

    const proj = new THREE.Vector3();
    function updateLabel() {
      const rect = renderer.domElement.getBoundingClientRect();
      const cRect = container.getBoundingClientRect();
      mesh.getWorldPosition(proj);
      proj.project(camera);
      const x = (proj.x * 0.5 + 0.5) * rect.width + rect.left;
      const y = (-proj.y * 0.5 + 0.5) * rect.height + rect.top;
      label.style.left = (x - cRect.left) + "px";
      label.style.top = (y - cRect.top) + "px";
    }

    let onScreen = true;
    const visibilityIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const wasOn = onScreen;
          onScreen = entry.isIntersecting;
          if (!wasOn && onScreen && !rafId && !prefersReducedMotion) {
            clock.start();
            rafId = requestAnimationFrame(animate);
          }
        }
      },
      { threshold: 0 },
    );
    visibilityIO.observe(container);

    const clock = new THREE.Clock();
    function animate() {
      if (!onScreen) {
        rafId = 0;
        return;
      }
      material.uniforms.uTime.value = clock.getElapsedTime();
      mesh.rotation.x += 0.004;
      mesh.rotation.y += 0.006;
      updateLabel();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }

    resize();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      renderer.render(scene, camera);
      return () => {
        abort.abort();
        ro.disconnect();
        visibilityIO.disconnect();
        base.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        label.remove();
      };
    }

    animate();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (intervalId) clearInterval(intervalId);
      abort.abort();
      ro.disconnect();
      visibilityIO.disconnect();
      base.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      label.remove();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
};
