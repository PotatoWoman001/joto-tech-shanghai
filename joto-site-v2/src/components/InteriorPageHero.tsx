import type { ReactNode } from "react";
import Header from "./Header";
import { Reveal } from "./SectionHeading";

interface InteriorPageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  titleId: string;
  narrowRail?: boolean;
}

export default function InteriorPageHero({
  eyebrow,
  title,
  description,
  titleId,
  narrowRail = false,
}: InteriorPageHeroProps) {
  return (
    <section
      aria-labelledby={titleId}
      className="relative isolate overflow-hidden border-b border-white/10 bg-[#070b0a]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_36%,rgba(94,210,156,0.14),transparent_34%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        {[
          "left-1/4",
          "left-1/2",
          "left-3/4",
        ].map((position) => (
          <span className={`absolute inset-y-0 w-px bg-white/[0.06] ${position}`} key={position} />
        ))}
      </div>
      <Header />
      <div className="relative z-10 mx-auto grid min-h-[720px] max-w-[1440px] content-end gap-10 px-5 pb-20 pt-36 sm:px-8 sm:pb-24 lg:grid-cols-12 lg:gap-6 lg:px-12 lg:pb-28">
        <Reveal className={narrowRail ? "lg:col-span-3" : "lg:col-span-4"}>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-joto-green">
            [ {eyebrow} ]
          </p>
        </Reveal>
        <Reveal className={narrowRail ? "lg:col-span-9" : "lg:col-span-8"} delay={80}>
          <h1
            className="max-w-6xl text-balance text-[clamp(3.6rem,8.2vw,8.8rem)] font-medium leading-[0.84] tracking-[-0.075em]"
            id={titleId}
          >
            {title}
          </h1>
          <p className="mt-9 max-w-2xl text-base leading-7 text-white/58 md:text-lg md:leading-8">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
