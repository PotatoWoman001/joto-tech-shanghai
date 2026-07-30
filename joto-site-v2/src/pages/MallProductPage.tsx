import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import SiteFooter from "../components/SiteFooter";
import {
  loadMallProduct,
  mallPublicUrl,
  type MallProduct,
} from "../content/mall";
import { useI18n } from "../i18n/I18nProvider";
import { localizedHref, type Locale } from "../i18n/routing";

const copyByLocale: Record<
  Locale,
  {
    back: string;
    contact: string;
    overview: string;
    specifications: string;
    applications: string;
    documents: string;
    source: string;
    model: string;
    condition: string;
    loading: string;
    error: string;
  }
> = {
  en: {
    back: "All products",
    contact: "Contact Us",
    overview: "Overview",
    specifications: "Specifications",
    applications: "Applications",
    documents: "Documents",
    source: "Source attribution",
    model: "Model",
    condition: "Condition",
    loading: "Loading product details…",
    error: "This product is temporarily unavailable.",
  },
  "zh-CN": {
    back: "全部产品",
    contact: "联系我们",
    overview: "产品概览",
    specifications: "规格参数",
    applications: "应用场景",
    documents: "资料下载",
    source: "内容来源",
    model: "型号",
    condition: "产品成色",
    loading: "正在加载产品详情…",
    error: "该产品暂时无法加载。",
  },
  "fa-IR": {
    back: "همه محصولات",
    contact: "تماس با ما",
    overview: "معرفی",
    specifications: "مشخصات فنی",
    applications: "کاربردها",
    documents: "اسناد",
    source: "منبع اطلاعات",
    model: "مدل",
    condition: "وضعیت",
    loading: "در حال بارگذاری جزئیات محصول…",
    error: "این محصول موقتاً در دسترس نیست.",
  },
};

