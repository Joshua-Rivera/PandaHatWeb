import { useId } from "react";
export function PandaMark() {
  return (
    <img className="panda-logo" src="/images/pandahat-logo.jpg" alt="" width={200} height={200} />
  );
}
export function SignalArt({ compact = false }: { compact?: boolean }) {
  const id = useId().replace(/:/g, "");
  const point = (u: number, v: number) => {
    const r = 139 + 28 * Math.sin(u * 3 + v * 2) * Math.sin(v);
    return `${280 + r * Math.sin(v) * Math.cos(u)},${267 + 177 * Math.cos(v) + 39 * Math.sin(u) * Math.sin(v) + 22 * Math.sin(u * 2 + v)}`;
  };
  return (
    <svg
      className="signal-art"
      viewBox="0 0 560 540"
      role="img"
      aria-label="Illustrative wireframe surface with watermark analysis annotations"
    >
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop stopColor="#65dccb" stopOpacity=".14" />
          <stop offset="1" stopColor="#65dccb" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-line`} x2="1" y2="1">
          <stop stopColor="#96eee0" />
          <stop offset=".55" stopColor="#4b8b81" />
          <stop offset="1" stopColor="#193a34" />
        </linearGradient>
        <pattern
          id={`${id}-grid`}
          width="35"
          height="35"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M35 0H0V35"
            fill="none"
            stroke="#53635d"
            strokeOpacity=".17"
            strokeWidth=".7"
          />
        </pattern>
      </defs>
      <rect width="560" height="540" fill={`url(#${id}-grid)`} />
      <ellipse cx="285" cy="280" rx="265" ry="260" fill={`url(#${id}-glow)`} />
      <g fill="none" stroke={`url(#${id}-line)`} strokeWidth=".8" opacity=".85">
        {Array.from({ length: 35 }, (_, r) => (
          <polyline
            key={`r${r}`}
            points={Array.from({ length: 65 }, (_, c) =>
              point((c / 64) * Math.PI * 2, (r / 34) * Math.PI),
            ).join(" ")}
          />
        ))}
        {Array.from({ length: 42 }, (_, c) => (
          <polyline
            key={`c${c}`}
            opacity=".65"
            points={Array.from({ length: 45 }, (_, r) =>
              point((c / 42) * Math.PI * 2, (r / 44) * Math.PI),
            ).join(" ")}
          />
        ))}
      </g>
      <g fill="none" stroke="#82d4c2">
        <path d="M100 147v-25h25M435 147v-25h-25M100 392v25h25M435 392v25h-25" />
        <path d="M73 270h18m-9-9v18M459 270h18m-9-9v18" opacity=".5" />
      </g>
      {!compact && (
        <g
          fontFamily="monospace"
          fontSize="9"
          letterSpacing="1.2"
          fill="#93aca4"
        >
          <text x="21" y="30">
            FIG. 01 / LATENT SIGNATURE
          </text>
          <text x="21" y="518">
            SYNTHETIC SURFACE
          </text>
          <text x="405" y="518">
            ILLUSTRATION
          </text>
          <path
            d="M357 197h90v-29"
            fill="none"
            stroke="#82d4c2"
            strokeOpacity=".5"
          />
          <circle cx="357" cy="197" r="3" fill="#9fe8d5" />
          <text x="409" y="155">
            SIGNAL TRACE
          </text>
        </g>
      )}
      <g className="watermark-reveal" fill="#a8f0df" opacity=".75">
        <rect x="355" y="335" width="7" height="7" />
        <rect x="366" y="335" width="7" height="7" />
        <rect x="377" y="346" width="7" height="7" />
        <rect x="355" y="357" width="7" height="7" />
        <rect x="377" y="368" width="7" height="7" />
      </g>
    </svg>
  );
}
export function TopicGraphic({ variant }: { variant: number }) {
  return (
    <div className="topic-graphic" aria-hidden="true">
      {variant === 0 ? (
        <>
          <div className="watermark-sheet sheet-back" />
          <div className="watermark-sheet sheet-front">
            {Array.from({ length: 36 }, (_, i) => (
              <i key={i} className={i % 5 === 0 || i % 7 === 0 ? "lit" : ""} />
            ))}
          </div>
          <span className="graphic-label">EMBEDDED SIGNAL</span>
        </>
      ) : (
        <>
          <div className="scan-orb" />
          <div className="scan-box" />
          <div className="scan-line" />
          <span className="graphic-label">PATTERN ANALYSIS</span>
        </>
      )}
    </div>
  );
}
