import { useState, type CSSProperties, type PointerEvent } from "react";
import worldMap from "../assets/global/world-map.webp";
import {
  globalMapHubId,
  globalMapMarkers,
  projectMarkerCoordinates,
  type GlobalMapMarker,
} from "../content/globalMap";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/routing";

interface GlobalMapProps {
  activeRegion?: string | null;
  onActiveRegionChange?: (region: string | null) => void;
}

function markerLabel(
  marker: GlobalMapMarker,
  t: (source: string) => string,
  locale: Locale,
) {
  const citySeparator = locale === "zh-CN" ? "、" : locale === "fa-IR" ? " و " : " and ";
  const regionSeparator = locale === "zh-CN" ? "，" : locale === "fa-IR" ? "، " : ", ";
  const labelSeparator = locale === "zh-CN" ? "：" : ": ";

  if (marker.cities.length === 1) {
    return `${t(marker.cities[0])}${regionSeparator}${t(marker.region)}`;
  }

  return `${t(marker.label)}${labelSeparator}${marker.cities.map(t).join(citySeparator)}${regionSeparator}${t(marker.region)}`;
}

function tooltipAlignment(x: number) {
  if (x < 24) return "left-0";
  if (x > 76) return "right-0";
  return "left-1/2 -translate-x-1/2";
}

export default function GlobalMap({
  activeRegion = null,
  onActiveRegionChange,
}: GlobalMapProps) {
  const { locale, t } = useI18n();
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const hub = globalMapMarkers.find((marker) => marker.id === globalMapHubId)!;
  const hubPoint = projectMarkerCoordinates(hub);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;
    setOffset({ x: normalizedX * 7, y: normalizedY * 5 });
  }

  function activate(marker: GlobalMapMarker) {
    setActiveMarker(marker.id);
    onActiveRegionChange?.(marker.region);
  }

  function deactivate() {
    setActiveMarker(null);
    onActiveRegionChange?.(null);
  }

  return (
    <div
      className="global-map relative h-full min-h-[390px] overflow-hidden bg-[#07100d] lg:min-h-[560px]"
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      onPointerMove={handlePointerMove}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_65%_38%,rgba(94,210,156,0.13),transparent_45%)]"
      />

      <p className="absolute left-6 top-6 z-30 font-mono text-[10px] uppercase tracking-[0.2em] text-white/42 sm:left-8 sm:top-8 lg:left-12 lg:top-12">
        {t("Global delivery network")}
      </p>

      <div
        className="global-map__canvas absolute inset-x-0 top-16 z-10 aspect-[16/10] origin-center sm:top-14 lg:top-10"
        style={
          {
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.018)`,
          } as CSSProperties
        }
      >
        <img
          src={worldMap}
          alt={t("World map showing JOTO's international delivery footprint")}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain opacity-70"
        />

        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="global-route" x1="0" x2="1">
              <stop offset="0" stopColor="#5ed29c" stopOpacity="0.12" />
              <stop offset="0.6" stopColor="#5ed29c" stopOpacity="0.55" />
              <stop offset="1" stopColor="#5ed29c" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {globalMapMarkers
            .filter((marker) => marker.id !== globalMapHubId)
            .map((marker) => {
              const point = projectMarkerCoordinates(marker);
              const highlighted = activeRegion === marker.region;

              return (
                <path
                  className={`global-map__route ${highlighted ? "global-map__route--active" : ""}`}
                  d={`M ${hubPoint.x} ${hubPoint.y} Q ${(hubPoint.x + point.x) / 2} ${Math.min(
                    hubPoint.y,
                    point.y,
                  ) - 8} ${point.x} ${point.y}`}
                  fill="none"
                  key={marker.id}
                  stroke="url(#global-route)"
                  strokeDasharray="1.3 1.6"
                  strokeLinecap="round"
                  strokeWidth={highlighted ? "0.42" : "0.25"}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
        </svg>

        {globalMapMarkers.map((marker) => {
          const point = projectMarkerCoordinates(marker);
          const highlighted = activeRegion === marker.region || activeMarker === marker.id;
          const isCluster = marker.cities.length > 1;

          return (
            <button
              aria-label={markerLabel(marker, t, locale)}
              className={`group absolute z-20 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none ${
                highlighted ? "z-30" : ""
              }`}
              data-active={highlighted ? "true" : "false"}
              data-marker-id={marker.id}
              key={marker.id}
              onBlur={deactivate}
              onFocus={() => activate(marker)}
              onMouseEnter={() => activate(marker)}
              onMouseLeave={deactivate}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              type="button"
            >
              <span
                aria-hidden="true"
                className={`global-map__marker-pulse absolute inset-1 rounded-full border border-[#5ed29c]/45 ${
                  highlighted ? "border-[#b7f4d9]/80" : ""
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#c9f8e4] bg-[#5ed29c] font-mono text-[8px] font-bold text-[#07100d] shadow-[0_0_18px_rgba(94,210,156,0.95)] transition-transform duration-300 ${
                  isCluster ? "h-4 w-4" : "h-2.5 w-2.5"
                } ${highlighted ? "scale-125" : ""}`}
              >
                {isCluster ? marker.cities.length : ""}
              </span>
              <span
                className={`pointer-events-none absolute bottom-[calc(100%+0.4rem)] min-w-40 rounded border border-white/15 bg-[#07100d]/95 px-3 py-2 text-left opacity-0 shadow-2xl backdrop-blur-md transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100 group-focus-visible:-translate-y-1 group-focus-visible:opacity-100 ${tooltipAlignment(
                  point.x,
                )}`}
              >
                <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5ed29c]">
                  {t(marker.label)}
                </span>
                <span className="mt-1 block whitespace-nowrap text-[11px] leading-5 text-white/65">
                  {marker.cities.map(t).join(" · ")}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#07100d] via-[#07100d]/95 to-transparent px-6 pb-7 pt-16 sm:px-8 sm:pb-8 lg:px-12 lg:pb-12 lg:pt-24">
        <p className="text-[clamp(2.75rem,7vw,4.5rem)] font-medium leading-none tracking-[-0.06em] text-white">
          24×7
        </p>
        <p className="mt-3 max-w-xs text-sm leading-6 text-white/52">
          {t("Connected teams supporting international operations across time zones.")}
        </p>
      </div>
    </div>
  );
}
