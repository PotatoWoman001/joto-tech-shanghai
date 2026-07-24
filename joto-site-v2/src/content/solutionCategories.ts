import type { Locale } from "../i18n/routing";

type LocalizedText = Record<Locale, string>;

interface LocalizedCapability {
  title: LocalizedText;
  description: LocalizedText;
}

interface SolutionCategorySource {
  id: string;
  pathname: string;
  tagline: LocalizedText;
  summary: LocalizedText;
  capabilities: LocalizedCapability[];
  featuredCaseClient: string;
}

export interface SolutionCapability {
  title: string;
  description: string;
}

export interface SolutionCategoryDetail {
  id: string;
  pathname: string;
  tagline: string;
  summary: string;
  capabilities: SolutionCapability[];
  featuredCaseClient: string;
}

export interface SolutionCategoryPageLabels {
  overview: string;
  capabilitiesEyebrow: string;
  capabilitiesTitle: string;
  partnersEyebrow: string;
  partnersTitle: string;
  caseEyebrow: string;
  caseTitle: string;
  viewCase: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
}

const text = (en: string, zh: string, fa: string): LocalizedText => ({
  en,
  "zh-CN": zh,
  "fa-IR": fa,
});

const capability = (
  title: LocalizedText,
  description: LocalizedText,
): LocalizedCapability => ({ title, description });

