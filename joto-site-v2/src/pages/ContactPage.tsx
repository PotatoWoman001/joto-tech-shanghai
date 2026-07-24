import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "../components/ContactForm";
import Header from "../components/Header";
import { Reveal } from "../components/SectionHeading";
import SiteFooter from "../components/SiteFooter";
import { useI18n } from "../i18n/I18nProvider";

function telephoneHref(value: string) {
  return `tel:${value.replace(/[^+\d]/g, "")}`;
}

export default function ContactPage() {
  const { siteContent, t } = useI18n();
  const { contact } = siteContent;
  const channels = [
    {
      label: t("Service hotline"),
      value: contact.hotline,
      href: telephoneHref(contact.hotline),
      icon: Phone,
      action: t("Start a call"),
    },
    {
      label: t("Shanghai HQ"),
      value: contact.phone,
      href: telephoneHref(contact.phone),
      icon: Phone,
      action: t("Reach the team"),
    },
    {
      label: t("Sales & projects"),
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: Mail,
      action: t("Write to us"),
    },
  ];

  return (
    <main id="top" className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased">
      <Header />

      <section
        className="px-5 pb-24 pt-32 sm:px-8 sm:pt-36 md:pb-32 lg:px-12 lg:pb-40 lg:pt-40"
        data-contact-form-section
      >
        <div className="mx-auto grid max-w-[1440px] gap-12 border-t border-white/15 pt-6 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-joto-green">
              [ {t("Project brief")} ]
            </p>
            <h1 className="mt-8 max-w-sm text-[clamp(2.5rem,5vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.06em]">
              {t("Start with the challenge.")}
            </h1>
            <p className="mt-7 max-w-sm text-sm leading-6 text-white/48">
              {t("Share a few details about your organization and what you need to solve. Our team will respond within one business day.")}
            </p>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={80}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 md:pb-32 lg:px-12 lg:pb-40">
        <div className="mx-auto grid max-w-[1440px] border-l border-t border-white/15 md:grid-cols-3">
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <Reveal delay={index * 70} key={channel.label}>
                <a
                  className="group flex min-h-56 flex-col justify-between border-b border-r border-white/15 p-6 transition-colors hover:bg-joto-green hover:text-joto-ink lg:p-8"
                  href={channel.href}
                >
                  <Icon className="h-5 w-5 text-joto-green transition-colors group-hover:text-joto-ink" />
                  <div className="pt-16">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/42 transition-colors group-hover:text-black/55">
                      {channel.label}
                    </p>
                    <p className="mt-3 break-words text-lg font-semibold tracking-[-0.02em]">
                      {channel.value}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs text-joto-green transition-colors group-hover:text-joto-ink">
                      {channel.action}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-joto-green px-5 py-24 text-joto-ink sm:px-8 md:py-32 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="grid gap-10 border-t border-black/25 pt-6 lg:grid-cols-12 lg:gap-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] lg:col-span-4">
              {t("Our offices")}
            </p>
            <h2 className="max-w-5xl text-[clamp(3rem,7vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.07em] lg:col-span-8">
              {t("Find JOTO")}
              <br />
              {t("nearby.")}
            </h2>
          </Reveal>
          <div className="mt-16 grid border-l border-t border-black/25 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
            {contact.offices.map((office, index) => (
              <Reveal
                className="flex min-h-48 gap-4 border-b border-r border-black/25 p-6 lg:p-8"
                delay={Math.min(index * 55, 220)}
                key={office.city}
              >
                <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <h3 className="text-base font-semibold">{office.city}</h3>
                  <address className="mt-6 max-w-sm text-sm not-italic leading-6 text-black/60">
                    {office.address}
                  </address>
                </div>
              </Reveal>
            ))}
            <Reveal className="flex min-h-48 flex-col justify-between border-b border-r border-black/25 p-6 lg:p-8" delay={220}>
              <p className="text-base font-semibold">{t("Global delivery")}</p>
              <a className="group inline-flex items-center gap-3 text-sm font-semibold" href={`mailto:${contact.email}`}>
                {t("Plan a multi-region rollout")}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
