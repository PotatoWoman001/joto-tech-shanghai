import BlogCard from "../components/BlogCard";
import Header from "../components/Header";
import SiteFooter from "../components/SiteFooter";
import { blogArticles, blogPageCopy } from "../content/blog";
import { useI18n } from "../i18n/I18nProvider";

export default function BlogPage() {
  const { locale } = useI18n();
  const copy = blogPageCopy[locale];

  return (
    <main id="top" className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased">
      <Header />

      <section
        aria-labelledby="blog-page-title"
        className="border-b border-white/10 px-5 pb-8 pt-28 sm:px-8 sm:pb-10 sm:pt-32 lg:px-12 lg:pb-12 lg:pt-36"
      >
        <div className="mx-auto grid max-w-[1440px] gap-7 md:grid-cols-12 md:items-end">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-joto-green md:col-span-3 md:self-start md:pt-2">
            [ {copy.eyebrow} ]
          </p>
          <div className="md:col-span-9">
            <h1
              className="max-w-4xl text-balance text-[clamp(2.65rem,5vw,4.8rem)] font-medium leading-[0.92] tracking-[-0.06em]"
              id="blog-page-title"
            >
              {copy.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/55 sm:text-lg">
              {copy.description}
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center justify-between gap-6 border-t border-white/15 pt-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/48">
              [ {copy.latest} ]
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-joto-green">
              01 — {String(blogArticles.length).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {blogArticles.map((article) => (
              <BlogCard article={article} copy={copy} key={article.slug} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
