import { useState } from "react";
import {
  Building2,
  Clock3,
  Landmark,
  Mountain,
  RadioTower,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import GlobalMap from "./GlobalMap";
import SectionHeading, { Reveal } from "./SectionHeading";

interface RegionPresentation {
  icon: LucideIcon;
  key: string;
}

const REGION_PRESENTATION: readonly RegionPresentation[] = [
  { key: "China", icon: Building2 },
  { key: "Japan", icon: Mountain },
  { key: "Thailand", icon: Landmark },
  { key: "Singapore", icon: Waves },
  { key: "United States", icon: RadioTower },
  { key: "United Kingdom", icon: Clock3 },
];

export default function GlobalPresence() {
  const { siteContent } = useI18n();
  const { globalPresence } = siteContent;
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  return (
    <section id="global-presence" className="bg-[#070b0a] px-5 py-12 sm:px-8 md:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="06"
          eyebrow={globalPresence.eyebrow}
          title={globalPresence.title}
          description={globalPresence.description}
        />

        <div className="mt-16 overflow-hidden border border-white/15 md:mt-24 lg:grid lg:grid-cols-[minmax(0,1fr)_17rem]">
          <Reveal className="h-full overflow-hidden border-b border-white/15 lg:border-b-0 lg:border-r">
            <GlobalMap activeRegion={activeRegion} onActiveRegionChange={setActiveRegion} />
          </Reveal>

          <div
            className="grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-6"
            data-region-grid
          >
            {globalPresence.regions.map((region, index) => {
              const presentation = REGION_PRESENTATION[index];
              const Icon = presentation.icon;
              const isActive = activeRegion === presentation.key;

              return (
                <Reveal
                  key={presentation.key}
                  delay={index * 55}
                  className="min-w-0 bg-[#070b0a]"
                >
                  <button
                    aria-label={`${region.region}. ${region.cities.join(" · ")}`}
                    aria-pressed={isActive}
                    className="global-region-card group relative flex min-h-[112px] w-full items-center gap-3 overflow-hidden p-4 text-start outline-none lg:h-full lg:min-h-0 lg:px-4 lg:py-3"
                    data-active={isActive ? "true" : "false"}
                    data-region-card
                    data-region-key={presentation.key}
                    onBlur={() => setActiveRegion(null)}
                    onFocus={() => setActiveRegion(presentation.key)}
                    onMouseEnter={() => setActiveRegion(presentation.key)}
                    onMouseLeave={() => setActiveRegion(null)}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      className="global-region-card__orb relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full"
                      data-region-icon
                      style={{
                        animationDelay: `${index * -0.72}s`,
                        animationDuration: `${5.2 + index * 0.32}s`,
                      }}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.45} />
                    </span>

                    <span className="relative z-10 min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium tracking-[-0.02em] text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5">
                        {region.region}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-[10px] leading-4 text-white/48 transition-colors duration-300 group-hover:text-white/66 group-focus-visible:text-white/66">
                        {region.cities.join(" · ")}
                      </span>
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