const sources: SolutionCategorySource[] = [
  {
    id: "network",
    pathname: "/solutions/network",
    tagline: text(
      "The backbone your business runs on.",
      "让业务始终在线的网络底座。",
      "ستون فقراتی که کسب‌وکار شما بر آن استوار است.",
    ),
    summary: text(
      "High-availability architecture, cloud-managed campus networks, SD-WAN and secure access — designed, deployed and supported across offices, factories and data centers.",
      "从高可用架构、云管理园区网到 SD-WAN 与安全接入，覆盖办公室、工厂和数据中心的规划、部署与持续运维。",
      "معماری با دسترس‌پذیری بالا، شبکه پردیس ابری، SD-WAN و دسترسی امن؛ برای دفاتر، کارخانه‌ها و مراکز داده طراحی، اجرا و پشتیبانی می‌شود.",
    ),
    capabilities: [
      capability(
        text("High-availability Network Design", "高可用网络设计", "طراحی شبکه با دسترس‌پذیری بالا"),
        text(
          "Resilient architectures with capacity, redundancy and operational continuity planned from the start.",
          "从规划阶段统筹容量、冗余和业务连续性，构建稳定可靠的网络架构。",
          "معماری تاب‌آور با برنامه‌ریزی ظرفیت، افزونگی و تداوم عملیات از همان ابتدا.",
        ),
      ),
      capability(
        text("Cloud-managed Campus", "云管理园区网络", "پردیس با مدیریت ابری"),
        text(
          "Centralized wired and wireless operations across distributed offices and campuses.",
          "集中管理分布式办公室与园区的有线、无线网络。",
          "مدیریت متمرکز شبکه سیمی و بی‌سیم در دفاتر و پردیس‌های پراکنده.",
        ),
      ),
      capability(
        text("SD-WAN & Branch Connectivity", "SD-WAN 与分支互联", "SD-WAN و اتصال شعب"),
        text(
          "Reliable, policy-driven connectivity between branches, regional hubs and global headquarters.",
          "以策略驱动的方式连接分支、区域中心与全球总部，兼顾可靠性与成本。",
          "اتصال پایدار و مبتنی بر سیاست میان شعب، مراکز منطقه‌ای و دفتر مرکزی جهانی.",
        ),
      ),
      capability(
        text("SASE & Zero Trust", "SASE 与零信任接入", "SASE و اعتماد صفر"),
        text(
          "Secure access for users, devices and applications wherever work happens.",
          "面向用户、设备与应用提供不受地点限制的安全访问。",
          "دسترسی امن برای کاربران، دستگاه‌ها و برنامه‌ها در هر محل کاری.",
        ),
      ),
      capability(
        text("Experience Monitoring", "用户体验监控", "پایش تجربه کاربر"),
        text(
          "Visibility from network health to real user experience, with issues surfaced before they spread.",
          "从网络健康度到真实用户体验持续可视，提前发现并控制问题影响。",
          "دید کامل از سلامت شبکه تا تجربه واقعی کاربر و شناسایی مشکل پیش از گسترش.",
        ),
      ),
      capability(
        text("Wireless at Scale", "大规模无线覆盖", "شبکه بی‌سیم در مقیاس بزرگ"),
        text(
          "Enterprise Wi-Fi designed for density, roaming, security and long-term growth.",
          "围绕高密接入、漫游、安全与长期扩展设计企业无线网络。",
          "وای‌فای سازمانی برای تراکم، رومینگ، امنیت و رشد بلندمدت طراحی می‌شود.",
        ),
      ),
    ],
    featuredCaseClient: "Harrow International School",
  },
  {
    id: "security",
    pathname: "/solutions/security",
    tagline: text(
      "Defense in depth, operated as one system.",
      "纵深防御，统一运营。",
      "دفاع چندلایه، با عملیاتی یکپارچه.",
    ),
    summary: text(
      "From next-generation firewalls and XDR to identity, awareness and security operations, JOTO connects controls into a practical defense program.",
      "从下一代防火墙、XDR 到身份、意识培训与安全运营，JOTO 将分散的安全能力整合为可持续执行的防护体系。",
      "از فایروال نسل جدید و XDR تا هویت، آموزش و عملیات امنیت، JOTO کنترل‌ها را در یک برنامه دفاعی عملی یکپارچه می‌کند.",
    ),
    capabilities: [
      capability(
        text("Network & Cloud Firewalls", "网络与云防火墙", "فایروال شبکه و ابر"),
        text(
          "Architecture, migration and lifecycle management for perimeter, data-center and cloud security.",
          "覆盖边界、数据中心与云环境的架构设计、迁移和全生命周期管理。",
          "معماری، مهاجرت و مدیریت چرخه عمر امنیت پیرامونی، مرکز داده و ابر.",
        ),
      ),
      capability(
        text("Endpoint & XDR", "终端安全与 XDR", "امنیت نقطه پایانی و XDR"),
        text(
          "Detection, investigation and response across endpoints and business-critical servers.",
          "覆盖终端和关键业务服务器的检测、调查与响应。",
          "شناسایی، بررسی و پاسخ در نقاط پایانی و سرورهای حیاتی کسب‌وکار.",
        ),
      ),
      capability(
        text("SOC & Security Operations", "SOC 与安全运营", "SOC و عملیات امنیت"),
        text(
          "Monitoring, incident coordination, tuning and maintenance aligned to agreed service levels.",
          "按照约定服务等级开展监控、事件协同、策略调优与持续维护。",
          "پایش، هماهنگی رخداد، تنظیم و نگهداری متناسب با سطح خدمات توافق‌شده.",
        ),
      ),
      capability(
        text("Compliance Readiness", "合规能力建设", "آمادگی انطباق"),
        text(
          "Technical controls, evidence and remediation planning for local and industry requirements.",
          "围绕本地及行业要求完善技术控制、证据留存和整改计划。",
          "کنترل‌های فنی، مستندات و برنامه اصلاح برای الزامات محلی و صنعتی.",
        ),
      ),
      capability(
        text("Identity & Access", "身份与访问管理", "هویت و دسترسی"),
        text(
          "SSO, MFA and account lifecycle controls that keep access appropriate and auditable.",
          "通过 SSO、MFA 和账户生命周期控制，让访问权限合理且可审计。",
          "SSO، احراز هویت چندمرحله‌ای و کنترل چرخه عمر حساب برای دسترسی مناسب و قابل ممیزی.",
        ),
      ),
      capability(
        text("Security Awareness", "安全意识与演练", "آگاهی امنیتی"),
        text(
          "Training and phishing simulations that help employees recognize and report real threats.",
          "通过培训与钓鱼模拟，帮助员工识别并上报真实威胁。",
          "آموزش و شبیه‌سازی فیشینگ برای تشخیص و گزارش تهدیدهای واقعی توسط کارکنان.",
        ),
      ),
    ],
    featuredCaseClient: "Starbucks China",
  },
  {
    id: "server-storage",
    pathname: "/solutions/server-storage",
    tagline: text(
      "Compute and data platforms built for continuity.",
      "为业务连续性打造计算与数据平台。",
      "پلتفرم‌های پردازش و داده برای تداوم کسب‌وکار.",
    ),
    summary: text(
      "Private cloud, virtualization, hyperconverged infrastructure, backup and disaster recovery — sized for real workloads and supported through the lifecycle.",
      "覆盖私有云、虚拟化、超融合、备份与灾备，按照真实业务负载规划容量，并提供全生命周期支持。",
      "ابر خصوصی، مجازی‌سازی، زیرساخت همگرا، پشتیبان‌گیری و بازیابی بحران؛ متناسب با بار کاری واقعی و با پشتیبانی کامل چرخه عمر.",
    ),
    capabilities: [
      capability(
        text("Private Cloud", "私有云平台", "ابر خصوصی"),
        text(
          "On-premises cloud platforms aligned to workload, governance and data-location needs.",
          "结合工作负载、治理要求与数据位置需求建设本地私有云。",
          "پلتفرم ابری درون‌سازمانی متناسب با بار کاری، حاکمیت و محل نگهداری داده.",
        ),
      ),
      capability(
        text("Server Virtualization", "服务器虚拟化", "مجازی‌سازی سرور"),
        text(
          "Assessment, migration and optimization of hypervisor and virtual infrastructure estates.",
          "开展虚拟化平台评估、迁移与持续优化。",
          "ارزیابی، مهاجرت و بهینه‌سازی بسترهای هایپروایزر و زیرساخت مجازی.",
        ),
      ),
      capability(
        text("Hyperconverged Infrastructure", "超融合基础设施", "زیرساخت همگرا"),
        text(
          "Modular compute and storage building blocks that simplify operations and scale predictably.",
          "以模块化计算与存储单元简化运维，并实现可预测扩展。",
          "بلوک‌های ماژولار پردازش و ذخیره‌سازی برای عملیات ساده‌تر و توسعه قابل پیش‌بینی.",
        ),
      ),
      capability(
        text("Data Backup", "数据备份", "پشتیبان‌گیری داده"),
        text(
          "Local, off-site and immutable backup designs with restore procedures that are tested.",
          "建设本地、异地及不可变备份体系，并持续验证恢复流程。",
          "طراحی پشتیبان محلی، خارج از سایت و تغییرناپذیر همراه با آزمون فرآیند بازیابی.",
        ),
      ),
      capability(
        text("Disaster Recovery", "灾难恢复", "بازیابی بحران"),
        text(
          "Recovery architecture, runbooks and exercises tied to business recovery objectives.",
          "围绕业务恢复目标制定灾备架构、操作手册与演练机制。",
          "معماری بازیابی، دستورالعمل‌ها و تمرین‌ها بر پایه اهداف بازیابی کسب‌وکار.",
        ),
      ),
      capability(
        text("Data Center Build-out", "数据中心建设", "ساخت مرکز داده"),
        text(
          "Racks, power, cooling, cabling and migration coordinated as one delivery program.",
          "统一协调机柜、供配电、制冷、布线和迁移工作。",
          "هماهنگی رک، برق، سرمایش، کابل‌کشی و مهاجرت در قالب یک برنامه تحویل.",
        ),
      ),
    ],
    featuredCaseClient: "Danaher",
  },
  {
    id: "collaboration",
    pathname: "/solutions/collaboration",
    tagline: text(
      "Every call, room and message — connected.",
      "让每一通电话、每一间会议室和每一条消息保持连接。",
      "هر تماس، اتاق و پیام؛ به‌هم‌پیوسته.",
    ),
    summary: text(
      "Cloud telephony, Microsoft Teams voice, meeting rooms, contact centers and mass notification — unified around how your teams communicate.",
      "覆盖云电话、Microsoft Teams 语音、会议室、联络中心和群体通知，围绕团队真实沟通方式实现统一协作。",
      "تلفن ابری، صدای Microsoft Teams، اتاق جلسه، مرکز تماس و اعلان انبوه؛ یکپارچه بر پایه شیوه ارتباط تیم‌ها.",
    ),
    capabilities: [
      capability(
        text("Microsoft Teams Telephony", "Microsoft Teams 电话", "تلفن Microsoft Teams"),
        text(
          "Direct Routing, SBC design and number planning that turn Teams into an enterprise phone system.",
          "通过 Direct Routing、SBC 设计和号码规划，将 Teams 打造为企业电话系统。",
          "Direct Routing، طراحی SBC و برنامه‌ریزی شماره برای تبدیل Teams به سامانه تلفن سازمانی.",
        ),
      ),
      capability(
        text("Cloud IP PBX", "云 IP PBX", "IP PBX ابری"),
        text(
          "Flexible cloud and hybrid telephony replacing aging on-premises PBX platforms.",
          "以灵活的云和混合电话方案替代老旧本地 PBX。",
          "تلفن ابری و ترکیبی منعطف برای جایگزینی PBXهای قدیمی درون‌سازمانی.",
        ),
      ),
      capability(
        text("Video & Meeting Rooms", "视频会议与会议室", "ویدئو و اتاق جلسه"),
        text(
          "Room systems, control, audio and content sharing designed as one user experience.",
          "将会议室系统、控制、音频与内容共享整合为一致体验。",
          "طراحی یکپارچه سامانه اتاق، کنترل، صدا و اشتراک محتوا برای تجربه‌ای واحد.",
        ),
      ),
      capability(
        text("Contact Center", "联络中心", "مرکز تماس"),
        text(
          "IVR, queues, recording and reporting integrated with customer-service workflows.",
          "将 IVR、排队、录音和报表能力融入客户服务流程。",
          "یکپارچه‌سازی IVR، صف، ضبط و گزارش با فرآیندهای خدمات مشتری.",
        ),
      ),
      capability(
        text("IP Paging & Intercom", "IP 广播与对讲", "پیجینگ و اینترکام IP"),
        text(
          "Standards-based paging and intercom endpoints for offices, schools and facilities.",
          "为办公室、学校和园区部署标准化 IP 广播与对讲终端。",
          "نقاط پایانی استاندارد پیجینگ و اینترکام برای دفاتر، مدارس و تأسیسات.",
        ),
      ),
      capability(
        text("Mass Notification", "群体通知", "اعلان انبوه"),
        text(
          "Coordinated alerts across phones, speakers and screens for operational and emergency messages.",
          "通过电话、扬声器和屏幕协同发布运营及紧急通知。",
          "هشدار هماهنگ از طریق تلفن، بلندگو و نمایشگر برای پیام‌های عملیاتی و اضطراری.",
        ),
      ),
    ],
    featuredCaseClient: "JD International",
  },
  {
    id: "safeguarding",
    pathname: "/solutions/safeguarding",
    tagline: text(
      "Physical security connected to the wider IT environment.",
      "让物理安防真正融入整体 IT 环境。",
      "امنیت فیزیکی متصل به کل محیط فناوری اطلاعات.",
    ),
    summary: text(
      "Video security, access control, intrusion alerting, visitor management and environmental sensing — integrated for visibility and faster response.",
      "将视频安防、门禁、入侵告警、访客管理和环境感知统一集成，提升可视性与响应速度。",
      "امنیت ویدئویی، کنترل دسترسی، هشدار نفوذ، مدیریت مراجعه‌کننده و حسگر محیطی؛ یکپارچه برای دید بهتر و پاسخ سریع‌تر.",
    ),
    capabilities: [
      capability(
        text("Video Surveillance", "视频监控", "نظارت تصویری"),
        text(
          "Cloud-managed, hybrid and on-premises video architectures for single sites and distributed estates.",
          "面向单一场所和分布式园区提供云管理、混合及本地视频架构。",
          "معماری ویدئویی ابری، ترکیبی و درون‌سازمانی برای یک سایت یا مجموعه‌های پراکنده.",
        ),
      ),
      capability(
        text("Access Control", "门禁控制", "کنترل دسترسی"),
        text(
          "Card, mobile and biometric access integrated with identity and facility workflows.",
          "将卡证、移动端和生物识别门禁与身份及设施流程集成。",
          "دسترسی کارتی، موبایلی و زیستی یکپارچه با هویت و فرآیندهای تأسیسات.",
        ),
      ),
      capability(
        text("Intrusion Alerting", "入侵告警", "هشدار نفوذ"),
        text(
          "Sensors and escalation workflows that deliver verified alarms to the right teams.",
          "通过传感器与升级流程，将经核实的告警及时送达相应团队。",
          "حسگرها و فرآیندهای تصعید برای رساندن هشدار تأییدشده به تیم مناسب.",
        ),
      ),
      capability(
        text("Identity Verification", "身份核验", "احراز هویت"),
        text(
          "Appropriate identity checks for restricted, sensitive and high-security areas.",
          "为受限、敏感和高安全区域提供适当的身份核验方式。",
          "بررسی هویت متناسب برای نواحی محدود، حساس و با امنیت بالا.",
        ),
      ),
      capability(
        text("Visitor Management", "访客管理", "مدیریت مراجعه‌کننده"),
        text(
          "A traceable journey from invitation and approval through badge issuance and departure.",
          "实现从邀请、审批到发证和离场的全流程可追溯。",
          "فرآیندی قابل رهگیری از دعوت و تأیید تا صدور کارت و خروج.",
        ),
      ),
      capability(
        text("Environmental Sensing", "环境感知", "حسگر محیطی"),
        text(
          "Air-quality, vaping and environmental signals connected to operational response.",
          "将空气质量、电子烟和环境信号接入运营响应流程。",
          "اتصال سیگنال‌های کیفیت هوا، ویپینگ و محیطی به پاسخ عملیاتی.",
        ),
      ),
    ],
    featuredCaseClient: "Danaher",
  },
];

