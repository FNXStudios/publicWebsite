import type { CSSProperties } from 'react';

/**
 * Atmospheric operator visual: a still wireframe hemisphere with delivery arcs
 * travelling between nodes. Only the arcs' dashes and the node glows move (CSS);
 * the globe itself never rotates. Reduced motion freezes both. Decorative.
 */
const NODES: [number, number][] = [
  [238, 250], [352, 196], [468, 238], [540, 330], [420, 372], [300, 350], [610, 214], [180, 346], [505, 150],
];
const ARCS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [1, 8], [2, 6], [4, 5], [5, 0], [3, 4], [7, 5], [8, 6],
];

function arc([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const lift = Math.hypot(x2 - x1, y2 - y1) * 0.38;
  return `M${x1} ${y1} Q${mx} ${my - lift} ${x2} ${y2}`;
}

export function NetworkVisual({ className }: { className?: string }) {
  const cx = 400, cy = 400, r = 330;
  const lats = [-60, -40, -20, 0, 20, 40, 60];
  const lons = [-75, -50, -25, 0, 25, 50, 75];
  return (
    <svg viewBox="0 0 800 640" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="net-sphere" cx="0.42" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#3a4a9a" stopOpacity="0.32" />
          <stop offset="0.6" stopColor="#141a3a" stopOpacity="0.2" />
          <stop offset="1" stopColor="#050607" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="net-arc" x1="0" x2="1">
          <stop offset="0" stopColor="#9a68ff" stopOpacity="0.1" />
          <stop offset="0.5" stopColor="#b99bff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#7fd6ff" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="net-node">
          <stop offset="0" stopColor="#e9e0ff" />
          <stop offset="0.4" stopColor="#9a68ff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#9a68ff" stopOpacity="0" />
        </radialGradient>
        <clipPath id="net-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <linearGradient id="net-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stopColor="#fff" />
          <stop offset="0.95" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="net-mask">
          <rect width="800" height="640" fill="url(#net-fade)" />
        </mask>
      </defs>
      <g mask="url(#net-mask)">
        <circle cx={cx} cy={cy} r={r} fill="url(#net-sphere)" />
        <g clipPath="url(#net-clip)" fill="none" stroke="#8fa0ff" strokeOpacity="0.12" strokeWidth="1">
          {lats.map((lat) => {
            const y = cy - r * Math.sin((lat * Math.PI) / 180);
            const rx = r * Math.cos((lat * Math.PI) / 180);
            return <ellipse key={`la${lat}`} cx={cx} cy={y} rx={rx} ry={rx * 0.12} />;
          })}
          {lons.map((lon) => (
            <ellipse key={`lo${lon}`} cx={cx} cy={cy} rx={Math.abs(r * Math.sin((lon * Math.PI) / 180)) || 0.5} ry={r} />
          ))}
        </g>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#b99bff" strokeOpacity="0.18" />
        <g fill="none" stroke="url(#net-arc)" strokeWidth="1.5" strokeLinecap="round">
          {ARCS.map(([a, b], i) => (
            <path key={i} d={arc(NODES[a]!, NODES[b]!)} className="net-arc" style={{ animationDelay: `${-i * 0.9}s` } as CSSProperties} />
          ))}
        </g>
        {NODES.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="14" fill="url(#net-node)" className="net-node" style={{ '--d': `${-i * 0.55}s` } as CSSProperties} />
            <circle cx={x} cy={y} r="2.6" fill="#f2ecff" />
          </g>
        ))}
      </g>
    </svg>
  );
}