function descriptionText(html: string | null): string {
  if (!html) return "";
  const document = new DOMParser().parseFromString(html, "text/html");
  const headings = Array.from(document.body.querySelectorAll("h1,h2,h3,h4"));
  const cutoff = headings.find((heading) =>
    /get more information|contact us/i.test(heading.textContent || ""),
  );
  if (cutoff) {
    let current: Element | null = cutoff;
    while (current) {
      const next: Element | null = current.nextElementSibling;
      current.remove();
      current = next;
    }
  }
  document.body
    .querySelectorAll("p")
    .forEach((paragraph) => {
      if (/router-switch\.com|live chat|sales@/i.test(paragraph.textContent || "")) {
        paragraph.remove();
      }
    });
  return Array.from(document.body.querySelectorAll("p"))
    .map((paragraph) => paragraph.textContent?.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
}

export default function MallProductPage({ slug }: { slug: string }) {
  const { locale } = useI18n();
  const copy = copyByLocale[locale];
  const [product, setProduct] = useState<MallProduct | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    loadMallProduct(slug, controller.signal)
      .then((result) => {
        setProduct(result);
        setStatus("ready");
      })
      .catch((error) => {
        if ((error as Error).name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, [slug]);

  const overview = useMemo(
    () => descriptionText(product?.description_html || null),
    [product?.description_html],
  );

  return (
    <main
      className="min-h-screen overflow-x-clip bg-[#070b0a] pb-20 text-white antialiased lg:pb-0"
      id="top"
    >
      <Header />

      {status === "loading" && (
        <p className="px-5 pb-24 pt-36 text-center text-white/55">{copy.loading}</p>
      )}
      {status === "error" && (
        <p className="px-5 pb-24 pt-36 text-center text-red-200">{copy.error}</p>
      )}

      {status === "ready" && product && (
        <>
          <section className="border-b border-white/10 px-5 pb-12 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pb-16 lg:pt-36">
            <div className="mx-auto max-w-[1440px]">
              <a
                className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 transition hover:text-joto-green"
                href={localizedHref("/mall", locale)}
              >
                <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5 rtl:rotate-180" />
                {copy.back}
              </a>

              <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-14">
                <div>
                  <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-white">
                    {product.images[activeImage] ? (
                      <img
                        alt={`${product.title} ${activeImage + 1}`}
                        className="h-full w-full object-contain p-6 sm:p-10"
                        src={mallPublicUrl(product.images[activeImage])}
                      />
                    ) : (
                      <span className="text-black/40">{product.model || product.brand}</span>
                    )}
                  </div>
                  {product.images.length > 1 && (
                    <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
                      {product.images.map((image, index) => (
                        <button
                          aria-label={`Show product image ${index + 1}`}
                          className={`aspect-square bg-white p-2 transition ${
                            activeImage === index
                              ? "ring-2 ring-joto-green"
                              : "opacity-65 hover:opacity-100"
                          }`}
                          key={image}
                          onClick={() => setActiveImage(index)}
                          type="button"
                        >
                          <img
                            alt=""
                            className="h-full w-full object-contain"
                            src={mallPublicUrl(image)}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:pt-2">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-joto-green">
                    [ {product.category_path.join(" / ") || product.brand} ]
                  </p>
                  <h1 className="mt-5 text-balance text-[clamp(2.25rem,4.6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
                    {product.title}
                  </h1>
                  {product.summary && (
                    <p className="mt-6 text-base leading-7 text-white/55">
                      {product.summary}
                    </p>
                  )}
                  <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
                    {product.brand && (
                      <div className="grid grid-cols-[120px_1fr] gap-4 py-4 text-sm">
                        <dt className="text-white/38">Brand</dt>
                        <dd className="font-medium text-white/85">{product.brand}</dd>
                      </div>
                    )}
                    {product.model && (
                      <div className="grid grid-cols-[120px_1fr] gap-4 py-4 text-sm">
                        <dt className="text-white/38">{copy.model}</dt>
                        <dd className="font-medium text-white/85">{product.model}</dd>
                      </div>
                    )}
                    {product.condition && (
                      <div className="grid grid-cols-[120px_1fr] gap-4 py-4 text-sm">
                        <dt className="text-white/38">{copy.condition}</dt>
                        <dd className="font-medium text-white/85">
                          {product.condition.trim()}
                        </dd>
                      </div>
                    )}
                  </dl>
                  <a
                    className="mt-8 inline-flex h-12 min-w-52 items-center justify-center rounded-full bg-joto-green px-7 text-xs font-semibold uppercase tracking-[0.15em] text-joto-ink transition hover:bg-white"
                    href={localizedHref("/contact", locale)}
                  >
                    {copy.contact}
                  </a>
                </div>
              </div>
            </div>
          </section>

          <nav className="sticky top-[75px] z-30 border-b border-white/10 bg-[#070b0a]/95 px-5 backdrop-blur sm:px-8 lg:px-12">
            <div className="mx-auto flex max-w-[1440px] gap-7 overflow-x-auto py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
              {overview && <a href="#overview">{copy.overview}</a>}
              {Object.keys(product.specifications).length > 0 && (
                <a href="#specifications">{copy.specifications}</a>
              )}
              {product.application_scenarios.length > 0 && (
                <a href="#applications">{copy.applications}</a>
              )}
              {product.documents.length > 0 && <a href="#documents">{copy.documents}</a>}
            </div>
          </nav>

          <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
            {overview && (
              <section className="scroll-mt-36 border-t border-white/15 pt-7" id="overview">
                <div className="grid gap-7 lg:grid-cols-12">
                  <h2 className="text-2xl font-semibold tracking-[-0.035em] lg:col-span-3">
                    {copy.overview}
                  </h2>
                  <p className="whitespace-pre-line text-base leading-8 text-white/60 lg:col-span-9">
                    {overview}
                  </p>
                </div>
              </section>
            )}

            {Object.keys(product.specifications).length > 0 && (
              <section
                className="mt-14 scroll-mt-36 border-t border-white/15 pt-7"
                id="specifications"
              >
                <div className="grid gap-7 lg:grid-cols-12">
                  <h2 className="text-2xl font-semibold tracking-[-0.035em] lg:col-span-3">
                    {copy.specifications}
                  </h2>
                  <dl className="divide-y divide-white/10 border-b border-white/10 lg:col-span-9">
                    {Object.entries(product.specifications).map(([label, value]) => (
                      <div
                        className="grid gap-2 py-4 text-sm sm:grid-cols-[minmax(180px,0.36fr)_1fr] sm:gap-8"
                        key={label}
                      >
                        <dt className="font-medium text-white/48">{label.trim()}</dt>
                        <dd className="leading-6 text-white/75">{value.trim()}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </section>
            )}

            {product.application_scenarios.length > 0 && (
              <section
                className="mt-14 scroll-mt-36 border-t border-white/15 pt-7"
                id="applications"
              >
                <div className="grid gap-7 lg:grid-cols-12">
                  <h2 className="text-2xl font-semibold tracking-[-0.035em] lg:col-span-3">
                    {copy.applications}
                  </h2>
                  <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-white/65 lg:col-span-9">
                    {JSON.stringify(product.application_scenarios, null, 2)}
                  </pre>
                </div>
              </section>
            )}

            {product.documents.length > 0 && (
              <section
                className="mt-14 scroll-mt-36 border-t border-white/15 pt-7"
                id="documents"
              >
                <div className="grid gap-7 lg:grid-cols-12">
                  <h2 className="text-2xl font-semibold tracking-[-0.035em] lg:col-span-3">
                    {copy.documents}
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2 lg:col-span-9">
                    {product.documents.map((document) => (
                      <a
                        className="flex items-center gap-3 border border-white/12 bg-white/[0.03] p-4 text-sm text-white/75 transition hover:border-joto-green hover:text-white"
                        href={mallPublicUrl(document.url)}
                        key={document.url}
                      >
                        <Download aria-hidden="true" className="h-4 w-4 text-joto-green" />
                        {document.title || copy.documents}
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            )}

            <div className="mt-14 border-t border-white/10 pt-6">
              <a
                className="inline-flex items-center gap-2 text-xs text-white/35 transition hover:text-joto-green"
                href={product.source_url}
                rel="noreferrer"
                target="_blank"
              >
                {copy.source}
                <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#070b0a]/95 p-3 backdrop-blur lg:hidden">
            <a
              className="flex h-12 items-center justify-center rounded-full bg-joto-green text-xs font-semibold uppercase tracking-[0.15em] text-joto-ink"
              href={localizedHref("/contact", locale)}
            >
              {copy.contact}
            </a>
          </div>
        </>
      )}

      <SiteFooter />
    </main>
  );
}
