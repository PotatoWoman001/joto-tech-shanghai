import { MapPin } from "lucide-react";
import { siteContent } from "../content/en";
import SectionHeading, { Reveal } from "./SectionHeading";

export default function GlobalPresence() {
  const { globalPresence } = siteContent;

  return (
    <section id="global-presence" className="bg-[#070b0a] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="06"
          eyebrow={globalPresence.eyebrow}
          title={globalPresence.title}
          description={globalPresence.description}
        />

        <div className="mt-16 grid overflow-hidden border border-white/15 md:mt-24 lg:grid-cols-12">
          <Reveal className="relative min-h-[360px] overflow-hidden border-b border-white/15 bg-[#0a100e] p-8 lg:col-span-7 lg:min-h-[560px] lg:border-b-0 lg:border-r lg:p-12">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                maskImage: "radial-gradient(circle at 55% 50%, black 10%, transparent 72%)",
              }}
            />
            <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#5ed29c]/25 sm:h-[380px] sm:w-[380px]">
              <div className="absolute inset-[15%] rounded-full border border-white/10" />
              <div className="absolute inset-[32%] rounded-full border border-white/10" />
              <span className="absolute left-[66%] top-[28%] h-3 w-3 rounded-full bg-[#5ed29c] shadow-[0_0_30px_rgba(94,210,156,0.9)]" />
              <span className="absolute left-[34%] top-[49%] h-2 w-2 rounded-full bg-[#5ed29c]/80 shadow-[0_0_20px_rgba(94,210,156,0.7)]" />
              <span className="absolute bottom-[25%] right-[25%] h-2 w-2 rounded-full bg-[#5ed29c]/80 shadow-[0_0_20px_rgba(94,210,156,0.7)]" />
            </div>
            <div className="relative flex h-full flex-col justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/38">
                Global delivery network
              </p>
              <div>
                <p className="text-5xl font-medium tracking-[-0.06em] text-white sm:text-7xl">
                  24×7
                </p>
                <p className="mt-3 max-w-xs text-sm leading-6 text-white/48">
                  Connected teams supporting international operations across time zones.
                </p>
              </div>
            </div>
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
