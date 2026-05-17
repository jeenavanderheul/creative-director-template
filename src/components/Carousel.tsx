import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PANEL_COUNT = 10;
const CYLINDER_RADIUS = 3.8;
const CYLINDER_HEIGHT = 4.8;

const PANEL_LABELS = [
  "VISUAL COLLECTIVE",
  "INSPIRING YOU",
  "TO INSPIRE OTHERS",
  "SYSTEMS THINKCOVALENT BANK",
  "BRAND STRATEGY",
  "CREATIVE DIRECTION",
  "DIGITAL CRAFT",
  "DESIGN SYSTEMS",
  "GROWTH ENGINE",
  "FUTURE FORWARD",
];

export const Carousel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera — slightly above, looking at center
    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.5, 11);
    camera.lookAt(0, -0.3, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Build sealed cylinder geometry — faces share edges, zero gaps
    const geometry = buildCylinderGeometry(CYLINDER_RADIUS, CYLINDER_HEIGHT, PANEL_COUNT);

    // Create placeholder materials (light gray until images load)
    const materials: THREE.MeshBasicMaterial[] = PANEL_LABELS.map(() =>
      new THREE.MeshBasicMaterial({ color: 0xd4d4d4, side: THREE.DoubleSide })
    );

    const cylinder = new THREE.Mesh(geometry, materials);
    scene.add(cylinder);


    // Load images → composite with text overlay → apply as textures
    PANEL_LABELS.forEach((label, i) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 840;
        canvas.height = 1040;
        const ctx = canvas.getContext('2d')!;

        // Draw image
        ctx.drawImage(img, 0, 0, 840, 1040);

        // Gradient overlay at bottom
        const gradient = ctx.createLinearGradient(0, 820, 0, 1040);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 820, 840, 220);

        // Text label
        ctx.fillStyle = 'white';
        ctx.font = 'bold 30px "Geist Sans", "Helvetica Neue", Arial, sans-serif';
        ctx.textBaseline = 'bottom';
        ctx.letterSpacing = '2px';
        ctx.fillText(label, 48, 1000);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        materials[i].map = texture;
        materials[i].color.set(0xffffff);
        materials[i].needsUpdate = true;
      };
      img.src = `/placeholders/image.svg`;
    });

    // Interaction state
    let rotationY = Math.PI * 0.6;
    let targetRotationY = rotationY;
    let velocity = 0;
    let isDragging = false;
    let prevX = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      velocity = 0;
      container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const diff = (e.clientX - prevX) * 0.004;
      velocity = diff;
      targetRotationY += diff;
      prevX = e.clientX;
    };

    const onPointerUp = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetRotationY += e.deltaY * 0.0015;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!isDragging) {
        velocity *= 0.96;
        targetRotationY += velocity;
      }

      rotationY += (targetRotationY - rotationY) * 0.06;
      cylinder.rotation.y = rotationY;

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] cursor-grab select-none"
    />
  );
};

/**
 * Creates a decagonal prism geometry with per-face UVs and material groups.
 * Non-indexed so each face has independent UVs (full 0-1 mapping per panel).
 * Adjacent faces share edge positions exactly — no gaps in WebGL rendering.
 */
function buildCylinderGeometry(radius: number, height: number, segments: number) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const normals: number[] = [];
  const h2 = height / 2;

  const GAP = 0.012; // fraction of panel width to inset on each side

  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * Math.PI * 2;
    const a2 = ((i + 1) / segments) * Math.PI * 2;

    // Inset edges to create gap between panels
    const aGap = (a2 - a1) * GAP;
    const a1g = a1 + aGap;
    const a2g = a2 - aGap;

    const x1 = Math.sin(a1g) * radius;
    const z1 = Math.cos(a1g) * radius;
    const x2 = Math.sin(a2g) * radius;
    const z2 = Math.cos(a2g) * radius;

    // Outward-facing normal (average of edge normals)
    const midA = (a1 + a2) / 2;
    const nx = Math.sin(midA);
    const nz = Math.cos(midA);

    // Triangle 1: top-left, bottom-left, top-right
    positions.push(x1, h2, z1);
    uvs.push(1, 1);
    normals.push(nx, 0, nz);

    positions.push(x1, -h2, z1);
    uvs.push(1, 0);
    normals.push(nx, 0, nz);

    positions.push(x2, h2, z2);
    uvs.push(0, 1);
    normals.push(nx, 0, nz);

    // Triangle 2: top-right, bottom-left, bottom-right
    positions.push(x2, h2, z2);
    uvs.push(0, 1);
    normals.push(nx, 0, nz);

    positions.push(x1, -h2, z1);
    uvs.push(1, 0);
    normals.push(nx, 0, nz);

    positions.push(x2, -h2, z2);
    uvs.push(0, 0);
    normals.push(nx, 0, nz);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

  for (let i = 0; i < segments; i++) {
    geo.addGroup(i * 6, 6, i);
  }

  return geo;
}
