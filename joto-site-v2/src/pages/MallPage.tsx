import { Grid2X2, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import SiteFooter from "../components/SiteFooter";
import {
  loadMallCatalog,
  mallPublicUrl,
  type MallIndexProduct,
} from "../content/mall";
import { useI18n } from "../i18n/I18nProvider";
import { localizedHref, type Locale } from "../i18n/routing";

const copyByLocale: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    description: string;
    search: string;
    allBrands: string;
    allCategories: string;
    products: string;
    empty: string;
    loading: string;
    error: string;
    contact: string;
    condition: string;
    catalog: string;
  }
> = {
  en: {
    eyebrow: "JOTO PRODUCT CATALOG",
    title: "Enterprise technology, ready for your next project.",
    description:
      "Explore verified networking and infrastructure products. Tell us what you need and our team will help with availability, configuration and delivery.",
    search: "Search product, brand or model",
    allBrands: "All brands",
    allCategories: "All categories",
    products: "products",
    empty: "No products match these filters.",
    loading: "Loading the product catalog…",
    error: "The product catalog is temporarily unavailable.",
    contact: "Contact Us",
    condition: "Condition",
    catalog: "Catalog",
  },
  "zh-CN": {
    eyebrow: "JOTO 产品目录",
    title: "面向企业项目的技术产品目录。",
    description:
      "浏览已验证的网络与基础设施产品。告诉我们您的需求，我们将协助确认供货、配置与交付方案。",
    search: "搜索产品、品牌或型号",
    allBrands: "全部品牌",
    allCategories: "全部分类",
    products: "个产品",
    empty: "没有符合当前筛选条件的产品。",
    loading: "正在加载产品目录…",
    error: "产品目录暂时无法加载。",
    contact: "联系我们",
    condition: "产品成色",
    catalog: "产品目录",
  },
  "fa-IR": {
    eyebrow: "کاتالوگ محصولات JOTO",
    title: "فناوری سازمانی برای پروژه بعدی شما.",
    description:
      "محصولات تأییدشده شبکه و زیرساخت را بررسی کنید. نیاز خود را با ما در میان بگذارید تا برای موجودی، پیکربندی و تحویل راهنمایی شوید.",
    search: "جستجوی محصول، برند یا مدل",
    allBrands: "همه برندها",
    allCategories: "همه دسته‌ها",
    products: "محصول",
    empty: "محصولی با این فیلترها پیدا نشد.",
    loading: "در حال بارگذاری کاتالوگ…",
    error: "کاتالوگ محصولات موقتاً در دسترس نیست.",
    contact: "تماس با ما",
    condition: "وضعیت",
    catalog: "کاتالوگ",
  },
};

