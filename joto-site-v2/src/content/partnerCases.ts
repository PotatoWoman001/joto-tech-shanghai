import amlogicLogo from "../assets/customer-logos/amlogic.png";
import bostonScientificLogo from "../assets/customer-logos/partner-cases/boston-scientific.svg";
import bungeLogo from "../assets/customer-logos/partner-cases/bunge.svg";
import dfxAdvanceLogo from "../assets/customer-logos/partner-cases/dfx-advance.svg";
import dulwichLogo from "../assets/customer-logos/partner-cases/dulwich-college-international.svg";
import pallLogo from "../assets/customer-logos/partner-cases/pall.png";
import ssisLogo from "../assets/customer-logos/partner-cases/ssis.svg";
import ykPaoLogo from "../assets/customer-logos/partner-cases/yk-pao-school.png";
import zhongkeChuangweiLogo from "../assets/customer-logos/partner-cases/zhongke-chuangwei.png";
import starbucksLogo from "../assets/customer-logos/starbucks.svg";
import type { Locale } from "../i18n/routing";
import type { PartnerCaseStudy } from "./partners";

type LocalizedText = Record<Locale, string>;

interface LocalizedPartnerCase {
  client: LocalizedText;
  tag: LocalizedText;
  category: LocalizedText;
  brief: LocalizedText;
  scope: LocalizedText[];
  logo?: string;
  logoTreatment?: PartnerCaseStudy["logoTreatment"];
}

type PartnerCaseGroup =
  | "paloAlto"
  | "knowBe4"
  | "extreme"
  | "fortinet"
  | "aruba"
  | "sangfor"
  | "hikvision";

const text = (en: string, zh: string, fa: string): LocalizedText => ({
  en,
  "zh-CN": zh,
  "fa-IR": fa,
});

