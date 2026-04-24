"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function NavBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const dots = svgRef.current.querySelectorAll(".nav-dot");
    const lines = svgRef.current.querySelectorAll(".nav-line");

    // Stagger breathe animation on dots
    gsap.to(dots, {
      opacity: 0.08,
      scale: 1.5,
      duration: 2.4,
      ease: "sine.inOut",
      stagger: {
        each: 0.18,
        repeat: -1,
        yoyo: true,
        from: "random",
      },
    });

    // Slow drift on lines
    gsap.to(lines, {
      strokeDashoffset: -60,
      duration: 6,
      ease: "none",
      repeat: -1,
      stagger: {
        each: 0.9,
        from: "start",
      },
    });

    return () => {
      gsap.killTweensOf(dots);
      gsap.killTweensOf(lines);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="navGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.06" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow pools */}
      <ellipse cx="20%" cy="50%" rx="120" ry="40" fill="url(#navGlow)" className="text-primary" />
      <ellipse cx="80%" cy="50%" rx="100" ry="35" fill="url(#navGlow)" className="text-primary" />

      {/* Drifting dash lines */}
      {[10, 30, 60, 85].map((x, i) => (
        <line
          key={i}
          className="nav-line"
          x1={`${x}%`} y1="0%"
          x2={`${x}%`} y2="100%"
          stroke="currentColor"
          strokeOpacity="0.04"
          strokeWidth="1"
          strokeDasharray="4 20"
          strokeDashoffset="0"
        />
      ))}

      {/* Micro dots grid */}
      {Array.from({ length: 18 }).map((_, i) => {
        const cx = `${5 + (i % 9) * 11.5}%`;
        const cy = i < 9 ? "30%" : "70%";
        return (
          <circle
            key={i}
            className="nav-dot"
            cx={cx}
            cy={cy}
            r="1.5"
            fill="currentColor"
            opacity="0.04"
          />
        );
      })}
    </svg>
  );
}