import { lazy, Suspense } from "react";
import About from "./components/About";
import CaseStudies from "./components/CaseStudies";
import ContactFooter from "./components/ContactFooter";
import GlobalPresence from "./components/GlobalPresence";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Solutions from "./components/Solutions";
import { featureFlags } from "./config/features";
import { getPartnerDetail } from "./content/partners";
import PartnerDetailPage from "./pages/PartnerDetailPage";

const CustomerLogoWall = lazy(() => import("./components/CustomerLogoWall"));
const CustomerLogoWallPreviewPage = lazy(() => import("./pages/CustomerLogoWallPreviewPage"));

export default function App() {
  const pathname = typeof window === "undefined" ? "/" : window.location.pathname;

  if (pathname === "/preview/customer-logo-wall") {
    return (
      <Suspense fallback={<main className="min-h-screen bg-[#070b0a]" />}>
        <CustomerLogoWallPreviewPage />
      </Suspense>
    );
  }

  const detail = getPartnerDetail(pathname);

  if (detail) {
    return <PartnerDetailPage detail={detail} />;
  }

  return (
    <main id="top" className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased">
      <Hero />
      {featureFlags.customerLogoWall && (
        <Suspense fallback={null}>
          <CustomerLogoWall />
        </Suspense>
      )}
      <Solutions />
      <Services />
      <CaseStudies />
      <About />
      <GlobalPresence />
      <ContactFooter />
    </main>
  );
}
