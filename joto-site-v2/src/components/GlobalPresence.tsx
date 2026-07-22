import { MapPin } from "lucide-react";
import { siteContent } from "../content/en";
import GlobalMap from "./GlobalMap";
import SectionHeading, { Reveal } from "./SectionHeading";

export default function GlobalPresence() {
  const { globalPresence } = siteContent;

  return (
    <section id="global-presence" className="bg-[#070b0a] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="05"
          eyebrow={globalPresence.eyebrow}
          title={globalPresence.title}
          description={globalPresence.description}
        />

        <div className="mt-16 grid overflow-hidden border border-white/15 md:mt-24 lg:grid-cols-12">
          <Reveal className="overflow-hidden border-b border-white/15 lg:col-span-7 lg:border-b-0 lg:border-r">
            <GlobalMap />
          </Reveal>

          <div className="lg:col-span-5">
            {globalPresence.regions.map((region, index) => (
              <Reveal
                key={region.region}
                delay={index * 55}
                className="flex min-h-24 gap-4 border-b border-white/15 p-5 last:border-b-0 sm:p-6 lg:min-h-[93px]"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#5ed29c]" />
                <div>
                  <h3 className="text-sm font-medium text-white">{region.region}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/48">{region.cities.join(" · ")}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
