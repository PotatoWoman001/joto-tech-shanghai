import arubaLogo from "../assets/logos/aruba.svg";
import audioCodesLogo from "../assets/logos/audiocodes.png";
import checkpointLogo from "../assets/logos/checkpoint.svg";
import ciscoLogo from "../assets/logos/cisco.svg";
import danaherLogo from "../assets/logos/danaher.svg";
import dellLogo from "../assets/logos/dell.svg";
import extremeLogo from "../assets/logos/extreme-networks.png";
import fortinetLogo from "../assets/logos/fortinet.svg";
import harrowLogo from "../assets/logos/harrow.svg";
import hikvisionLogo from "../assets/logos/hikvision.svg";
import huaweiLogo from "../assets/logos/huawei.svg";
import jdLogo from "../assets/logos/jd.png";
import paloAltoLogo from "../assets/logos/palo-alto.svg";
import sangforLogo from "../assets/logos/sangfor.png";
import starbucksLogo from "../assets/logos/starbucks.svg";
import verkadaLogo from "../assets/logos/verkada.png";
import collaborationVisual from "../assets/solutions/collaboration.webp";
import networkVisual from "../assets/solutions/network.webp";
import safeguardingVisual from "../assets/solutions/safeguarding.webp";
import securityVisual from "../assets/solutions/security.webp";
import serverStorageVisual from "../assets/solutions/server-storage.webp";
import type { SiteContent, Vendor } from "./types";

const vendors: Record<string, Vendor> = {
  cisco: {
    name: "Cisco",
    tier: "Gold",
    description:
      "Enterprise networking across campus switching, wireless, routing and cloud-managed infrastructure.",
    logo: ciscoLogo,
  },
  extreme: {
    name: "Extreme Networks",
    tier: "Gold",
    description:
      "Cloud-managed wired and wireless networking for distributed enterprise and campus environments.",
    logo: extremeLogo,
  },
  aruba: {
    name: "Aruba",
    description:
      "Wired, wireless and network-management capabilities for secure, connected workplaces and campuses.",
    logo: arubaLogo,
  },
  sangforNetwork: {
    name: "Sangfor 深信服",
    tier: "Gold",
    description:
      "Secure networking capabilities for branch connectivity, application access and managed infrastructure.",
    logo: sangforLogo,
  },
  knowBe4: {
    name: "KnowBe4",
    description:
      "Security-awareness training and simulated phishing designed to help organizations reduce human risk.",
  },
  paloAlto: {
    name: "Palo Alto Networks",
    tier: "Platinum",
    description:
      "Network-security and threat-prevention capabilities for users, applications and distributed environments.",
    logo: paloAltoLogo,
  },
  fortinet: {
    name: "Fortinet",
    tier: "Gold",
    description:
      "Integrated networking and security capabilities spanning firewalls, secure access and branch environments.",
    logo: fortinetLogo,
  },
  sangforSecurity: {
    name: "Sangfor 深信服",
    description:
      "Network-security capabilities for protecting access, applications and enterprise infrastructure.",
    logo: sangforLogo,
  },
  checkpoint: {
    name: "Check Point",
    description:
      "Enterprise threat prevention and security management across networks, cloud environments and users.",
    logo: checkpointLogo,
  },
  oneLogin: {
    name: "OneLogin",
    description:
      "Cloud-based identity and access management with single sign-on, multi-factor authentication and lifecycle controls.",
  },
  dell: {
    name: "Dell Technologies",
    description:
      "Enterprise compute and storage platforms for data-center, virtualization and workload requirements.",
    logo: dellLogo,
  },
  huawei: {
    name: "Huawei",
    description:
      "Enterprise compute and data-storage infrastructure for private cloud and business workloads.",
    logo: huaweiLogo,
  },
  inspur: {
    name: "Inspur 浪潮",
    description:
      "Server and storage platforms for enterprise computing, cloud infrastructure and data-intensive workloads.",
  },
  audioCodes: {
    name: "AudioCodes",
    description:
      "Voice connectivity and communications infrastructure for enterprise calling and collaboration environments.",
    logo: audioCodesLogo,
  },
  vodia: {
    name: "Vodia",
    description:
      "Multi-tenant IP PBX software for hosted and enterprise voice communications across common server platforms.",
  },
  cyberData: {
    name: "CyberData",
    description:
      "SIP paging, intercom and notification endpoints for IP-based communication and alerting systems.",
  },
  informaCast: {
    name: "InformaCast",
    description:
      "Mass-notification and incident-communication software for coordinated audio, text and visual alerts.",
  },
  verkada: {
    name: "Verkada",
    description:
      "Cloud-managed physical-security systems spanning video security, access and environmental visibility.",
    logo: verkadaLogo,
  },
  hikvision: {
    name: "Hikvision",
    description:
      "Video-security and access-control products for monitoring and safeguarding physical environments.",
    logo: hikvisionLogo,
  },
  keyking: {
    name: "Keyking",
    description:
      "Access-control hardware and integrated physical-security management for connected facilities.",
  },
};

