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
    "HPE Aruba Networking developer and Central platform ecosystem",
    "HPE Aruba Networking AFC planning window for wireless spectrum coordination",
    "HPE Aruba Networking AOS-CX switching platform",
    "HPE Aruba Networking Central cloud management platform",
  ]),
  "sangfor-network": createVisualSet("sangfor-network", [
    "Sangfor Secure SD-WAN architecture connecting branch, campus and cloud locations",
    "Sangfor Athena unified security and networking platform",
    "Sangfor Athena NGFW appliance used for secure branch deployment",
    "Sangfor Central Manager interface for policy and network operations",
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
    "Sangfor Athena enterprise security platform",
    "Sangfor security architecture connecting sites and protected workloads",
    "Sangfor Athena NGFW appliance for perimeter and branch protection",
    "Sangfor security operations and management product demonstration",
  ]),
  "check-point": createVisualSet("check-point", [
    "Check Point Infinity platform across network, cloud and workspace security",
    "Check Point Infinity platform security architecture",
    "Check Point Quantum enterprise firewall appliance portfolio",
    "Check Point Infinity platform operations interface",
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
