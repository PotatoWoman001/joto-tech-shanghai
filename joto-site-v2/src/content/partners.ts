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
  logoTreatment?: "monochrome" | "brand";
}

export type PartnerBadge = "Gold Partner" | "Platinum Partner" | "Partner";

export interface PartnerDetail {
  pathname: string;
  solutionName: string;
  partnerName: string;
  partnerLogo: string;
  partnerBadge: PartnerBadge;
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
type ReasonGroup = [PartnerReason, PartnerReason, PartnerReason];
type ServiceCopyGroup = [
  Pick<PartnerService, "title" | "description">,
  Pick<PartnerService, "title" | "description">,
  Pick<PartnerService, "title" | "description">,
];

interface CategoryDefinition {
  solutionName: string;
  visual: string;
  visualAlt: string;
}

const categoryDefinitions: Record<string, CategoryDefinition> = {
  network: {
    solutionName: "Network",
    visual: networkVisual,
    visualAlt: "Enterprise switches connected through illuminated network links",
  },
  security: {
    solutionName: "Security",
    visual: securityVisual,
    visualAlt: "Layered digital security surrounding connected enterprise infrastructure",
  },
  "server-storage": {
    solutionName: "Server & Storage",
    visual: serverStorageVisual,
    visualAlt: "Enterprise compute and storage racks inside a modern data center",
  },
  collaboration: {
    solutionName: "Collaboration",
    visual: collaborationVisual,
    visualAlt: "Enterprise voice, paging and communication devices connected across a workplace",
  },
  safeguarding: {
    solutionName: "Safeguarding",
    visual: safeguardingVisual,
    visualAlt: "Video security and access control devices protecting a modern facility",
  },
};

interface PartnerFactoryInput {
  pathname: string;
  categoryId: keyof typeof categoryDefinitions;
  partnerName: string;
  partnerLogo: string;
  partnerBadge?: PartnerBadge;
  title: string;
  accent: string;
  introduction: string;
  capabilities: CapabilityGroups;
  relationshipTitle: string;
  relationshipDescription: string;
  reasons: ReasonGroup;
  servicesTitle: string;
  servicesDescription: string;
  serviceCopy: ServiceCopyGroup;
  ctaTitle: string;
  ctaDescription: string;
}

function createPartnerDetail({
  pathname,
  categoryId,
  partnerName,
  partnerLogo,
  partnerBadge = "Partner",
  title,
  accent,
  introduction,
  capabilities,
  relationshipTitle,
  relationshipDescription,
  reasons,
  servicesTitle,
  servicesDescription,
  serviceCopy,
  ctaTitle,
  ctaDescription,
}: PartnerFactoryInput): PartnerDetail {
  const category = categoryDefinitions[categoryId];

  return {
    pathname,
    solutionName: category.solutionName,
    partnerName,
    partnerLogo,
    partnerBadge,
    eyebrow: `${category.solutionName} / ${partnerName}`,
    title,
    accent,
    introduction,
    heroVisual: {
      src: category.visual,
      alt: `${partnerName} ${category.solutionName.toLowerCase()} solution environment`,
      caption: `${partnerName} technology · planned, deployed and supported by JOTO`,
    },
    relationshipTitle,
    relationshipDescription,
    reasons,
    servicesTitle,
    servicesDescription,
    services: [
      {
        ...serviceCopy[0],
        capabilities: capabilities[0],
        icon: "compass",
        image: ciscoConsulting,
        imageAlt: `Consultants planning a ${partnerName} solution with enterprise stakeholders`,
        imagePosition: "object-center",
      },
      {
        ...serviceCopy[1],
        capabilities: capabilities[1],
        icon: "wrench",
        image: ciscoIntegration,
        imageAlt: `Engineer installing and integrating ${partnerName} technology on site`,
        imagePosition: "object-center",
      },
      {
        ...serviceCopy[2],
        capabilities: capabilities[2],
        icon: "headphones",
        image: ciscoManagedServices,
        imageAlt: `Operations team monitoring and supporting a ${partnerName} environment`,
        imagePosition: "object-center",
      },
    ],
    casesEyebrow: "Representative Projects",
    casesTitle: "Representative projects.",
    casesDescription: "",
    cases: [],
    ctaTitle,
    ctaDescription,
    contactEmail: "sales@jototech.cn",
  };
}

const ciscoDetail: PartnerDetail = {
  pathname: "/solutions/network/cisco",
  solutionName: "Network",
  partnerName: "Cisco",
  partnerLogo: ciscoLogo,
  partnerBadge: "Gold Partner",
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
      logoTreatment: "brand",
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
    partnerBadge: "Gold Partner",
    title: "Extreme Networks cloud-driven campus networking,",
    accent: "make complex networks agile and manageable.",
    introduction: "For large campuses, branches and distributed operations, JOTO combines Extreme Networks cloud management, network fabric, switching and wireless capabilities to simplify operations and improve visibility.",
    relationshipTitle: "Manage a growing network through one experience.",
    relationshipDescription: "JOTO's legacy website records Extreme Networks demonstrations, proof of concept, deployment and maintenance services. We apply that experience to the customer's current network, migration path and operating model; any current partner tier is confirmed separately before publication.",
    reasons: [
      { title: "Unified cloud visibility", description: "Bring device health, user experience and network events from multiple sites into one operational view." },
      { title: "Simpler expansion with fabric", description: "Use fabric and automation to reduce the effort involved in segmentation, change and network growth." },
      { title: "Continuity across the lifecycle", description: "Connect solution validation, migration, configuration improvement and ongoing maintenance as one service path." },
    ],
    servicesTitle: "JOTO Extreme Networks services",
    servicesDescription: "From experience assessment to fabric, switching, wireless deployment and cloud operations, JOTO helps Extreme Networks environments keep pace with business change.",
    serviceCopy: [
      { title: "Network Experience & Architecture", description: "Assess the existing network, user experience, coverage, capacity and management complexity." },
      { title: "Fabric, Switching & Wireless", description: "Configure and migrate campus access, fabric, Wi-Fi and branch connectivity." },
      { title: "Cloud Operations & Optimization", description: "Establish monitoring, alerting, configuration, upgrade and incident-response practices." },
    ],
    capabilities: [
      ["Extreme Platform ONE and ExtremeCloud IQ", "Wired and wireless access architecture", "Network fabric and segmentation"],
      ["Switching and Wi-Fi deployment", "Fabric configuration and migration", "SD-WAN and branch integration"],
      ["Cloud visibility and monitoring", "Software lifecycle coordination", "Incident and configuration support"],
    ],
    ctaTitle: "Make network operations simpler.",
    ctaDescription: "Talk to JOTO about network complexity, cloud management, fabric or a wireless upgrade.",
  }),
  createPartnerDetail({
    pathname: "/solutions/network/aruba",
    categoryId: "network",
    partnerName: "Aruba",
    partnerLogo: arubaLogo,
    title: "Aruba edge-to-cloud networking,",
    accent: "make every connection secure, seamless and visible.",
    introduction: "Using Aruba Central, CX switching and enterprise wireless, JOTO builds unified access, policy management and user-experience foundations for campuses, branches and hybrid workplaces.",
    relationshipTitle: "Unify network and policy around the user connection.",
    relationshipDescription: "The solution starts with people, endpoints, IoT devices and application experience, then plans wireless, wired, branch connectivity and identity policy through one operational lens.",
    reasons: [
      { title: "Experience-led design", description: "Measure network quality through coverage, capacity, roaming and application behavior." },
      { title: "Unified wired and wireless", description: "Plan switching, wireless, gateways and branch connectivity together to reduce fragmented management." },
      { title: "Policy from edge to cloud", description: "Carry identity, device and access policy across sites and connection types." },
    ],
    servicesTitle: "JOTO Aruba services",
    servicesDescription: "JOTO supports access-experience planning, Aruba Central architecture, CX switching, wireless delivery and lifecycle operations.",
    serviceCopy: [
      { title: "Access Experience & Central", description: "Assess coverage, capacity, endpoint types, site structure and cloud-management requirements." },
      { title: "CX Switching & Wi-Fi", description: "Deploy campus switching, wireless, gateways and branch access." },
      { title: "Policy, Experience & Lifecycle", description: "Optimize access policy, device health, firmware planning and remote-support workflows." },
    ],
    capabilities: [
      ["HPE Aruba Networking Central", "Aruba CX switching architecture", "Wi-Fi coverage and capacity planning"],
      ["Campus switching and access points", "Branch and gateway integration", "Migration, validation and documentation"],
      ["Centralized health and configuration", "Firmware and lifecycle planning", "Remote and on-site support"],
    ],
    ctaTitle: "Rethink every network connection.",
    ctaDescription: "Talk to JOTO about Aruba campus, wireless, branch or Central management planning.",
  }),
  createPartnerDetail({
    pathname: "/solutions/network/sangfor",
    categoryId: "network",
    partnerName: "Sangfor 深信服",
    partnerLogo: sangforLogo,
    partnerBadge: "Gold Partner",
    title: "Sangfor secure networking,",
    accent: "connect every branch with consistent security and experience.",
    introduction: "For regional offices, branch connectivity and critical application access, JOTO plans Sangfor WAN, application-delivery and secure-gateway capabilities together to reduce multi-site complexity.",
    relationshipTitle: "Do not split networking and security into separate systems.",
    relationshipDescription: "Starting with link quality, application priority, access policy and remote operations, JOTO designs a consistent network for local China and cross-regional sites.",
    reasons: [
      { title: "Network and security together", description: "Consider link steering, application experience and access control within the same architecture." },
      { title: "Repeatable branch rollout", description: "Use standard site configurations to reduce launch time and configuration drift." },
      { title: "Grounded in local operations", description: "Shape deployment around local connectivity, site conditions and practical support requirements." },
    ],
    servicesTitle: "JOTO Sangfor networking services",
    servicesDescription: "From multi-site design to SD-WAN, application delivery and ongoing operations, JOTO helps branch networks maintain link quality and policy consistency.",
    serviceCopy: [
      { title: "Branch & WAN Planning", description: "Map sites, links, applications, bandwidth and high-availability requirements." },
      { title: "SD-WAN & Application Delivery", description: "Implement branch connectivity, link steering, application optimization and gateway policy." },
      { title: "Link & Application Operations", description: "Monitor quality, policy, software lifecycle and site exceptions over time." },
    ],
    capabilities: [
      ["Secure branch and WAN architecture", "Application delivery requirements", "Internet access and policy planning"],
      ["SD-WAN and gateway deployment", "Application delivery integration", "Site migration and acceptance testing"],
      ["Link and application visibility", "Policy and configuration changes", "Software lifecycle and incident support"],
    ],
    ctaTitle: "Make every branch easier to connect and manage.",
    ctaDescription: "Talk to JOTO about multi-site networking, SD-WAN or application-access optimization.",
  }),
  createPartnerDetail({
    pathname: "/solutions/security/knowbe4",
    categoryId: "security",
    partnerName: "KnowBe4",
    partnerLogo: knowBe4Logo,
    title: "KnowBe4 human risk management,",
    accent: "turn awareness into measurable behavior change.",
    introduction: "JOTO helps organizations build continuous security-awareness training and simulated-phishing programs, turning employee risk from a one-off course into a trackable, improvable operating process.",
    relationshipTitle: "Manage human risk alongside technical controls.",
    relationshipDescription: "JOTO's legacy website records KnowBe4 solution design, demonstrations, proof of concept, deployment and support in China and Hong Kong. Current programs focus on risk baselines, training cadence and measurable improvement.",
    reasons: [
      { title: "Establish a human-risk baseline", description: "Identify high-risk roles, common behaviors and the current culture before setting training priorities." },
      { title: "Connect training and simulation", description: "Link learning, simulated phishing and immediate feedback into one continuous process." },
      { title: "Improve through evidence", description: "Use participation, test results and risk trends to shape each next stage of the program." },
    ],
    servicesTitle: "JOTO KnowBe4 services",
    servicesDescription: "JOTO supports human-risk assessment, platform rollout, training campaigns, simulated phishing and ongoing program operations.",
    serviceCopy: [
      { title: "Human-Risk Baseline & Plan", description: "Assess workforce structure, risk roles, learning objectives and compliance needs." },
      { title: "Training & Phishing Operations", description: "Configure users, content, campaigns, mail flow and landing-page validation." },
      { title: "Risk Reporting & Improvement", description: "Track participation, risk scores, priority groups and improvement trends." },
    ],
    capabilities: [
      ["Human-risk and culture baseline", "Awareness program design", "Phishing simulation planning"],
      ["Platform and user provisioning", "Training and campaign configuration", "Mail-flow and landing-page validation"],
      ["Campaign scheduling and reporting", "Risk-score review", "Administrator and user support"],
    ],
    ctaTitle: "Move from one-time training to continuous human-risk management.",
    ctaDescription: "Talk to JOTO about your awareness baseline, simulated phishing and annual operating plan.",
  }),
  createPartnerDetail({
    pathname: "/solutions/security/palo-alto-networks",
    categoryId: "security",
    partnerName: "Palo Alto Networks",
    partnerLogo: paloAltoLogo,
    partnerBadge: "Platinum Partner",
    title: "Palo Alto Networks integrated protection,",
    accent: "carry consistent policy across every business boundary.",
    introduction: "Across next-generation firewalls, secure access, cloud environments and security operations, JOTO helps organizations unify policy, telemetry and response while reducing gaps between networks, clouds and users.",
    relationshipTitle: "Connect separate controls into one security operating model.",
    relationshipDescription: "From the network edge and remote access to cloud workloads and threat operations, JOTO plans a phased path around the existing architecture and the customer's highest-priority risks.",
    reasons: [
      { title: "Unified policy and visibility", description: "Reduce fragmentation across security boundaries that otherwise configure, record and respond in isolation." },
      { title: "Coverage across network, cloud and users", description: "Extend access control and threat prevention from campuses to cloud and remote environments." },
      { title: "An operational closed loop", description: "Bring migration, policy tuning, logging, alerting and escalation into long-term management." },
    ],
    servicesTitle: "JOTO Palo Alto Networks services",
    servicesDescription: "JOTO supports phased delivery across next-generation firewalls, secure access, cloud integration, logging, policy and continuing operations.",
    serviceCopy: [
      { title: "NGFW & Policy Architecture", description: "Plan architecture, capacity, zones, rules and threat-prevention controls." },
      { title: "Secure Access & Cloud Integration", description: "Design remote access, branch, cloud-workload and identity integrations." },
      { title: "Detection & Operations", description: "Establish alerting, policy review, content updates and escalation workflows." },
    ],
    capabilities: [
      ["Next-generation firewall architecture", "Prisma secure-access planning", "Cloud and endpoint security alignment"],
      ["Policy migration and deployment", "Threat-prevention profile tuning", "Logging and identity integration"],
      ["Health, alert and policy review", "Content and software lifecycle", "Incident and escalation support"],
    ],
    ctaTitle: "Find the next connection point in your security architecture.",
    ctaDescription: "Talk to JOTO about firewalls, Prisma secure access, cloud security or operational integration.",
  }),
  createPartnerDetail({
    pathname: "/solutions/security/fortinet",
    categoryId: "security",
    partnerName: "Fortinet",
    partnerLogo: fortinetLogo,
    partnerBadge: "Gold Partner",
    title: "Fortinet security-driven networking,",
    accent: "unify network and security operations in one architecture.",
    introduction: "JOTO combines FortiGate, the Fortinet Security Fabric, Secure SD-WAN and centralized management to build coordinated protection and consistent operations across campuses, branches and data centers.",
    relationshipTitle: "Let security capabilities scale with the network.",
    relationshipDescription: "Connectivity, segmentation, threat prevention and centralized operations are planned together, reducing the complexity created when branches, campuses and edge devices are managed separately.",
    reasons: [
      { title: "Network and security alignment", description: "Plan connectivity, segmentation, policy and threat prevention in the same architecture." },
      { title: "Branch rollout at scale", description: "Use consistent templates to bring many sites online quickly and predictably." },
      { title: "Centralized operations", description: "Manage telemetry, policy, software versions and device lifecycles through shared workflows." },
    ],
    servicesTitle: "JOTO Fortinet services",
    servicesDescription: "JOTO provides design, implementation and lifecycle support for FortiGate, the Security Fabric, Secure SD-WAN and centralized operations.",
    serviceCopy: [
      { title: "FortiGate & Security Fabric", description: "Plan security zones, policy, performance, resilience and the wider fabric architecture." },
      { title: "Secure SD-WAN & Branches", description: "Implement links, branch templates, access and segmentation." },
      { title: "Central Management & Operations", description: "Establish FortiManager, FortiAnalyzer and software-lifecycle operating practices." },
    ],
    capabilities: [
      ["Fortinet Security Fabric architecture", "FortiGate sizing and policy design", "Secure SD-WAN and branch planning"],
      ["Firewall and branch deployment", "Segmentation and access integration", "Migration, testing and documentation"],
      ["FortiManager and FortiAnalyzer workflows", "Firmware and policy lifecycle", "Monitoring and incident support"],
    ],
    ctaTitle: "Cover more sites with fewer management boundaries.",
    ctaDescription: "Talk to JOTO about Fortinet firewalls, branches, the Security Fabric or centralized operations.",
  }),
  createPartnerDetail({
    pathname: "/solutions/security/sangfor",
    categoryId: "security",
    partnerName: "Sangfor 深信服",
    partnerLogo: sangforLogo,
    partnerBadge: "Gold Partner",
    title: "Sangfor enterprise security,",
    accent: "build a closed loop from prevention to operations.",
    introduction: "Across internet edges, application access, endpoints and security operations, JOTO integrates Sangfor capabilities into a prevention, detection and response model suited to local business environments.",
    relationshipTitle: "Shape security around real business and local operations.",
    relationshipDescription: "Starting with risk, assets, existing controls and team capacity, JOTO phases gateway, endpoint and operational capabilities so products do not go live in isolation.",
    reasons: [
      { title: "Fit the local environment", description: "Plan around local connectivity, business systems and relevant operational requirements." },
      { title: "Link edge, endpoint and operations", description: "Allow controls to share context and support a coordinated response process." },
      { title: "Join delivery with support", description: "Connect architecture, site deployment, platform tuning and ongoing assistance." },
    ],
    servicesTitle: "JOTO Sangfor security services",
    servicesDescription: "From risk review and NGAF deployment to endpoint integration, policy, alerts and incident operations, JOTO helps establish a continuous security loop.",
    serviceCopy: [
      { title: "Risk Review & NGAF Planning", description: "Define assets, zones, access relationships, performance and threat-prevention needs." },
      { title: "Edge, Endpoint & Platform", description: "Deploy and connect gateways, policy, endpoints and logging systems." },
      { title: "Policy & Threat Operations", description: "Maintain policy, signatures, software, alerts and incident escalation." },
    ],
    capabilities: [
      ["Network and application risk review", "NGAF architecture and sizing", "Secure access policy planning"],
      ["Gateway and policy deployment", "Endpoint and infrastructure integration", "Migration and validation"],
      ["Security visibility and reporting", "Policy and signature lifecycle", "Operational and incident support"],
    ],
    ctaTitle: "Strengthen the security loop from the risks you have today.",
    ctaDescription: "Talk to JOTO about Sangfor edge security, endpoints or a security-operations roadmap.",
  }),
  createPartnerDetail({
    pathname: "/solutions/security/check-point",
    categoryId: "security",
    partnerName: "Check Point",
    partnerLogo: checkpointLogo,
    title: "Check Point unified threat prevention,",
    accent: "keep policy consistent and protection continuous.",
    introduction: "Built around Check Point Quantum, CloudGuard and Harmony, JOTO helps organizations establish consistent policy and continuing threat prevention across networks, clouds, users and endpoints.",
    relationshipTitle: "Use one policy language across different security boundaries.",
    relationshipDescription: "JOTO brings rules, identity, telemetry and threat prevention into one design, with equal attention to rule cleanup, migration validation and policy governance after go-live.",
    reasons: [
      { title: "Consistent policy management", description: "Reduce policy differences between environments through shared rules and management practices." },
      { title: "Network, cloud and user coverage", description: "Extend threat prevention across data centers, cloud environments and endpoint users." },
      { title: "Migration with governance", description: "Clean and validate rules before cutover, then maintain policy quality over time." },
    ],
    servicesTitle: "JOTO Check Point services",
    servicesDescription: "JOTO supports Quantum gateways, CloudGuard and Harmony integration with architecture, migration and continuing rule governance.",
    serviceCopy: [
      { title: "Quantum Gateway Architecture", description: "Plan gateways, management domains, rules, resilience and performance." },
      { title: "CloudGuard & Harmony", description: "Extend protection to cloud workloads, SaaS, users and endpoints." },
      { title: "Rule Governance & Threat Operations", description: "Maintain rules, telemetry, software versions and incident workflows." },
    ],
    capabilities: [
      ["Quantum gateway architecture", "CloudGuard security planning", "Harmony user and endpoint alignment"],
      ["Gateway and management deployment", "Rulebase migration and cleanup", "Identity, logging and threat integration"],
      ["Policy and health reviews", "Software and signature lifecycle", "Incident and escalation support"],
    ],
    ctaTitle: "Make every security rule clearer and more controllable.",
    ctaDescription: "Talk to JOTO about Check Point architecture, migration or unified policy governance.",
  }),
  createPartnerDetail({
    pathname: "/solutions/security/onelogin",
    categoryId: "security",
    partnerName: "OneLogin",
    partnerLogo: oneLoginLogo,
    title: "OneLogin unified identity access,",
    accent: "give the right people the right access at the right time.",
    introduction: "JOTO brings together OneLogin single sign-on, multi-factor authentication, directories and account lifecycle controls to improve and govern access across cloud and on-premises applications.",
    relationshipTitle: "Make identity the common entry point for access control.",
    relationshipDescription: "JOTO's legacy website records OneLogin demonstrations, proof of concept, deployment and maintenance services in China and Hong Kong. Current solutions begin with the application inventory, user journeys and risk policy.",
    reasons: [
      { title: "Reduce login friction", description: "Use a common entry point and single sign-on to reduce password burden and repeated authentication." },
      { title: "Centralize authentication policy", description: "Apply MFA and access requirements by identity, application and risk." },
      { title: "Cover the account lifecycle", description: "Connect joiner, mover and leaver events with changes in application access." },
    ],
    servicesTitle: "JOTO OneLogin services",
    servicesDescription: "JOTO supports identity and application blueprints, SSO and MFA delivery, account lifecycle workflows and user operations.",
    serviceCopy: [
      { title: "Identity & Application Blueprint", description: "Map directories, applications, user groups, authentication methods and lifecycle flows." },
      { title: "SSO, MFA & Connectors", description: "Implement directories, application connectors, policy, pilots and user migration." },
      { title: "Identity Operations & Support", description: "Maintain connectors, access policy, reporting and administrator workflows." },
    ],
    capabilities: [
      ["Application and identity inventory", "SSO and MFA architecture", "Joiner, mover and leaver workflows"],
      ["Directory and application connectors", "Authentication policy configuration", "Pilot, rollout and user migration"],
      ["Access and adoption reporting", "Connector and policy maintenance", "Administrator and user support"],
    ],
    ctaTitle: "Start simplifying identity access with the application inventory.",
    ctaDescription: "Talk to JOTO about SSO, MFA, directory integration or account-lifecycle requirements.",
  }),
  createPartnerDetail({
    pathname: "/solutions/server-storage/dell-technologies",
    categoryId: "server-storage",
    partnerName: "Dell Technologies",
    partnerLogo: dellLogo,
    title: "Dell Technologies data center infrastructure,",
    accent: "build scalable compute and data foundations for critical work.",
    introduction: "Combining Dell PowerEdge compute, enterprise storage and management, JOTO plans reliable, scalable and operable infrastructure for core applications, virtualization, edge and data-intensive workloads.",
    relationshipTitle: "Plan compute, storage and lifecycle as one system.",
    relationshipDescription: "Starting with workload, performance, capacity, availability and growth, JOTO coordinates racks, power, networking, virtualization, migration and long-term maintenance.",
    reasons: [
      { title: "Workload-led selection", description: "Size compute and storage around applications, performance and growth rather than a hardware list." },
      { title: "Compute and storage alignment", description: "Consider servers, data platforms, networking, virtualization, power and rack conditions together." },
      { title: "Full lifecycle coverage", description: "Connect deployment, migration and acceptance with firmware, capacity and warranty coordination." },
    ],
    servicesTitle: "JOTO Dell Technologies services",
    servicesDescription: "From workload and capacity assessment to PowerEdge, storage, virtualization integration and maintenance, JOTO supports the infrastructure lifecycle.",
    serviceCopy: [
      { title: "Workload & Capacity Planning", description: "Assess compute, storage, performance, resilience and future growth." },
      { title: "PowerEdge & Data Platforms", description: "Integrate racks, servers, storage, networking and virtualization." },
      { title: "Infrastructure Lifecycle", description: "Coordinate health monitoring, firmware, capacity, warranty and fault resolution." },
    ],
    capabilities: [
      ["PowerEdge compute sizing", "Dell storage performance and capacity", "Resilience and lifecycle architecture"],
      ["Rack, server and storage deployment", "Virtualization and network integration", "Data migration and acceptance testing"],
      ["iDRAC and infrastructure monitoring", "Firmware and warranty coordination", "Capacity and incident support"],
    ],
    ctaTitle: "Prepare infrastructure for the next generation of workloads.",
    ctaDescription: "Talk to JOTO about Dell compute, storage, virtualization or a data-center refresh.",
  }),
  createPartnerDetail({
    pathname: "/solutions/server-storage/huawei",
    categoryId: "server-storage",
    partnerName: "Huawei",
    partnerLogo: huaweiLogo,
    title: "Huawei OceanStor data infrastructure,",
    accent: "keep critical data efficient, resilient and manageable.",
    introduction: "For core databases, virtualization and data-intensive services, JOTO plans Huawei OceanStor storage around performance, availability, data protection and sustainable growth.",
    relationshipTitle: "Work back from business data needs to the storage architecture.",
    relationshipDescription: "Capacity is not the only starting point. JOTO assesses application performance, growth, recovery objectives, networking and the operating model as one design problem.",
    reasons: [
      { title: "Performance and capacity together", description: "Assess current workloads, growth, latency and throughput in the same plan." },
      { title: "Migration and continuity first", description: "Define cutover, rollback, protection and recovery objectives during design." },
      { title: "Delivery and lifecycle coordination", description: "Connect deployment, networks, virtualization, firmware and support workflows." },
    ],
    servicesTitle: "JOTO Huawei services",
    servicesDescription: "From data requirements and OceanStor architecture to migration, capacity and lifecycle management, JOTO supports the data-infrastructure journey.",
    serviceCopy: [
      { title: "Storage & Data Protection", description: "Define performance, capacity, availability, backup and recovery objectives." },
      { title: "OceanStor Deployment & Migration", description: "Integrate storage, SAN, networking, virtualization and data migration." },
      { title: "Capacity, Health & Lifecycle", description: "Track performance, capacity, firmware and fault resolution over time." },
    ],
    capabilities: [
      ["OceanStor architecture and sizing", "Application performance and capacity", "Availability and data-protection planning"],
      ["OceanStor installation and commissioning", "SAN, network and virtualization integration", "Migration and performance validation"],
      ["Capacity and health monitoring", "Firmware and lifecycle coordination", "Remote and on-site support"],
    ],
    ctaTitle: "Keep data growth from becoming infrastructure pressure.",
    ctaDescription: "Talk to JOTO about Huawei storage, migration, expansion or data protection.",
  }),
  createPartnerDetail({
    pathname: "/solutions/server-storage/inspur",
    categoryId: "server-storage",
    partnerName: "Inspur 浪潮",
    partnerLogo: inspurLogo,
    title: "Inspur compute and storage,",
    accent: "unlock infrastructure potential for dense compute and data growth.",
    introduction: "Combining Inspur servers, accelerated computing and enterprise storage, JOTO plans workload-aligned compute and data foundations for business systems, cloud platforms, AI and high-performance computing.",
    relationshipTitle: "Make platform capabilities fit the workload in practice.",
    relationshipDescription: "Processors, GPUs, memory, storage, networking, rack density and cooling are evaluated together to create a platform that can be deployed, validated and maintained.",
    reasons: [
      { title: "Precise workload alignment", description: "Shape resources around general compute, AI, HPC or data-platform requirements." },
      { title: "Dense environments considered end to end", description: "Plan GPU, networking, racks, power, cooling and storage throughput together." },
      { title: "Deployment and component lifecycle", description: "Cover installation, validation, firmware, parts replacement and fault coordination." },
    ],
    servicesTitle: "JOTO Inspur services",
    servicesDescription: "From compute specifications and platform planning to servers, clusters, storage and component lifecycle, JOTO supports implementation and operations.",
    serviceCopy: [
      { title: "Compute & Platform Sizing", description: "Assess general compute, acceleration, memory, networking and storage requirements." },
      { title: "Servers, Clusters & Storage", description: "Integrate racks, systems, virtualization or clusters and validate the result." },
      { title: "Performance, Capacity & Parts", description: "Manage platform health, firmware, capacity, components and replacement." },
    ],
    capabilities: [
      ["Rack and acceleration server sizing", "Enterprise and scale-out storage", "Workload and resilience planning"],
      ["Compute and storage deployment", "Cluster and virtualization integration", "Benchmarking and acceptance testing"],
      ["Platform health and capacity", "Firmware and component lifecycle", "Incident and replacement coordination"],
    ],
    ctaTitle: "Choose the right compute foundation for the real workload.",
    ctaDescription: "Talk to JOTO about Inspur servers, AI compute, clusters or storage infrastructure.",
  }),
  createPartnerDetail({
    pathname: "/solutions/collaboration/audiocodes",
    categoryId: "collaboration",
    partnerName: "AudioCodes",
    partnerLogo: audioCodesLogo,
    title: "AudioCodes enterprise voice connectivity,",
    accent: "connect Teams, carriers and existing voice without friction.",
    introduction: "Through AudioCodes SBCs, voice gateways, Microsoft Teams connectivity and management, JOTO helps organizations preserve interoperability, security, call quality and site continuity during cloud-voice migration.",
    relationshipTitle: "Connect the new platform while protecting voice investments.",
    relationshipDescription: "Carrier services, numbering, dial plans, SIP interoperability and site survivability are planned together to create a measured path from traditional voice to cloud communications.",
    reasons: [
      { title: "Detailed SIP interoperability", description: "Coordinate carriers, numbers, dial plans, platforms and endpoints at the protocol and call-flow level." },
      { title: "Migration with continuity", description: "Retain required legacy devices and site-survival capabilities while introducing cloud communications." },
      { title: "Operational voice quality", description: "Monitor call quality, session state, routing and fault isolation over time." },
    ],
    servicesTitle: "JOTO AudioCodes services",
    servicesDescription: "From voice-readiness assessment to SBCs, gateways, Teams integration and operations, JOTO connects cloud communications with existing voice environments.",
    serviceCopy: [
      { title: "Voice & Cloud Readiness", description: "Map trunks, numbers, platforms, endpoints and high-availability requirements." },
      { title: "SBC, Gateway & Teams", description: "Implement Direct Routing, Operator Connect, SIP and gateway configurations." },
      { title: "Voice Quality & Operations", description: "Monitor sessions, quality, routing, software and carrier issues." },
    ],
    capabilities: [
      ["Voice and SIP readiness assessment", "SBC and gateway architecture", "Teams and carrier connectivity design"],
      ["SBC, gateway and device deployment", "Dial-plan and SIP integration", "Migration and call-flow validation"],
      ["Voice quality and session monitoring", "Configuration and software lifecycle", "Carrier and incident troubleshooting"],
    ],
    ctaTitle: "Make enterprise voice migration smoother.",
    ctaDescription: "Talk to JOTO about AudioCodes, Teams, SBCs, gateways or carrier interoperability.",
  }),
  createPartnerDetail({
    pathname: "/solutions/collaboration/vodia",
    categoryId: "collaboration",
    partnerName: "Vodia",
    partnerLogo: vodiaLogo,
    title: "Vodia multi-tenant IP communications,",
    accent: "support enterprise and service-provider voice on one flexible platform.",
    introduction: "JOTO helps enterprises and service providers deploy Vodia IP PBX with multi-tenancy, SIP interoperability, flexible endpoints and centralized management for hosted voice and multi-site communications.",
    relationshipTitle: "Design the platform from its tenant and numbering model.",
    relationshipDescription: "Tenant boundaries, numbering, routing, carriers, endpoints, security and availability are defined together so the foundation does not need repeated redesign after launch.",
    reasons: [
      { title: "Flexible multi-tenancy", description: "Create independent configuration and management boundaries by company, customer or business unit." },
      { title: "Open SIP and endpoint choice", description: "Connect multiple carriers, desk phones, soft clients and communications applications." },
      { title: "Centralized service operations", description: "Manage numbering, tenants, upgrades, quality and high-volume changes through common workflows." },
    ],
    servicesTitle: "JOTO Vodia services",
    servicesDescription: "From tenant and numbering architecture to PBX, SIP, endpoint rollout and operations, JOTO supports flexible enterprise and service-provider voice platforms.",
    serviceCopy: [
      { title: "Tenant, Numbering & Routing", description: "Plan the tenant model, dial plan, SIP trunks and resilience." },
      { title: "PBX, Carrier & Endpoints", description: "Configure the platform, tenants, devices, applications and user migration." },
      { title: "Service Operations & Support", description: "Manage call quality, tenant changes, upgrades and administrator workflows." },
    ],
    capabilities: [
      ["Tenant and numbering architecture", "SIP trunk and endpoint planning", "Availability and security design"],
      ["PBX and tenant configuration", "Carrier, device and application integration", "User migration and call testing"],
      ["Call quality and service monitoring", "Tenant changes and upgrades", "Administrator and user support"],
    ],
    ctaTitle: "Start with a clear tenant and numbering model.",
    ctaDescription: "Talk to JOTO about Vodia multi-tenant PBX, SIP or hosted voice platforms.",
  }),
  createPartnerDetail({
    pathname: "/solutions/collaboration/cyberdata",
    categoryId: "collaboration",
    partnerName: "CyberData",
    partnerLogo: cyberDataLogo,
    title: "CyberData IP intercom and paging,",
    accent: "make on-site messages clear, locatable and actionable.",
    introduction: "JOTO designs and deploys CyberData SIP paging, intercom, speakers and visual-alert endpoints to create reliable on-site communications across campuses, factories, warehouses and public areas.",
    relationshipTitle: "Extend the voice platform into every physical space.",
    relationshipDescription: "Acoustic coverage, zones, PoE, SIP, multicast and environmental conditions are planned together so endpoints are not only connected, but intelligible where people use them.",
    reasons: [
      { title: "Purposeful coverage design", description: "Select devices and positions based on the space, ambient noise, purpose and paging zones." },
      { title: "Platform interoperability", description: "Connect SIP endpoints with PBX, paging and critical-notification systems." },
      { title: "Validation on site", description: "Confirm installation, volume and intelligibility through testing in the real environment." },
    ],
    servicesTitle: "JOTO CyberData services",
    servicesDescription: "From coverage and endpoint planning to SIP, PBX and notification integration, JOTO supports complete on-site communications.",
    serviceCopy: [
      { title: "Paging Zones & Endpoints", description: "Assess zones, noise, volume, networking, PoE and endpoint types." },
      { title: "SIP Intercom & Paging", description: "Install speakers, intercoms and visual alerts, then connect them to PBX or notification platforms." },
      { title: "Endpoint Health & Site Support", description: "Handle configuration, moves, additions, fault isolation and replacement." },
    ],
    capabilities: [
      ["Paging zone and coverage design", "SIP and multicast planning", "Endpoint and PoE requirements"],
      ["Speakers, intercoms and strobes", "PBX and notification integration", "Commissioning and intelligibility testing"],
      ["Endpoint health and configuration", "Moves, adds and changes", "Fault isolation and replacement support"],
    ],
    ctaTitle: "Make every zone hear the message clearly.",
    ctaDescription: "Talk to JOTO about CyberData paging, intercom, visual alerts or coverage design.",
  }),
  createPartnerDetail({
    pathname: "/solutions/collaboration/informacast",
    categoryId: "collaboration",
    partnerName: "InformaCast",
    partnerLogo: informaCastLogo,
    title: "InformaCast critical event notification,",
    accent: "reach the right people when every second matters.",
    introduction: "JOTO uses InformaCast to connect paging, text, desktop, mobile devices and collaboration tools into a unified notification process for emergencies and day-to-day operations.",
    relationshipTitle: "Notification value depends on a workflow that works in practice.",
    relationshipDescription: "The solution begins with incident types, audiences, escalation paths, message templates, channels and exercises rather than ending with platform installation.",
    reasons: [
      { title: "One multi-channel workflow", description: "Connect paging, text, desktop, mobile and collaboration channels in a coordinated process." },
      { title: "Designed around incidents", description: "Organize notifications by audience, location, severity and escalation path." },
      { title: "Continuously validated", description: "Use exercises, delivery reports and reviews to confirm readiness before an event." },
    ],
    servicesTitle: "JOTO InformaCast services",
    servicesDescription: "From incident and audience design to channel integration, templates, exercises and reporting, JOTO helps build a testable critical-notification system.",
    serviceCopy: [
      { title: "Incidents, Audiences & Workflows", description: "Define scenarios, people, channels, templates and escalation rules." },
      { title: "Platform & Channel Integration", description: "Connect paging, mobile, desktop, collaboration tools and business systems." },
      { title: "Exercises, Reporting & Care", description: "Maintain templates and recipients, review delivery and run periodic exercises." },
    ],
    capabilities: [
      ["Incident and audience mapping", "Alert workflow and channel design", "Integration and resilience planning"],
      ["Platform and recipient configuration", "Paging, mobile and desktop integration", "Scenario testing and operational handover"],
      ["Template and recipient maintenance", "Delivery reporting and drill support", "Platform and integration troubleshooting"],
    ],
    ctaTitle: "Start by defining the critical event and its notification path.",
    ctaDescription: "Talk to JOTO about InformaCast scenarios, channel integration and exercise planning.",
  }),
  createPartnerDetail({
    pathname: "/solutions/safeguarding/verkada",
    categoryId: "safeguarding",
    partnerName: "Verkada",
    partnerLogo: verkadaLogo,
    title: "Verkada cloud-managed physical security,",
    accent: "bring video, access and environmental context into one view.",
    introduction: "JOTO combines Verkada video, access control, sensors, intercom and cloud management to help multi-site organizations unify devices, users, alerts and investigation workflows.",
    relationshipTitle: "Gain fuller site context with fewer systems to switch between.",
    relationshipDescription: "Sites, coverage, retention, permissions, alerting and response workflows are designed together, turning separate physical-security capabilities into a manageable operating environment.",
    reasons: [
      { title: "Unified multi-site management", description: "Manage distributed sites, devices, users and events through one cloud view." },
      { title: "Video, access and sensor context", description: "Bring people, doors, footage and environmental signals together during investigation and response." },
      { title: "Ongoing operational improvement", description: "Continue refining device health, alerts, retention and user permissions after go-live." },
    ],
    servicesTitle: "JOTO Verkada services",
    servicesDescription: "From site and Command architecture to video, access, sensor deployment and cloud operations, JOTO supports the physical-security lifecycle.",
    serviceCopy: [
      { title: "Site & Command Architecture", description: "Plan cameras, retention, access, sensors, intercom and user permissions." },
      { title: "Device Deployment & Integration", description: "Implement cameras, controllers, identity and relevant building-system integrations." },
      { title: "Cloud Operations & Events", description: "Manage fleet health, alerts, retention, users and support workflows." },
    ],
    capabilities: [
      ["Command platform and site architecture", "Camera and retention planning", "Access, sensor and intercom requirements"],
      ["Camera and controller deployment", "Identity and building-system integration", "Coverage, alert and workflow validation"],
      ["Fleet health and user administration", "Alert and retention optimization", "Remote and on-site support"],
    ],
    ctaTitle: "See every site through one operational view.",
    ctaDescription: "Talk to JOTO about Verkada video, access, sensors or multi-site management.",
  }),
  createPartnerDetail({
    pathname: "/solutions/safeguarding/hikvision",
    categoryId: "safeguarding",
    partnerName: "Hikvision",
    partnerLogo: hikvisionLogo,
    title: "Hikvision intelligent physical security,",
    accent: "turn site visibility into manageable protection.",
    introduction: "JOTO plans and integrates Hikvision video, recording, access control and intercom for offices, campuses, factories, warehouses and public spaces, with clear coverage and practical operations.",
    relationshipTitle: "Start with site risk, not a camera count.",
    relationshipDescription: "Risk areas, view angles, lighting, bandwidth, storage, retention, permissions and event handling are evaluated together so device deployment serves real operations.",
    reasons: [
      { title: "Coverage and storage together", description: "Plan positions, views, lighting, bandwidth, retention and storage capacity as one system." },
      { title: "Video, access and intercom alignment", description: "Connect physical-security systems through shared event and operating workflows." },
      { title: "Local delivery and maintenance", description: "Cover installation, commissioning, handover, device health and fault resolution." },
    ],
    servicesTitle: "JOTO Hikvision services",
    servicesDescription: "From site-risk and coverage planning to video, storage, access, intercom and maintenance, JOTO supports integrated physical security.",
    serviceCopy: [
      { title: "Video Coverage & Storage", description: "Define positions, views, analytics, bandwidth, retention and storage architecture." },
      { title: "Video, Access & Intercom", description: "Integrate and commission cameras, recording, controllers and management platforms." },
      { title: "Device Health & Permissions", description: "Manage devices, storage, users, policy, firmware and fault handling." },
    ],
    capabilities: [
      ["Camera coverage and analytics needs", "Recording, bandwidth and retention", "Access and intercom architecture"],
      ["Cameras, recorders and controllers", "Network and management integration", "Commissioning and operator handover"],
      ["Device and storage health", "User, policy and firmware lifecycle", "Fault isolation and replacement support"],
    ],
    ctaTitle: "Begin with site risk and coverage objectives.",
    ctaDescription: "Talk to JOTO about Hikvision video, storage, access control or intercom.",
  }),
  createPartnerDetail({
    pathname: "/solutions/safeguarding/keyking",
    categoryId: "safeguarding",
    partnerName: "Keyking",
    partnerLogo: keykingLogo,
    title: "Keyking access control and integrated security,",
    accent: "make every entry authorized, recorded and traceable.",
    introduction: "Using Keyking access controllers, readers and SPHINX management, JOTO builds stable and extensible control over people and doors across offices, campuses and operational facilities.",
    relationshipTitle: "Bring doors, people and permissions into one operating model.",
    relationshipDescription: "Door hardware, controllers, networking, credentials, permission models and event records are planned together for both new facilities and phased upgrades to existing access systems.",
    reasons: [
      { title: "Hardware and software together", description: "Consider locks, readers, controllers, networks, credentials and the management platform as one system." },
      { title: "Support phased modernization", description: "Retain suitable existing hardware and update control and management in practical stages." },
      { title: "Designed for long-term operations", description: "Continue managing permissions, credentials, events, controllers and on-site faults." },
    ],
    servicesTitle: "JOTO Keyking services",
    servicesDescription: "From doors and permissions to controllers, SPHINX integration and maintenance, JOTO supports access control and integrated physical security.",
    serviceCopy: [
      { title: "Doors, Credentials & Permissions", description: "Survey locks, readers, people, zones and permission workflows." },
      { title: "Controllers & SPHINX", description: "Integrate controllers, readers, locks, management and connected security systems." },
      { title: "Users, Events & Devices", description: "Maintain permissions, credentials, events, controllers and on-site faults." },
    ],
    capabilities: [
      ["Door, reader and credential survey", "Controller and permissions architecture", "Building and security integration planning"],
      ["Controllers, readers and credentials", "Door hardware and platform integration", "Commissioning and access testing"],
      ["Events, users and permissions support", "Controller and credential lifecycle", "On-site fault and replacement coordination"],
    ],
    ctaTitle: "Make access permissions clearer and events easier to trace.",
    ctaDescription: "Talk to JOTO about Keyking access control, controllers, SPHINX or an existing-system upgrade.",
  }),
];

export const partnerDetails: PartnerDetail[] = [ciscoDetail, ...additionalPartnerDetails];

export function getPartnerDetail(pathname: string): PartnerDetail | undefined {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return partnerDetails.find((detail) => detail.pathname === normalizedPath);
}
