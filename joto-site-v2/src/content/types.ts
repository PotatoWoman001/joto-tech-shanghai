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
}

export interface SolutionCategory {
  id: string;
  title: string;
  description: string;
  vendors: Vendor[];
}

export interface ServiceItem {
  title: string;
  description: string;
  points: string[];
}

export interface CaseStudy {
  client: string;
  sector: string;
  summary: string;
  capabilities: string[];
  logo?: string;
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
