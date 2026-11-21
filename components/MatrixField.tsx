"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };
type Fold = Point & { radius: number; strength: number };
type Region = Point & { width: number; height: number };
const spacing = 44;
const edge = spacing * 2 / Math.sqrt(3);
const tilt = -Math.PI / 14;
const directions = [0, Math.PI / 3, 2 * Math.PI / 3].map(angle => ({
  x: Math.cos(angle + tilt),
  y: Math.sin(angle + tilt),
}));

function foldWeight(x: number, y: number, fold: Fold) {
  const distanceSquared = (x - fold.x) ** 2 + (y - fold.y) ** 2;
  return fold.strength * Math.max(0, 1 - distanceSquared / fold.radius ** 2) ** 2;
}

function foldVertex(x: number, y: number, fold: Fold): Point {
  const axis = directions[0];
  const dx = x - fold.x;
  const dy = y - fold.y;
  const u = dx * axis.x + dy * axis.y;
  const v = -dx * axis.y + dy * axis.x;
  const weight = foldWeight(x, y, fold);

  // Project the depth of two intersecting folds along the lattice's axes.
  const along = weight * (.79 * Math.abs(v) - .26 * u);
  const across = weight * (-.96 * Math.abs(u) - .33 * v);
  return { x: x + along * axis.x - across * axis.y, y: y + along * axis.y + across * axis.x };
}

function paintFacets(context: CanvasRenderingContext2D, fold: Fold, light: string, shade: string) {
  const [first, second] = directions;
  const determinant = first.x * second.y - first.y * second.x;
  const column = Math.floor((fold.x * second.y - fold.y * second.x) / (edge * determinant));
  const row = Math.floor((first.x * fold.y - first.y * fold.x) / (edge * determinant));
  const reach = Math.ceil(fold.radius / spacing) + 1;
  const a = { x: first.x * edge, y: first.y * edge };
  const b = { x: second.x * edge, y: second.y * edge };

  for (let j = row - reach; j <= row + reach; j++) {
    for (let i = column - reach; i <= column + reach; i++) {
      const x = i * a.x + j * b.x;
      const y = i * a.y + j * b.y;

      for (let face = 0; face < 2; face++) {
        const centroid = (face + 1) / 3;
        const weight = foldWeight(x + (a.x + b.x) * centroid, y + (a.y + b.y) * centroid, fold);
        if (weight < .015) continue;

        const p = foldVertex(x + face * (a.x + b.x), y + face * (a.y + b.y), fold);
        const q = foldVertex(x + a.x, y + a.y, fold);
        const r = foldVertex(x + b.x, y + b.y, fold);

        context.beginPath();
        context.moveTo(p.x, p.y);
        context.lineTo(q.x, q.y);
        context.lineTo(r.x, r.y);
        context.closePath();
        context.fillStyle = face === 0 ? light : shade;
        context.globalAlpha = weight * (face === 0 ? .21 : .32);
        context.fill();
      }
    }
  }
}

function strokeLattice(context: CanvasRenderingContext2D, extent: number, major: boolean, fold?: Fold) {
  const count = Math.ceil(extent / spacing);

  context.beginPath();
  for (const { x: dx, y: dy } of directions) {
    for (let index = -count; index <= count; index++) {
      if ((index % 4 === 0) !== major) continue;

      const offset = index * spacing;
      const x = -dy * offset;
      const y = dx * offset;
      context.moveTo(x - dx * extent, y - dy * extent);

      if (fold) {
        const across = fold.y * dx - fold.x * dy - offset;
        const chordSquared = fold.radius ** 2 - across ** 2;

        if (chordSquared > 0) {
          const along = fold.x * dx + fold.y * dy;
          const halfChord = Math.sqrt(chordSquared);
          const stagger = index % 2 * edge / 2;
          const first = Math.floor((along - halfChord - stagger) / edge);
          const last = Math.ceil((along + halfChord - stagger) / edge);

          // Connect the shared vertices directly so each facet keeps straight edges.
          for (let vertex = first; vertex <= last; vertex++) {
            const position = vertex * edge + stagger;
            const point = foldVertex(x + dx * position, y + dy * position, fold);
            context.lineTo(point.x, point.y);
          }
        }
      }

      context.lineTo(x + dx * extent, y + dy * extent);
    }
  }

  context.globalAlpha = major ? .23 : .12;
  context.lineWidth = major ? 1 : .8;
  context.stroke();
}

