import ciscoHeroVisual from "../assets/partners/cisco-network-management.png";
import chewyLogo from "../assets/logos/chewy.svg";
import ciscoLogo from "../assets/logos/cisco.svg";
import danaherLogo from "../assets/logos/danaher.svg";
import harrowLogo from "../assets/logos/harrow.svg";

export interface PartnerReason {
  title: string;
  description: string;
}

export interface PartnerService {
  title: string;
  description: string;
  capabilities: string[];
}

export interface PartnerCaseStudy {
  client: string;
  tag: string;
  category: string;
  brief: string;
  scope: string[];
  logo: string;
}

export interface PartnerDetail {
  pathname: string;
  solutionName: string;
  partnerName: string;
  partnerLogo: string;
  eyebrow: string;
  title: string;
  accent: string;
  introduction: string;
  heroVisual: {
    src: string;
    alt: string;
    caption: string;
  };
  relationshipTitle: string;
  relationshipDescription: string;
  reasons: PartnerReason[];
  servicesTitle: string;
  servicesDescription: string;
  services: PartnerService[];
  cases: PartnerCaseStudy[];
  ctaTitle: string;
  ctaDescription: string;
  contactEmail: string;
}

const ciscoDetail: PartnerDetail = {
  pathname: "/solutions/network/cisco",
  solutionName: "Network",
  partnerName: "Cisco",
  partnerLogo: ciscoLogo,
  eyebrow: "Network / Cisco",
  title: "Cisco solutions,",
  accent: "delivered by JOTO.",
  introduction:
    "JOTO helps enterprises plan, deploy and operate Cisco network infrastructure across offices, campuses, factories and data centers. Our team brings practical experience across Catalyst, Nexus, Meraki and Cisco UCS, with support covering both project delivery and daily operations.",
  heroVisual: {
    src: ciscoHeroVisual,
    alt: "Cisco Catalyst switches, wireless access points and Catalyst Center management interface",
    caption: "Cisco networking infrastructure · planned, deployed and supported by JOTO",
  },
  relationshipTitle: "Cisco expertise, backed by delivery experience.",
  relationshipDescription:
    "JOTO provides Cisco-based network design, deployment and ongoing support for enterprises operating across China and international locations. Our work extends beyond product supply: we help customers translate business and technical requirements into reliable infrastructure, integrate Cisco with the wider IT environment, and support the network after go-live.",
  reasons: [
    {
      title: "Enterprise-focused design",
      description:
        "Network architecture built around offices, campuses, factories and data centers, with capacity, coverage, availability and long-term growth considered from the start.",
    },
    {
      title: "China and cross-border delivery",
      description:
        "Coordination across headquarters standards, local environments, on-site delivery, supply chains and ongoing support for China and international locations.",
    },
    {
      title: "Long-term operational support",
      description:
        "Monitoring, incident response, configuration changes, software maintenance, spare-parts coordination and on-site assistance after go-live.",
    },
  ],
  servicesTitle: "Cisco services from JOTO",
  servicesDescription:
    "From network planning to integration and ongoing support, JOTO provides the services required to keep Cisco infrastructure aligned with day-to-day business needs.",
  services: [
    {
      title: "Consulting & Design",
      description:
        "JOTO assesses business requirements, users, sites and existing infrastructure before defining the network architecture.",
      capabilities: [
        "Existing network assessment",
        "Topology and high-availability design",
        "Wired and wireless coverage planning",
        "Hardware and licensing selection",
        "Campus, factory and data-center planning",
      ],
    },
    {
      title: "Integration & Support",
      description:
        "JOTO deploys and integrates Cisco infrastructure within the customer's wider IT environment.",
      capabilities: [
        "Catalyst and wireless deployment",
        "Meraki cloud-managed networking",
        "Nexus and UCS integration",
        "Migration and cut-over",
        "Testing, tuning and documentation",
      ],
    },
    {
      title: "Managed Services",
      description:
        "JOTO provides managed support across China and selected international locations according to the agreed service scope.",
      capabilities: [
        "Monitoring and incident response",
        "Configuration changes and backups",
        "Software and firmware maintenance",
        "Performance optimization",
        "Remote and on-site engineering support",
      ],
    },
  ],
  cases: [
    {
      client: "Harrow International School",
      tag: "5 campuses, 2019–2022",
      category: "Campus Network & Security",
      brief:
        "Across five new international schools, JOTO delivered the full IT infrastructure — including Cisco's largest DNA deployment in China.",
      scope: [
        "Cisco DNA architecture — 3,500+ Wi-Fi 5/6 APs",
        "800+ Cisco Catalyst 9200/9300 switches",
        "Daily on-site helpdesk",
      ],
      logo: harrowLogo,
    },
    {
      client: "Danaher",
      tag: "Fortune 500",
      category: "End-to-end IT Infrastructure",
      brief:
        "JOTO is responsible for the construction and maintenance of IT and security infrastructure for Danaher's offices across China.",
      scope: [
        "Cisco Nexus data-center network",
        "Cisco UCS servers",
        "Ongoing nationwide maintenance",
      ],
      logo: danaherLogo,
    },
    {
      client: "Chewy",
      tag: "Fortune 500",
      category: "IT Procurement & Managed Services",
      brief:
        "As Chewy expands into China, JOTO handles its IT procurement, installation and ongoing maintenance.",
      scope: [
        "Cisco Meraki networking",
        "Site deployment and installation",
        "On-site technical support",
      ],
      logo: chewyLogo,
    },
  ],
  ctaTitle: "Discuss your Cisco project with JOTO.",
  ctaDescription:
    "Tell us about your sites, users, current infrastructure and support requirements. Our team can help assess the next practical step for your Cisco environment.",
  contactEmail: "sales@jototech.cn",
};

export const partnerDetails: PartnerDetail[] = [ciscoDetail];

export function getPartnerDetail(pathname: string): PartnerDetail | undefined {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return partnerDetails.find((detail) => detail.pathname === normalizedPath);
}
