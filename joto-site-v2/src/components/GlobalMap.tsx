import worldMap from "../assets/global/world-map.webp";

const locations = [
  { id: "us", label: "United States", x: 21, y: 26 },
  { id: "uk", label: "United Kingdom", x: 46, y: 20 },
  { id: "china", label: "China", x: 82, y: 30 },
  { id: "japan", label: "Japan", x: 90, y: 27 },
  { id: "thailand", label: "Thailand", x: 80, y: 37 },
  { id: "singapore", label: "Singapore", x: 81, y: 42 },
];

const routes = [
  [21, 26, 82, 30],
  [46, 20, 82, 30],
  [82, 30, 90, 27],
  [82, 30, 80, 37],
  [80, 37, 81, 42],
];

export default function GlobalMap() {
  return (
    <div className="relative h-full min-h-[390px] overflow-hidden bg-[#07100d] lg:min-h-[560px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_65%_38%,rgba(94,210,156,0.13),transparent_45%)]"
      />

      <p className="absolute left-6 top-6 z-20 font-mono text-[10px] uppercase tracking-[0.2em] text-white/42 sm:left-8 sm:top-8 lg:left-12 lg:top-12">
        Global delivery network
      </p>

      <div className="absolute inset-x-0 top-16 z-10 aspect-[16/10] sm:top-14 lg:top-10">
        <img
          src={worldMap}
          alt="World map showing JOTO's international delivery footprint"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain opacity-70"
        />

        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 62.5"
        >
          <defs>
            <linearGradient id="global-route" x1="0" x2="1">
              <stop offset="0" stopColor="#5ed29c" stopOpacity="0.12" />
              <stop offset="0.6" stopColor="#5ed29c" stopOpacity="0.55" />
              <stop offset="1" stopColor="#5ed29c" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {routes.map(([x1, y1, x2, y2]) => (
            <path
              key={`${x1}-${y1}-${x2}-${y2}`}
              d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 8} ${x2} ${y2}`}
              fill="none"
              stroke="url(#global-route)"
              strokeDasharray="1.3 1.6"
              strokeLinecap="round"
              strokeWidth="0.25"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {locations.map((location) => (
          <span
            aria-hidden="true"
            className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b7f4d9] bg-[#5ed29c] shadow-[0_0_22px_rgba(94,210,156,0.95)] before:absolute before:-inset-2 before:rounded-full before:border before:border-[#5ed29c]/35"
            key={location.id}
            style={{ left: `${location.x}%`, top: `${(location.y / 62.5) * 100}%` }}
            title={location.label}
          />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#07100d] via-[#07100d]/95 to-transparent px-6 pb-7 pt-16 sm:px-8 sm:pb-8 lg:px-12 lg:pb-12 lg:pt-24">
        <p className="text-[clamp(2.75rem,7vw,4.5rem)] font-medium leading-none tracking-[-0.06em] text-white">
          24×7
        </p>
        <p className="mt-3 max-w-xs text-sm leading-6 text-white/52">
          Connected teams supporting international operations across time zones.
        </p>
      </div>
    </div>
  );
}