const labels: Record<Locale, SolutionCategoryPageLabels> = {
  en: {
    overview: "Solution overview",
    capabilitiesEyebrow: "What we deliver",
    capabilitiesTitle: "Capabilities, end to end.",
    partnersEyebrow: "Technology partners",
    partnersTitle: "Built with the right stack.",
    caseEyebrow: "Representative experience",
    caseTitle: "Proven in demanding environments.",
    viewCase: "View case studies",
    ctaEyebrow: "Start a conversation",
    ctaTitle: "Bring us the environment you need to improve.",
    ctaDescription:
      "Share your locations, priorities and timeline. JOTO will help shape a practical next step.",
    ctaLabel: "Contact JOTO",
  },
  "zh-CN": {
    overview: "解决方案概览",
    capabilitiesEyebrow: "我们交付什么",
    capabilitiesTitle: "从规划到运营，能力贯穿全程。",
    partnersEyebrow: "技术合作伙伴",
    partnersTitle: "选择合适的技术组合。",
    caseEyebrow: "代表项目经验",
    caseTitle: "在复杂环境中经过验证。",
    viewCase: "查看客户案例",
    ctaEyebrow: "开始沟通",
    ctaTitle: "告诉我们，你希望改善什么。",
    ctaDescription: "分享地点、重点与时间计划，JOTO 将协助梳理切实可行的下一步。",
    ctaLabel: "联系 JOTO",
  },
  "fa-IR": {
    overview: "نمای کلی راهکار",
    capabilitiesEyebrow: "آنچه تحویل می‌دهیم",
    capabilitiesTitle: "توانمندی سرتاسری، از طراحی تا عملیات.",
    partnersEyebrow: "شرکای فناوری",
    partnersTitle: "ساخته‌شده با ترکیب درست فناوری.",
    caseEyebrow: "تجربه منتخب",
    caseTitle: "آزموده‌شده در محیط‌های پیچیده.",
    viewCase: "مشاهده مطالعات موردی",
    ctaEyebrow: "شروع گفتگو",
    ctaTitle: "محیطی را که باید بهبود یابد با ما در میان بگذارید.",
    ctaDescription:
      "مکان‌ها، اولویت‌ها و زمان‌بندی را بگویید تا JOTO گام عملی بعدی را مشخص کند.",
    ctaLabel: "تماس با JOTO",
  },
};

function normalizePathname(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
}

export function getSolutionCategoryDetail(
  pathname: string,
  locale: Locale,
): SolutionCategoryDetail | undefined {
  const source = sources.find((item) => item.pathname === normalizePathname(pathname));
  if (!source) return undefined;

  return {
    id: source.id,
    pathname: source.pathname,
    tagline: source.tagline[locale],
    summary: source.summary[locale],
    capabilities: source.capabilities.map((item) => ({
      title: item.title[locale],
      description: item.description[locale],
    })),
    featuredCaseClient: source.featuredCaseClient,
  };
}

export function getSolutionCategoryPageLabels(locale: Locale) {
  return labels[locale];
}

export const solutionCategoryPaths = sources.map((item) => item.pathname);
