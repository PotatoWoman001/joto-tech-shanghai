import About from "./components/About";
import CaseStudies from "./components/CaseStudies";
import ContactFooter from "./components/ContactFooter";
import GlobalPresence from "./components/GlobalPresence";
import Hero from "./components/Hero";
import Partners from "./components/Partners";
import Services from "./components/Services";
import Solutions from "./components/Solutions";

export default function App() {
  return (
    <main id="top" className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased">
      <Hero />
      <Solutions />
      <Services />
      <CaseStudies />
      <About />
      <Partners />
      <GlobalPresence />
      <ContactFooter />
    </main>
  );
}