const partnerCaseGroups: Record<PartnerCaseGroup, LocalizedPartnerCase[]> = {
  paloAlto: [
    {
      client: text(
        "Starbucks China",
        "星巴克（中国）有限公司",
        "استارباکس چین",
      ),
      tag: text(
        "Ongoing procurement & support",
        "持续采购与支持",
        "تأمین و پشتیبانی مستمر",
      ),
      category: text(
        "Firewall Procurement & Lifecycle",
        "防火墙采购与生命周期",
        "تأمین و چرخه عمر فایروال",
      ),
      brief: text(
        "JOTO has supported Starbucks China through Palo Alto Networks firewall procurement, maintenance renewals, XDR technical support and hardware replacement.",
        "JOTO 持续为星巴克中国提供 Palo Alto Networks 防火墙采购、维保续订、XDR 技术支持与硬件替换服务。",
        "JOTO از استارباکس چین در تأمین فایروال‌های Palo Alto Networks، تمدید نگهداری، پشتیبانی فنی XDR و جایگزینی سخت‌افزار پشتیبانی کرده است.",
      ),
      scope: [
        text(
          "PA-5430 / PA-5250 / PA-5220 / PA-3250",
          "PA-5430 / PA-5250 / PA-5220 / PA-3250",
          "PA-5430 / PA-5250 / PA-5220 / PA-3250",
        ),
        text(
          "Maintenance and subscription renewals",
          "维保与订阅续订",
          "تمدید نگهداری و اشتراک",
        ),
        text(
          "XDR support, hardware replacement and optical modules",
          "XDR 技术支持、硬件替换与光模块采购",
          "پشتیبانی XDR، جایگزینی سخت‌افزار و ماژول‌های نوری",
        ),
      ],
      logo: starbucksLogo,
      logoTreatment: "brand",
    },
    {
      client: text(
        "Dulwich College International Schools",
        "德威国际学校系",
        "مدارس بین‌المللی کالج دالویچ",
      ),
      tag: text(
        "Pudong · Suzhou · Puxi",
        "浦东 · 苏州 · 浦西",
        "پودونگ · سوژو · پوشی",
      ),
      category: text(
        "Firewall Renewal & Cloud Security",
        "防火墙续订与云安全",
        "تمدید فایروال و امنیت ابری",
      ),
      brief: text(
        "Across Dulwich campuses in Pudong, Suzhou and Puxi, JOTO has supported Palo Alto Networks firewall renewals, system modernization and cloud-security requirements.",
        "面向浦东、苏州与浦西德威学校，JOTO 提供 Palo Alto Networks 防火墙续费、系统改造与云安全相关支持。",
        "JOTO در پردیس‌های دالویچ در پودونگ، سوژو و پوشی از تمدید فایروال‌های Palo Alto Networks، نوسازی سامانه و نیازهای امنیت ابری پشتیبانی کرده است.",
      ),
      scope: [
        text(
          "Firewall renewals and system modernization",
          "防火墙续费与系统改造",
          "تمدید فایروال و نوسازی سامانه",
        ),
        text(
          "Azure Palo Alto Networks VM-100",
          "Azure Palo Alto Networks VM-100",
          "Azure Palo Alto Networks VM-100",
        ),
        text(
          "Palo Alto Networks PA-1410",
          "Palo Alto Networks PA-1410",
          "Palo Alto Networks PA-1410",
        ),
      ],
      logo: dulwichLogo,
    },
    {
      client: text("Jinnet", "Jinnet 今网", "جین‌نت"),
      tag: text(
        "Annual renewals, 2022–2025",
        "2022–2025 每年续约",
        "تمدید سالانه، ۲۰۲۲ تا ۲۰۲۵",
      ),
      category: text(
        "Subscription Renewal",
        "订阅许可续保",
        "تمدید اشتراک",
      ),
      brief: text(
        "JOTO supported Jinnet with recurring Palo Alto Networks support and license renewals from 2022 through 2025.",
        "2022 至 2025 年，JOTO 连续为 Jinnet 今网提供 Palo Alto Networks 续保与许可续订支持。",
        "JOTO از سال ۲۰۲۲ تا ۲۰۲۵ تمدیدهای مستمر پشتیبانی و مجوز Palo Alto Networks را برای جین‌نت انجام داده است.",
      ),
      scope: [
        text(
          "Palo Alto Networks support and license renewals",
          "Palo Alto Networks 续保与许可续订",
          "تمدید پشتیبانی و مجوز Palo Alto Networks",
        ),
        text(
          "Renewal continuity across four consecutive years",
          "连续四年续约",
          "تداوم تمدید در چهار سال پیاپی",
        ),
      ],
    },
  ],
  knowBe4: [
    {
      client: text(
        "Quasar Medical",
        "Quasar Medical（科凯生命科学）",
        "کوآزار مدیکال",
      ),
      tag: text(
        "Ongoing cooperation",
        "持续合作",
        "همکاری مستمر",
      ),
      category: text(
        "Human-Risk Security Program",
        "人因安全项目",
        "برنامه امنیت ریسک انسانی",
      ),
      brief: text(
        "JOTO maintains an ongoing KnowBe4-related cooperation with Quasar Medical.",
        "JOTO 与 Quasar Medical（科凯生命科学）保持持续的 KnowBe4 相关合作。",
        "JOTO همکاری مستمری در زمینه KnowBe4 با کوآزار مدیکال دارد.",
      ),
      scope: [
        text(
          "Ongoing KnowBe4-related cooperation",
          "持续的 KnowBe4 相关合作",
          "همکاری مستمر مرتبط با KnowBe4",
        ),
        text(
          "Continuing JOTO support",
          "JOTO 持续支持",
          "پشتیبانی مستمر JOTO",
        ),
      ],
    },
    {
      client: text(
        "DFX Labs Company Limited",
        "DFX Labs Company Limited",
        "شرکت DFX Labs",
      ),
      tag: text(
        "Active engagement",
        "活跃合作",
        "همکاری فعال",
      ),
      category: text(
        "Human-Risk Security Program",
        "人因安全项目",
        "برنامه امنیت ریسک انسانی",
      ),
      brief: text(
        "DFX Labs Company Limited has an active KnowBe4-related engagement with JOTO.",
        "DFX Labs Company Limited 与 JOTO 保持活跃的 KnowBe4 相关合作。",
        "شرکت DFX Labs همکاری فعالی در زمینه KnowBe4 با JOTO دارد.",
      ),
      scope: [
        text(
          "Active KnowBe4-related engagement",
          "活跃的 KnowBe4 相关合作",
          "همکاری فعال مرتبط با KnowBe4",
        ),
      ],
      logo: dfxAdvanceLogo,
    },
  ],
  extreme: [
    {
      client: text(
        "Shanghai Singapore International School (SSIS)",
        "上海新加坡外籍人员子女学校（SSIS）",
        "مدرسه بین‌المللی سنگاپور شانگهای (SSIS)",
      ),
      tag: text(
        "49 cloud subscriptions",
        "49 个云订阅许可",
        "۴۹ اشتراک ابری",
      ),
      category: text(
        "Cloud-Managed Campus Network",
        "云管理园区网络",
        "شبکه پردیس با مدیریت ابری",
      ),
      brief: text(
        "JOTO supplied ExtremeCloud IQ subscriptions for Shanghai Singapore International School as part of its cloud-managed campus network.",
        "JOTO 为上海新加坡外籍人员子女学校提供 ExtremeCloud IQ 云订阅许可，支持其云管理园区网络。",
        "JOTO اشتراک‌های ExtremeCloud IQ را برای شبکه پردیس با مدیریت ابری مدرسه بین‌المللی سنگاپور شانگهای تأمین کرده است.",
      ),
      scope: [
        text(
          "49 XIQ-PIL-S-C-PWP cloud subscription licenses",
          "49 个 XIQ-PIL-S-C-PWP 云订阅许可",
          "۴۹ مجوز اشتراک ابری XIQ-PIL-S-C-PWP",
        ),
        text(
          "JOTO reseller delivery",
          "JOTO 经销交付",
          "تحویل از طریق JOTO به‌عنوان فروشنده",
        ),
        text(
          "ExtremeCloud IQ subscription",
          "ExtremeCloud IQ 云订阅",
          "اشتراک ExtremeCloud IQ",
        ),
      ],
      logo: ssisLogo,
      logoTreatment: "brand",
    },
    {
      client: text(
        "Shanghai YK Pao School",
        "上海包玉刚实验学校",
        "مدرسه وای‌کی پائو شانگهای",
      ),
      tag: text(
        "Wired & wireless campus",
        "有线与无线园区",
        "پردیس سیمی و بی‌سیم",
      ),
      category: text(
        "Campus Network Modernization",
        "园区网络升级",
        "نوسازی شبکه پردیس",
      ),
      brief: text(
        "JOTO supported Shanghai YK Pao School with Extreme Networks wireless access, switching and cloud-managed networking products.",
        "JOTO 为上海包玉刚实验学校提供 Extreme Networks 无线接入、交换与云管理网络产品。",
        "JOTO تجهیزات دسترسی بی‌سیم، سوئیچینگ و شبکه با مدیریت ابری Extreme Networks را برای مدرسه وای‌کی پائو شانگهای فراهم کرده است.",
      ),
      scope: [
        text(
          "AP410C / AP305C / AP-7612 wireless access points",
          "AP410C、AP305C、AP-7612 无线接入点",
          "نقاط دسترسی بی‌سیم AP410C، AP305C و AP-7612",
        ),
        text(
          "ERS 4950GTS-PWR+ switches",
          "ERS 4950GTS-PWR+ 交换机",
          "سوئیچ‌های ERS 4950GTS-PWR+",
        ),
        text(
          "XIQ cloud subscriptions",
          "XIQ 云订阅",
          "اشتراک‌های ابری XIQ",
        ),
      ],
      logo: ykPaoLogo,
    },
  ],
  fortinet: [
    {
      client: text(
        "Tianjin Bunge Foods",
        "天津邦士食品有限公司",
        "صنایع غذایی بانج تیانجین",
      ),
      tag: text(
        "Confirmed cooperation",
        "已确认合作",
        "همکاری تأییدشده",
      ),
      category: text(
        "Fortinet Security Project",
        "Fortinet 安全项目",
        "پروژه امنیتی Fortinet",
      ),
      brief: text(
        "JOTO has a confirmed Fortinet-related security cooperation with Tianjin Bunge Foods.",
        "JOTO 与天津邦士食品有限公司开展了已确认的 Fortinet 相关安全合作。",
        "JOTO همکاری امنیتی تأییدشده‌ای در زمینه Fortinet با صنایع غذایی بانج تیانجین دارد.",
      ),
      scope: [
        text(
          "Fortinet-related security cooperation",
          "Fortinet 相关安全合作",
          "همکاری امنیتی مرتبط با Fortinet",
        ),
      ],
      logo: bungeLogo,
    },
    {
      client: text(
        "Amlogic (Shanghai)",
        "晶晨半导体（上海）股份有限公司",
        "آملوجیک (شانگهای)",
      ),
      tag: text(
        "Confirmed cooperation",
        "已确认合作",
        "همکاری تأییدشده",
      ),
      category: text(
        "Fortinet Security Project",
        "Fortinet 安全项目",
        "پروژه امنیتی Fortinet",
      ),
      brief: text(
        "JOTO has a confirmed Fortinet-related security cooperation with Amlogic in Shanghai.",
        "JOTO 与晶晨半导体（上海）股份有限公司开展了已确认的 Fortinet 相关安全合作。",
        "JOTO همکاری امنیتی تأییدشده‌ای در زمینه Fortinet با آملوجیک در شانگهای دارد.",
      ),
      scope: [
        text(
          "Fortinet-related security cooperation",
          "Fortinet 相关安全合作",
          "همکاری امنیتی مرتبط با Fortinet",
        ),
      ],
      logo: amlogicLogo,
    },
  ],
  aruba: [
    {
      client: text(
        "Boston Scientific (Shanghai)",
        "波士顿科学（上海）有限公司",
        "بوستون ساینتیفیک (شانگهای)",
      ),
      tag: text(
        "Confirmed cooperation",
        "已确认合作",
        "همکاری تأییدشده",
      ),
      category: text(
        "Aruba Network Project",
        "Aruba 网络项目",
        "پروژه شبکه Aruba",
      ),
      brief: text(
        "JOTO has a confirmed Aruba-related network cooperation with Boston Scientific in Shanghai.",
        "JOTO 与波士顿科学（上海）有限公司开展了已确认的 Aruba 相关网络合作。",
        "JOTO همکاری شبکه‌ای تأییدشده‌ای در زمینه Aruba با بوستون ساینتیفیک در شانگهای دارد.",
      ),
      scope: [
        text(
          "Aruba-related network cooperation",
          "Aruba 相关网络合作",
          "همکاری شبکه مرتبط با Aruba",
        ),
      ],
      logo: bostonScientificLogo,
    },
    {
      client: text(
        "Zhongke Chuangwei",
        "中科创威",
        "ژونگ‌که چوانگ‌وی",
      ),
      tag: text(
        "Confirmed cooperation",
        "已确认合作",
        "همکاری تأییدشده",
      ),
      category: text(
        "Aruba Network Project",
        "Aruba 网络项目",
        "پروژه شبکه Aruba",
      ),
      brief: text(
        "JOTO has a confirmed Aruba-related network cooperation with Zhongke Chuangwei.",
        "JOTO 与中科创威开展了已确认的 Aruba 相关网络合作。",
        "JOTO همکاری شبکه‌ای تأییدشده‌ای در زمینه Aruba با ژونگ‌که چوانگ‌وی دارد.",
      ),
      scope: [
        text(
          "Aruba-related network cooperation",
          "Aruba 相关网络合作",
          "همکاری شبکه مرتبط با Aruba",
        ),
      ],
      logo: zhongkeChuangweiLogo,
      logoTreatment: "brand",
    },
  ],
  sangfor: [
    {
      client: text(
        "Pall Filter (Beijing)",
        "颇尔过滤器（北京）有限公司",
        "پال فیلتر (پکن)",
      ),
      tag: text(
        "Confirmed cooperation",
        "已确认合作",
        "همکاری تأییدشده",
      ),
      category: text(
        "Sangfor Technology Project",
        "深信服技术项目",
        "پروژه فناوری Sangfor",
      ),
      brief: text(
        "JOTO has a confirmed Sangfor-related technology cooperation with Pall Filter in Beijing.",
        "JOTO 与颇尔过滤器（北京）有限公司开展了已确认的深信服相关技术合作。",
        "JOTO همکاری فناوری تأییدشده‌ای در زمینه Sangfor با پال فیلتر در پکن دارد.",
      ),
      scope: [
        text(
          "Sangfor-related technology cooperation",
          "深信服相关技术合作",
          "همکاری فناوری مرتبط با Sangfor",
        ),
      ],
      logo: pallLogo,
    },
    {
      client: text(
        "Pall (China) Investment",
        "颇尔（中国）投资有限公司",
        "سرمایه‌گذاری پال (چین)",
      ),
      tag: text(
        "Confirmed cooperation",
        "已确认合作",
        "همکاری تأییدشده",
      ),
      category: text(
        "Sangfor Technology Project",
        "深信服技术项目",
        "پروژه فناوری Sangfor",
      ),
      brief: text(
        "JOTO has a confirmed Sangfor-related technology cooperation with Pall (China) Investment.",
        "JOTO 与颇尔（中国）投资有限公司开展了已确认的深信服相关技术合作。",
        "JOTO همکاری فناوری تأییدشده‌ای در زمینه Sangfor با سرمایه‌گذاری پال (چین) دارد.",
      ),
      scope: [
        text(
          "Sangfor-related technology cooperation",
          "深信服相关技术合作",
          "همکاری فناوری مرتبط با Sangfor",
        ),
      ],
      logo: pallLogo,
    },
  ],
  hikvision: [
    {
      client: text(
        "Pall (China) Investment",
        "颇尔（中国）投资有限公司",
        "سرمایه‌گذاری پال (چین)",
      ),
      tag: text(
        "Confirmed cooperation",
        "已确认合作",
        "همکاری تأییدشده",
      ),
      category: text(
        "Hikvision Physical Security Project",
        "海康威视物理安防项目",
        "پروژه امنیت فیزیکی Hikvision",
      ),
      brief: text(
        "JOTO has a confirmed Hikvision-related physical-security cooperation with Pall (China) Investment.",
        "JOTO 与颇尔（中国）投资有限公司开展了已确认的海康威视相关物理安防合作。",
        "JOTO همکاری تأییدشده‌ای در زمینه امنیت فیزیکی Hikvision با سرمایه‌گذاری پال (چین) دارد.",
      ),
      scope: [
        text(
          "Hikvision-related physical-security cooperation",
          "海康威视相关物理安防合作",
          "همکاری امنیت فیزیکی مرتبط با Hikvision",
        ),
      ],
      logo: pallLogo,
    },
    {
      client: text(
        "Tianjin Bunge Foods",
        "天津邦士食品有限公司",
        "صنایع غذایی بانج تیانجین",
      ),
      tag: text(
        "Confirmed cooperation",
        "已确认合作",
        "همکاری تأییدشده",
      ),
      category: text(
        "Hikvision Physical Security Project",
        "海康威视物理安防项目",
        "پروژه امنیت فیزیکی Hikvision",
      ),
      brief: text(
        "JOTO has a confirmed Hikvision-related physical-security cooperation with Tianjin Bunge Foods.",
        "JOTO 与天津邦士食品有限公司开展了已确认的海康威视相关物理安防合作。",
        "JOTO همکاری تأییدشده‌ای در زمینه امنیت فیزیکی Hikvision با صنایع غذایی بانج تیانجین دارد.",
      ),
      scope: [
        text(
          "Hikvision-related physical-security cooperation",
          "海康威视相关物理安防合作",
          "همکاری امنیت فیزیکی مرتبط با Hikvision",
        ),
      ],
      logo: bungeLogo,
    },
  ],
};

const groupByPath: Record<string, PartnerCaseGroup> = {
  "/solutions/security/palo-alto-networks": "paloAlto",
  "/solutions/security/knowbe4": "knowBe4",
  "/solutions/network/extreme-networks": "extreme",
  "/solutions/security/fortinet": "fortinet",
  "/solutions/network/aruba": "aruba",
  "/solutions/network/sangfor": "sangfor",
  "/solutions/security/sangfor": "sangfor",
  "/solutions/safeguarding/hikvision": "hikvision",
};

export function getPartnerCases(pathname: string, locale: Locale): PartnerCaseStudy[] {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const group = groupByPath[normalizedPath];

  if (!group) return [];

  return partnerCaseGroups[group].map((project) => ({
    client: project.client[locale],
    tag: project.tag[locale],
    category: project.category[locale],
    brief: project.brief[locale],
    scope: project.scope.map((item) => item[locale]),
    logo: project.logo,
    logoTreatment: project.logoTreatment,
  }));
}
