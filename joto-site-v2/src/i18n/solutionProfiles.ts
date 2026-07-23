export interface LocalizedPartnerProfile {
  title: string;
  accent: string;
  introduction: string;
  relationshipTitle: string;
  serviceTitles: [string, string, string];
  ctaTitle: string;
  ctaDescription: string;
}

export const zhPartnerProfiles: Record<string, LocalizedPartnerProfile> = {
  "/solutions/network/extreme-networks": {
    title: "Extreme Networks 云驱动园区网络，",
    accent: "让复杂网络，更敏捷、更可控。",
    introduction:
      "面向大型园区、分支机构和分布式业务环境，JOTO 结合 Extreme Networks 的云端管理、网络 Fabric、交换与无线能力，帮助企业简化网络运营并提升整体可视性。",
    relationshipTitle: "用统一体验管理不断扩展的网络。",
    serviceTitles: ["网络体验与架构评估", "Fabric、交换与无线部署", "云端运营与持续优化"],
    ctaTitle: "让网络运营回归简单。",
    ctaDescription: "与 JOTO 讨论现网复杂度、云端管理、Fabric 或无线升级需求。",
  },
  "/solutions/network/aruba": {
    title: "Aruba 边缘到云网络，",
    accent: "让每一次接入，都安全、顺畅、可见。",
    introduction:
      "JOTO 以 Aruba Central、CX 交换和企业无线为基础，为园区、分支和混合办公环境构建统一接入、策略管理和用户体验保障能力。",
    relationshipTitle: "从用户接入出发，统一网络与策略。",
    serviceTitles: ["接入体验与 Central 架构", "CX 交换与 Wi-Fi 建设", "策略、体验与生命周期"],
    ctaTitle: "重新审视每一次网络接入。",
    ctaDescription: "与 JOTO 讨论 Aruba 园区、无线、分支或 Central 管理规划。",
  },
  "/solutions/network/sangfor": {
    title: "深信服安全组网，",
    accent: "连接每个分支，也统一安全与体验。",
    introduction:
      "面向跨区域办公、分支互联和关键应用访问，JOTO 将深信服的广域网、应用交付与安全网关能力统一规划，减少多站点网络的建设与运营复杂度。",
    relationshipTitle: "不把网络和安全拆成两套系统。",
    serviceTitles: ["分支与广域网规划", "SD-WAN 与应用交付", "链路与应用运营"],
    ctaTitle: "让每个分支都更容易连接和管理。",
    ctaDescription: "与 JOTO 讨论多站点网络、SD-WAN 或应用访问优化需求。",
  },
  "/solutions/security/knowbe4": {
    title: "KnowBe4 人因安全管理，",
    accent: "把安全意识，转化为可衡量的行为改变。",
    introduction:
      "JOTO 帮助企业建立持续的安全意识培训与模拟钓鱼机制，让员工风险从一次性培训项目转变为可追踪、可改进的日常安全管理过程。",
    relationshipTitle: "技术控制之外，也管理人的风险。",
    serviceTitles: ["人因风险基线与计划", "培训与模拟钓鱼运营", "风险报告与持续改进"],
    ctaTitle: "从一次培训，走向持续的人因风险管理。",
    ctaDescription: "与 JOTO 讨论安全意识现状、模拟钓鱼和年度运营计划。",
  },
  "/solutions/security/palo-alto-networks": {
    title: "Palo Alto Networks 云网端一体化防护，",
    accent: "让安全策略贯穿每一处业务边界。",
    introduction:
      "JOTO 围绕下一代防火墙、安全访问、云环境和安全运营，帮助企业统一策略、日志与响应流程，减少网络、云和用户之间的防护断点。",
    relationshipTitle: "把分散的安全控制连接成一套运营体系。",
    serviceTitles: ["下一代防火墙与策略体系", "安全访问与云环境集成", "日志、检测与运营优化"],
    ctaTitle: "找出安全体系中的下一个连接点。",
    ctaDescription: "与 JOTO 讨论防火墙、Prisma 安全访问、云安全或运营整合需求。",
  },
  "/solutions/security/fortinet": {
    title: "Fortinet 安全融合网络，",
    accent: "一套架构，统一网络与安全运营。",
    introduction:
      "JOTO 结合 FortiGate、安全 Fabric、Secure SD-WAN 与集中管理能力，为园区、分支和数据中心构建协同防护、统一策略和可持续运营的安全网络。",
    relationshipTitle: "让安全能力随着网络一起扩展。",
    serviceTitles: ["FortiGate 与安全 Fabric 架构", "安全 SD-WAN 与分支部署", "集中管理与安全运营"],
    ctaTitle: "用更少的管理边界覆盖更多站点。",
    ctaDescription: "与 JOTO 讨论 Fortinet 防火墙、分支、安全 Fabric 或集中运营建设。",
  },
  "/solutions/security/sangfor": {
    title: "深信服企业安全，",
    accent: "从边界防护到持续运营，形成安全闭环。",
    introduction:
      "JOTO 围绕互联网边界、应用访问、终端与安全运营，整合深信服安全能力，为企业建立适合本地业务环境的防护、检测和响应体系。",
    relationshipTitle: "让安全建设贴近真实业务和本地运营。",
    serviceTitles: ["风险梳理与 NGAF 规划", "边界、终端与平台集成", "策略与威胁运营"],
    ctaTitle: "从现有风险出发完善安全闭环。",
    ctaDescription: "与 JOTO 讨论深信服边界安全、终端防护或安全运营建设路径。",
  },
  "/solutions/security/check-point": {
    title: "Check Point 统一威胁防护，",
    accent: "让策略保持一致，让防护持续在线。",
    introduction:
      "JOTO 围绕 Check Point Quantum、CloudGuard 与 Harmony，为网络、云、用户和终端建立统一策略与持续威胁防护能力。",
    relationshipTitle: "用统一策略语言连接不同安全边界。",
    serviceTitles: ["Quantum 网关架构", "CloudGuard 与 Harmony 集成", "规则治理与威胁运营"],
    ctaTitle: "让每一条安全策略更清晰、更可控。",
    ctaDescription: "与 JOTO 讨论 Check Point 架构、迁移或统一策略治理。",
  },
  "/solutions/security/onelogin": {
    title: "OneLogin 统一身份访问，",
    accent: "在正确的时间，把正确权限交给正确的人。",
    introduction:
      "JOTO 将 OneLogin 单点登录、多因素认证、目录与账号生命周期管理结合起来，改善并治理云端和本地应用的访问体验。",
    relationshipTitle: "让身份成为访问控制的共同入口。",
    serviceTitles: ["身份与应用蓝图", "SSO、MFA 与连接器", "身份运营与支持"],
    ctaTitle: "从应用清单开始简化身份访问。",
    ctaDescription: "与 JOTO 讨论 SSO、MFA、目录集成或账号生命周期要求。",
  },
  "/solutions/server-storage/dell-technologies": {
    title: "Dell Technologies 数据中心基础设施，",
    accent: "为关键业务构建可扩展的算力与数据底座。",
    introduction:
      "JOTO 结合 Dell PowerEdge、企业存储与管理能力，为核心应用、虚拟化、边缘和数据密集型工作负载规划可靠、可扩展且易于运营的基础设施。",
    relationshipTitle: "把算力、存储和生命周期作为一个整体规划。",
    serviceTitles: ["工作负载与容量规划", "PowerEdge 与数据平台", "基础设施生命周期"],
    ctaTitle: "让基础设施为下一代工作负载做好准备。",
    ctaDescription: "与 JOTO 讨论 Dell 计算、存储、虚拟化或数据中心更新。",
  },
  "/solutions/server-storage/huawei": {
    title: "华为 OceanStor 数据基础设施，",
    accent: "让关键数据高效、可靠、易于管理。",
    introduction:
      "面向核心数据库、虚拟化和数据密集型业务，JOTO 围绕性能、可用性、数据保护和持续增长规划华为 OceanStor 存储环境。",
    relationshipTitle: "从业务数据需求反推存储架构。",
    serviceTitles: ["存储与数据保护规划", "OceanStor 部署与迁移", "容量、健康与生命周期"],
    ctaTitle: "别让数据增长变成基础设施压力。",
    ctaDescription: "与 JOTO 讨论华为存储、迁移、扩容或数据保护需求。",
  },
  "/solutions/server-storage/inspur": {
    title: "浪潮计算与存储，",
    accent: "释放高密算力与数据增长所需的基础设施潜力。",
    introduction:
      "JOTO 结合浪潮服务器、加速计算与企业存储，为业务系统、云平台、人工智能和高性能计算规划与工作负载匹配的算力和数据底座。",
    relationshipTitle: "让平台能力真正匹配工作负载。",
    serviceTitles: ["计算与平台规格规划", "服务器、集群与存储", "性能、容量与部件生命周期"],
    ctaTitle: "为真实工作负载选择正确的算力底座。",
    ctaDescription: "与 JOTO 讨论浪潮服务器、AI 算力、集群或存储基础设施。",
  },
  "/solutions/collaboration/audiocodes": {
    title: "AudioCodes 企业语音互联，",
    accent: "顺畅连接 Teams、运营商与现有语音系统。",
    introduction:
      "JOTO 通过 AudioCodes SBC、语音网关、Microsoft Teams 连接与管理能力，在云语音迁移中保障互操作性、安全性、通话质量和站点连续性。",
    relationshipTitle: "连接新平台，也保护既有语音投资。",
    serviceTitles: ["语音与云就绪评估", "SBC、网关与 Teams 集成", "通话质量与语音运营"],
    ctaTitle: "让云语音迁移更稳妥。",
    ctaDescription: "与 JOTO 讨论 Teams 语音、SBC、运营商互联或站点连续性。",
  },
  "/solutions/collaboration/vodia": {
    title: "Vodia 多租户 IP 通信，",
    accent: "用一套灵活平台承载企业与服务商语音。",
    introduction:
      "JOTO 帮助企业和服务提供商部署 Vodia IP PBX，将多租户、SIP 中继、号码、终端和管理能力组织成可扩展的通信平台。",
    relationshipTitle: "让多租户语音平台保持灵活且易于运营。",
    serviceTitles: ["租户、号码与容量规划", "PBX、SIP 与终端集成", "通话质量与租户运营"],
    ctaTitle: "规划更灵活的企业语音平台。",
    ctaDescription: "与 JOTO 讨论 Vodia 多租户、SIP 中继、终端或运营流程。",
  },
  "/solutions/collaboration/cyberdata": {
    title: "CyberData IP 对讲与广播，",
    accent: "让现场信息清晰、可定位、可响应。",
    introduction:
      "JOTO 为园区、工厂和设施规划 CyberData SIP 广播、对讲和告警终端，并将其接入语音、通知与网络基础设施。",
    relationshipTitle: "把关键声音送到正确区域和终端。",
    serviceTitles: ["广播分区与覆盖规划", "SIP 终端与系统集成", "终端健康与现场支持"],
    ctaTitle: "让每一条现场信息都被及时听见。",
    ctaDescription: "与 JOTO 讨论 SIP 广播、对讲、分区覆盖或通知集成。",
  },
  "/solutions/collaboration/informacast": {
    title: "InformaCast 关键事件通知，",
    accent: "在分秒必争时，把消息送到正确的人。",
    introduction:
      "JOTO 帮助组织建设 InformaCast 大规模通知能力，通过音频、短信、桌面和移动渠道统一触达不同人员和场所。",
    relationshipTitle: "把事件流程、受众与通知渠道连接起来。",
    serviceTitles: ["事件与受众规划", "平台、渠道与系统集成", "演练、报告与持续运营"],
    ctaTitle: "让关键通知真正抵达。",
    ctaDescription: "与 JOTO 讨论应急场景、通知渠道、受众分组或演练计划。",
  },
  "/solutions/safeguarding/verkada": {
    title: "Verkada 云管理物理安防，",
    accent: "把视频、门禁与环境信息汇聚到一个视图。",
    introduction:
      "JOTO 将 Verkada 混合云平台应用于视频、门禁、传感器、对讲和站点运营，帮助企业统一查看、管理和响应物理安全事件。",
    relationshipTitle: "用一个平台连接不同场所的安防上下文。",
    serviceTitles: ["站点、视频与留存规划", "设备、身份与系统集成", "云端运营与告警优化"],
    ctaTitle: "让物理安防更集中、更可见。",
    ctaDescription: "与 JOTO 讨论 Verkada 视频、门禁、传感器或多站点管理。",
  },
  "/solutions/safeguarding/hikvision": {
    title: "海康威视智能物理安防，",
    accent: "把现场可视性转化为可管理的防护能力。",
    introduction:
      "JOTO 为办公场所、园区和运营站点设计并集成海康威视视频监控、录像、门禁与对讲系统。",
    relationshipTitle: "把覆盖、存储、分析与现场运营统一规划。",
    serviceTitles: ["覆盖、分析与留存设计", "视频、门禁与平台实施", "设备、存储与策略运营"],
    ctaTitle: "从现场风险出发完善安防体系。",
    ctaDescription: "与 JOTO 讨论视频覆盖、存储留存、门禁或平台集成。",
  },
  "/solutions/safeguarding/keyking": {
    title: "Keyking 门禁与集成安防，",
    accent: "让每一次通行都经过授权、记录并可追溯。",
    introduction:
      "JOTO 部署 Keyking 门禁控制器、读卡器、凭证与集成管理能力，为办公楼、园区和设施建立清晰的人员与门点访问控制。",
    relationshipTitle: "把门、人员、凭证和事件纳入同一管理流程。",
    serviceTitles: ["门点、凭证与权限规划", "控制器、读卡器与平台集成", "事件、用户与设备运维"],
    ctaTitle: "让每一道门都更清楚地被管理。",
    ctaDescription: "与 JOTO 讨论 Keyking 门禁、权限、凭证或楼宇系统集成。",
  },
};

