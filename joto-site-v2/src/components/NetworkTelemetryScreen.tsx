const catalystMetrics = [
  { label: "NETWORK HEALTH", values: ["99", "98"], unit: "/100" },
  { label: "CONNECTED DEVICES", values: ["128", "131"], unit: "online" },
  { label: "ACCESS POINTS", values: ["02", "02"], unit: "/02" },
  { label: "UPLINK", values: ["10", "10"], unit: "Gb/s" },
];

export function NetworkTelemetryReadouts() {
  return (
    <div
      aria-hidden="true"
      className="absolute -top-52 left-0 right-0 hidden border-y border-white/10 bg-[#07100d]/55 font-mono backdrop-blur-[3px] lg:block xl:-top-40"
      data-catalyst-readouts
    >
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-2 text-[8px] uppercase tracking-[0.2em] text-white/38">
        <span className="flex items-center gap-2.5">
          <span className="telemetry-status-dot h-1.5 w-1.5 rounded-full bg-joto-green" />
          CATALYST CENTER / SITE-01
        </span>
        <span>ASSURANCE ACTIVE</span>
      </div>
      <div className="grid grid-cols-4">
        {catalystMetrics.map((metric, metricIndex) => (
          <div
            className="border-r border-white/8 px-3 py-3 last:border-r-0"
            key={metric.label}
          >
            <p className="whitespace-nowrap text-[7px] tracking-[0.12em] text-white/32">
              {metric.label}
            </p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="relative inline-block h-5 min-w-[2.7rem] text-[15px] text-joto-green">
                {metric.values.map((value, valueIndex) => (
                  <span
                    className="telemetry-readout-number absolute inset-0"
                    key={`${value}-${valueIndex}`}
                    style={{ animationDelay: `${-(valueIndex * 4.2 + metricIndex * 0.45)}s` }}
                  >
                    {value}
                  </span>
                ))}
              </span>
              <span className="text-[7px] text-white/35">{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-white/8 px-4 py-1.5 text-[7px] uppercase tracking-[0.13em] text-white/28">
        <span>SW-CORE-01 · 12 ACCESS PORTS ACTIVE</span>
        <span>NO CRITICAL ISSUES</span>
      </div>
    </div>
  );
}

const switchPorts = Array.from({ length: 12 }, (_, index) => ({
  x: 71 + index * 15.6,
  y: index % 2 === 0 ? 177 : 181,
}));

export default function NetworkTelemetryScreen() {
  return (
    <svg
      aria-hidden="true"
      className="cisco-network-visual pointer-events-none absolute inset-0 z-20 h-full w-full"
      data-cisco-network-topology
      viewBox="0 0 690 288"
    >
      <defs>
        <clipPath id="catalyst-screen-clip">
          <polygon points="329,98 574,100 588,229 316,229" />
        </clipPath>
        <pattern id="catalyst-grid" height="14" patternUnits="userSpaceOnUse" width="18">
          <path
            d="M 18 0 L 0 0 0 14"
            fill="none"
            stroke="#70e1b0"
            strokeOpacity="0.07"
            strokeWidth="0.55"
          />
        </pattern>
        <linearGradient id="catalyst-screen-shade" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#071612" />
          <stop offset="0.58" stopColor="#0a1d18" />
          <stop offset="1" stopColor="#030c0a" />
        </linearGradient>
        <filter id="catalyst-glow" height="300%" width="300%" x="-100%" y="-100%">
          <feGaussianBlur result="blur" stdDeviation="1.6" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="cisco-physical-links" fill="none" strokeLinecap="round">
        <path
          className="cisco-device-link cisco-device-link--a"
          d="M238 165 C211 120 168 91 130 62"
          stroke="#68efaa"
          strokeOpacity="0.48"
          strokeWidth="1.25"
        />
        <path
          className="cisco-device-link cisco-device-link--b"
          d="M248 164 C252 121 246 88 231 62"
          stroke="#68efaa"
          strokeOpacity="0.4"
          strokeWidth="1.25"
        />
        <path
          className="cisco-device-link cisco-device-link--c"
          d="M270 169 C300 150 322 127 348 118"
          stroke="#8abfff"
          strokeOpacity="0.42"
          strokeWidth="1.15"
        />
      </g>

      {[
        { cx: 130, cy: 51, delay: "0s" },
        { cx: 231, cy: 51, delay: "-2.4s" },
      ].map((ap, index) => (
        <g data-ap-node key={ap.cx}>
          <circle
            className="cisco-ap-ring"
            cx={ap.cx}
            cy={ap.cy}
            fill="none"
            r="25"
            stroke="#6af0ad"
            strokeOpacity="0.3"
            style={{ animationDelay: ap.delay }}
          />
          <circle
            className="cisco-ap-status"
            cx={ap.cx}
            cy={ap.cy + 17}
            fill="#69efaa"
            filter="url(#catalyst-glow)"
            r="1.8"
            style={{ animationDelay: `${index * -1.7}s` }}
          />
        </g>
      ))}

      <g data-switch-ports filter="url(#catalyst-glow)">
        {switchPorts.map((port, index) => (
          <circle
            className="cisco-switch-port"
            cx={port.x}
            cy={port.y}
            data-switch-port
            fill={index === 10 ? "#8abfff" : "#69efaa"}
            key={`${port.x}-${port.y}`}
            r="1.25"
            style={{ animationDelay: `${-(index * 0.48)}s` }}
          />
        ))}
      </g>

      <g clipPath="url(#catalyst-screen-clip)">
        <rect fill="url(#catalyst-screen-shade)" height="145" width="290" x="307" y="92" />
        <rect fill="url(#catalyst-grid)" height="145" width="290" x="307" y="92" />

        <g fontFamily="monospace">
          <circle className="telemetry-status-dot" cx="339" cy="110" fill="#65f0ad" r="2.3" />
          <text fill="#aef7d3" fontSize="7.2" letterSpacing="0.85" x="346" y="113">
            SITE TOPOLOGY / ASSURANCE
          </text>
          <text fill="#6da88d" fontSize="6.2" textAnchor="end" x="568" y="113">
            HEALTH 99
          </text>
        </g>

        <line
          stroke="#7cf2b7"
          strokeOpacity="0.16"
          strokeWidth="0.7"
          x1="327"
          x2="574"
          y1="120"
          y2="120"
        />

        <g className="cisco-screen-topology" fill="none" stroke="#70e1b0" strokeWidth="1">
          <path className="cisco-topology-edge" d="M449 184 L382 146" />
          <path className="cisco-topology-edge cisco-topology-edge--delay" d="M449 184 L515 146" />
          <path className="cisco-topology-edge" d="M382 146 L350 198" />
          <path className="cisco-topology-edge cisco-topology-edge--delay" d="M515 146 L548 198" />
        </g>

        <g data-catalyst-node fontFamily="monospace">
          <circle
            className="cisco-health-ring"
            cx="449"
            cy="184"
            fill="#0c241c"
            r="16"
            stroke="#69efaa"
            strokeWidth="2.2"
          />
          <rect fill="#69efaa" height="6" rx="1.5" width="14" x="442" y="181" />
          <circle cx="445" cy="184" fill="#082117" r="0.9" />
          <circle cx="449" cy="184" fill="#082117" r="0.9" />
          <circle cx="453" cy="184" fill="#082117" r="0.9" />
          <text fill="#aef7d3" fontSize="6.1" textAnchor="middle" x="449" y="211">
            CORE-01
          </text>
        </g>

        {[
          { x: 382, label: "AP-01" },
          { x: 515, label: "AP-02" },
        ].map((node, index) => (
          <g data-catalyst-node key={node.label}>
            <circle
              className="cisco-topology-node"
              cx={node.x}
              cy="146"
              fill="#0d2b21"
              r="10"
              stroke="#69efaa"
              strokeWidth="1.3"
              style={{ animationDelay: `${index * -2.7}s` }}
            />
            <path
              d={`M${node.x - 5} 146 Q${node.x} 140 ${node.x + 5} 146 M${node.x - 2.6} 148 Q${node.x} 145 ${node.x + 2.6} 148`}
              fill="none"
              stroke="#b9f9da"
              strokeLinecap="round"
              strokeWidth="0.8"
            />
            <text fill="#86bda4" fontFamily="monospace" fontSize="5.4" textAnchor="middle" x={node.x} y="164">
              {node.label}
            </text>
          </g>
        ))}

        {[
          { x: 350, label: "24 CLIENTS" },
          { x: 548, label: "31 CLIENTS" },
        ].map((client) => (
          <g data-client-node key={client.label}>
            <rect
              fill="#10271f"
              height="10"
              rx="2"
              stroke="#77b99a"
              strokeWidth="0.8"
              width="15"
              x={client.x - 7.5}
              y="193"
            />
            <line stroke="#77b99a" strokeWidth="0.8" x1={client.x - 4} x2={client.x + 4} y1="205" y2="205" />
            <text fill="#6fa68d" fontFamily="monospace" fontSize="5" textAnchor="middle" x={client.x} y="216">
              {client.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
