import {
  Clock4,
  Compass,
  PackageCheck,
  ShieldHalf,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useI18n } from "../i18n/I18nProvider";
import type { ServiceIcon, ServiceItem } from "../content/types";
import SectionHeading, { Reveal } from "./SectionHeading";

const SERVICE_ICONS: Record<ServiceIcon, LucideIcon> = {
  planning: Compass,
  deployment: Wrench,
  support: Clock4,
  security: ShieldHalf,
  staffing: Users,
  procurement: PackageCheck,
};

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
    const rotateY = ((x / bounds.width) - 0.5) * 3.5;
    const rotateX = (0.5 - y / bounds.height) * 3.5;

    card.style.setProperty("--service-glow-x", `${x}px`);
    card.style.setProperty("--service-glow-y", `${y}px`);
    card.style.setProperty("--service-rotate-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--service-rotate-y", `${rotateY.toFixed(2)}deg`);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--service-rotate-x", "0deg");
    event.currentTarget.style.setProperty("--service-rotate-y", "0deg");
  };

  return (
    <Reveal delay={index * 80} className="h-full">
      <article
        data-service-card
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="service-card group relative h-full min-h-[480px] overflow-hidden rounded-[22px] p-7 sm:min-h-[520px] sm:p-9 lg:min-h-[500px] lg:p-10"
      >
        <div className="service-card__glow" aria-hidden="true" />
        <div className="service-card__content relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-5">
            <div className="service-card__icon" data-service-icon aria-hidden="true">
              <span className="service-card__icon-halo" />
              <Icon className="relative z-10 h-8 w-8" strokeWidth={1.45} />
              <span className="service-card__orbit" />
            </div>
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/32 transition-colors duration-500 group-hover:text-[#5ed29c]/70">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-10">
            <h3 className="max-w-md text-xl font-medium tracking-[-0.035em] text-white sm:text-2xl">
              {service.title}
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/52 transition-colors duration-500 group-hover:text-white/68 sm:text-[15px] sm:leading-7">
              {service.description}
            </p>
          </div>

          <div
            className="relative -mx-3 -mb-3 mt-auto h-36 overflow-hidden sm:-mx-4 sm:-mb-4 sm:h-44 lg:h-40"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 84% 82% at 52% 50%, black 42%, rgba(0,0,0,.92) 58%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse 84% 82% at 52% 50%, black 42%, rgba(0,0,0,.92) 58%, transparent 100%)",
            }}
          >
            <img
              src={service.image}
              alt={service.imageAlt}
              loading="lazy"
              className="h-full w-full scale-[1.08] object-cover brightness-[0.58] contrast-[1.04] saturate-[0.66] transition-[transform,filter] duration-700 group-hover:scale-[1.12] group-hover:brightness-[0.66] motion-reduce:transition-none"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(7,11,10,0.22),rgba(42,174,132,0.24)_52%,rgba(7,11,10,0.48))] mix-blend-color"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_32%,rgba(7,11,10,0.2)_66%,#070b0a_100%)]"
            />
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

        <div className="services-grid relative mt-16 grid gap-4 sm:grid-cols-2 md:mt-24 md:gap-5 lg:grid-cols-3">
          {services.items.map((service, index) => (
            <ServiceCard key={service.title} index={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
