import arubaLogo from "../assets/logos/aruba.svg";
import audioCodesLogo from "../assets/logos/audiocodes.png";
import checkpointLogo from "../assets/logos/checkpoint.svg";
import chewyLogo from "../assets/logos/chewy.svg";
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
import keykingLogo from "../assets/logos/keyking.png";
import knowBe4Logo from "../assets/logos/knowbe4.svg";
import oneLoginLogo from "../assets/logos/onelogin.svg";
import paloAltoLogo from "../assets/logos/palo-alto.svg";
import sangforLogo from "../assets/logos/sangfor.png";
import verkadaLogo from "../assets/logos/verkada.png";
import vodiaLogo from "../assets/logos/vodia.svg";
import ciscoConsulting from "../assets/partners/cisco-consulting.jpg";
import ciscoIntegration from "../assets/partners/cisco-integration.jpg";
import ciscoManagedServices from "../assets/partners/cisco-managed-services.jpg";
import ciscoHeroVisual from "../assets/partners/cisco-network-management.png";
import collaborationVisual from "../assets/solutions/collaboration.webp";
import networkVisual from "../assets/solutions/network.webp";
import safeguardingVisual from "../assets/solutions/safeguarding.webp";
import securityVisual from "../assets/solutions/security.webp";
import serverStorageVisual from "../assets/solutions/server-storage.webp";

export interface PartnerReason {
  title: string;
  description: string;
}

export interface PartnerService {
  title: string;
  description: string;
  capabilities: string[];
  icon: "compass" | "wrench" | "headphones";
  image: string;
  imageAlt: string;
  imagePosition: string;
}

export interface PartnerCaseStudy {
  client: string;
  tag: string;
  category: string;
  brief: string;
  scope: string[];
  logo?: string;
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
    telemetry?: boolean;
  };
  relationshipTitle: string;
  relationshipDescription: string;
  reasons: PartnerReason[];
  servicesTitle: string;
  servicesDescription: string;
  services: PartnerService[];
  casesEyebrow: string;
  casesTitle: string;
  casesDescription: string;
  cases: PartnerCaseStudy[];
  ctaTitle: string;
  ctaDescription: string;
  contactEmail: string;
}

type CapabilityGroups = [string[], string[], string[]];

interface CategoryDefinition {
  solutionName: string;
  visual: string;
  visualAlt: string;
  scenarios: PartnerCaseStudy[];
}

