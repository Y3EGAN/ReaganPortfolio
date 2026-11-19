"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };
type Pursuit = { position: Point; guidance: Point };

const copper = "#edb080";
const ink = "#17262d";
const responseRate = 7;

function advancePursuit({ position, guidance }: Pursuit, waypoint: Point, seconds: number): Pursuit {
  const time = seconds * responseRate;
  const decay = Math.exp(-time);
  const dx = guidance.x - waypoint.x;
  const dy = guidance.y - waypoint.y;

  // Two cascaded filters form a critically damped system with continuous velocity.
  return {
    position: {
      x: waypoint.x + (position.x - waypoint.x + dx * time) * decay,
      y: waypoint.y + (position.y - waypoint.y + dy * time) * decay,
    },
    guidance: { x: waypoint.x + dx * decay, y: waypoint.y + dy * decay },
  };
}

function drawNavigation(context: CanvasRenderingContext2D, pursuit: Pursuit, waypoint: Point, heading: number) {
  const { position } = pursuit;

  context.lineCap = "round";
  context.beginPath();
  context.moveTo(position.x, position.y);
  // Forecast the rover's path if the pointer stays at this waypoint.
  for (let step = 1; step <= 20; step++) {
    const { position: predicted } = advancePursuit(pursuit, waypoint, step * .06);
    context.lineTo(predicted.x, predicted.y);
  }
  context.lineTo(waypoint.x, waypoint.y);
  context.setLineDash([3, 6]);
  context.strokeStyle = "rgba(23, 38, 45, .6)";
  context.lineWidth = 3;
  context.stroke();
  context.strokeStyle = copper;
  context.lineWidth = 1.25;
  context.stroke();
  context.setLineDash([]);

  context.beginPath();
  context.arc(waypoint.x, waypoint.y, 7, 0, Math.PI * 2);
  context.moveTo(waypoint.x - 3, waypoint.y);
  context.lineTo(waypoint.x + 3, waypoint.y);
  context.moveTo(waypoint.x, waypoint.y - 3);
  context.lineTo(waypoint.x, waypoint.y + 3);
  context.strokeStyle = ink;
  context.lineWidth = 3;
  context.stroke();
  context.strokeStyle = copper;
  context.lineWidth = 1.25;
  context.stroke();

  context.save();
  context.translate(position.x, position.y);
  context.rotate(heading);
  context.fillStyle = ink;
  context.strokeStyle = copper;
  context.beginPath();
  context.roundRect(-9, -6, 18, 12, 3);
  context.roundRect(-7, -9, 5, 3, 1);
  context.roundRect(2, -9, 5, 3, 1);
  context.roundRect(-7, 6, 5, 3, 1);
  context.roundRect(2, 6, 5, 3, 1);
  context.fill();
  context.stroke();

  context.beginPath();
  context.moveTo(12, 0);
  context.lineTo(22, 0);
  context.moveTo(18, -3);
  context.lineTo(22, 0);
  context.lineTo(18, 3);
  context.stroke();
  context.restore();
}

export default function RoverNavigation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const portrait = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !portrait || !context) return;

    const motion = window.matchMedia(
      "(min-width: 881px) and (any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let bounds = canvas.getBoundingClientRect();
    let scale = 0;
    let pursuit: Pursuit = { position: { x: 0, y: 0 }, guidance: { x: 0, y: 0 } };
    let heading = -Math.PI / 4;
    let waypoint: Point | null = null;
    let previousTime = 0;
    let frame = 0;

    const hideNavigation = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      waypoint = null;
      pursuit = { position: pursuit.position, guidance: pursuit.position };
      canvas.removeAttribute("data-active");
    };

    const resizeNavigation = () => {
      const nextBounds = canvas.getBoundingClientRect();
      const nextScale = Math.min(window.devicePixelRatio || 1, 2);
      if (nextBounds.width === bounds.width && nextBounds.height === bounds.height && nextScale === scale) return;

      hideNavigation();
      bounds = nextBounds;
      scale = nextScale;
      canvas.width = Math.round(bounds.width * scale);
      canvas.height = Math.round(bounds.height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const start = { x: bounds.width * .22, y: bounds.height * .72 };
      pursuit = { position: start, guidance: start };
      heading = -Math.PI / 4;
    };

    const animate = (time: number) => {
      frame = 0;
      if (!waypoint) return;

      const seconds = Math.min(.05, Math.max(0, (time - previousTime) / 1000));
      previousTime = time;
      pursuit = advancePursuit(pursuit, waypoint, seconds);
      const { position, guidance } = pursuit;
      const dx = guidance.x - position.x;
      const dy = guidance.y - position.y;
      const speed = responseRate * Math.hypot(dx, dy);
      if (speed > 2) {
        const turn = Math.atan2(dy, dx) - heading;
        const shortestTurn = Math.atan2(Math.sin(turn), Math.cos(turn));
        heading += shortestTurn * (1 - Math.exp(-14 * seconds));
      }

      const settled = speed < 1 && Math.hypot(waypoint.x - position.x, waypoint.y - position.y) < .2;
      if (settled) pursuit = { position: waypoint, guidance: waypoint };

      context.clearRect(0, 0, bounds.width, bounds.height);
      drawNavigation(context, pursuit, waypoint, heading);
      canvas.setAttribute("data-active", "");

      if (!settled) frame = requestAnimationFrame(animate);
    };

    const setWaypoint = (event: PointerEvent) => {
      if (!motion.matches || event.pointerType !== "mouse") return;

      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      if (x < 0 || x >= bounds.width || y < 0 || y >= bounds.height) return;
      if (waypoint?.x === x && waypoint.y === y) return;

      waypoint = { x, y };
      if (!frame) {
        previousTime = performance.now();
        frame = requestAnimationFrame(animate);
      }
    };

    const observer = new ResizeObserver(resizeNavigation);
    observer.observe(canvas);
    portrait.addEventListener("pointermove", setWaypoint);
    portrait.addEventListener("pointerleave", hideNavigation);
    motion.addEventListener("change", resizeNavigation);
    resizeNavigation();

    return () => {
      hideNavigation();
      observer.disconnect();
      portrait.removeEventListener("pointermove", setWaypoint);
      portrait.removeEventListener("pointerleave", hideNavigation);
      motion.removeEventListener("change", resizeNavigation);
    };
  }, []);

  return <canvas ref={canvasRef} className="rover-navigation" aria-hidden="true" />;
}
