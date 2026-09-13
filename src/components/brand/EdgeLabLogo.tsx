import React from "react";

interface EdgeLabLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const EdgeLabLogo: React.FC<EdgeLabLogoProps> = ({
  className = "",
  showText = true,
  size = "md",
}) => {
  const iconDimensions = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  }[size];

  const textSize = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  }[size];

  const aiBadgeSize = {
    sm: "text-[9px] px-1 py-0.2",
    md: "text-[10px] px-1.5 py-0.5",
    lg: "text-xs px-2 py-0.5",
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Unique Geometric Insignia */}
      <div
        className={`relative ${iconDimensions} rounded-xl bg-gradient-to-br from-cyprus-900 via-cyprus-950 to-[#021811] p-1.5 flex items-center justify-center border border-cyprus-400/40 shadow-[0_0_15px_-3px_rgba(33,241,168,0.35)] shrink-0 transition-transform hover:scale-105`}
      >
        {/* Soft Ambient Core Glow */}
        <div className="absolute inset-0 rounded-xl bg-cyprus-400/15 blur-sm pointer-events-none" />

        {/* High-Definition Custom SVG Insignia: Interlocking Alpha Edge + Quant Node Matrix */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          <defs>
            <linearGradient id="tiffany-gradient-primary" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#21F1A8" />
              <stop offset="100%" stopColor="#0B8A5D" />
            </linearGradient>

            <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Geometric Diamond Prism Base Grid */}
          <path
            d="M16 3L28 9.5V22.5L16 29L4 22.5V9.5L16 3Z"
            stroke="url(#tiffany-gradient-primary)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="opacity-40"
          />

          {/* Ascending Quantitative "Edge" Trend Delta */}
          <path
            d="M8 21L14 15L18 19L24 10"
            stroke="url(#tiffany-gradient-primary)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#logo-glow)"
          />

          {/* Upward Alpha Arrowhead */}
          <path
            d="M19.5 10H24V14.5"
            stroke="#21F1A8"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central Lab Deterministic Node & Core Intersection */}
          <circle cx="18" cy="19" r="2.2" fill="#21F1A8" stroke="#03281C" strokeWidth="1" />
          <circle cx="14" cy="15" r="1.8" fill="#FFFFFF" />
          <circle cx="8" cy="21" r="1.8" fill="#21F1A8" />
          <circle cx="24" cy="10" r="2" fill="#FFFFFF" filter="url(#logo-glow)" />

          {/* Lower "E" Stabilizer Bar */}
          <path
            d="M10 25H22"
            stroke="#21F1A8"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="2 3"
            className="opacity-75"
          />
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-white ${textSize}`}>
              Edge<span className="text-cyprus-400">Lab</span>
            </span>
            <span
              className={`font-mono font-black uppercase rounded-md bg-cyprus-400/20 text-cyprus-400 border border-cyprus-400/50 shadow-xs tracking-wider ${aiBadgeSize}`}
            >
              AI
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