const categoryDefinitions: Record<string, CategoryDefinition> = {
  network: {
    solutionName: "Network",
    visual: networkVisual,
    visualAlt: "Enterprise switches connected through illuminated network links",
    scenarios: [
      {
        client: "Connected Campuses",
        tag: "Use case 01",
        category: "Campus & Workplace",
        brief: "Consistent wired and wireless access for users, devices and operational systems across busy sites.",
        scope: ["Coverage and capacity planning", "Resilient switching", "Central policy and visibility"],
      },
      {
        client: "Distributed Branches",
        tag: "Use case 02",
        category: "Branch Connectivity",
        brief: "Standardized connectivity for offices and branches that need secure access and simpler remote operations.",
        scope: ["WAN and internet edge", "Repeatable site templates", "Remote monitoring and support"],
      },
      {
        client: "Critical Infrastructure",
        tag: "Use case 03",
        category: "Data Center & Factory",
        brief: "High-availability network foundations for workloads and operational environments where downtime matters.",
        scope: ["Redundant architecture", "Segmentation and control", "Migration and cutover support"],
      },
    ],
  },
  security: {
    solutionName: "Security",
    visual: securityVisual,
    visualAlt: "Layered digital security surrounding connected enterprise infrastructure",
    scenarios: [
      {
        client: "Prevent & Protect",
        tag: "Use case 01",
        category: "Threat Prevention",
        brief: "Reduce exposure across users, applications and networks with controls aligned to real business risk.",
        scope: ["Policy and control design", "Threat prevention", "Secure configuration baselines"],
      },
      {
        client: "Secure Access",
        tag: "Use case 02",
        category: "Identity & Connectivity",
        brief: "Give employees and partners appropriate access while keeping authentication and policy manageable.",
        scope: ["Identity-aware access", "MFA and least privilege", "Remote and branch security"],
      },
      {
        client: "Operational Resilience",
        tag: "Use case 03",
        category: "Security Operations",
        brief: "Turn security telemetry into practical monitoring, response and continuous improvement workflows.",
        scope: ["Logging and visibility", "Incident support", "Lifecycle and policy reviews"],
      },
    ],
  },
  "server-storage": {
    solutionName: "Server & Storage",
    visual: serverStorageVisual,
    visualAlt: "Enterprise compute and storage racks inside a modern data center",
    scenarios: [
      {
        client: "Core Workloads",
        tag: "Use case 01",
        category: "Enterprise Compute",
        brief: "Right-sized compute platforms for business applications, databases and shared infrastructure services.",
        scope: ["Workload sizing", "Resilience planning", "Rack and power coordination"],
      },
      {
        client: "Private Cloud",
        tag: "Use case 02",
        category: "Virtualization",
        brief: "Integrated compute and storage foundations for virtualized and private-cloud environments.",
        scope: ["Cluster architecture", "Storage and network integration", "Migration planning"],
      },
      {
        client: "Data Lifecycle",
        tag: "Use case 03",
        category: "Storage & Protection",
        brief: "Capacity, performance and protection designed together so business data remains available and manageable.",
        scope: ["Performance and capacity", "Backup integration", "Monitoring and lifecycle support"],
      },
    ],
  },
  collaboration: {
    solutionName: "Collaboration",
    visual: collaborationVisual,
    visualAlt: "Enterprise voice, paging and communication devices connected across a workplace",
    scenarios: [
      {
        client: "Enterprise Voice",
        tag: "Use case 01",
        category: "Calling & Connectivity",
        brief: "Reliable calling services that connect users, carriers, meeting platforms and existing voice estates.",
        scope: ["SIP and carrier connectivity", "Numbering and call flows", "Migration and interoperability"],
      },
      {
        client: "Paging & Intercom",
        tag: "Use case 02",
        category: "On-site Communications",
        brief: "IP-based audio and intercom coverage for campuses, factories, warehouses and public areas.",
        scope: ["Zones and coverage", "SIP endpoint integration", "Testing and commissioning"],
      },
      {
        client: "Critical Notification",
        tag: "Use case 03",
        category: "Incident Communications",
        brief: "Coordinated alerts that reach the right people through multiple channels during time-sensitive events.",
        scope: ["Alert workflows", "System integrations", "Drills and operational readiness"],
      },
    ],
  },
  safeguarding: {
    solutionName: "Safeguarding",
    visual: safeguardingVisual,
    visualAlt: "Video security and access control devices protecting a modern facility",
    scenarios: [
      {
        client: "Video Security",
        tag: "Use case 01",
        category: "Visibility & Investigation",
        brief: "Purposeful camera coverage and retention that help teams monitor sites and investigate events.",
        scope: ["Coverage design", "Recording and retention", "Operator access and workflows"],
      },
      {
        client: "Controlled Access",
        tag: "Use case 02",
        category: "People & Entry",
        brief: "Door and credential controls aligned with how employees, visitors and contractors use each facility.",
        scope: ["Door hardware integration", "Credentials and permissions", "Events and audit trails"],
      },
      {
        client: "Connected Response",
        tag: "Use case 03",
        category: "Integrated Safeguarding",
        brief: "Bring video, access, intercom and alerts together to give teams context when they need to act.",
        scope: ["Cross-system integration", "Event escalation", "Testing and support"],
      },
    ],
  },
};

