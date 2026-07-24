import type { Locale } from "../i18n/routing";
import operationsImage from "../assets/blog/china-operations.jpg";
import safeguardingImage from "../assets/blog/connected-safeguarding.jpg";
import campusImage from "../assets/blog/five-campus.jpg";
import rolloutImage from "../assets/blog/multi-site-rollout.jpg";
import networkImage from "../assets/blog/network-growth.jpg";
import securityImage from "../assets/blog/security-response.jpg";
import { blogArticleExpansions } from "./blogExpansions";

export type BlogBodyBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export interface BlogArticleTranslation {
  category: string;
  title: string;
  excerpt: string;
  imageAlt: string;
  dateLabel: string;
  readingTime: string;
  body: BlogBodyBlock[];
}

export interface BlogArticle {
  slug: string;
  publishedAt: string;
  featured: boolean;
  image: string;
  translations: Record<Locale, BlogArticleTranslation>;
}

export interface BlogPageCopy {
  eyebrow: string;
  title: string;
  description: string;
  featured: string;
  latest: string;
  readArticle: string;
  backToInsights: string;
  related: string;
  viewpointLabel: string;
  notFoundEyebrow: string;
  notFoundTitle: string;
  notFoundDescription: string;
}

export const blogPageCopy: Record<Locale, BlogPageCopy> = {
  en: {
    eyebrow: "JOTO TECH / INSIGHTS",
    title: "Enterprise insights.",
    description:
      "Field notes on networks, security, operations and delivery — drawn from the environments JOTO plans, builds and supports.",
    featured: "FEATURED INSIGHT",
    latest: "LATEST ARTICLES",
    readArticle: "Read article",
    backToInsights: "Back to insights",
    related: "Related insights",
    viewpointLabel: "JOTO VIEWPOINT · CLOSING NOTE",
    notFoundEyebrow: "JOTO TECH / 404",
    notFoundTitle: "Article not found.",
    notFoundDescription:
      "The article may have moved or the address may be incomplete. Return to Insights to continue reading.",
  },
  "zh-CN": {
    eyebrow: "JOTO TECH / 最新资讯",
    title: "企业实践洞察。",
    description:
      "来自 JOTO 真实项目与运维环境的网络、安全、运营和交付观察。",
    featured: "重点资讯",
    latest: "最新文章",
    readArticle: "阅读文章",
    backToInsights: "返回最新资讯",
    related: "相关资讯",
    viewpointLabel: "JOTO 观点 · 文章结语",
    notFoundEyebrow: "JOTO TECH / 404",
    notFoundTitle: "未找到这篇文章。",
    notFoundDescription: "文章可能已移动，或地址不完整。请返回最新资讯继续阅读。",
  },
  "fa-IR": {
    eyebrow: "JOTO TECH / دیدگاه‌ها",
    title: "دیدگاه‌های سازمانی.",
    description:
      "یادداشت‌هایی درباره شبکه، امنیت، عملیات و تحویل از محیط‌هایی که JOTO طراحی و پشتیبانی می‌کند.",
    featured: "دیدگاه منتخب",
    latest: "تازه‌ترین مقاله‌ها",
    readArticle: "مطالعه مقاله",
    backToInsights: "بازگشت به دیدگاه‌ها",
    related: "مطالب مرتبط",
    viewpointLabel: "دیدگاه جوتو · جمع‌بندی",
    notFoundEyebrow: "JOTO TECH / 404",
    notFoundTitle: "مقاله پیدا نشد.",
    notFoundDescription:
      "ممکن است مقاله جابه‌جا شده باشد یا نشانی کامل نباشد. برای ادامه مطالعه به صفحه دیدگاه‌ها بازگردید.",
  },
};

