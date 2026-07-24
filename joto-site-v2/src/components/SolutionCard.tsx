import { ArrowRight } from "lucide-react";
import type { SolutionCategory } from "../content/types";
import { localizedHref, type Locale } from "../i18n/routing";

interface SolutionCardProps {
  category: SolutionCategory;
  index: number;
  learnMoreLabel: string;
  locale: Locale;
}

export default function SolutionCard({
  category,
  index,
  learnMoreLabel,
  locale,
}: SolutionCardProps) {
  const href = localizedHref(`/solutions/${category.id}`, locale);

  return (
    <article
      className="group relative h-[500px] min-w-0 sm:h-[540px] xl:h-[530px]"
      data-solution-card={category.id}
    >
      <div
        className="absolute inset-x-0 top-0 h-full overflow-hidden rounded-[1.6rem] bg-[#111714] transition-[height] duration-500 ease-out group-focus-within:h-full xl:h-[440px] xl:group-hover:h-full motion-reduce:transition-none"
        data-solution-visual
      >
        <img
          alt={category.imageAlt}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-focus-within:scale-[1.03] xl:group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
          loading="lazy"
          src={category.image}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5 transition-colors duration-500 xl:from-black/70 xl:via-transparent xl:group-hover:from-black/90 xl:group-hover:via-black/25 group-focus-within:from-black/90 group-focus-within:via-black/25 motion-reduce:transition-none"
        />

        <span className="absolute left-6 top-6 rounded-full border border-white/35 bg-black/15 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-white/75 backdrop-blur-sm sm:left-7 sm:top-7">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="absolute inset-x-0 bottom-24 px-6 transition-[bottom] duration-500 ease-out sm:px-7 xl:bottom-6 xl:group-hover:bottom-24 group-focus-within:bottom-24 motion-reduce:transition-none">
          <h3 className="text-balance text-[clamp(1.8rem,2.6vw,2.75rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
            {category.title}
          </h3>
          <p
            className="mt-4 max-w-md text-sm leading-6 text-white/78 transition-[max-height,opacity,transform] duration-500 ease-out xl:max-h-0 xl:translate-y-3 xl:overflow-hidden xl:opacity-0 xl:group-hover:max-h-24 xl:group-hover:translate-y-0 xl:group-hover:opacity-100 group-focus-within:max-h-24 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transform-none motion-reduce:transition-none"
            data-solution-description
          >
            {category.description}
          </p>
        </div>
      </div>

      <a
        aria-label={`${learnMoreLabel}: ${category.title}`}
        className="absolute bottom-5 left-5 right-5 flex h-16 items-center justify-between rounded-full border border-black bg-black px-6 text-base font-semibold text-white transition-[bottom,background-color,border-color,color] duration-500 ease-out group-hover:border-white group-hover:bg-white group-hover:text-joto-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-joto-green sm:left-6 sm:right-6 xl:bottom-0 xl:group-hover:bottom-5 group-focus-within:bottom-5 group-focus-within:border-white group-focus-within:bg-white group-focus-within:text-joto-green motion-reduce:transition-none"
        href={href}
      >
        <span>{learnMoreLabel}</span>
        <ArrowRight
          aria-hidden="true"
          className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
        />
      </a>
    </article>
  );
}
