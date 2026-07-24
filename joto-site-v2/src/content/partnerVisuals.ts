export interface PartnerVisual {
  src: string;
  alt: string;
  position?: string;
}

export interface PartnerVisualSet {
  hero: PartnerVisual;
  planning: PartnerVisual;
  deployment: PartnerVisual;
  operations: PartnerVisual;
}

export type PartnerVisualKey =
  | "extreme-networks"
  | "aruba"
  | "sangfor-network"
  | "knowbe4"
  | "palo-alto-networks"
  | "fortinet"
  | "sangfor-security"
  | "check-point"
  | "onelogin"
  | "dell-technologies"
  | "huawei"
  | "inspur"
  | "audiocodes"
  | "vodia"
  | "cyberdata"
  | "informacast"
  | "verkada"
  | "hikvision"
  | "keyking";

const assetModules = import.meta.glob("../assets/partners/*/*.{jpg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function asset(slug: PartnerVisualKey, role: keyof PartnerVisualSet): string {
  const jpg = assetModules[`../assets/partners/${slug}/${role}.jpg`];
  const png = assetModules[`../assets/partners/${slug}/${role}.png`];
  const src = jpg ?? png;

  if (!src) {
    throw new Error(`Missing ${role} visual for ${slug}`);
  }
  return src;
}

function createVisualSet(
  slug: PartnerVisualKey,
  descriptions: [string, string, string, string],
): PartnerVisualSet {
  const [hero, planning, deployment, operations] = descriptions;
  return {
    hero: { src: asset(slug, "hero"), alt: hero },
    planning: { src: asset(slug, "planning"), alt: planning },
    deployment: { src: asset(slug, "deployment"), alt: deployment },
    operations: { src: asset(slug, "operations"), alt: operations },
  };
}

export const partnerVisuals: Record<PartnerVisualKey, PartnerVisualSet> = {
  "extreme-networks": createVisualSet("extreme-networks", [
    "Extreme Platform ONE workspace connecting people, applications and network operations",
    "Extreme Platform ONE service-layer architecture and network topology",
    "Extreme 4000 Series switches managed through ExtremeCloud IQ",
    "Extreme Platform ONE operations dashboard showing network alerts and health",
  ]),
  aruba: createVisualSet("aruba", [
    "Modern Aruba campus network connecting access points, switching and cloud management",
    "Network architects planning Aruba wireless coverage and campus topology",
    "Engineer deploying Aruba wired and wireless infrastructure",
    "Aruba cloud operations team monitoring network health and performance",
  ]),
  "sangfor-network": createVisualSet("sangfor-network", [
    "Sangfor secure multi-site network connecting branches, campus, data center and cloud",
    "Network architects planning Sangfor SD-WAN topology and resilient application paths",
    "Engineer deploying a Sangfor branch gateway and network infrastructure",
    "Sangfor network operations team optimizing multi-site connectivity and performance",
  ]),
  knowbe4: createVisualSet("knowbe4", [
    "KnowBe4 human risk management and security awareness platform workflow",
    "KnowBe4 program view for reducing repeat security incidents",
    "KnowBe4 security awareness program workflow for scaling training",
    "KnowBe4 high-risk user reporting and human risk operations view",
  ]),
  "palo-alto-networks": createVisualSet("palo-alto-networks", [
    "Palo Alto Networks integrated network security platform and NGFW capabilities",
    "Palo Alto Networks NGFW enterprise use-case architecture",
    "Palo Alto Networks PA-1410 next-generation firewall appliance",
    "Palo Alto Networks Cloud NGFW service for cloud operations",
  ]),
  fortinet: createVisualSet("fortinet", [
    "Fortinet hybrid mesh firewall architecture across distributed environments",
    "FortiManager Cloud centralized management architecture",
    "FortiGate 200G Series next-generation firewall appliance family",
    "FortiManager graphical interface for centralized Fortinet operations",
  ]),
  "sangfor-security": createVisualSet("sangfor-security", [
    "Sangfor layered protection securing campus, data center and cloud workloads",
    "Security architects planning Sangfor zero-trust boundaries and policy paths",
    "Engineer integrating Sangfor next-generation firewall infrastructure",
    "Sangfor security operations center monitoring and responding to threats",
  ]),
  "check-point": createVisualSet("check-point", [
    "Check Point unified protection across network, cloud, users and endpoints",
    "Security architects designing Check Point unified policy and trust architecture",
    "Engineer deploying Check Point firewall and hybrid-cloud security infrastructure",
    "Check Point security operations team continuously preventing and containing threats",
  ]),
  onelogin: createVisualSet("onelogin", [
    "OneLogin cloud identity and access management platform",
    "OneLogin workforce identity environment for application access planning",
    "OneLogin customer identity environment and application connections",
    "OneLogin identity administration and access-policy operations",
  ]),
  "dell-technologies": createVisualSet("dell-technologies", [
    "Dell Technologies enterprise infrastructure product demonstration",
    "Dell Technologies workload and infrastructure planning demonstration",
    "Dell Technologies server and data-center deployment demonstration",
    "Dell Technologies infrastructure operations demonstration",
  ]),
  huawei: createVisualSet("huawei", [
    "Huawei OceanStor data storage portfolio",
    "Huawei simplified all-flash data-center architecture",
    "Huawei OceanStor all-flash storage system",
    "Huawei OceanStor storage management and data-services environment",
  ]),
  inspur: createVisualSet("inspur", [
    "Inspur enterprise compute and storage portfolio",
    "Inspur infrastructure platform planning environment",
    "Inspur enterprise storage product family",
    "Inspur storage platform for lifecycle operations",
  ]),
  audiocodes: createVisualSet("audiocodes", [
    "AudioCodes Mediant session border controller portfolio",
    "AudioCodes SBC architecture connecting enterprise voice and cloud services",
    "AudioCodes Mediant SBC appliances for voice deployment",
    "AudioCodes management products and voice operations environment",
  ]),
  vodia: createVisualSet("vodia", [
    "Vodia V70 administration portal for multi-tenant phone systems",
    "Vodia V70 dashboard with CPU, registration and system graphs",
    "Vodia SBC integration connecting Microsoft Teams and mobile endpoints",
    "Vodia real-time dashboard for live phone-system visibility",
  ]),
  cyberdata: createVisualSet("cyberdata", [
    "CyberData SIP paging, intercom and endpoint product portfolio",
    "CyberData enterprise paging and communication deployment environment",
    "CyberData SIP keypad intercom endpoint",
    "CyberData SIP product integration with Microsoft Teams",
  ]),
  informacast: createVisualSet("informacast", [
    "InformaCast mass notification platform across connected channels",
    "InformaCast technology integrations for notification planning",
    "InformaCast wearable alert badge for emergency notification",
    "InformaCast interactive school notification and incident workflow",
  ]),
  verkada: createVisualSet("verkada", [
    "Verkada video security cameras connected to the Command platform",
    "Verkada access control products for site security planning",
    "Verkada air-quality sensor product for facility deployment",
    "Verkada workplace product and Command operations environment",
  ]),
  hikvision: createVisualSet("hikvision", [
    "Hikvision official video demonstrating its physical security ecosystem",
    "Hikvision official demonstration of video security planning capabilities",
    "Hikvision official product demonstration for camera deployment",
    "Hikvision official demonstration of security management operations",
  ]),
  keyking: createVisualSet("keyking", [
    "Keyking network-based access control system",
    "Keyking fingerprint reader for credential and door planning",
    "Keyking graphical interface for access-control deployment",
    "Keyking remote access and device operations capability",
  ]),
};
