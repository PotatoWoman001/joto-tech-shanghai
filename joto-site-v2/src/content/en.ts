import arubaLogo from "../assets/logos/aruba.svg";
import audioCodesLogo from "../assets/logos/audiocodes.png";
import checkpointLogo from "../assets/logos/checkpoint.svg";
import ciscoLogo from "../assets/logos/cisco.svg";
import cyberDataLogo from "../assets/logos/cyberdata.png";
import danaherLogo from "../assets/logos/danaher.svg";
import dellLogo from "../assets/logos/dell.svg";
import extremeLogo from "../assets/logos/extreme-networks.png";
import fortinetLogo from "../assets/logos/fortinet.svg";
import harrowLogo from "../assets/logos/harrow.svg";
import hikvisionLogo from "../assets/logos/hikvision.svg";
import huaweiLogo from "../assets/logos/huawei.svg";
import informaCastLogo from "../assets/logos/informacast.svg";
import inspurLogo from "../assets/logos/inspur.svg";
import jdLogo from "../assets/logos/jingdong-international.png";
import keykingLogo from "../assets/logos/keyking.png";
import knowBe4Logo from "../assets/logos/knowbe4.svg";
import oneLoginLogo from "../assets/logos/onelogin.svg";
import paloAltoLogo from "../assets/logos/palo-alto.svg";
import sangforLogo from "../assets/logos/sangfor.png";
import starbucksLogo from "../assets/logos/starbucks.svg";
import verkadaLogo from "../assets/logos/verkada.png";
import vodiaLogo from "../assets/logos/vodia.svg";
import advisoryPlanningVisual from "../assets/services/advisory-planning.webp";
import designIntegrationVisual from "../assets/services/design-integration.webp";
import managedSupportVisual from "../assets/services/managed-support.webp";
import securityComplianceVisual from "../assets/services/security-compliance.webp";
import collaborationVisual from "../assets/solutions/collaboration-field-v3.png";
import networkVisual from "../assets/solutions/network-field-v3.png";
import safeguardingVisual from "../assets/solutions/safeguarding-field-v3.png";
import securityVisual from "../assets/solutions/security-field-v3.png";
import serverStorageVisual from "../assets/solutions/server-storage-field-v3.png";
import type { SiteContent, Vendor } from "./types";

const vendors: Record<string, Vendor> = {
  cisco: {
    name: "Cisco",
    tier: "Gold",
    logoScale: "compact",
    description:
      "Enterprise networking across campus switching, wireless, routing and cloud-managed infrastructure.",
    logo: ciscoLogo,
  },
  extreme: {
    name: "Extreme Networks",
    tier: "Gold",
    logoScale: "wide",
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
    logoScale: "wide",
    description:
      "Secure networking capabilities for branch connectivity, application access and managed infrastructure.",
    logo: sangforLogo,
  },
  knowBe4: {
    name: "KnowBe4",
    logo: knowBe4Logo,
    logoScale: "wide",
    description:
      "Security-awareness training and simulated phishing designed to help organizations reduce human risk.",
  },
  paloAlto: {
    name: "Palo Alto Networks",
    tier: "Platinum",
    logoScale: "wide",
    description:
      "Network-security and threat-prevention capabilities for users, applications and distributed environments.",
    logo: paloAltoLogo,
  },
  fortinet: {
    name: "Fortinet",
    tier: "Gold",
    logoScale: "wide",
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
    logoScale: "wide",
    description:
      "Enterprise threat prevention and security management across networks, cloud environments and users.",
    logo: checkpointLogo,
  },
  oneLogin: {
    name: "OneLogin",
    logo: oneLoginLogo,
    logoScale: "wide",
    description:
      "Cloud-based identity and access management with single sign-on, multi-factor authentication and lifecycle controls.",
  },
  dell: {
    name: "Dell Technologies",
    logoScale: "wide",
    description:
      "Enterprise compute and storage platforms for data-center, virtualization and workload requirements.",
    logo: dellLogo,
  },
  huawei: {
    name: "Huawei",
    logoScale: "compact",
    description:
      "Enterprise compute and data-storage infrastructure for private cloud and business workloads.",
    logo: huaweiLogo,
  },
  inspur: {
    name: "Inspur 浪潮",
    logo: inspurLogo,
    logoScale: "wide",
    description:
      "Server and storage platforms for enterprise computing, cloud infrastructure and data-intensive workloads.",
  },
  audioCodes: {
    name: "AudioCodes",
    logoScale: "compact",
    description:
      "Voice connectivity and communications infrastructure for enterprise calling and collaboration environments.",
    logo: audioCodesLogo,
  },
  vodia: {
    name: "Vodia",
    logo: vodiaLogo,
    description:
      "Multi-tenant IP PBX software for hosted and enterprise voice communications across common server platforms.",
  },
  cyberData: {
    name: "CyberData",
    logo: cyberDataLogo,
    description:
      "SIP paging, intercom and notification endpoints for IP-based communication and alerting systems.",
  },
  informaCast: {
    name: "InformaCast",
    logo: informaCastLogo,
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
    logoScale: "wide",
    description:
      "Video-security and access-control products for monitoring and safeguarding physical environments.",
    logo: hikvisionLogo,
  },
  keyking: {
    name: "Keyking",
    logo: keykingLogo,
    logoScale: "compact",
    description:
      "Access-control hardware and integrated physical-security management for connected facilities.",
  },
};