function normalized(value: string | null | undefined) {
  return (value || "").trim().toLocaleLowerCase();
}
export default function MallPage() {
  const { locale } = useI18n();
  const copy = copyByLocale[locale];
  const [products, setProducts] = useState<MallIndexProduct[]>([]);
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    loadMallCatalog(controller.signal)
      .then((catalog) => {
        setProducts(catalog.products);
        setStatus("ready");
      })
      .catch((error) => {
        if ((error as Error).name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, []);

  const brands = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.brand).filter(Boolean) as string[]),
      ).sort(),
    [products],
  );
  const categories = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.category_path[0]).filter(Boolean)),
      ).sort(),
    [products],
  );
  const filteredProducts = useMemo(() => {
    const needle = normalized(query);
    return products.filter((product) => {
      const matchesQuery =
        !needle ||
        [product.title, product.brand, product.model]
          .map(normalized)
          .some((value) => value.includes(needle));
      const matchesBrand = !brand || product.brand === brand;
      const matchesCategory = !category || product.category_path[0] === category;
      return matchesQuery && matchesBrand && matchesCategory;
    });
  }, [brand, category, products, query]);

  return (
    <main
      className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased"
      id="top"
    >
      <Header />

      <section className="border-b border-white/10 px-5 pb-10 pt-28 sm:px-8 sm:pb-12 sm:pt-32 lg:px-12 lg:pb-16 lg:pt-36">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-12 lg:items-end">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-joto-green lg:col-span-3 lg:self-start lg:pt-2">
            [ {copy.eyebrow} ]
          </p>
          <div className="lg:col-span-9">
            <h1 className="max-w-5xl text-balance text-[clamp(2.5rem,5vw,5rem)] font-medium leading-[0.94] tracking-[-0.055em]">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-white/55 sm:text-lg">
              {copy.description}
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-3 border-y border-white/10 py-5 md:grid-cols-[minmax(0,1fr)_220px_220px]">
            <label className="relative">
              <span className="sr-only">{copy.search}</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 rtl:left-auto rtl:right-4"
              />
              <input
                className="h-12 w-full rounded-none border border-white/15 bg-white/[0.035] px-11 text-sm text-white outline-none transition focus:border-joto-green"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.search}
                type="search"
                value={query}
              />
            </label>
            <label>
              <span className="sr-only">{copy.allBrands}</span>
              <select
                className="h-12 w-full border border-white/15 bg-[#0b100e] px-4 text-sm text-white outline-none focus:border-joto-green"
                onChange={(event) => setBrand(event.target.value)}
                value={brand}
              >
                <option value="">{copy.allBrands}</option>
                {brands.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">{copy.allCategories}</span>
              <select
                className="h-12 w-full border border-white/15 bg-[#0b100e] px-4 text-sm text-white outline-none focus:border-joto-green"
                onChange={(event) => setCategory(event.target.value)}
                value={category}
              >
                <option value="">{copy.allCategories}</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-3">
              <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-joto-green" />
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">
                {copy.catalog} · {filteredProducts.length} {copy.products}
              </p>
            </div>
            <Grid2X2 aria-hidden="true" className="h-4 w-4 text-white/40" />
          </div>

          {status === "loading" && (
            <p className="border-t border-white/10 py-20 text-center text-white/55">
              {copy.loading}
            </p>
          )}
          {status === "error" && (
            <p className="border-t border-white/10 py-20 text-center text-red-200">
              {copy.error}
            </p>
          )}
          {status === "ready" && filteredProducts.length === 0 && (
            <p className="border-t border-white/10 py-20 text-center text-white/55">
              {copy.empty}
            </p>
          )}

          {status === "ready" && filteredProducts.length > 0 && (
            <div className="grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <article
                  className="group flex min-h-full flex-col bg-[#090e0c] p-5 transition-colors hover:bg-[#0c1511] sm:p-6"
                  key={product.id}
                >
                  <a
                    className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-white"
                    href={localizedHref(`/mall/products/${product.slug}`, locale)}
                  >
                    {product.images[0] ? (
                      <img
                        alt={product.title}
                        className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.035]"
                        loading="lazy"
                        src={mallPublicUrl(product.images[0])}
                      />
                    ) : (
                      <span className="text-sm text-black/45">{product.model || product.brand}</span>
                    )}
                  </a>
                  <div className="flex flex-1 flex-col pt-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-joto-green">
                      {product.brand || product.category_path[0] || copy.catalog}
                    </p>
                    <h2 className="mt-3 text-xl font-semibold leading-7 tracking-[-0.025em]">
                      <a
                        className="transition-colors hover:text-joto-green"
                        href={localizedHref(`/mall/products/${product.slug}`, locale)}
                      >
                        {product.title}
                      </a>
                    </h2>
                    {(product.model || product.condition) && (
                      <dl className="mt-5 grid gap-2 border-t border-white/10 pt-4 text-sm">
                        {product.model && (
                          <div className="flex justify-between gap-4">
                            <dt className="text-white/40">Model</dt>
                            <dd className="text-right text-white/75">{product.model}</dd>
                          </div>
                        )}
                        {product.condition && (
                          <div className="flex justify-between gap-4">
                            <dt className="text-white/40">{copy.condition}</dt>
                            <dd className="text-right text-white/75">
                              {product.condition.trim()}
                            </dd>
                          </div>
                        )}
                      </dl>
                    )}
                    <a
                      className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-joto-green px-5 text-xs font-semibold uppercase tracking-[0.14em] text-joto-ink transition hover:bg-white"
                      href={localizedHref("/contact", locale)}
                    >
                      {copy.contact}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