interface PartnerFactoryInput {
  pathname: string;
  categoryId: keyof typeof categoryDefinitions;
  partnerName: string;
  partnerLogo: string;
  introduction: string;
  capabilities: CapabilityGroups;
  relationshipDescription?: string;
}

function createPartnerDetail({
  pathname,
  categoryId,
  partnerName,
  partnerLogo,
  introduction,
  capabilities,
  relationshipDescription,
}: PartnerFactoryInput): PartnerDetail {
  const category = categoryDefinitions[categoryId];

  return {
    pathname,
    solutionName: category.solutionName,
    partnerName,
    partnerLogo,
    eyebrow: `${category.solutionName} / ${partnerName}`,
    title: `${partnerName} solutions,`,
    accent: "delivered by JOTO.",
    introduction,
    heroVisual: {
      src: category.visual,
      alt: `${partnerName} ${category.solutionName.toLowerCase()} solution environment`,
      caption: `${partnerName} technology · planned, deployed and supported by JOTO`,
    },
    relationshipTitle: `${partnerName} technology, shaped around your environment.`,
    relationshipDescription:
      relationshipDescription ??
      `JOTO helps enterprises turn ${partnerName} technology into an operational solution. We align architecture, deployment and support with the customer's sites, users, existing systems and regional delivery requirements.`,
    reasons: [
      {
        title: "Requirements before products",
        description: `We start with users, sites, risks and operating constraints before defining the right ${partnerName} architecture and scope.`,
      },
      {
        title: "Integrated delivery",
        description: `${partnerName} is connected with the wider IT environment through coordinated design, installation, migration, testing and documentation.`,
      },
      {
        title: "Support beyond go-live",
        description: "JOTO can provide remote and on-site support, configuration changes, lifecycle coordination and practical escalation after deployment.",
      },
    ],
    servicesTitle: `${partnerName} services from JOTO`,
    servicesDescription: `From early assessment through deployment and steady-state support, JOTO helps keep ${partnerName} solutions aligned with business and operational needs.`,
    services: [
      {
        title: "Assessment & Architecture",
        description: `Translate business, technical and site requirements into a practical ${partnerName} solution design.`,
        capabilities: capabilities[0],
        icon: "compass",
        image: ciscoConsulting,
        imageAlt: `Consultants planning a ${partnerName} solution with enterprise stakeholders`,
        imagePosition: "object-center",
      },
      {
        title: "Deployment & Integration",
        description: `Configure and integrate ${partnerName} technology with the customer's existing environment.`,
        capabilities: capabilities[1],
        icon: "wrench",
        image: ciscoIntegration,
        imageAlt: `Engineer installing and integrating ${partnerName} technology on site`,
        imagePosition: "object-center",
      },
      {
        title: "Operations & Lifecycle",
        description: `Keep the ${partnerName} environment visible, maintained and supported after go-live.`,
        capabilities: capabilities[2],
        icon: "headphones",
        image: ciscoManagedServices,
        imageAlt: `Operations team monitoring and supporting a ${partnerName} environment`,
        imagePosition: "object-center",
      },
    ],
    casesEyebrow: "Where It Fits",
    casesTitle: `${partnerName} for real operating environments.`,
    casesDescription: `Common settings where JOTO can help plan, integrate and support ${partnerName} as part of a wider ${category.solutionName.toLowerCase()} solution.`,
    cases: category.scenarios,
    ctaTitle: `Discuss your ${partnerName} project with JOTO.`,
    ctaDescription: `Tell us about your sites, users, current environment and support requirements. Our team can help assess the next practical step for your ${partnerName} solution.`,
    contactEmail: "sales@jototech.cn",
  };
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
    telemetry: true,
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
      description: "JOTO turns business, site and infrastructure requirements into a practical network architecture.",
      icon: "compass",
      image: ciscoConsulting,
      imageAlt: "IT consultants and client stakeholders discussing enterprise network planning around a conference table",
      imagePosition: "object-center",
      capabilities: [
        "Network assessment and requirements",
        "Topology and high-availability design",
        "Wired and wireless coverage planning",
        "Hardware, licensing and rollout planning",
      ],
    },
    {
      title: "Integration & Support",
      description: "JOTO deploys Cisco infrastructure and integrates it with the wider IT environment.",
      icon: "wrench",
      image: ciscoIntegration,
      imageAlt: "Engineer installing and configuring technical equipment during an on-site integration",
      imagePosition: "object-center",
      capabilities: [
        "Catalyst, wireless and Meraki deployment",
        "Nexus and UCS integration",
        "Migration, cutover and validation",
        "Configuration, tuning and documentation",
      ],
    },
    {
      title: "Managed Services",
      description: "JOTO keeps Cisco environments monitored, maintained and supported across agreed locations.",
      icon: "headphones",
      image: ciscoManagedServices,
      imageAlt: "IT operations engineer viewed from behind monitoring systems inside a server room",
      imagePosition: "object-center",
      capabilities: [
        "Monitoring, incident response and backups",
        "Software and firmware maintenance",
        "Performance optimization",
        "Remote and on-site engineering support",
      ],
    },
  ],
  casesEyebrow: "Selected Deployments",
  casesTitle: "Cisco infrastructure, proven in the field.",
  casesDescription:
    "Selected environments where JOTO has designed, deployed or supported Cisco technology as part of a wider business-critical solution.",
  cases: [
    {
      client: "Harrow International School",
      tag: "5 campuses, 2019–2022",
      category: "Campus Network & Security",
      brief: "Across five new international schools, JOTO delivered the full IT infrastructure — including Cisco's largest DNA deployment in China.",
      scope: ["Cisco DNA architecture — 3,500+ Wi-Fi 5/6 APs", "800+ Cisco Catalyst 9200/9300 switches", "Daily on-site helpdesk"],
      logo: harrowLogo,
    },
    {
      client: "Danaher",
      tag: "Fortune 500",
      category: "End-to-end IT Infrastructure",
      brief: "JOTO is responsible for the construction and maintenance of IT and security infrastructure for Danaher's offices across China.",
      scope: ["Cisco Nexus data-center network", "Cisco UCS servers", "Ongoing nationwide maintenance"],
      logo: danaherLogo,
    },
    {
      client: "Chewy",
      tag: "Fortune 500",
      category: "IT Procurement & Managed Services",
      brief: "As Chewy expands into China, JOTO handles its IT procurement, installation and ongoing maintenance.",
      scope: ["Cisco Meraki networking", "Site deployment and installation", "On-site technical support"],
      logo: chewyLogo,
    },
  ],
  ctaTitle: "Discuss your Cisco project with JOTO.",
  ctaDescription: "Tell us about your sites, users, current infrastructure and support requirements. Our team can help assess the next practical step for your Cisco environment.",
  contactEmail: "sales@jototech.cn",
};

