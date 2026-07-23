import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface ContactFields {
  name: string;
  company: string;
  email: string;
  phoneOrWechat: string;
  message: string;
  website: string;
}

type ContactErrors = Partial<Record<keyof ContactFields, string>>;

const initialFields: ContactFields = {
  name: "",
  company: "",
  email: "",
  phoneOrWechat: "",
  message: "",
  website: "",
};

const fieldClassName =
  "mt-2 w-full border border-white/18 bg-[#0a100d] px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/24 focus:border-joto-green";
const contactEndpoint = import.meta.env.VITE_CONTACT_API_URL?.trim() || "/api/contact";

function validate(fields: ContactFields, t: (source: string) => string): ContactErrors {
  const errors: ContactErrors = {};
  if (!fields.name.trim()) errors.name = t("Please enter your name.");
  if (!fields.company.trim()) errors.company = t("Please enter your company or organization.");
  if (!fields.email.trim()) {
    errors.email = t("Please enter your work email.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = t("Please enter a valid email address.");
  }
  if (!fields.message.trim()) errors.message = t("Please tell us what you would like to solve.");
  return errors;
}

export default function ContactForm() {
  const { t } = useI18n();
  const [fields, setFields] = useState<ContactFields>(initialFields);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const updateField = (field: keyof ContactFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(fields, t);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalid = Object.keys(nextErrors)[0];
      window.setTimeout(() => document.getElementById(`contact-${firstInvalid}`)?.focus(), 0);
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch(contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      if (!response.ok) throw new Error("Contact request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const errorMessage = (field: keyof ContactFields) =>
    errors[field] ? (
      <p className="mt-2 text-xs text-[#ff8f8f]" id={`contact-${field}-error`}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <form
      className="border border-white/15 bg-white/[0.025] p-5 sm:p-7 lg:p-9"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4 border-b border-white/12 pb-7 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-medium tracking-[-0.03em]">{t("Send us your requirements")}</h2>
          <p className="mt-2 text-xs text-white/42">{t("Fields marked with * are required.")}</p>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-joto-green">
          {t("Secure enquiry")}
        </p>
      </div>

      <div className="mt-7 grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <div>
          <label className="text-xs text-white/65" htmlFor="contact-name">
            {t("Name")} <span className="text-joto-green">*</span>
          </label>
          <input
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            className={fieldClassName}
            id="contact-name"
            maxLength={100}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder={t("Your name")}
            value={fields.name}
          />
          {errorMessage("name")}
        </div>
        <div>
          <label className="text-xs text-white/65" htmlFor="contact-company">
            {t("Company")} <span className="text-joto-green">*</span>
          </label>
          <input
            aria-describedby={errors.company ? "contact-company-error" : undefined}
            aria-invalid={Boolean(errors.company)}
            autoComplete="organization"
            className={fieldClassName}
            id="contact-company"
            maxLength={160}
            onChange={(event) => updateField("company", event.target.value)}
            placeholder={t("Company or organization")}
            value={fields.company}
          />
          {errorMessage("company")}
        </div>
        <div>
          <label className="text-xs text-white/65" htmlFor="contact-email">
            {t("Work email")} <span className="text-joto-green">*</span>
          </label>
          <input
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className={fieldClassName}
            id="contact-email"
            inputMode="email"
            maxLength={254}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="name@company.com"
            type="email"
            value={fields.email}
          />
          {errorMessage("email")}
        </div>
        <div>
          <div className="flex items-center justify-between gap-4">
            <label className="text-xs text-white/65" htmlFor="contact-phoneOrWechat">
              {t("Phone / WeChat")}
            </label>
            <span className="text-[10px] uppercase tracking-[0.14em] text-white/30">{t("Optional")}</span>
          </div>
          <input
            autoComplete="tel"
            className={fieldClassName}
            id="contact-phoneOrWechat"
            maxLength={100}
            onChange={(event) => updateField("phoneOrWechat", event.target.value)}
            placeholder={t("Phone number or WeChat ID")}
            value={fields.phoneOrWechat}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-white/65" htmlFor="contact-message">
            {t("What would you like to solve?")} <span className="text-joto-green">*</span>
          </label>
          <textarea
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            aria-invalid={Boolean(errors.message)}
            className={`${fieldClassName} min-h-40 resize-y`}
            id="contact-message"
            maxLength={5000}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder={t("Tell us about your environment, goals, timeline or current pain points…")}
            value={fields.message}
          />
          {errorMessage("message")}
        </div>
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input
          autoComplete="off"
          id="contact-website"
          onChange={(event) => updateField("website", event.target.value)}
          tabIndex={-1}
          value={fields.website}
        />
      </div>

      <div className="mt-7 flex flex-col items-start justify-between gap-6 border-t border-white/12 pt-7 sm:flex-row sm:items-center">
        <p className="max-w-md text-[11px] leading-5 text-white/35">
          {t("By submitting, you agree that JOTO TECH may use this information to respond to your enquiry.")}
        </p>
        <button
          className="group inline-flex items-center gap-5 rounded-full bg-joto-green py-2 pl-5 pr-2 text-xs font-bold uppercase tracking-[0.1em] text-joto-ink transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-65"
          disabled={status === "submitting" || status === "success"}
          type="submit"
        >
          {status === "submitting"
            ? t("Sending…")
            : status === "success"
              ? t("Enquiry sent")
              : t("Send project brief")}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-joto-ink text-joto-green">
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </button>
      </div>

      <div aria-live="polite">
        {status === "success" && (
          <p className="mt-6 border-l-2 border-joto-green pl-4 text-sm leading-6 text-white/70">
            {t("Thank you. Your project brief has been sent, and our team will reply within one business day.")}
          </p>
        )}
        {status === "error" && (
          <p className="mt-6 border-l-2 border-[#ff8f8f] pl-4 text-sm leading-6 text-white/70">
            {t("We could not send your enquiry. Please try again or email")} {" "}
            <a className="text-joto-green underline underline-offset-4" href="mailto:sales@jototech.cn">
              sales@jototech.cn
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
