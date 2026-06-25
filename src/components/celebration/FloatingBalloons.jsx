"use client";

import { useEffect, useState } from "react";

const COLORS = [
  "#FF9A9E", // pink
  "#D4AF37", // gold
  "#FFB3C1", // soft rose
  "#FFD700", // gold bright
  "#FF6B9D", // hot pink
  "#C9A0DC", // lavender
];

// Generate exactly 6 balloons (half the original amount) to optimize rendering overhead
const balloonsConfig = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  size: 34 + (i * 8) % 22,            // 34px to 56px (smaller sizes look cleaner)
  left: 12 + (i * 17) % 76,           // spread across the screen
  duration: 14 + (i * 3) % 7,         // 14s to 21s (slow, luxury movement)
  delay: i * 3.2,                     // staggered start
  color: COLORS[i % COLORS.length],
  wobble: i % 2 === 0 ? "wobble-left" : "wobble-right"
}));

export default function FloatingBalloons() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-[3]"
      aria-hidden="true"
    >
      {/* High-performance CSS transitions running on GPU compositor layer */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-up {
          0% {
            transform: translate3d(0, 105vh, 0);
          }
          100% {
            transform: translate3d(0, -120px, 0);
          }
        }
        @keyframes sway-left {
          0%, 100% { transform: translate3d(-6px, 0, 0); }
          50% { transform: translate3d(6px, 0, 0); }
        }
        @keyframes sway-right {
          0%, 100% { transform: translate3d(6px, 0, 0); }
          50% { transform: translate3d(-6px, 0, 0); }
        }
        .balloon-wrapper {
          will-change: transform;
          animation-name: float-up;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        .balloon-sway-left {
          animation: sway-left 5s ease-in-out infinite;
        }
        .balloon-sway-right {
          animation: sway-right 5.5s ease-in-out infinite;
        }
      `}} />

      {balloonsConfig.map((b) => (
        <div
          key={b.id}
          className="absolute balloon-wrapper"
          style={{
            left: `${b.left}%`,
            bottom: "0",
            width: `${b.size}px`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <div className={b.wobble === "wobble-left" ? "balloon-sway-left" : "balloon-sway-right"}>
            <svg
              viewBox="0 0 60 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", height: "auto", opacity: 0.65 }}
            >
              {/* Balloon body */}
              <ellipse cx="30" cy="28" rx="26" ry="28" fill={b.color} />
              {/* Shine highlight */}
              <ellipse cx="20" cy="16" rx="7" ry="5" fill="white" fillOpacity="0.25" />
              {/* Knot */}
              <ellipse cx="30" cy="57" rx="3" ry="2.5" fill={b.color} />
              {/* String */}
              <path
                d="M30 60 Q26 72 30 82 Q34 90 30 90"
                stroke={b.color}
                strokeWidth="1.2"
                fill="none"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