const baseBlogArticles: BlogArticle[] = [
  {
    slug: "enterprise-network-growth",
    publishedAt: "2026-07-22",
    featured: true,
    image: networkImage,
    translations: {
      en: {
        category: "NETWORK",
        title: "Building an Enterprise Network That Can Grow With the Business",
        excerpt:
          "A resilient network starts with business priorities, site realities and operating responsibilities — not a hardware list.",
        imageAlt: "Enterprise network infrastructure in a modern technical environment",
        dateLabel: "22 July 2026",
        readingTime: "8 min read",
        body: [
          {
            type: "paragraph",
            text: "Enterprise networks rarely fail because a single device was specified incorrectly. More often, growth exposes decisions that were made site by site: inconsistent standards, unclear ownership, limited visibility and no common method for change.",
          },
          { type: "heading", text: "Start with the operating model" },
          {
            type: "paragraph",
            text: "Before selecting platforms, define who uses the network, which services are critical, how sites connect, where support comes from and what must happen when a link or device becomes unavailable.",
          },
          {
            type: "list",
            items: [
              "Map users, applications, sites and traffic dependencies.",
              "Set availability and recovery expectations by business service.",
              "Define standards for access, segmentation, monitoring and change.",
              "Plan capacity around realistic growth rather than current load alone.",
            ],
          },
          { type: "heading", text: "Design for operations, not only launch" },
          {
            type: "paragraph",
            text: "A design is only complete when the team can monitor it, document it and support it after go-live. Consistent naming, configuration baselines, lifecycle records and escalation paths make expansion safer and daily operations calmer.",
          },
          {
            type: "quote",
            text: "The most scalable network is the one that remains understandable when new sites, users and services arrive.",
          },
        ],
      },
      "zh-CN": {
        category: "企业网络",
        title: "构建能够随业务增长的企业网络",
        excerpt: "可靠的网络应从业务优先级、站点现实和运维责任出发，而不是从设备清单出发。",
        imageAlt: "现代技术环境中的企业网络基础设施",
        dateLabel: "2026 年 7 月 22 日",
        readingTime: "阅读约 8 分钟",
        body: [
          {
            type: "paragraph",
            text: "企业网络出现问题，往往不是某一台设备选错了，而是业务增长放大了过去按站点分别决策留下的差异：标准不统一、责任不清晰、可见性不足，也缺少一致的变更方法。",
          },
          { type: "heading", text: "先明确网络如何被使用和管理" },
          {
            type: "paragraph",
            text: "在选择平台之前，应先梳理谁在使用网络、哪些业务最关键、站点如何互联、支持来自哪里，以及链路或设备不可用时需要怎样恢复。",
          },
          {
            type: "list",
            items: [
              "梳理用户、应用、站点与流量依赖关系。",
              "按业务服务设定可用性与恢复目标。",
              "统一接入、分区、监控与变更标准。",
              "根据真实增长规划容量，而不只看当前负载。",
            ],
          },
          { type: "heading", text: "为长期运维设计，而不只为上线设计" },
          {
            type: "paragraph",
            text: "当团队能够持续监控、记录和支持网络时，设计才算完整。统一的命名、配置基线、生命周期记录和升级路径，可以让后续扩展更安全，也让日常运维更从容。",
          },
          {
            type: "quote",
            text: "真正可扩展的网络，是在新站点、新用户和新服务加入后，仍然清晰、可控、可维护的网络。",
          },
        ],
      },
      "fa-IR": {
        category: "شبکه سازمانی",
        title: "ساخت شبکه‌ای سازمانی که همراه کسب‌وکار رشد کند",
        excerpt:
          "شبکه پایدار از اولویت‌های کسب‌وکار، واقعیت سایت‌ها و مسئولیت‌های عملیاتی آغاز می‌شود، نه از فهرست تجهیزات.",
        imageAlt: "زیرساخت شبکه سازمانی در یک محیط فنی مدرن",
        dateLabel: "۲۲ ژوئیه ۲۰۲۶",
        readingTime: "۸ دقیقه مطالعه",
        body: [
          {
            type: "paragraph",
            text: "مشکل شبکه‌های سازمانی معمولاً از انتخاب اشتباه یک دستگاه آغاز نمی‌شود. رشد کسب‌وکار تصمیم‌های پراکنده هر سایت را آشکار می‌کند: استانداردهای متفاوت، مالکیت نامشخص، دید محدود و نبود روشی مشترک برای تغییر.",
          },
          { type: "heading", text: "از مدل عملیاتی شروع کنید" },
          {
            type: "paragraph",
            text: "پیش از انتخاب پلتفرم باید مشخص شود چه کسانی از شبکه استفاده می‌کنند، کدام سرویس‌ها حیاتی‌اند، سایت‌ها چگونه متصل می‌شوند و در زمان اختلال چه کسی مسئول بازیابی است.",
          },
          {
            type: "list",
            items: [
              "کاربران، برنامه‌ها، سایت‌ها و وابستگی‌های ترافیکی را ترسیم کنید.",
              "برای هر سرویس کسب‌وکار هدف دسترس‌پذیری و بازیابی تعیین کنید.",
              "استانداردهای دسترسی، بخش‌بندی، پایش و تغییر را یکپارچه کنید.",
              "ظرفیت را بر پایه رشد واقعی برنامه‌ریزی کنید، نه فقط بار امروز.",
            ],
          },
          { type: "heading", text: "برای عملیات طراحی کنید، نه فقط راه‌اندازی" },
          {
            type: "paragraph",
            text: "طراحی زمانی کامل است که تیم پس از راه‌اندازی بتواند شبکه را پایش، مستند و پشتیبانی کند. نام‌گذاری منظم، خط مبنای پیکربندی و مسیر روشن ارجاع، توسعه آینده را ایمن‌تر می‌کند.",
          },
          {
            type: "quote",
            text: "مقیاس‌پذیرترین شبکه، شبکه‌ای است که با ورود سایت‌ها، کاربران و سرویس‌های جدید همچنان قابل فهم بماند.",
          },
        ],
      },
    },
  },
  {
    slug: "multi-site-network-rollout",
    publishedAt: "2026-07-18",
    featured: false,
    image: rolloutImage,
    translations: {
      en: {
        category: "DELIVERY",
        title: "What a Reliable Multi-site Network Rollout Really Requires",
        excerpt:
          "Repeatable standards matter, but every location still needs disciplined discovery, local coordination and evidence-based acceptance.",
        imageAlt: "Engineers coordinating enterprise technology deployment",
        dateLabel: "18 July 2026",
        readingTime: "8 min read",
        body: [
          {
            type: "paragraph",
            text: "A multi-site rollout looks repetitive on a project plan, yet each location has different cabling, access rules, power, construction timing and local stakeholders. Reliable delivery combines a common standard with a controlled way to handle those differences.",
          },
          { type: "heading", text: "Standardise the decisions that should not vary" },
          {
            type: "paragraph",
            text: "Architecture, configuration templates, naming, documentation and acceptance criteria should be defined once. Site discovery then identifies the exceptions before they become installation delays.",
          },
          {
            type: "list",
            items: [
              "Confirm drawings, racks, power, cabling and carrier handoffs.",
              "Stage and validate configurations before equipment reaches site.",
              "Coordinate access, installation windows and local safety requirements.",
              "Capture test evidence, as-built records and unresolved items at handover.",
            ],
          },
          { type: "heading", text: "Treat handover as part of delivery" },
          {
            type: "paragraph",
            text: "A site is not complete when equipment powers on. Operations teams need current diagrams, asset records, support contacts, backups and a clear list of accepted exceptions.",
          },
          {
            type: "quote",
            text: "Consistency comes from a repeatable delivery system, not from pretending every site is identical.",
          },
        ],
      },
      "zh-CN": {
        category: "项目交付",
        title: "多站点网络部署真正需要协调什么",
        excerpt: "统一标准很重要，但每个站点仍需要严谨勘察、本地协调和以证据为基础的验收。",
        imageAlt: "工程师协同开展企业技术部署",
        dateLabel: "2026 年 7 月 18 日",
        readingTime: "阅读约 8 分钟",
        body: [
          {
            type: "paragraph",
            text: "多站点部署在项目表里看起来高度重复，但每个地点的布线、进场规则、供电、施工时间和本地协同对象都不同。可靠交付需要统一标准，也需要一套受控的方法处理这些差异。",
          },
          { type: "heading", text: "统一那些不应随站点变化的决策" },
          {
            type: "paragraph",
            text: "架构、配置模板、命名、文档和验收标准应一次定义清楚，再通过站点勘察提前识别例外，避免问题在安装阶段集中暴露。",
          },
          {
            type: "list",
            items: [
              "确认图纸、机柜、供电、布线和运营商交接条件。",
              "设备到场前完成配置预置和验证。",
              "协调进场权限、安装窗口和现场安全要求。",
              "在移交时保留测试证据、竣工记录和未决事项。",
            ],
          },
          { type: "heading", text: "把运维移交视为交付的一部分" },
          {
            type: "paragraph",
            text: "设备通电不代表站点已经完成。运维团队还需要最新拓扑、资产记录、支持联系人、配置备份，以及已经接受的例外清单。",
          },
          {
            type: "quote",
            text: "一致性来自可重复的交付体系，而不是假设所有站点完全相同。",
          },
        ],
      },
      "fa-IR": {
        category: "تحویل پروژه",
        title: "استقرار مطمئن شبکه در چند سایت واقعاً به چه نیاز دارد",
        excerpt:
          "استانداردهای تکرارپذیر مهم‌اند، اما هر محل همچنان به بررسی دقیق، هماهنگی محلی و پذیرش مبتنی بر مدرک نیاز دارد.",
        imageAlt: "هماهنگی مهندسان برای استقرار فناوری سازمانی",
        dateLabel: "۱۸ ژوئیه ۲۰۲۶",
        readingTime: "۸ دقیقه مطالعه",
        body: [
          {
            type: "paragraph",
            text: "استقرار چندسایتی در برنامه پروژه تکراری به نظر می‌رسد، اما کابل‌کشی، دسترسی، برق، زمان ساخت و ذی‌نفعان هر محل متفاوت‌اند. تحویل قابل اعتماد، استاندارد مشترک را با روشی کنترل‌شده برای مدیریت تفاوت‌ها ترکیب می‌کند.",
          },
          { type: "heading", text: "تصمیم‌هایی را که نباید تغییر کنند استاندارد کنید" },
          {
            type: "paragraph",
            text: "معماری، الگوهای پیکربندی، نام‌گذاری، مستندات و معیار پذیرش باید یک‌بار تعریف شوند. بررسی سایت استثناها را پیش از تبدیل شدن به تأخیر آشکار می‌کند.",
          },
          {
            type: "list",
            items: [
              "نقشه‌ها، رک، برق، کابل و تحویل اپراتور را تأیید کنید.",
              "پیکربندی را پیش از رسیدن تجهیزات به سایت آماده و اعتبارسنجی کنید.",
              "مجوز ورود، پنجره نصب و الزامات ایمنی محلی را هماهنگ کنید.",
              "مدارک آزمون، وضعیت نهایی و موارد باز را هنگام تحویل ثبت کنید.",
            ],
          },
          { type: "heading", text: "تحویل به عملیات را بخشی از پروژه بدانید" },
          {
            type: "paragraph",
            text: "روشن شدن تجهیزات پایان کار نیست. تیم عملیات به نقشه، فهرست دارایی، اطلاعات پشتیبانی، نسخه پشتیبان و استثناهای پذیرفته‌شده نیاز دارد.",
          },
          {
            type: "quote",
            text: "یکپارچگی از سامانه تحویل تکرارپذیر می‌آید، نه از یکسان فرض کردن همه سایت‌ها.",
          },
        ],
      },
    },
  },
  {
    slug: "practical-security-response",
    publishedAt: "2026-07-14",
    featured: false,
    image: securityImage,
    translations: {
      en: {
        category: "SECURITY",
        title: "From Alert Volume to Practical Security Response",
        excerpt:
          "Security improves when identity, network, endpoint and operational context converge into clear priorities and owned actions.",
        imageAlt: "Enterprise security operations and monitoring environment",
        dateLabel: "14 July 2026",
        readingTime: "9 min read",
        body: [
          {
            type: "paragraph",
            text: "More alerts do not automatically create better protection. Without context, ownership and an agreed response path, teams spend time sorting noise while important signals wait.",
          },
          { type: "heading", text: "Connect the technical signal to business impact" },
          {
            type: "paragraph",
            text: "An event becomes actionable when the team can identify the affected identity, device, application, location and business service. That context supports faster prioritisation and more proportionate containment.",
          },
          {
            type: "list",
            items: [
              "Normalise alerts across security, network and endpoint platforms.",
              "Enrich events with asset criticality, identity and location.",
              "Assign a clear owner and response target for each priority.",
              "Record decisions so recurring events become reusable knowledge.",
            ],
          },
          { type: "heading", text: "Build response around repeatable decisions" },
          {
            type: "paragraph",
            text: "Playbooks should define the checks, approvals, communications and recovery steps for common events. Automation can accelerate evidence collection, but high-impact actions still need explicit authority.",
          },
          {
            type: "quote",
            text: "A useful security signal is one that leads to a clear, owned and proportionate action.",
          },
        ],
      },
      "zh-CN": {
        category: "安全运营",
        title: "从海量告警走向可执行的安全响应",
        excerpt: "当身份、网络、终端与运维信息汇聚成明确优先级和责任动作时，安全能力才真正提升。",
        imageAlt: "企业安全运营与监控环境",
        dateLabel: "2026 年 7 月 14 日",
        readingTime: "阅读约 9 分钟",
        body: [
          {
            type: "paragraph",
            text: "更多告警并不会自动带来更好的保护。如果缺少上下文、责任人和约定的响应路径，团队会把大量时间花在筛选噪声上，而真正重要的信号仍在等待处理。",
          },
          { type: "heading", text: "把技术信号连接到业务影响" },
          {
            type: "paragraph",
            text: "当团队能够识别受影响的身份、设备、应用、地点与业务服务时，事件才具备可执行性。这些信息可以帮助团队更快确定优先级，并采取与风险相匹配的控制措施。",
          },
          {
            type: "list",
            items: [
              "统一安全、网络和终端平台的告警信息。",
              "补充资产重要性、身份和位置上下文。",
              "为不同优先级设定责任人和响应目标。",
              "记录处置决策，把重复事件沉淀为知识。",
            ],
          },
          { type: "heading", text: "围绕可重复的决策建立响应流程" },
          {
            type: "paragraph",
            text: "响应手册应明确常见事件需要完成的检查、审批、沟通与恢复步骤。自动化可以加快证据收集，但高影响操作仍需要清晰授权。",
          },
          {
            type: "quote",
            text: "真正有价值的安全信号，必须能够导向清晰、有责任人且与风险相称的行动。",
          },
        ],
      },
      "fa-IR": {
        category: "عملیات امنیت",
        title: "از انبوه هشدار تا پاسخ عملی امنیتی",
        excerpt:
          "امنیت زمانی بهتر می‌شود که هویت، شبکه، نقطه پایانی و زمینه عملیاتی به اولویت و اقدام روشن تبدیل شوند.",
        imageAlt: "محیط عملیات و پایش امنیت سازمانی",
        dateLabel: "۱۴ ژوئیه ۲۰۲۶",
        readingTime: "۹ دقیقه مطالعه",
        body: [
          {
            type: "paragraph",
            text: "هشدار بیشتر به‌تنهایی حفاظت بهتر ایجاد نمی‌کند. بدون زمینه، مالک و مسیر پاسخ توافق‌شده، تیم زمان خود را صرف جداسازی نویز می‌کند و نشانه‌های مهم منتظر می‌مانند.",
          },
          { type: "heading", text: "سیگنال فنی را به اثر کسب‌وکار متصل کنید" },
          {
            type: "paragraph",
            text: "رویداد زمانی قابل اقدام است که هویت، دستگاه، برنامه، محل و سرویس کسب‌وکار متاثر مشخص باشند. این زمینه اولویت‌بندی و مهار متناسب را ممکن می‌کند.",
          },
          {
            type: "list",
            items: [
              "هشدارهای امنیت، شبکه و نقطه پایانی را یکسان‌سازی کنید.",
              "اهمیت دارایی، هویت و محل را به رویداد اضافه کنید.",
              "برای هر اولویت مالک و زمان پاسخ روشن تعیین کنید.",
              "تصمیم‌ها را ثبت کنید تا رویدادهای تکراری به دانش تبدیل شوند.",
            ],
          },
          { type: "heading", text: "پاسخ را بر تصمیم‌های تکرارپذیر بنا کنید" },
          {
            type: "paragraph",
            text: "راهنمای پاسخ باید بررسی، تأیید، ارتباط و بازیابی رویدادهای رایج را مشخص کند. خودکارسازی جمع‌آوری شواهد را سریع می‌کند، اما اقدام‌های پراثر همچنان به اختیار روشن نیاز دارند.",
          },
          {
            type: "quote",
            text: "سیگنال امنیتی مفید، سیگنالی است که به اقدامی روشن، مسئولانه و متناسب منتهی شود.",
          },
        ],
      },
    },
  },
  {
    slug: "it-operations-in-china",
    publishedAt: "2026-07-10",
    featured: false,
    image: operationsImage,
    translations: {
      en: {
        category: "OPERATIONS",
        title: "What Global Teams Need to Coordinate for IT Operations in China",
        excerpt:
          "Clear standards, local execution and shared operational evidence help global and China teams work as one service organization.",
        imageAlt: "Technical support team operating enterprise infrastructure",
        dateLabel: "10 July 2026",
        readingTime: "8 min read",
        body: [
          {
            type: "paragraph",
            text: "Global standards provide consistency, while local teams understand carriers, sites, suppliers, access windows and the realities of on-site support. Effective operations connect both perspectives instead of forcing one to replace the other.",
          },
          { type: "heading", text: "Agree the service boundary" },
          {
            type: "paragraph",
            text: "Teams should define which systems and locations are covered, who approves changes, how incidents are escalated and which evidence is needed for regional or global reporting.",
          },
          {
            type: "list",
            items: [
              "Maintain a shared inventory and configuration baseline.",
              "Align global policy with local implementation procedures.",
              "Define remote and on-site responsibilities by incident type.",
              "Use common service records for changes, faults and lifecycle actions.",
            ],
          },
          { type: "heading", text: "Make local execution visible" },
          {
            type: "paragraph",
            text: "Consistent ticket records, change evidence, maintenance summaries and asset updates let distributed teams make decisions from the same operational picture.",
          },
          {
            type: "quote",
            text: "Good regional operations translate global intent into local action — and local reality back into global visibility.",
          },
        ],
      },
      "zh-CN": {
        category: "IT 运维",
        title: "跨国企业在中国开展 IT 运维需要关注什么",
        excerpt: "清晰标准、本地执行和共享运维证据，能够让全球团队与中国团队像一个服务组织一样协同。",
        imageAlt: "技术支持团队维护企业基础设施",
        dateLabel: "2026 年 7 月 10 日",
        readingTime: "阅读约 8 分钟",
        body: [
          {
            type: "paragraph",
            text: "全球标准提供一致性，本地团队则熟悉运营商、站点、供应链、进场窗口和现场支持的实际条件。有效运维需要连接这两个视角，而不是要求其中一方取代另一方。",
          },
          { type: "heading", text: "先明确服务边界" },
          {
            type: "paragraph",
            text: "团队需要明确覆盖哪些系统和地点、谁来批准变更、事件如何升级，以及区域或全球汇报需要保留哪些证据。",
          },
          {
            type: "list",
            items: [
              "维护共享的资产清单与配置基线。",
              "让全球政策与本地实施流程保持一致。",
              "按事件类型划分远程与现场责任。",
              "使用统一服务记录管理变更、故障和生命周期动作。",
            ],
          },
          { type: "heading", text: "让本地执行过程可见" },
          {
            type: "paragraph",
            text: "一致的工单记录、变更证据、维护摘要和资产更新，可以让分布在不同地区的团队基于同一幅运维图景做决策。",
          },
          {
            type: "quote",
            text: "良好的区域运维把全球意图转化为本地行动，也把本地现实转化为全球可见性。",
          },
        ],
      },
      "fa-IR": {
        category: "عملیات فناوری اطلاعات",
        title: "تیم‌های جهانی برای عملیات فناوری اطلاعات در چین چه چیزهایی را باید هماهنگ کنند",
        excerpt:
          "استاندارد روشن، اجرای محلی و شواهد مشترک عملیاتی، تیم‌های جهانی و چین را به یک سازمان خدماتی تبدیل می‌کند.",
        imageAlt: "تیم پشتیبانی فنی در حال اداره زیرساخت سازمانی",
        dateLabel: "۱۰ ژوئیه ۲۰۲۶",
        readingTime: "۸ دقیقه مطالعه",
        body: [
          {
            type: "paragraph",
            text: "استاندارد جهانی یکپارچگی ایجاد می‌کند و تیم محلی اپراتورها، سایت‌ها، تأمین‌کنندگان، زمان دسترسی و واقعیت پشتیبانی حضوری را می‌شناسد. عملیات موثر این دو نگاه را به هم متصل می‌کند.",
          },
          { type: "heading", text: "مرز خدمات را توافق کنید" },
          {
            type: "paragraph",
            text: "باید مشخص باشد کدام سامانه‌ها و محل‌ها پوشش داده می‌شوند، چه کسی تغییر را تأیید می‌کند، رویداد چگونه ارجاع می‌شود و چه مدرکی برای گزارش منطقه‌ای یا جهانی لازم است.",
          },
          {
            type: "list",
            items: [
              "فهرست دارایی و خط مبنای پیکربندی مشترک نگه دارید.",
              "سیاست جهانی را با روش اجرای محلی همسو کنید.",
              "مسئولیت دورکار و حضوری را برای هر نوع رویداد مشخص کنید.",
              "برای تغییر، خرابی و چرخه عمر از سوابق خدماتی مشترک استفاده کنید.",
            ],
          },
          { type: "heading", text: "اجرای محلی را قابل مشاهده کنید" },
          {
            type: "paragraph",
            text: "سوابق منظم درخواست، مدارک تغییر، خلاصه نگهداری و به‌روزرسانی دارایی باعث می‌شود تیم‌های پراکنده بر اساس یک تصویر عملیاتی تصمیم بگیرند.",
          },
          {
            type: "quote",
            text: "عملیات منطقه‌ای خوب، هدف جهانی را به اقدام محلی و واقعیت محلی را به دید جهانی تبدیل می‌کند.",
          },
        ],
      },
    },
  },
  {
    slug: "five-campus-standardisation",
    publishedAt: "2026-07-06",
    featured: false,
    image: campusImage,
    translations: {
      en: {
        category: "CASE STUDY",
        title: "Standardising Infrastructure Across Five Campus Sites",
        excerpt:
          "A shared Cisco DNA architecture, coordinated rollout and ongoing on-site support created a consistent foundation across five new international-school campuses.",
        imageAlt: "Collaborative planning for a multi-campus technology programme",
        dateLabel: "6 July 2026",
        readingTime: "9 min read",
        body: [
          {
            type: "paragraph",
            text: "Across five new international-school campuses, JOTO delivered the full IT infrastructure as one coordinated programme. The scope included Cisco DNA architecture, more than 3,500 Wi-Fi 5 and Wi-Fi 6 access points, more than 800 Cisco Catalyst 9200 and 9300 switches, and daily on-site helpdesk support.",
          },
          { type: "heading", text: "One standard, five operating environments" },
          {
            type: "paragraph",
            text: "The programme needed a common technical foundation while respecting the construction progress, building conditions and opening schedule of each campus.",
          },
          {
            type: "list",
            items: [
              "A repeatable architecture and equipment standard across sites.",
              "Coordinated installation, testing and handover by campus.",
              "Consistent documentation and operational ownership.",
              "Daily on-site support after the environments entered service.",
            ],
          },
          { type: "heading", text: "The delivery lesson" },
          {
            type: "paragraph",
            text: "Large multi-site programmes depend on disciplined coordination as much as technical design. Standards reduce variation; local validation ensures the standard works in each real environment.",
          },
          {
            type: "quote",
            text: "A shared architecture becomes valuable when every site can operate it consistently after handover.",
          },
        ],
      },
      "zh-CN": {
        category: "案例资讯",
        title: "五个园区基础设施标准化交付案例",
        excerpt: "统一的 Cisco DNA 架构、协同部署与持续驻场支持，为五个新建国际学校园区建立一致基础。",
        imageAlt: "多园区技术项目的协同规划",
        dateLabel: "2026 年 7 月 6 日",
        readingTime: "阅读约 9 分钟",
        body: [
          {
            type: "paragraph",
            text: "JOTO 将五个新建国际学校园区的完整 IT 基础设施作为一个协同项目交付。范围包括 Cisco DNA 架构、超过 3,500 个 Wi-Fi 5/6 无线接入点、超过 800 台 Cisco Catalyst 9200/9300 交换机，以及日常驻场服务台支持。",
          },
          { type: "heading", text: "一套标准，五个真实运营环境" },
          {
            type: "paragraph",
            text: "项目需要建立共同技术基础，同时适应每个园区不同的施工进度、建筑条件和开校时间。",
          },
          {
            type: "list",
            items: [
              "在多个站点复用统一架构与设备标准。",
              "按园区协调安装、测试和移交。",
              "保持一致的文档与运维责任。",
              "环境投入使用后提供日常驻场支持。",
            ],
          },
          { type: "heading", text: "项目带来的交付启示" },
          {
            type: "paragraph",
            text: "大型多站点项目既依赖技术设计，也依赖严格协同。标准化减少差异，本地验证则确保统一标准能够在每个真实环境中运行。",
          },
          {
            type: "quote",
            text: "只有当每个站点在移交后都能一致运维，共享架构才真正产生价值。",
          },
        ],
      },
      "fa-IR": {
        category: "مطالعه موردی",
        title: "استانداردسازی زیرساخت در پنج پردیس",
        excerpt:
          "معماری مشترک Cisco DNA، استقرار هماهنگ و پشتیبانی مستمر حضوری، پایه‌ای یکپارچه برای پنج پردیس جدید ایجاد کرد.",
        imageAlt: "برنامه‌ریزی مشترک برای یک برنامه فناوری چندپردیسی",
        dateLabel: "۶ ژوئیه ۲۰۲۶",
        readingTime: "۹ دقیقه مطالعه",
        body: [
          {
            type: "paragraph",
            text: "JOTO زیرساخت کامل فناوری اطلاعات پنج پردیس جدید مدارس بین‌المللی را به‌صورت یک برنامه هماهنگ تحویل داد. دامنه شامل معماری Cisco DNA، بیش از ۳۵۰۰ نقطه دسترسی Wi-Fi 5 و Wi-Fi 6، بیش از ۸۰۰ سوئیچ Cisco Catalyst 9200 و 9300 و میز خدمت روزانه در محل بود.",
          },
          { type: "heading", text: "یک استاندارد، پنج محیط عملیاتی" },
          {
            type: "paragraph",
            text: "برنامه به پایه فنی مشترک نیاز داشت و هم‌زمان باید پیشرفت ساخت، شرایط ساختمان و برنامه افتتاح هر پردیس را در نظر می‌گرفت.",
          },
          {
            type: "list",
            items: [
              "معماری و استاندارد تجهیزات تکرارپذیر در همه سایت‌ها.",
              "نصب، آزمون و تحویل هماهنگ برای هر پردیس.",
              "مستندات و مالکیت عملیاتی یکپارچه.",
              "پشتیبانی روزانه در محل پس از بهره‌برداری.",
            ],
          },
          { type: "heading", text: "درس تحویل" },
          {
            type: "paragraph",
            text: "برنامه‌های بزرگ چندسایتی به همان اندازه طراحی فنی به هماهنگی منظم وابسته‌اند. استانداردها تفاوت را کم می‌کنند و اعتبارسنجی محلی کارایی آن‌ها را در محیط واقعی تضمین می‌کند.",
          },
          {
            type: "quote",
            text: "معماری مشترک زمانی ارزشمند است که هر سایت پس از تحویل بتواند آن را یکسان اداره کند.",
          },
        ],
      },
    },
  },
  {
    slug: "connected-it-and-safeguarding",
    publishedAt: "2026-07-02",
    featured: false,
    image: safeguardingImage,
    translations: {
      en: {
        category: "SAFEGUARDING",
        title: "Why IT and Physical Security Should Be Planned as One Connected System",
        excerpt:
          "Networks, identity, video, access control and emergency communications increasingly share infrastructure, operational context and response workflows.",
        imageAlt: "Integrated physical-security and connected-facility environment",
        dateLabel: "2 July 2026",
        readingTime: "8 min read",
        body: [
          {
            type: "paragraph",
            text: "Physical-security systems are no longer isolated building services. Cameras, access control, intercom, emergency communications and analytics depend on networks, compute, storage, identity and disciplined operations.",
          },
          { type: "heading", text: "Design the dependencies together" },
          {
            type: "paragraph",
            text: "When teams plan these systems separately, they can miss bandwidth, retention, power, segmentation, identity and support dependencies. A connected design makes those requirements visible early.",
          },
          {
            type: "list",
            items: [
              "Map devices, data flows, users and control points.",
              "Separate critical systems while preserving required integrations.",
              "Plan storage, retention, resilience and time synchronisation.",
              "Define joint incident, maintenance and escalation procedures.",
            ],
          },
          { type: "heading", text: "Connect technology without blurring responsibility" },
          {
            type: "paragraph",
            text: "Integration should improve awareness and response while keeping clear boundaries for access, privacy, maintenance and approval. The operating model is as important as the technical interface.",
          },
          {
            type: "quote",
            text: "Connected safeguarding works best when infrastructure, information and responsibility are designed together.",
          },
        ],
      },
      "zh-CN": {
        category: "物理安全",
        title: "为什么 IT 与物理安全应作为一个整体规划",
        excerpt: "网络、身份、视频、门禁和应急通信正在共享基础设施、运维信息与响应流程。",
        imageAlt: "一体化物理安全与互联设施环境",
        dateLabel: "2026 年 7 月 2 日",
        readingTime: "阅读约 8 分钟",
        body: [
          {
            type: "paragraph",
            text: "物理安全系统已经不再是孤立的建筑子系统。摄像机、门禁、对讲、应急通信和分析能力，都依赖网络、计算、存储、身份体系与规范运维。",
          },
          { type: "heading", text: "把相互依赖的部分一起设计" },
          {
            type: "paragraph",
            text: "如果团队分别规划这些系统，就容易遗漏带宽、留存、供电、网络分区、身份和支持之间的依赖。统一设计可以更早暴露这些要求。",
          },
          {
            type: "list",
            items: [
              "梳理设备、数据流、用户与控制点。",
              "隔离关键系统，同时保留必要集成。",
              "规划存储、留存、冗余和时间同步。",
              "建立联合事件、维护与升级流程。",
            ],
          },
          { type: "heading", text: "连接技术，但不模糊责任" },
          {
            type: "paragraph",
            text: "系统集成应提升态势感知与响应效率，同时保持清晰的访问、隐私、维护和审批边界。运维模式与技术接口同样重要。",
          },
          {
            type: "quote",
            text: "当基础设施、信息和责任被一起设计时，互联的安全保障体系才能真正发挥作用。",
          },
        ],
      },
      "fa-IR": {
        category: "حفاظت فیزیکی",
        title: "چرا فناوری اطلاعات و امنیت فیزیکی باید یک سامانه متصل طراحی شوند",
        excerpt:
          "شبکه، هویت، ویدئو، کنترل دسترسی و ارتباط اضطراری بیش از پیش زیرساخت، زمینه عملیاتی و گردش پاسخ مشترک دارند.",
        imageAlt: "محیط یکپارچه امنیت فیزیکی و تأسیسات متصل",
        dateLabel: "۲ ژوئیه ۲۰۲۶",
        readingTime: "۸ دقیقه مطالعه",
        body: [
          {
            type: "paragraph",
            text: "سامانه‌های امنیت فیزیکی دیگر خدمات جداگانه ساختمان نیستند. دوربین، کنترل دسترسی، اینترکام، ارتباط اضطراری و تحلیل به شبکه، پردازش، ذخیره‌سازی، هویت و عملیات منظم وابسته‌اند.",
          },
          { type: "heading", text: "وابستگی‌ها را با هم طراحی کنید" },
          {
            type: "paragraph",
            text: "برنامه‌ریزی جداگانه می‌تواند نیازهای پهنای باند، نگهداری داده، برق، بخش‌بندی، هویت و پشتیبانی را پنهان کند. طراحی متصل این نیازها را زودتر آشکار می‌کند.",
          },
          {
            type: "list",
            items: [
              "دستگاه‌ها، جریان داده، کاربران و نقاط کنترل را ترسیم کنید.",
              "سامانه‌های حیاتی را جدا و یکپارچگی لازم را حفظ کنید.",
              "ذخیره‌سازی، نگهداری، تاب‌آوری و همگام‌سازی زمان را طراحی کنید.",
              "فرآیند مشترک رویداد، نگهداری و ارجاع تعریف کنید.",
            ],
          },
          { type: "heading", text: "فناوری را متصل کنید، مسئولیت را مبهم نکنید" },
          {
            type: "paragraph",
            text: "یکپارچگی باید آگاهی و پاسخ را بهتر کند و هم‌زمان مرز دسترسی، حریم خصوصی، نگهداری و تأیید را روشن نگه دارد. مدل عملیاتی به اندازه رابط فنی اهمیت دارد.",
          },
          {
            type: "quote",
            text: "حفاظت متصل زمانی بهترین نتیجه را دارد که زیرساخت، اطلاعات و مسئولیت با هم طراحی شوند.",
          },
        ],
      },
    },
  },
];

function expandTranslation(
  article: BlogArticle,
  locale: Locale,
): BlogArticleTranslation {
  const translation = article.translations[locale];
  const closingQuotes = translation.body.filter((block) => block.type === "quote");
  const coreBody = translation.body.filter((block) => block.type !== "quote");
  const openingParagraph = coreBody.find((block) => block.type === "paragraph");

  return {
    ...translation,
    body: [
      ...(openingParagraph ? [openingParagraph] : []),
      ...(blogArticleExpansions[article.slug]?.[locale] ?? []),
      ...closingQuotes,
    ],
  };
}

export const blogArticles: BlogArticle[] = baseBlogArticles.map((article) => ({
  ...article,
  translations: {
    en: expandTranslation(article, "en"),
    "zh-CN": expandTranslation(article, "zh-CN"),
    "fa-IR": expandTranslation(article, "fa-IR"),
  },
}));

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}
