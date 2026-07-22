import About from "./components/About";
import CaseStudies from "./components/CaseStudies";
import ContactFooter from "./components/ContactFooter";
import GlobalPresence from "./components/GlobalPresence";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Solutions from "./components/Solutions";
import { getPartnerDetail } from "./content/partners";
import PartnerDetailPage from "./pages/PartnerDetailPage";

export default function App() {
  const detail =
    typeof window === "undefined" ? undefined : getPartnerDetail(window.location.pathname);

  if (detail) {
    return <PartnerDetailPage detail={detail} />;
  }

  return (
    <main id="top" className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased">
      <Hero />
      <Solutions />
      <Services />
      <CaseStudies />
      <About />
      <GlobalPresence />
      <ContactFooter />
    </main>
  );
}
