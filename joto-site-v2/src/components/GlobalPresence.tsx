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
  const { siteContent, t } = useI18n();
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

        <div className="mt-16 overflow-hidden border border-white/15 md:mt-24">
          <Reveal className="overflow-hidden border-b border-white/15">
            <GlobalMap activeRegion={activeRegion} onActiveRegionChange={setActiveRegion} />
          </Reveal>

          <div
            className="grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
            data-region-grid
          >
            {globalPresence.regions.map((region, index) => {
              const presentation = REGION_PRESENTATION[index];
              const Icon = presentation.icon;
              const isActive = activeRegion === presentation.key;
              const locationLabel = region.cities.length === 1 ? "LOCATION" : "LOCATIONS";

              return (
                <Reveal
                  key={presentation.key}
                  delay={index * 55}
                  className="min-w-0 bg-[#070b0a]"
                >
                  <button
                    aria-label={`${region.region}. ${region.cities.join(" · ")}`}
                    aria-pressed={isActive}
                    className="global-region-card group relative flex min-h-[205px] w-full flex-col overflow-hidden p-5 text-start outline-none sm:min-h-[220px] sm:p-6"
                    data-active={isActive ? "true" : "false"}
                    data-region-card
                    data-region-key={presentation.key}
                    onBlur={() => setActiveRegion(null)}
                    onFocus={() => setActiveRegion(presentation.key)}
                    onMouseEnter={() => setActiveRegion(presentation.key)}
                    onMouseLeave={() => setActiveRegion(null)}
                    type="button"
                  >
                    <span className="relative z-10 flex items-start justify-between gap-4">
                      <span
                        aria-hidden="true"
                        className="global-region-card__orb grid h-12 w-12 shrink-0 place-items-center rounded-full"
                        data-region-icon
                        style={{
                          animationDelay: `${index * -0.72}s`,
                          animationDuration: `${5.2 + index * 0.32}s`,
                        }}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.45} />
                      </span>
                      <span className="pt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/36 transition-colors duration-300 group-hover:text-[#8ae7bb]/72 group-focus-visible:text-[#8ae7bb]/72">
                        {String(region.cities.length).padStart(2, "0")} {t(locationLabel)}
                      </span>
                    </span>

                    <span className="relative z-10 mt-auto block pt-10">
                      <span className="block text-base font-medium tracking-[-0.02em] text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5">
                        {region.region}
                      </span>
                      <span className="mt-2 block text-xs leading-5 text-white/48 transition-colors duration-300 group-hover:text-white/66 group-focus-visible:text-white/66">
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