const nav = [
  { label: "SOLUTIONS", href: "#solutions" },
  { label: "SERVICES", href: "#services" },
  { label: "CASE STUDIES", href: "#case-studies" },
  { label: "ABOUT", href: "/about" },
  { label: "BLOG", href: "/blog" },
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
    headline: "We Make",
    accent: "IT",
    accentWords: ["IT", "Network", "Safeguarding", "Collaboration", "Security"],
    headlineSecondLine: "Happen",
    description:
      "Enterprise networks, security, data centers, collaboration and physical safeguarding — designed, built and supported for the world's most demanding companies since 2010.",
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
    eyebrow: "END-TO-END SERVICES",
    title: "From the first workshop to steady-state operations.",
    description:
      "JOTO brings planning, integration and ongoing service together so multi-vendor environments remain coherent throughout their lifecycle.",
    items: [
      {
        icon: "planning",
        title: "IT Planning & Consulting",
        description:
          "IT strategy, architecture design and cross-border data compliance consulting — before a single box is ordered.",
        image: advisoryPlanningVisual,
        imageAlt: "Technology team collaborating around laptops during a planning workshop",
      },
      {
        icon: "deployment",
        title: "Design & Deployment",
        description:
          "Turnkey delivery from structured cabling to cloud: engineering, installation, migration and cut-over, on site.",
        image: designIntegrationVisual,
        imageAlt: "Network cabling and active equipment inside enterprise server racks",
      },
      {
        icon: "support",
        title: "24×7 Support & Maintenance",
        description:
          "Round-the-clock multilingual hotline, SLA-backed maintenance, spare parts and daily on-site helpdesk.",
        image: managedSupportVisual,
        imageAlt: "IT support team working across multiple desktop systems in an office",
      },
      {
        icon: "security",
        title: "Managed Security Services",
        description:
          "MSS with SOC monitoring and Level-3 security operations — proven across a 15,000-server estate.",
        image: securityComplianceVisual,
        imageAlt: "Security operator monitoring multiple live systems in a control center",
      },
      {
        icon: "staffing",
        title: "Managed Outsourcing & Staffing",
        description:
          "Dedicated on-site IT and AI teams, personnel outsourcing and ITIL-based managed operations.",
        image: managedSupportVisual,
        imageAlt: "IT support team working across multiple desktop systems in an office",
      },
      {
        icon: "procurement",
        title: "IT Procurement",
        description:
          "One-stop sourcing of hardware, software and cloud services for organizations operating across global markets.",
        image: designIntegrationVisual,
        imageAlt: "Network cabling and active equipment inside enterprise server racks",
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
        logoTreatment: "original",
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
        logoTreatment: "original",
      },
    ],
  },
  about: {
    eyebrow: "WHY JOTO",
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
      "A trusted network of technology leaders supporting secure, connected and resilient enterprise environments.",
    items: [
      vendors.cisco,
      vendors.extreme,
      vendors.sangforNetwork,
      vendors.fortinet,
      vendors.paloAlto,
      vendors.knowBe4,
      vendors.verkada,
      vendors.hikvision,
      vendors.aruba,
      vendors.checkpoint,
      vendors.oneLogin,
      vendors.dell,
      vendors.huawei,
      vendors.inspur,
      vendors.audioCodes,
      vendors.vodia,
      vendors.cyberData,
      vendors.informaCast,
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