const additionalPartnerDetails: PartnerDetail[] = [
  createPartnerDetail({
    pathname: "/solutions/network/extreme-networks",
    categoryId: "network",
    partnerName: "Extreme Networks",
    partnerLogo: extremeLogo,
    introduction: "JOTO plans, deploys and supports Extreme Networks wired, wireless, fabric and cloud-managed networking for campuses, branches and distributed enterprises.",
    relationshipDescription: "JOTO's legacy website identifies the company as an Extreme Networks Diamond Partner supporting promotion, demonstrations, proof of concept, deployment and maintenance across major locations in China and Hong Kong.",
    capabilities: [
      ["Extreme Platform ONE and ExtremeCloud IQ", "Wired and wireless access architecture", "Network fabric and segmentation"],
      ["Switching and Wi-Fi deployment", "Fabric configuration and migration", "SD-WAN and branch integration"],
      ["Cloud visibility and monitoring", "Software lifecycle coordination", "Incident and configuration support"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/network/aruba",
    categoryId: "network",
    partnerName: "Aruba",
    partnerLogo: arubaLogo,
    introduction: "JOTO helps enterprises design and operate HPE Aruba Networking environments across wired access, Wi-Fi, branch connectivity and centralized management.",
    capabilities: [
      ["HPE Aruba Networking Central", "Aruba CX switching architecture", "Wi-Fi coverage and capacity planning"],
      ["Campus switching and access points", "Branch and gateway integration", "Migration, validation and documentation"],
      ["Centralized health and configuration", "Firmware and lifecycle planning", "Remote and on-site support"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/network/sangfor",
    categoryId: "network",
    partnerName: "Sangfor 深信服",
    partnerLogo: sangforLogo,
    introduction: "JOTO delivers Sangfor secure-networking capabilities for branches, application access and enterprise environments that need connectivity and security planned together.",
    capabilities: [
      ["Secure branch and WAN architecture", "Application delivery requirements", "Internet access and policy planning"],
      ["SD-WAN and gateway deployment", "Application delivery integration", "Site migration and acceptance testing"],
      ["Link and application visibility", "Policy and configuration changes", "Software lifecycle and incident support"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/security/knowbe4",
    categoryId: "security",
    partnerName: "KnowBe4",
    partnerLogo: knowBe4Logo,
    introduction: "JOTO helps organizations deploy and operate KnowBe4 security-awareness training and simulated phishing programs that address human risk as an ongoing business process.",
    relationshipDescription: "JOTO's legacy website identifies the company as a KnowBe4 Certified Partner in China and Hong Kong, with services spanning design, sales, proof of concept, deployment, maintenance and support.",
    capabilities: [
      ["Human-risk and culture baseline", "Awareness program design", "Phishing simulation planning"],
      ["Platform and user provisioning", "Training and campaign configuration", "Mail-flow and landing-page validation"],
      ["Campaign scheduling and reporting", "Risk-score review", "Administrator and user support"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/security/palo-alto-networks",
    categoryId: "security",
    partnerName: "Palo Alto Networks",
    partnerLogo: paloAltoLogo,
    introduction: "JOTO designs and integrates Palo Alto Networks security across next-generation firewalls, secure access, cloud environments and security operations.",
    capabilities: [
      ["Next-generation firewall architecture", "Prisma secure-access planning", "Cloud and endpoint security alignment"],
      ["Policy migration and deployment", "Threat-prevention profile tuning", "Logging and identity integration"],
      ["Health, alert and policy review", "Content and software lifecycle", "Incident and escalation support"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/security/fortinet",
    categoryId: "security",
    partnerName: "Fortinet",
    partnerLogo: fortinetLogo,
    introduction: "JOTO brings Fortinet networking and security together for firewalls, secure branches, access and centrally managed enterprise environments.",
    capabilities: [
      ["Fortinet Security Fabric architecture", "FortiGate sizing and policy design", "Secure SD-WAN and branch planning"],
      ["Firewall and branch deployment", "Segmentation and access integration", "Migration, testing and documentation"],
      ["FortiManager and FortiAnalyzer workflows", "Firmware and policy lifecycle", "Monitoring and incident support"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/security/sangfor",
    categoryId: "security",
    partnerName: "Sangfor 深信服",
    partnerLogo: sangforLogo,
    introduction: "JOTO helps enterprises apply Sangfor security controls to internet access, applications, endpoints and infrastructure through coordinated architecture and support.",
    capabilities: [
      ["Network and application risk review", "NGAF architecture and sizing", "Secure access policy planning"],
      ["Gateway and policy deployment", "Endpoint and infrastructure integration", "Migration and validation"],
      ["Security visibility and reporting", "Policy and signature lifecycle", "Operational and incident support"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/security/check-point",
    categoryId: "security",
    partnerName: "Check Point",
    partnerLogo: checkpointLogo,
    introduction: "JOTO plans and supports Check Point protection across enterprise networks, cloud workloads, users and endpoints with policy managed as one operating system.",
    capabilities: [
      ["Quantum gateway architecture", "CloudGuard security planning", "Harmony user and endpoint alignment"],
      ["Gateway and management deployment", "Rulebase migration and cleanup", "Identity, logging and threat integration"],
      ["Policy and health reviews", "Software and signature lifecycle", "Incident and escalation support"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/security/onelogin",
    categoryId: "security",
    partnerName: "OneLogin",
    partnerLogo: oneLoginLogo,
    introduction: "JOTO helps enterprises deploy OneLogin single sign-on, multi-factor authentication and identity lifecycle controls for cloud and on-premises applications.",
    relationshipDescription: "JOTO's legacy website identifies the company as a OneLogin Certified Partner in China and Hong Kong, supporting demonstrations, proof of concept, deployment, maintenance and regional delivery.",
    capabilities: [
      ["Application and identity inventory", "SSO and MFA architecture", "Joiner, mover and leaver workflows"],
      ["Directory and application connectors", "Authentication policy configuration", "Pilot, rollout and user migration"],
      ["Access and adoption reporting", "Connector and policy maintenance", "Administrator and user support"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/server-storage/dell-technologies",
    categoryId: "server-storage",
    partnerName: "Dell Technologies",
    partnerLogo: dellLogo,
    introduction: "JOTO designs and integrates Dell Technologies compute and data platforms for core workloads, virtualization, edge environments and resilient storage.",
    capabilities: [
      ["PowerEdge compute sizing", "Dell storage performance and capacity", "Resilience and lifecycle architecture"],
      ["Rack, server and storage deployment", "Virtualization and network integration", "Data migration and acceptance testing"],
      ["iDRAC and infrastructure monitoring", "Firmware and warranty coordination", "Capacity and incident support"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/server-storage/huawei",
    categoryId: "server-storage",
    partnerName: "Huawei",
    partnerLogo: huaweiLogo,
    introduction: "JOTO delivers Huawei enterprise compute and OceanStor data-storage foundations for private cloud, core applications and data-intensive workloads.",
    capabilities: [
      ["OceanStor architecture and sizing", "Compute and workload requirements", "Availability and data-protection planning"],
      ["Server and storage installation", "SAN, network and virtualization integration", "Migration and performance validation"],
      ["Capacity and health monitoring", "Firmware and lifecycle coordination", "Remote and on-site support"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/server-storage/inspur",
    categoryId: "server-storage",
    partnerName: "Inspur 浪潮",
    partnerLogo: inspurLogo,
    introduction: "JOTO helps organizations deploy Inspur server and storage platforms for enterprise computing, cloud infrastructure and demanding data workloads.",
    capabilities: [
      ["Rack and acceleration server sizing", "Enterprise and scale-out storage", "Workload and resilience planning"],
      ["Compute and storage deployment", "Cluster and virtualization integration", "Benchmarking and acceptance testing"],
      ["Platform health and capacity", "Firmware and component lifecycle", "Incident and replacement coordination"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/collaboration/audiocodes",
    categoryId: "collaboration",
    partnerName: "AudioCodes",
    partnerLogo: audioCodesLogo,
    introduction: "JOTO integrates AudioCodes voice infrastructure across session border controllers, gateways, Microsoft Teams connectivity and enterprise calling environments.",
    capabilities: [
      ["Voice and SIP readiness assessment", "SBC and gateway architecture", "Teams and carrier connectivity design"],
      ["SBC, gateway and device deployment", "Dial-plan and SIP integration", "Migration and call-flow validation"],
      ["Voice quality and session monitoring", "Configuration and software lifecycle", "Carrier and incident troubleshooting"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/collaboration/vodia",
    categoryId: "collaboration",
    partnerName: "Vodia",
    partnerLogo: vodiaLogo,
    introduction: "JOTO helps service providers and enterprises deploy Vodia IP PBX environments for multi-tenant voice, flexible endpoints and SIP-based communications.",
    capabilities: [
      ["Tenant and numbering architecture", "SIP trunk and endpoint planning", "Availability and security design"],
      ["PBX and tenant configuration", "Carrier, device and application integration", "User migration and call testing"],
      ["Call quality and service monitoring", "Tenant changes and upgrades", "Administrator and user support"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/collaboration/cyberdata",
    categoryId: "collaboration",
    partnerName: "CyberData",
    partnerLogo: cyberDataLogo,
    introduction: "JOTO designs and installs CyberData SIP paging, intercom and notification endpoints for connected campuses, factories and facilities.",
    capabilities: [
      ["Paging zone and coverage design", "SIP and multicast planning", "Endpoint and PoE requirements"],
      ["Speakers, intercoms and strobes", "PBX and notification integration", "Commissioning and intelligibility testing"],
      ["Endpoint health and configuration", "Moves, adds and changes", "Fault isolation and replacement support"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/collaboration/informacast",
    categoryId: "collaboration",
    partnerName: "InformaCast",
    partnerLogo: informaCastLogo,
    introduction: "JOTO helps organizations implement InformaCast mass notification so alerts can reach people through audio, text, desktop and mobile channels.",
    capabilities: [
      ["Incident and audience mapping", "Alert workflow and channel design", "Integration and resilience planning"],
      ["Platform and recipient configuration", "Paging, mobile and desktop integration", "Scenario testing and operational handover"],
      ["Template and recipient maintenance", "Delivery reporting and drill support", "Platform and integration troubleshooting"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/safeguarding/verkada",
    categoryId: "safeguarding",
    partnerName: "Verkada",
    partnerLogo: verkadaLogo,
    introduction: "JOTO brings Verkada's hybrid-cloud physical security platform to video, access control, sensors, intercom and site operations through one managed environment.",
    capabilities: [
      ["Command platform and site architecture", "Camera and retention planning", "Access, sensor and intercom requirements"],
      ["Camera and controller deployment", "Identity and building-system integration", "Coverage, alert and workflow validation"],
      ["Fleet health and user administration", "Alert and retention optimization", "Remote and on-site support"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/safeguarding/hikvision",
    categoryId: "safeguarding",
    partnerName: "Hikvision",
    partnerLogo: hikvisionLogo,
    introduction: "JOTO designs and integrates Hikvision video security, recording, access control and intercom systems for workplaces, campuses and operational sites.",
    capabilities: [
      ["Camera coverage and analytics needs", "Recording, bandwidth and retention", "Access and intercom architecture"],
      ["Cameras, recorders and controllers", "Network and management integration", "Commissioning and operator handover"],
      ["Device and storage health", "User, policy and firmware lifecycle", "Fault isolation and replacement support"],
    ],
  }),
  createPartnerDetail({
    pathname: "/solutions/safeguarding/keyking",
    categoryId: "safeguarding",
    partnerName: "Keyking",
    partnerLogo: keykingLogo,
    introduction: "JOTO deploys Keyking access-control hardware and integrated security management for connected doors, users and facilities.",
    capabilities: [
      ["Door, reader and credential survey", "Controller and permissions architecture", "Building and security integration planning"],
      ["Controllers, readers and credentials", "Door hardware and platform integration", "Commissioning and access testing"],
      ["Events, users and permissions support", "Controller and credential lifecycle", "On-site fault and replacement coordination"],
    ],
  }),
];

export const partnerDetails: PartnerDetail[] = [ciscoDetail, ...additionalPartnerDetails];

export function getPartnerDetail(pathname: string): PartnerDetail | undefined {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return partnerDetails.find((detail) => detail.pathname === normalizedPath);
}
