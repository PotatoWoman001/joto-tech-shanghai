export type PartnerTier = "Gold" | "Platinum";

export interface NavItem {
  label: string;
  href: string;
}

export interface Vendor {
  name: string;
  description: string;
  tier?: PartnerTier;
  logo?: string;
  logoScale?: "compact" | "standard" | "wide";
}

export interface SolutionCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  vendors: Vendor[];
}

export type ServiceIcon =
  | "planning"
  | "deployment"
  | "support"
  | "security"
  | "staffing"
  | "procurement";

export interface ServiceItem {
  icon: ServiceIcon;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface CaseStudy {
  client: string;
  sector: string;
  summary: string;
  capabilities: string[];
  logo?: string;
  logoTreatment?: "original" | "monochrome";
}

export interface Stat {
  value: string;
  label: string;
}

export interface Region {
  region: string;
  cities: string[];
}

export interface Office {
  city: string;
  address: string;
}

export interface SiteContent {
  brand: {
    name: string;
    legalName: string;
    logoAlt: string;
  };
  nav: NavItem[];
  hero: {
    eyebrow: string;
    headline: string;
    accent: string;
    accentWords: string[];
    headlineSecondLine: string;
    description: string;
    card: {
      tag: string;
      title: string;
      emphasis: string;
      description: string;
    };
    cta: NavItem;
    videoUrl: string;
  };
  solutions: {
    eyebrow: string;
    title: string;
    description: string;
    categories: SolutionCategory[];
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    items: ServiceItem[];
  };
  caseStudies: {
    eyebrow: string;
    title: string;
    description: string;
    items: CaseStudy[];
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    secondary: string;
    stats: Stat[];
  };
  partners: {
    eyebrow: string;
    title: string;
    description: string;
    items: Vendor[];
  };
  globalPresence: {
    eyebrow: string;
    title: string;
    description: string;
    regions: Region[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    hotline: string;
    phone: string;
    email: string;
    companyCn: string;
    companyEn: string;
    offices: Office[];
  };
  footer: {
    copyright: string;
    icp: string;
    links: NavItem[];
  };
}
