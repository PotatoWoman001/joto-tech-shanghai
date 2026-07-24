import { lazy, Suspense, type ReactNode } from "react";
import About from "./components/About";
import CaseStudies from "./components/CaseStudies";
import ContactFooter from "./components/ContactFooter";
import GlobalPresence from "./components/GlobalPresence";
import Hero from "./components/Hero";
import Partners from "./components/Partners";
import Services from "./components/Services";
import Solutions from "./components/Solutions";
import { featureFlags } from "./config/features";
import { getBlogArticle } from "./content/blog";
import { getPartnerDetail } from "./content/partners";
import { getSolutionCategoryDetail } from "./content/solutionCategories";
import AboutPage from "./pages/AboutPage";
import BlogArticlePage from "./pages/BlogArticlePage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import PartnerDetailPage from "./pages/PartnerDetailPage";
import SolutionCategoryPage from "./pages/SolutionCategoryPage";
import SolutionCapabilityIconPreviewPage from "./pages/SolutionCapabilityIconPreviewPage";
import { useI18n } from "./i18n/I18nProvider";
import { localizePartnerDetail } from "./i18n/translations";
import { buildSeoDescriptor } from "./seo/descriptor";
import SeoHead from "./seo/SeoHead";

const CustomerLogoWall = lazy(() => import("./components/CustomerLogoWall"));
const CustomerLogoWallPreviewPage = lazy(() => import("./pages/CustomerLogoWallPreviewPage"));

export default function App() {
  const { locale, pathname } = useI18n();
  const categoryDetail = getSolutionCategoryDetail(pathname, locale);
  const detail = localizePartnerDetail(locale, getPartnerDetail(pathname));
  const seo = buildSeoDescriptor(locale, pathname);
  let page: ReactNode;

  if (pathname === "/preview/customer-logo-wall") {
    page = (
      <Suspense fallback={<main className="min-h-screen bg-[#070b0a]" />}>
        <CustomerLogoWallPreviewPage />
      </Suspense>
    );
  } else if (pathname === "/preview/solution-capability-icons") {
    page = <SolutionCapabilityIconPreviewPage />;
  } else if (pathname === "/about" || pathname === "/about/") {
    page = <AboutPage />;
  } else if (pathname === "/blog" || pathname === "/blog/") {
    page = <BlogPage />;
  } else {
    const blogSlug = pathname.match(/^\/blog\/([^/]+)\/?$/)?.[1];

    if (blogSlug) {
      const article = getBlogArticle(blogSlug);
      page = article ? <BlogArticlePage article={article} /> : <NotFoundPage />;
    } else if (pathname === "/contact" || pathname === "/contact/") {
      page = <ContactPage />;
    } else if (categoryDetail) {
      page = <SolutionCategoryPage detail={categoryDetail} />;
    } else if (detail) {
      page = <PartnerDetailPage detail={detail} />;
    } else if (pathname === "/") {
      page = (
        <main
          id="top"
          className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased"
        >
          <Hero />
          <Solutions />
          <Services />
          <CaseStudies />
          {featureFlags.customerLogoWall && (
            <div className="contents" data-customer-logo-wall-slot>
              <Suspense fallback={null}>
                <CustomerLogoWall />
              </Suspense>
            </div>
          )}
          <About />
          <Partners />
          <GlobalPresence />
          <ContactFooter />
        </main>
      );
    } else {
      page = <NotFoundPage />;
    }
  }

  return (
    <>
      <SeoHead descriptor={seo} />
      {page}
    </>
  );
}