export const faPartnerProfiles: Record<string, LocalizedPartnerProfile> = {
  "/solutions/network/extreme-networks": {
    title: "شبکه پردیس ابری Extreme Networks،",
    accent: "شبکه‌های پیچیده را چابک‌تر و قابل‌کنترل‌تر کنید.",
    introduction:
      "JOTO با ترکیب مدیریت ابری، فابریک شبکه، سوئیچینگ و بی‌سیم Extreme Networks، عملیات شبکه را در پردیس‌ها، شعب و محیط‌های توزیع‌شده ساده و شفاف می‌کند.",
    relationshipTitle: "شبکه در حال رشد را با یک تجربه مدیریتی یکپارچه اداره کنید.",
    serviceTitles: ["ارزیابی تجربه و معماری شبکه", "استقرار فابریک، سوئیچینگ و بی‌سیم", "عملیات ابری و بهینه‌سازی مستمر"],
    ctaTitle: "عملیات شبکه را ساده‌تر کنید.",
    ctaDescription: "درباره پیچیدگی شبکه، مدیریت ابری، فابریک یا ارتقای بی‌سیم با JOTO گفت‌وگو کنید.",
  },
  "/solutions/network/aruba": {
    title: "شبکه لبه تا ابر Aruba،",
    accent: "هر اتصال را امن، روان و قابل‌مشاهده کنید.",
    introduction:
      "JOTO با Aruba Central، سوئیچ‌های CX و شبکه بی‌سیم سازمانی، دسترسی یکپارچه و مدیریت سیاست را برای پردیس‌ها، شعب و محیط‌های کاری ترکیبی فراهم می‌کند.",
    relationshipTitle: "شبکه و سیاست را حول تجربه اتصال کاربر یکپارچه کنید.",
    serviceTitles: ["تجربه دسترسی و معماری Central", "سوئیچینگ CX و Wi-Fi", "سیاست، تجربه و چرخه عمر"],
    ctaTitle: "هر اتصال شبکه را دوباره ارزیابی کنید.",
    ctaDescription: "درباره پردیس، بی‌سیم، شعب یا مدیریت Aruba Central با JOTO گفت‌وگو کنید.",
  },
  "/solutions/network/sangfor": {
    title: "شبکه امن Sangfor،",
    accent: "همه شعب را با امنیت و تجربه‌ای یکپارچه متصل کنید.",
    introduction:
      "JOTO قابلیت‌های WAN، تحویل برنامه و دروازه امن Sangfor را برای دفاتر منطقه‌ای و دسترسی به برنامه‌های حیاتی یکپارچه برنامه‌ریزی می‌کند.",
    relationshipTitle: "شبکه و امنیت را به دو سامانه جداگانه تبدیل نکنید.",
    serviceTitles: ["برنامه‌ریزی شعب و WAN", "SD-WAN و تحویل برنامه", "عملیات لینک و برنامه"],
    ctaTitle: "اتصال و مدیریت هر شعبه را آسان‌تر کنید.",
    ctaDescription: "درباره شبکه چندسایتی، SD-WAN یا بهینه‌سازی دسترسی برنامه با JOTO گفت‌وگو کنید.",
  },
  "/solutions/security/knowbe4": {
    title: "مدیریت ریسک انسانی KnowBe4،",
    accent: "آگاهی امنیتی را به تغییر رفتاری قابل‌اندازه‌گیری تبدیل کنید.",
    introduction:
      "JOTO برنامه‌های مستمر آموزش آگاهی امنیتی و شبیه‌سازی فیشینگ را پیاده می‌کند تا ریسک کارکنان به فرایندی قابل‌پیگیری و قابل‌بهبود تبدیل شود.",
    relationshipTitle: "در کنار کنترل‌های فنی، ریسک انسانی را نیز مدیریت کنید.",
    serviceTitles: ["خط مبنا و برنامه ریسک انسانی", "عملیات آموزش و شبیه‌سازی فیشینگ", "گزارش ریسک و بهبود مستمر"],
    ctaTitle: "از آموزش مقطعی به مدیریت مستمر ریسک انسانی بروید.",
    ctaDescription: "درباره وضعیت آگاهی، فیشینگ شبیه‌سازی‌شده و برنامه سالانه با JOTO گفت‌وگو کنید.",
  },
  "/solutions/security/palo-alto-networks": {
    title: "حفاظت یکپارچه Palo Alto Networks،",
    accent: "سیاست امنیتی را در تمام مرزهای کسب‌وکار یکسان نگه دارید.",
    introduction:
      "JOTO دیواره آتش نسل جدید، دسترسی امن، محیط ابری و عملیات امنیت را برای یکپارچگی سیاست، لاگ و پاسخ به رخداد به هم متصل می‌کند.",
    relationshipTitle: "کنترل‌های پراکنده را به یک مدل عملیاتی امنیت تبدیل کنید.",
    serviceTitles: ["معماری NGFW و سیاست", "دسترسی امن و یکپارچه‌سازی ابر", "تشخیص و بهینه‌سازی عملیات"],
    ctaTitle: "نقطه اتصال بعدی در معماری امنیت را پیدا کنید.",
    ctaDescription: "درباره دیواره آتش، Prisma، امنیت ابر یا یکپارچه‌سازی عملیات با JOTO گفت‌وگو کنید.",
  },
  "/solutions/security/fortinet": {
    title: "شبکه مبتنی بر امنیت Fortinet،",
    accent: "شبکه و عملیات امنیت را در یک معماری یکپارچه کنید.",
    introduction:
      "JOTO با FortiGate، Security Fabric، Secure SD-WAN و مدیریت متمرکز، حفاظت هماهنگ و سیاست یکپارچه را در پردیس، شعب و مراکز داده ایجاد می‌کند.",
    relationshipTitle: "اجازه دهید امنیت همراه با شبکه مقیاس پیدا کند.",
    serviceTitles: ["معماری FortiGate و Security Fabric", "Secure SD-WAN و شعب", "مدیریت متمرکز و عملیات امنیت"],
    ctaTitle: "سایت‌های بیشتری را با مرزهای مدیریتی کمتر پوشش دهید.",
    ctaDescription: "درباره Fortinet، شعب، Security Fabric یا عملیات متمرکز با JOTO گفت‌وگو کنید.",
  },
  "/solutions/security/sangfor": {
    title: "امنیت سازمانی Sangfor،",
    accent: "از پیشگیری تا عملیات، یک چرخه امنیت کامل بسازید.",
    introduction:
      "JOTO قابلیت‌های Sangfor را در لبه اینترنت، دسترسی برنامه، نقاط پایانی و عملیات امنیت یکپارچه می‌کند تا مدل پیشگیری، تشخیص و پاسخ متناسب با محیط محلی شکل گیرد.",
    relationshipTitle: "امنیت را با واقعیت کسب‌وکار و عملیات محلی هماهنگ کنید.",
    serviceTitles: ["ارزیابی ریسک و برنامه‌ریزی NGAF", "یکپارچه‌سازی لبه، نقطه پایانی و پلتفرم", "سیاست و عملیات تهدید"],
    ctaTitle: "چرخه امنیت را از ریسک‌های امروز تقویت کنید.",
    ctaDescription: "درباره امنیت لبه Sangfor، نقاط پایانی یا نقشه راه عملیات امنیت با JOTO گفت‌وگو کنید.",
  },
  "/solutions/security/check-point": {
    title: "پیشگیری یکپارچه تهدید Check Point،",
    accent: "سیاست را منسجم و حفاظت را پیوسته نگه دارید.",
    introduction:
      "JOTO با Quantum، CloudGuard و Harmony سیاست و پیشگیری تهدید را در شبکه، ابر، کاربران و نقاط پایانی یکپارچه می‌کند.",
    relationshipTitle: "در مرزهای مختلف امنیت از یک زبان سیاست استفاده کنید.",
    serviceTitles: ["معماری دروازه Quantum", "یکپارچه‌سازی CloudGuard و Harmony", "حاکمیت قوانین و عملیات تهدید"],
    ctaTitle: "هر قانون امنیتی را روشن‌تر و قابل‌کنترل‌تر کنید.",
    ctaDescription: "درباره معماری، مهاجرت یا حاکمیت سیاست Check Point با JOTO گفت‌وگو کنید.",
  },
  "/solutions/security/onelogin": {
    title: "دسترسی هویتی یکپارچه OneLogin،",
    accent: "دسترسی درست را در زمان درست به فرد درست بدهید.",
    introduction:
      "JOTO ورود یکپارچه، احراز هویت چندعاملی، دایرکتوری و چرخه عمر حساب OneLogin را برای دسترسی بهتر به برنامه‌های ابری و محلی پیاده می‌کند.",
    relationshipTitle: "هویت را به ورودی مشترک کنترل دسترسی تبدیل کنید.",
    serviceTitles: ["نقشه هویت و برنامه‌ها", "SSO، MFA و اتصال‌دهنده‌ها", "عملیات هویت و پشتیبانی"],
    ctaTitle: "ساده‌سازی دسترسی هویتی را از فهرست برنامه‌ها آغاز کنید.",
    ctaDescription: "درباره SSO، MFA، دایرکتوری یا چرخه عمر حساب با JOTO گفت‌وگو کنید.",
  },
  "/solutions/server-storage/dell-technologies": {
    title: "زیرساخت مرکز داده Dell Technologies،",
    accent: "پایه پردازش و داده مقیاس‌پذیر برای کارهای حیاتی بسازید.",
    introduction:
      "JOTO با PowerEdge، ذخیره‌سازی سازمانی و مدیریت Dell، زیرساختی قابل‌اعتماد و عملیاتی برای برنامه‌های اصلی، مجازی‌سازی، لبه و بارهای داده‌محور طراحی می‌کند.",
    relationshipTitle: "پردازش، ذخیره‌سازی و چرخه عمر را یک سامانه واحد ببینید.",
    serviceTitles: ["برنامه‌ریزی بار کاری و ظرفیت", "PowerEdge و پلتفرم‌های داده", "چرخه عمر زیرساخت"],
    ctaTitle: "زیرساخت را برای نسل بعدی بارهای کاری آماده کنید.",
    ctaDescription: "درباره پردازش، ذخیره‌سازی، مجازی‌سازی یا نوسازی مرکز داده Dell با JOTO گفت‌وگو کنید.",
  },
  "/solutions/server-storage/huawei": {
    title: "زیرساخت داده Huawei OceanStor،",
    accent: "داده حیاتی را کارآمد، تاب‌آور و قابل‌مدیریت نگه دارید.",
    introduction:
      "JOTO معماری OceanStor را برای پایگاه‌های داده اصلی، مجازی‌سازی و خدمات داده‌محور بر اساس عملکرد، دسترس‌پذیری، حفاظت و رشد طراحی می‌کند.",
    relationshipTitle: "معماری ذخیره‌سازی را از نیاز واقعی داده کسب‌وکار آغاز کنید.",
    serviceTitles: ["ذخیره‌سازی و حفاظت از داده", "استقرار و مهاجرت OceanStor", "ظرفیت، سلامت و چرخه عمر"],
    ctaTitle: "اجازه ندهید رشد داده به فشار زیرساخت تبدیل شود.",
    ctaDescription: "درباره ذخیره‌سازی Huawei، مهاجرت، توسعه یا حفاظت داده با JOTO گفت‌وگو کنید.",
  },
  "/solutions/server-storage/inspur": {
    title: "پردازش و ذخیره‌سازی Inspur،",
    accent: "توان زیرساخت را برای پردازش متراکم و رشد داده آزاد کنید.",
    introduction:
      "JOTO سرورها، پردازش شتاب‌یافته و ذخیره‌سازی Inspur را برای سامانه‌های سازمانی، ابر، هوش مصنوعی و پردازش پربازده با بار کاری هماهنگ می‌کند.",
    relationshipTitle: "قابلیت پلتفرم را در عمل با بار کاری منطبق کنید.",
    serviceTitles: ["اندازه‌گذاری پردازش و پلتفرم", "سرورها، کلاسترها و ذخیره‌سازی", "عملکرد، ظرفیت و قطعات"],
    ctaTitle: "پایه پردازشی مناسب را برای بار کاری واقعی انتخاب کنید.",
    ctaDescription: "درباره سرورهای Inspur، پردازش AI، کلاستر یا ذخیره‌سازی با JOTO گفت‌وگو کنید.",
  },
  "/solutions/collaboration/audiocodes": {
    title: "اتصال صوت سازمانی AudioCodes،",
    accent: "Teams، اپراتورها و سامانه صوتی موجود را روان متصل کنید.",
    introduction:
      "JOTO با SBC، دروازه صوتی و اتصال Microsoft Teams از AudioCodes، سازگاری، امنیت، کیفیت تماس و تداوم سایت را در مهاجرت صوت ابری حفظ می‌کند.",
    relationshipTitle: "پلتفرم جدید را متصل و سرمایه‌گذاری صوتی موجود را حفظ کنید.",
    serviceTitles: ["آمادگی صوت و ابر", "SBC، دروازه و یکپارچه‌سازی Teams", "کیفیت تماس و عملیات صوت"],
    ctaTitle: "مهاجرت صوت ابری را مطمئن‌تر کنید.",
    ctaDescription: "درباره Teams Voice، SBC، اتصال اپراتور یا تداوم سایت با JOTO گفت‌وگو کنید.",
  },
  "/solutions/collaboration/vodia": {
    title: "ارتباطات IP چندمستاجری Vodia،",
    accent: "صوت سازمانی و سرویس‌دهنده را روی یک پلتفرم منعطف اجرا کنید.",
    introduction:
      "JOTO به سازمان‌ها و سرویس‌دهندگان کمک می‌کند Vodia IP PBX را با مستاجرها، ترانک SIP، شماره‌ها، پایانه‌ها و مدیریت مقیاس‌پذیر پیاده کنند.",
    relationshipTitle: "پلتفرم صوت چندمستاجری را منعطف و عملیاتی نگه دارید.",
    serviceTitles: ["برنامه‌ریزی مستاجر، شماره و ظرفیت", "PBX، SIP و یکپارچه‌سازی پایانه", "کیفیت تماس و عملیات مستاجر"],
    ctaTitle: "یک پلتفرم صوت سازمانی منعطف‌تر طراحی کنید.",
    ctaDescription: "درباره Vodia، چندمستاجری، ترانک SIP یا عملیات صوت با JOTO گفت‌وگو کنید.",
  },
  "/solutions/collaboration/cyberdata": {
    title: "اینترکام و پیجینگ IP از CyberData،",
    accent: "پیام‌های محل را شفاف، قابل‌مکان‌یابی و قابل‌اقدام کنید.",
    introduction:
      "JOTO پیجینگ SIP، اینترکام و پایانه‌های اعلان CyberData را برای پردیس، کارخانه و تأسیسات طراحی و با زیرساخت صوت، اعلان و شبکه یکپارچه می‌کند.",
    relationshipTitle: "صدای حیاتی را به منطقه و پایانه درست برسانید.",
    serviceTitles: ["طراحی مناطق پیجینگ و پوشش", "پایانه SIP و یکپارچه‌سازی سامانه", "سلامت پایانه و پشتیبانی محل"],
    ctaTitle: "مطمئن شوید هر پیام محل به‌موقع شنیده می‌شود.",
    ctaDescription: "درباره پیجینگ SIP، اینترکام، پوشش یا اعلان یکپارچه با JOTO گفت‌وگو کنید.",
  },
  "/solutions/collaboration/informacast": {
    title: "اعلان رویدادهای حیاتی InformaCast،",
    accent: "وقتی هر ثانیه مهم است، پیام را به فرد درست برسانید.",
    introduction:
      "JOTO اعلان انبوه InformaCast را برای رساندن هشدار از طریق صوت، پیام، دسکتاپ و موبایل به افراد و مکان‌های مختلف پیاده می‌کند.",
    relationshipTitle: "فرایند رویداد، مخاطبان و کانال‌های اعلان را به هم متصل کنید.",
    serviceTitles: ["برنامه‌ریزی رویداد و مخاطب", "یکپارچه‌سازی پلتفرم، کانال و سامانه", "مانور، گزارش و عملیات مستمر"],
    ctaTitle: "اطمینان پیدا کنید اعلان حیاتی واقعاً می‌رسد.",
    ctaDescription: "درباره سناریوهای اضطراری، کانال‌ها، گروه مخاطب یا مانورها با JOTO گفت‌وگو کنید.",
  },
  "/solutions/safeguarding/verkada": {
    title: "امنیت فیزیکی ابری Verkada،",
    accent: "ویدئو، دسترسی و اطلاعات محیطی را در یک نما جمع کنید.",
    introduction:
      "JOTO پلتفرم ترکیبی‌ابری Verkada را برای ویدئو، کنترل دسترسی، حسگر، اینترکام و عملیات سایت به یک محیط مدیریتی واحد تبدیل می‌کند.",
    relationshipTitle: "زمینه امنیتی سایت‌های مختلف را روی یک پلتفرم به هم متصل کنید.",
    serviceTitles: ["برنامه‌ریزی سایت، ویدئو و نگهداری", "یکپارچه‌سازی تجهیزات، هویت و سامانه", "عملیات ابری و بهینه‌سازی هشدار"],
    ctaTitle: "امنیت فیزیکی را متمرکزتر و قابل‌مشاهده‌تر کنید.",
    ctaDescription: "درباره ویدئو، دسترسی، حسگر یا مدیریت چندسایتی Verkada با JOTO گفت‌وگو کنید.",
  },
  "/solutions/safeguarding/hikvision": {
    title: "امنیت فیزیکی هوشمند Hikvision،",
    accent: "دیدپذیری محل را به حفاظتی قابل‌مدیریت تبدیل کنید.",
    introduction:
      "JOTO سامانه‌های ویدئویی، ضبط، کنترل دسترسی و اینترکام Hikvision را برای محیط کار، پردیس و سایت‌های عملیاتی طراحی و یکپارچه می‌کند.",
    relationshipTitle: "پوشش، ذخیره‌سازی، تحلیل و عملیات محل را یکجا برنامه‌ریزی کنید.",
    serviceTitles: ["طراحی پوشش، تحلیل و نگهداری", "اجرای ویدئو، دسترسی و پلتفرم", "عملیات تجهیزات، ذخیره‌سازی و سیاست"],
    ctaTitle: "سامانه حفاظت را از ریسک واقعی محل تکمیل کنید.",
    ctaDescription: "درباره پوشش ویدئویی، نگهداری، کنترل دسترسی یا یکپارچه‌سازی با JOTO گفت‌وگو کنید.",
  },
  "/solutions/safeguarding/keyking": {
    title: "کنترل دسترسی و امنیت یکپارچه Keyking،",
    accent: "هر ورود را مجاز، ثبت‌شده و قابل‌ردیابی کنید.",
    introduction:
      "JOTO کنترلر، کارت‌خوان، اعتبارنامه و مدیریت یکپارچه Keyking را برای کنترل روشن دسترسی افراد و درها در دفاتر، پردیس‌ها و تأسیسات پیاده می‌کند.",
    relationshipTitle: "درها، افراد، اعتبارنامه‌ها و رویدادها را در یک فرایند مدیریت کنید.",
    serviceTitles: ["برنامه‌ریزی در، اعتبارنامه و مجوز", "یکپارچه‌سازی کنترلر، کارت‌خوان و پلتفرم", "عملیات رویداد، کاربر و تجهیزات"],
    ctaTitle: "مدیریت هر در را روشن‌تر و قابل‌کنترل‌تر کنید.",
    ctaDescription: "درباره کنترل دسترسی، مجوز، اعتبارنامه یا یکپارچه‌سازی ساختمان با JOTO گفت‌وگو کنید.",
  },
};
