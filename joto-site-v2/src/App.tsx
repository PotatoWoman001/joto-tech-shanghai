import { lazy, Suspense } from "react";
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
import AboutPage from "./pages/AboutPage";
import BlogArticlePage from "./pages/BlogArticlePage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import PartnerDetailPage from "./pages/PartnerDetailPage";
import { useI18n } from "./i18n/I18nProvider";
import { localizePartnerDetail } from "./i18n/translations";

const CustomerLogoWall = lazy(() => import("./components/CustomerLogoWall"));
const CustomerLogoWallPreviewPage = lazy(() => import("./pages/CustomerLogoWallPreviewPage"));

export default function App() {
  const { locale, pathname } = useI18n();

  if (pathname === "/preview/customer-logo-wall") {
    return (
      <Suspense fallback={<main className="min-h-screen bg-[#070b0a]" />}>
        <CustomerLogoWallPreviewPage />
      </Suspense>
    );
  }

  const detail = localizePartnerDetail(locale, getPartnerDetail(pathname));

  if (pathname === "/about" || pathname === "/about/") {
    return <AboutPage />;
  }

  if (pathname === "/blog" || pathname === "/blog/") {
    return <BlogPage />;
  }

  const blogSlug = pathname.match(/^\/blog\/([^/]+)\/?$/)?.[1];
  if (blogSlug) {
    return <BlogArticlePage article={getBlogArticle(blogSlug)} />;
  }

  if (pathname === "/contact" || pathname === "/contact/") {
    return <ContactPage />;
  }

  if (detail) {
    return <PartnerDetailPage detail={detail} />;
  }

  return (
    <main id="top" className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased">
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
}
