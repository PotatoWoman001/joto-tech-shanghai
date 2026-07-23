import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { Reveal } from "./SectionHeading";
import SiteFooter from "./SiteFooter";

function telephoneHref(value: string) {
  return `tel:${value.replace(/[^+\d]/g, "")}`;
}

export default function ContactFooter() {
  const { siteContent, t } = useI18n();
  const { contact } = siteContent;

  return (
    <>
      <section id="contact" className="scroll-mt-20 bg-[#5ed29c] px-5 py-12 text-[#07100c] sm:px-8 md:py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="grid gap-10 border-t border-black/25 pt-6 lg:grid-cols-12 lg:gap-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] lg:col-span-4">
              {contact.eyebrow}
            </p>
            <div className="lg:col-span-8">
              <h2 className="max-w-5xl text-[clamp(3rem,8vw,8rem)] font-medium leading-[0.88] tracking-[-0.07em]">
                {contact.title}
              </h2>
              <p className="mt-8 max-w-2xl text-base leading-7 text-black/65 md:text-lg">
                {contact.description}
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid border-l border-t border-black/25 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
            <a
              href={`mailto:${contact.email}`}
              className="group flex min-h-44 flex-col justify-between border-b border-r border-black/25 p-6 transition-colors duration-300 hover:bg-black hover:text-white"
            >
              <div className="flex items-center justify-between">
                <Mail className="h-5 w-5" />
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] opacity-60">{t("Email")}</p>
                <p className="mt-2 break-all text-sm font-semibold">{contact.email}</p>
              </div>
            </a>
            <a
              href={telephoneHref(contact.phone)}
              className="group flex min-h-44 flex-col justify-between border-b border-r border-black/25 p-6 transition-colors duration-300 hover:bg-black hover:text-white"
            >
              <Phone className="h-5 w-5" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] opacity-60">{t("Shanghai")}</p>
                <p className="mt-2 text-sm font-semibold">{contact.phone}</p>
              </div>
            </a>
            <a
              href={telephoneHref(contact.hotline)}
              className="group flex min-h-44 flex-col justify-between border-b border-r border-black/25 p-6 transition-colors duration-300 hover:bg-black hover:text-white"
            >
              <Phone className="h-5 w-5" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] opacity-60">{t("Service hotline")}</p>
                <p className="mt-2 text-sm font-semibold">{contact.hotline}</p>
              </div>
            </a>
            <a
              href="#top"
              className="group flex min-h-44 flex-col justify-between border-b border-r border-black/25 p-6 transition-colors duration-300 hover:bg-black hover:text-white"
            >
              <ArrowUpRight className="h-5 w-5 rotate-[-45deg] transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] opacity-60">{t("Back to top")}</p>
                <p className="mt-2 text-sm font-semibold">{t("Explore JOTO TECH")}</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
