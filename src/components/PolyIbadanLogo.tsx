import React from 'react';

interface PolyIbadanLogoProps {
  className?: string;
  size?: number;
}

export const PolyIbadanLogo: React.FC<PolyIbadanLogoProps> = ({ 
  className = '', 
  size = 48 
}) => {
  // 12 star rays with dual facets (Brown on left, Grey on right)
  const rayAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 270"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="The Polytechnic, Ibadan Official Logo"
      >
        <defs>
          {/* Text paths for curved text */}
          <path
            id="polyTextArcTop"
            d="M 58 115 A 58 58 0 0 1 182 115"
          />
          <path
            id="polyTextArcBottom"
            d="M 182 118 A 58 58 0 0 1 58 118"
          />
          <path
            id="bannerTextArc"
            d="M 40 226 Q 120 252 200 226"
          />
        </defs>

        {/* 12 Sunburst / Gear Cog Rays centered at (120, 115) */}
        <g id="cog-starburst">
          {rayAngles.map((angle, index) => {
            // Draw dual faceted chevron ray
            return (
              <g key={index} transform={`rotate(${angle} 120 115)`}>
                {/* Left facet: Warm Brown */}
                <path
                  d="M 120 115 L 105 40 L 120 18 Z"
                  fill="#995325"
                  stroke="#2B1810"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Right facet: Warm Grey/Silver */}
                <path
                  d="M 120 115 L 120 18 L 135 40 Z"
                  fill="#9D958C"
                  stroke="#2B1810"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}
        </g>

        {/* Central Circular Seal Base Outline */}
        <circle cx="120" cy="115" r="76" fill="#FFFFFF" stroke="#2B1810" strokeWidth="4" />

        {/* Outer Brown Ring with Institution Name */}
        <circle cx="120" cy="115" r="74" fill="#995325" stroke="#2B1810" strokeWidth="2.5" />
        <circle cx="120" cy="115" r="50" fill="#9D958C" stroke="#2B1810" strokeWidth="2.5" />

        {/* Top Arc Text: THE POLYTECHNIC */}
        <text
          fill="#1C1008"
          fontSize="13"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="1.8"
        >
          <textPath href="#polyTextArcTop" startOffset="50%" textAnchor="middle">
            THE POLYTECHNIC
          </textPath>
        </text>

        {/* Bottom Arc Text: IBADAN */}
        <text
          fill="#1C1008"
          fontSize="13"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="2.2"
        >
          <textPath href="#polyTextArcBottom" startOffset="50%" textAnchor="middle">
            IBADAN
          </textPath>
        </text>

        {/* Inner Field Decor: Thin circular boundary */}
        <circle cx="120" cy="115" r="49" fill="#9D958C" stroke="#2B1810" strokeWidth="1.5" />

        {/* Inner Symbols Group centered at (120, 115) */}
        <g id="inner-symbols">
          {/* Horizontal River / Wave representation */}
          <path
            d="M 76 116 Q 87 111 98 116 T 120 116 T 142 116 T 164 116"
            fill="none"
            stroke="#2B1810"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Crossed Tools behind T-Square */}
          {/* Diagonal Tool 1: File/Chisel/Pencil (Top-Left to Bottom-Right) */}
          <g transform="rotate(-45 120 115)">
            {/* Handle at bottom */}
            <rect x="117" y="125" width="6" height="20" rx="3" fill="#FFFFFF" stroke="#2B1810" strokeWidth="2" />
            {/* Blade/shaft */}
            <rect x="117.5" y="70" width="5" height="55" fill="#FFFFFF" stroke="#2B1810" strokeWidth="2" />
            {/* Tip */}
            <polygon points="117.5,70 120,64 122.5,70" fill="#FFFFFF" stroke="#2B1810" strokeWidth="1.5" />
          </g>

          {/* Diagonal Tool 2: Open-end Spanner/Wrench (Bottom-Left to Top-Right) */}
          <g transform="rotate(45 120 115)">
            {/* Shaft */}
            <rect x="117" y="78" width="6" height="55" fill="#FFFFFF" stroke="#2B1810" strokeWidth="2" />
            {/* Upper Spanner Head */}
            <path
              d="M 114 78 C 110 74 112 65 120 65 C 128 65 130 74 126 78 L 123 74 L 117 74 Z"
              fill="#FFFFFF"
              stroke="#2B1810"
              strokeWidth="2"
            />
            {/* Lower Handle Base */}
            <circle cx="120" cy="138" r="5.5" fill="#FFFFFF" stroke="#2B1810" strokeWidth="2" />
            <circle cx="120" cy="138" r="2" fill="#2B1810" />
          </g>

          {/* White Capital "T" (T-Square / Anvil) */}
          {/* Horizontal bar of T */}
          <rect
            x="96"
            y="88"
            width="48"
            height="11"
            rx="1.5"
            fill="#FFFFFF"
            stroke="#2B1810"
            strokeWidth="2.5"
          />
          {/* Vertical stem of T */}
          <rect
            x="114"
            y="98"
            width="12"
            height="44"
            rx="1.5"
            fill="#FFFFFF"
            stroke="#2B1810"
            strokeWidth="2.5"
          />

          {/* Center Hexagonal Nut / Fastener over the cross */}
          <polygon
            points="120,110 126,113 126,119 120,122 114,119 114,113"
            fill="#9D958C"
            stroke="#2B1810"
            strokeWidth="2"
          />
          <circle cx="120" cy="116" r="2" fill="#2B1810" />
        </g>

        {/* Bottom Banner Ribbon / Scroll */}
        <g id="bottom-ribbon">
          {/* Ribbon Shadow / Fold */}
          <path
            d="M 24 205 L 14 185 L 30 185 L 42 206 Z"
            fill="#756D65"
            stroke="#2B1810"
            strokeWidth="2"
          />
          <path
            d="M 216 205 L 226 185 L 210 185 L 198 206 Z"
            fill="#756D65"
            stroke="#2B1810"
            strokeWidth="2"
          />

          {/* Left Ribbon Curl */}
          <path
            d="M 12 186 C 10 178 18 172 26 174 C 32 176 34 182 32 192 L 20 220 L 10 205 Z"
            fill="#9D958C"
            stroke="#2B1810"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Right Ribbon Curl */}
          <path
            d="M 228 186 C 230 178 222 172 214 174 C 208 176 206 182 208 192 L 220 220 L 230 205 Z"
            fill="#9D958C"
            stroke="#2B1810"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Main Curved Banner Body */}
          <path
            d="M 18 195 Q 120 220 222 195 L 228 226 Q 120 258 12 226 Z"
            fill="#9D958C"
            stroke="#2B1810"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner border line on ribbon */}
          <path
            d="M 22 199 Q 120 224 218 199"
            fill="none"
            stroke="#756D65"
            strokeWidth="1"
          />
          <path
            d="M 18 222 Q 120 252 222 222"
            fill="none"
            stroke="#756D65"
            strokeWidth="1"
          />

          {/* Motto Text: "Ise loogun ise" */}
          <text
            fill="#2B1810"
            fontSize="18"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.8"
          >
            <textPath href="#bannerTextArc" startOffset="50%" textAnchor="middle">
              Ise loogun ise
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  );
};