const nav = [
  { label: "SOLUTIONS", href: "#solutions" },
  { label: "SERVICES", href: "#services" },
  { label: "CASE STUDIES", href: "#case-studies" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

export const siteContent: SiteContent = {
  brand: {
    name: "JOTO TECH",
    legalName: "JOTO Tech (SH) Co., Ltd.",
    logoAlt: "JOTO TECH",
  },
  nav,
  hero: {
    eyebrow: "ENTERPRISE-READY IT SOLUTIONS",
    headline: "BUILD WHAT'S NEXT",
    accent: ".",
    description:
      "Design, deploy and operate secure IT infrastructure across China and beyond.",
    card: {
      tag: "[ SINCE 2010 ]",
      title: "Engineered by",
      emphasis: "Certified Professionals",
      description:
        "Architecture, integration and support for complex, multi-vendor environments.",
    },
    cta: { label: "EXPLORE SOLUTIONS", href: "#solutions" },
    videoUrl:
      "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8",
  },
  solutions: {
    eyebrow: "WHAT WE DELIVER",
    title: "Infrastructure built as one connected system.",
    description:
      "A focused portfolio across the network, security, compute, communications and physical safeguards that modern organizations depend on.",
    categories: [
      {
        id: "network",
        title: "Network",
        description:
          "Campus, branch and data-center connectivity designed for consistent performance, visibility and control.",
        image: networkVisual,
        imageAlt: "Enterprise network switches connected by illuminated fiber-optic paths",
        vendors: [vendors.cisco, vendors.extreme, vendors.aruba, vendors.sangforNetwork],
      },
      {
        id: "security",
        title: "Security",
        description:
          "Layered protection for people, identities, applications, networks and day-to-day operations.",
        image: securityVisual,
        imageAlt: "Layered digital protection surrounding secure enterprise infrastructure",
        vendors: [
          vendors.knowBe4,
          vendors.paloAlto,
          vendors.fortinet,
          vendors.sangforSecurity,
          vendors.checkpoint,
          vendors.oneLogin,
        ],
      },
      {
        id: "server-storage",
        title: "Server & Storage",
        description:
          "Compute and data platforms sized around resilience, workload needs and practical lifecycle management.",
        image: serverStorageVisual,
        imageAlt: "Enterprise data-center racks housing compute and storage infrastructure",
        vendors: [vendors.dell, vendors.huawei, vendors.inspur],
      },
      {
        id: "collaboration",
        title: "Collaboration",
        description:
          "Voice, paging and critical communications that connect teams and reach people when timing matters.",
        image: collaborationVisual,
        imageAlt: "Connected enterprise voice, paging and meeting-room communication devices",
        vendors: [vendors.audioCodes, vendors.vodia, vendors.cyberData, vendors.informaCast],
      },
      {
        id: "safeguarding",
        title: "Safeguarding",
        description:
          "Connected video, access and physical-security systems for safer workplaces, campuses and facilities.",
        image: safeguardingVisual,
        imageAlt: "Video surveillance and access-control devices protecting a modern facility",
        vendors: [vendors.verkada, vendors.hikvision, vendors.keyking],
      },
    ],
  },
  services: {
    eyebrow: "END-TO-END DELIVERY",
    title: "From the first workshop to steady-state operations.",
    description:
      "JOTO brings planning, integration and ongoing service together so multi-vendor environments remain coherent throughout their lifecycle.",
    items: [
      {
        title: "Advisory & Planning",
        description:
          "Translate business, technical and compliance requirements into a practical architecture and roadmap.",
        points: [
          "Current-state assessment",
          "Architecture and technology selection",
          "Bill of materials and rollout planning",
          "Budget and lifecycle considerations",
        ],
      },
      {
        title: "Design & Integration",
        description:
          "Coordinate products, deployment work and acceptance across connected infrastructure domains.",
        points: [
          "Detailed solution design",
          "Multi-vendor procurement coordination",
          "Installation, migration and testing",
          "Documentation and handover",
        ],
      },
      {
        title: "Security & Compliance",
        description:
          "Strengthen technology and operating practices around access, protection and audit readiness.",
        points: [
          "Security architecture review",
          "Network and identity controls",
          "Security-awareness programs",
          "Remediation planning and support",
        ],
      },
      {
        title: "Managed Services & Support",
        description:
          "Maintain service continuity through coordinated monitoring, maintenance and user support.",
        points: [
          "Remote and on-site support",
          "Incident and service coordination",
          "Preventive maintenance",
          "Vendor and lifecycle management",
        ],
      },
    ],
  },
  caseStudies: {
    eyebrow: "SELECTED EXPERIENCE",
    title: "Complex environments, delivered with care.",
    description:
      "Selected references from JOTO materials. Scope statements remain deliberately concise pending the next client-approval review.",
    items: [
      {
        client: "Harrow International School",
        sector: "Education",
        summary:
          "Campus networking and ongoing on-site support for international-school environments in China.",
        capabilities: ["Campus networking", "Wireless infrastructure", "On-site support"],
        logo: harrowLogo,
      },
      {
        client: "Starbucks China",
        sector: "Retail & F&B",
        summary:
          "Security-infrastructure reinforcement supporting large-scale business operations in China.",
        capabilities: ["Network security", "Endpoint protection", "Security operations"],
        logo: starbucksLogo,
      },
      {
        client: "Danaher",
        sector: "Life Sciences & Manufacturing",
        summary:
          "Multi-site IT and security infrastructure delivery and maintenance for offices in China.",
        capabilities: ["Data-center networking", "Compute and storage", "Physical security"],
        logo: danaherLogo,
      },
      {
        client: "JD International",
        sector: "E-commerce",
        summary:
          "Workplace infrastructure design and deployment supporting international business expansion.",
        capabilities: ["Global workplace design", "Network and security", "Site deployment"],
        logo: jdLogo,
      },
    ],
  },
  about: {
    eyebrow: "ABOUT JOTO",
    title: "A China-based technology partner with an international delivery view.",
    description:
      "Established in Shanghai in 2010, JOTO plans, integrates and supports enterprise IT and physical-security environments across multiple technology domains.",
    secondary:
      "Our role is to connect strategy with field delivery: one team coordinating architecture, products, deployment and ongoing service across China and selected international locations.",
    stats: [
      { value: "2010", label: "Established in Shanghai" },
      { value: "5", label: "Solution domains" },
      { value: "MULTI-VENDOR", label: "Integrated delivery model" },
      { value: "LIFECYCLE", label: "Plan, deploy and operate" },
    ],
  },
  partners: {
    eyebrow: "TECHNOLOGY PORTFOLIO",
    title: "A focused multi-vendor ecosystem.",
    description:
      "Partnership tiers are shown only where supplied by JOTO for this release; all other brands are presented without a level claim.",
    items: [
      vendors.cisco,
      vendors.extreme,
      vendors.aruba,
      vendors.sangforNetwork,
      vendors.knowBe4,
      vendors.paloAlto,
      vendors.fortinet,
      vendors.checkpoint,
      vendors.oneLogin,
      vendors.dell,
      vendors.huawei,
      vendors.inspur,
      vendors.audioCodes,
      vendors.vodia,
      vendors.cyberData,
      vendors.informaCast,
      vendors.verkada,
      vendors.hikvision,
      vendors.keyking,
    ],
  },
  globalPresence: {
    eyebrow: "GLOBAL PRESENCE",
    title: "Local execution, coordinated across borders.",
    description:
      "JOTO materials identify delivery presence across the following markets. Exact office and service coverage can be refined before public launch.",
    regions: [
      { region: "China", cities: ["Shanghai", "Beijing", "Shenzhen", "Suzhou", "Hong Kong"] },
      { region: "Japan", cities: ["Tokyo"] },
      { region: "Thailand", cities: ["Bangkok"] },
      { region: "Singapore", cities: ["Singapore"] },
      { region: "United States", cities: ["Cupertino", "Sheridan"] },
      { region: "United Kingdom", cities: ["London"] },
    ],
  },
  contact: {
    eyebrow: "START A CONVERSATION",
    title: "Bring us the environment you need to improve.",
    description:
      "Tell us about your locations, priorities and timeline. We will help shape a practical next step.",
    hotline: "400 100 3172",
    phone: "+86 (021) 6566 1628",
    email: "sales@jototech.cn",
    companyCn: "上海聚托信息科技有限公司",
    companyEn: "JOTO Tech (SH) Co., Ltd.",
    offices: [
      {
        city: "Shanghai (HQ)",
        address: "Rm 1203A/B, No. 1402 Shuidian Road, Hongkou District, Shanghai, China",
      },
      {
        city: "Shenzhen",
        address: "Room 501, No. 15 Shengang Chanxue Industry Park, Shenzhen, China",
      },
      {
        city: "Hong Kong",
        address:
          "Unit A22, Block A, 10/F Prince Industrial Building, 706 Prince Edward Road East, San Po Kong",
      },
      {
        city: "Singapore",
        address: "10 Anson Road #28-18, International Plaza, Singapore 079903",
      },
      {
        city: "United States",
        address: "30 N Gould St, Suite R, Sheridan, WY 82801, United States",
      },
    ],
  },
  footer: {
    copyright: "© JOTO TECH. All rights reserved.",
    icp: "沪ICP备15056478号",
    links: nav,
  },
};

export default siteContent;
