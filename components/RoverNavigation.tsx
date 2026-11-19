"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };
type Pose = Point & { heading: number };
type Route = {
  start: Pose;
  departure: Point;
  approach: Point;
  waypoint: Point;
  startTime: number;
  duration: number;
};

const copper = "#edb080";
const ink = "#17262d";

function drawNavigation(context: CanvasRenderingContext2D, route: Route, rover: Pose) {
  const { start, departure, approach, waypoint } = route;

  context.lineCap = "round";
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.bezierCurveTo(departure.x, departure.y, approach.x, approach.y, waypoint.x, waypoint.y);
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
  context.translate(rover.x, rover.y);
  context.rotate(rover.heading);
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
    let rover: Pose = { x: 0, y: 0, heading: -Math.PI / 4 };
    let route: Route | null = null;
    let frame = 0;

    const hideNavigation = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      route = null;
      canvas.removeAttribute("data-active");
    };

    const resizeNavigation = () => {
      hideNavigation();
      bounds = canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(bounds.width * scale);
      canvas.height = Math.round(bounds.height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      rover = { x: bounds.width * .22, y: bounds.height * .72, heading: -Math.PI / 4 };
    };

    const animate = (time: number) => {
      frame = 0;
      if (!route) return;

      const { start, departure, approach, waypoint, startTime, duration } = route;
      const progress = Math.min(1, Math.max(0, (time - startTime) / duration));
      const t = 1 - (1 - progress) ** 1.35;
      const u = 1 - t;

      // Follow the cubic Bézier curve and orient the chassis along its tangent.
      const x = u ** 3 * start.x + 3 * u ** 2 * t * departure.x + 3 * u * t ** 2 * approach.x + t ** 3 * waypoint.x;
      const y = u ** 3 * start.y + 3 * u ** 2 * t * departure.y + 3 * u * t ** 2 * approach.y + t ** 3 * waypoint.y;
      const dx = u ** 2 * (departure.x - start.x) + 2 * u * t * (approach.x - departure.x) + t ** 2 * (waypoint.x - approach.x);
      const dy = u ** 2 * (departure.y - start.y) + 2 * u * t * (approach.y - departure.y) + t ** 2 * (waypoint.y - approach.y);
      const heading = Math.hypot(dx, dy) > .01 ? Math.atan2(dy, dx) : rover.heading;
      rover = { x, y, heading };

      context.clearRect(0, 0, bounds.width, bounds.height);
      drawNavigation(context, route, rover);
      canvas.setAttribute("data-active", "");

      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    const setWaypoint = (event: PointerEvent) => {
      if (!motion.matches || event.pointerType !== "mouse") return;

      const waypoint = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      if (waypoint.x < 0 || waypoint.x >= bounds.width || waypoint.y < 0 || waypoint.y >= bounds.height) return;
      if (route?.waypoint.x === waypoint.x && route.waypoint.y === waypoint.y) return;

      const dx = waypoint.x - rover.x;
      const dy = waypoint.y - rover.y;
      const distance = Math.hypot(dx, dy);
      const forwardX = Math.cos(rover.heading);
      const forwardY = Math.sin(rover.heading);
      const turn = Math.min(0, forwardX * dx + forwardY * dy) * .32;
      const lead = Math.min(distance * .48, 120);

      route = {
        start: rover,
        departure: {
          x: Math.max(0, Math.min(bounds.width, rover.x + forwardX * lead)),
          y: Math.max(0, Math.min(bounds.height, rover.y + forwardY * lead)),
        },
        // Give the curve room to turn when the next waypoint is behind the rover.
        approach: {
          x: Math.max(0, Math.min(bounds.width, waypoint.x - dx * .24 - forwardY * turn)),
          y: Math.max(0, Math.min(bounds.height, waypoint.y - dy * .24 + forwardX * turn)),
        },
        waypoint,
        startTime: performance.now(),
        duration: Math.max(180, Math.min(1600, distance * 3.4)),
      };

      if (!frame) frame = requestAnimationFrame(animate);
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