export default function MatrixField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const pane = canvas?.closest(".resume-pane");
    const context = canvas?.getContext("2d");
    const background = document.createElement("canvas");
    const backgroundContext = background.getContext("2d");
    if (!canvas || !pane || !context || !backgroundContext) return;

    const motion = window.matchMedia(
      "(min-width: 881px) and (any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const palette = getComputedStyle(canvas);
    const light = palette.getPropertyValue("--paper").trim();
    const shade = palette.getPropertyValue("--ink").trim();
    let width = 0;
    let height = 0;
    let scale = 0;
    let frame = 0;
    let lastTime = 0;
    let target: Point | null = null;
    let fold: Fold | undefined;
    let previousRegion: Region | undefined;

    const paint = (layer: CanvasRenderingContext2D, distortion?: Fold) => {
      const extent = Math.hypot(width, height) / 2 + spacing * 2;
      layer.save();
      layer.scale(scale, scale);
      layer.translate(width / 2, height / 2);

      if (distortion) {
        const { x, y, radius } = distortion;
        layer.beginPath();
        layer.arc(x, y, radius, 0, 2 * Math.PI);
        layer.clip();
        layer.clearRect(x - radius, y - radius, radius * 2, radius * 2);
        paintFacets(layer, distortion, light, shade);
      }

      layer.strokeStyle = light;
      strokeLattice(layer, extent, false, distortion);
      strokeLattice(layer, extent, true, distortion);
      layer.restore();
    };

    const draw = () => {
      // Restore only the area touched last frame. The rest of the lattice is stationary.
      if (previousRegion) {
        const { x, y, width: regionWidth, height: regionHeight } = previousRegion;
        context.clearRect(x, y, regionWidth, regionHeight);
        context.drawImage(background, x, y, regionWidth, regionHeight, x, y, regionWidth, regionHeight);
        previousRegion = undefined;
      }

      if (!fold) return;

      const { x, y, radius } = fold;
      const left = Math.max(0, Math.floor((x + width / 2 - radius) * scale) - 1);
      const top = Math.max(0, Math.floor((y + height / 2 - radius) * scale) - 1);
      const right = Math.min(canvas.width, Math.ceil((x + width / 2 + radius) * scale) + 1);
      const bottom = Math.min(canvas.height, Math.ceil((y + height / 2 + radius) * scale) + 1);
      if (right <= left || bottom <= top) return;

      previousRegion = { x: left, y: top, width: right - left, height: bottom - top };
      paint(context, fold);
    };

    const animate = (time: number) => {
      frame = 0;
      if (!fold) return;

      const delta = Math.min(.05, Math.max(0, (time - lastTime) / 1000));
      lastTime = time;
      const dx = target ? target.x - fold.x : 0;
      const dy = target ? target.y - fold.y : 0;
      const distance = Math.hypot(dx, dy);
      const ease = Math.max(1 - Math.exp(-20 * delta), 1 - 26 / Math.max(26, distance));
      fold.x += dx * ease;
      fold.y += dy * ease;

      const strength = target ? 1 : 0;
      fold.strength += (strength - fold.strength) * (1 - Math.exp(-(target ? 16 : 7) * delta));
      const settled = distance < .1 && Math.abs(strength - fold.strength) < .005;
      if (settled) {
        fold = target ? { ...target, radius: fold.radius, strength } : undefined;
      }
      draw();

      if (!settled) frame = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (frame) return;

      lastTime = performance.now();
      frame = requestAnimationFrame(animate);
    };

    const resetMotion = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      target = null;
      fold = undefined;
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const nextScale = Math.min(window.devicePixelRatio || 1, 2);
      if (bounds.width === width && bounds.height === height && nextScale === scale) return;

      width = bounds.width;
      height = bounds.height;
      scale = nextScale;
      resetMotion();
      previousRegion = undefined;
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      background.width = canvas.width;
      background.height = canvas.height;
      if (width && height) {
        paint(backgroundContext);
        context.drawImage(background, 0, 0);
      }
    };

    const follow = (event: Event) => {
      if (!(event instanceof PointerEvent) || event.pointerType !== "mouse" || !motion.matches || !width || !height) return;

      const { left, top } = canvas.getBoundingClientRect();
      target = { x: event.clientX - left - width / 2, y: event.clientY - top - height / 2 };
      fold ??= { ...target, radius: Math.min(146, width / 4), strength: 0 };
      startAnimation();
    };

    const leave = () => {
      target = null;
      if (fold) startAnimation();
    };
    const onMotionChange = () => {
      if (motion.matches) return;

      resetMotion();
      if (width && height) draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    pane.addEventListener("pointermove", follow, { passive: true });
    pane.addEventListener("pointerleave", leave);
    motion.addEventListener("change", onMotionChange);
    resize();

    return () => {
      resetMotion();
      observer.disconnect();
      pane.removeEventListener("pointermove", follow);
      pane.removeEventListener("pointerleave", leave);
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <div className="matrix-field" aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
