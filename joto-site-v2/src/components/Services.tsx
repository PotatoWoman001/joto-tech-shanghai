import {
  Boxes,
  ChartNetwork,
  LifeBuoy,
  ShieldCheck,
  UserRoundCog,
  DraftingCompass,
  type LucideIcon,
} from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useI18n } from "../i18n/I18nProvider";
import type { ServiceIcon, ServiceItem } from "../content/types";
import SectionHeading, { Reveal } from "./SectionHeading";

const SERVICE_ICONS: Record<ServiceIcon, LucideIcon> = {
  planning: ChartNetwork,
  deployment: DraftingCompass,
  support: LifeBuoy,
  security: ShieldCheck,
  staffing: UserRoundCog,
  procurement: Boxes,
};

const SERVICE_PLACEMENT = [
  "lg:col-start-1 lg:row-start-1",
  "lg:col-start-2 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-3 lg:row-start-2",
  "lg:col-start-2 lg:row-start-2",
  "lg:col-start-1 lg:row-start-2",
] as const;

interface ServiceCardProps {
  index: number;
  service: ServiceItem;
}

function ServiceCard({ index, service }: ServiceCardProps) {
  const Icon = SERVICE_ICONS[service.icon];

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;

    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    card.style.setProperty("--service-glow-x", `${x}px`);
    card.style.setProperty("--service-glow-y", `${y}px`);
  };

  return (
    <Reveal delay={index * 70} className={`h-full ${SERVICE_PLACEMENT[index]}`}>
      <article
        data-service-card
        data-service-step={index + 1}
        onPointerMove={handlePointerMove}
        className="service-card group relative h-full min-h-[260px] overflow-hidden p-7 text-center sm:min-h-[280px] sm:p-8 lg:min-h-[300px] lg:p-9"
      >
        <div className="service-card__content relative z-10 flex h-full flex-col items-center">
          <div className="relative flex w-full justify-center">
            <div className="service-card__icon" data-service-icon aria-hidden="true">
              <Icon className="service-card__icon-mark h-11 w-11 sm:h-[3.2rem] sm:w-[3.2rem]" strokeWidth={2.55} />
              <Icon
                className="service-card__icon-mark service-card__icon-mark--accent h-11 w-11 sm:h-[3.2rem] sm:w-[3.2rem]"
                strokeWidth={2.55}
              />
            </div>
            <span className="absolute right-0 top-0 font-mono text-[10px] tracking-[0.2em] text-white/32 transition-colors duration-500 group-hover:text-[#5ed29c]/70">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="flex w-full flex-col items-center pt-5 sm:pt-6">
            <h3 className="flex min-h-14 max-w-md items-center justify-center text-xl font-medium tracking-[-0.035em] text-white sm:text-[1.35rem]">
              {service.title}
            </h3>
            <p className="mt-2 min-h-12 max-w-sm text-sm leading-6 text-white/50 transition-colors duration-500 group-hover:text-white/70">
              {service.description}
            </p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Services() {
  const { siteContent } = useI18n();
  const { services } = siteContent;

  return (
    <section id="services" className="scroll-mt-20 bg-[#070b0a] px-5 py-12 sm:px-8 md:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          index="02"
          eyebrow={services.eyebrow}
          title={services.title}
          description={services.description}
        />

        <div
          data-services-grid
          className="services-grid relative mt-16 grid gap-px overflow-hidden bg-white/14 sm:grid-cols-2 md:mt-24 lg:grid-cols-3"
        >
          {services.items.map((service, index) => (
            <ServiceCard key={service.title} index={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
