import { siteContent } from "../content/en";
import SectionHeading, { Reveal } from "./SectionHeading";

export default function About() {
  const { about } = siteContent;

  return (
    <section id="about" className="scroll-mt-20 bg-[#070b0a] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="04"
          eyebrow={about.eyebrow}
          title={about.title}
          description={about.description}
        />

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-5 lg:col-start-5">
            <p className="text-xl leading-8 tracking-[-0.02em] text-white/76 md:text-2xl md:leading-9">
              {about.secondary}
            </p>
          </Reveal>
          <div className="grid border-l border-t border-white/15 sm:grid-cols-2 lg:col-span-12 lg:mt-16 lg:grid-cols-4">
            {about.stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 70}
                className="min-h-48 border-b border-r border-white/15 p-6 sm:min-h-56 lg:p-8"
              >
                <p className="text-[clamp(2.75rem,5vw,5rem)] font-medium leading-none tracking-[-0.06em] text-[#5ed29c]">
                  {stat.value}
                </p>
                <p className="mt-12 max-w-[14rem] text-xs uppercase leading-5 tracking-[0.17em] text-white/48">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
