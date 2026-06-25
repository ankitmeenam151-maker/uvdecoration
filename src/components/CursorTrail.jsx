"use client";

import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Disable on mobile/touch screen devices to safeguard browser performance
    if (
      typeof window === "undefined" ||
      "ontouchstart" in window ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const mouse = { x: 0, y: 0 };
    let hasMoved = false;

    // 10 points to make the trail look silky and fluid without rendering lag
    const numPoints = 10;
    const points = Array.from({ length: numPoints }).map(() => ({ x: 0, y: 0 }));

    // Handle canvas resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas, { passive: true });
    resizeCanvas();

    // Mouse coordinates tracker
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        // Instantly position all points at cursor on first mouse entry
        points.forEach((p) => {
          p.x = mouse.x;
          p.y = mouse.y;
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Performance-optimized render loop using requestAnimationFrame
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (hasMoved) {
        // Lerp coordinate math for silky smooth delayed trailing effect
        points[0].x += (mouse.x - points[0].x) * 0.28;
        points[0].y += (mouse.y - points[0].y) * 0.28;

        for (let i = 1; i < numPoints; i++) {
          points[i].x += (points[i - 1].x - points[i].x) * 0.28;
          points[i].y += (points[i - 1].y - points[i].y) * 0.28;
        }

        // Draw curving silky line path
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < numPoints - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        // Luxury brand color gradient matching pink/gold colors
        const gradient = ctx.createLinearGradient(
          points[0].x, points[0].y,
          points[numPoints - 1].x, points[numPoints - 1].y
        );
        gradient.addColorStop(0, "rgba(255, 154, 158, 0.35)");  // Primary pink
        gradient.addColorStop(0.5, "rgba(255, 154, 158, 0.15)");
        gradient.addColorStop(1, "rgba(214, 175, 87, 0)");       // Gold fadeout

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Accent tip dot
        ctx.beginPath();
        ctx.arc(points[0].x, points[0].y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 154, 158, 0.5)";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // Cleanup listeners
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[99999] select-none"
    />
  );
}
