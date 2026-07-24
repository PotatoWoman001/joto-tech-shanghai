import type { Locale } from "../i18n/routing";

export type FixedPageKey = "home" | "about" | "contact" | "blog";

export const fixedSeoCopy: Record<
  Locale,
  Record<FixedPageKey, { title: string; description: string }>
> = {
  en: {
    home: {
      title: "Enterprise IT Solutions & Systems Integration | JOTO TECH",
      description:
        "JOTO TECH designs, integrates and supports enterprise networks, cybersecurity, servers, storage, collaboration and physical security in China and global markets.",
    },
    about: {
      title: "About JOTO TECH | Enterprise IT Integrator in China",
      description:
        "Founded in Shanghai in 2010, JOTO TECH plans, integrates and supports complex enterprise IT and physical-security environments.",
    },
    contact: {
      title: "Contact JOTO TECH | Discuss Your Enterprise IT Project",
      description:
        "Talk to JOTO TECH about enterprise networks, security, data centers, collaboration, physical security, multi-site deployment or managed IT support.",
    },
    blog: {
      title: "Enterprise IT Insights & Project Experience | JOTO TECH",
      description:
        "Practical insights on enterprise networks, cybersecurity, IT operations, multi-site delivery and connected physical security from JOTO TECH.",
    },
  },
  "zh-CN": {
    home: {
      title: "企业 IT 解决方案与系统集成服务 | JOTO TECH",
      description:
        "JOTO TECH 提供企业网络、网络安全、服务器与存储、协作通信及物理安防解决方案，覆盖 IT 规划、系统集成、项目实施与持续运维。",
    },
    about: {
      title: "关于 JOTO TECH | 上海企业 IT 系统集成服务商",
      description:
        "JOTO TECH 于 2010 年创立于上海，为企业提供 IT 规划、系统集成、项目交付与持续运维服务。",
    },
    contact: {
      title: "联系 JOTO TECH | 咨询企业 IT 项目与解决方案",
      description:
        "咨询企业网络、网络安全、服务器与存储、协作通信、物理安防、多站点部署及 IT 运维服务。",
    },
    blog: {
      title: "企业 IT 洞察、技术实践与项目经验 | JOTO TECH",
      description:
        "阅读 JOTO TECH 关于企业网络、网络安全、IT 运维、多站点项目交付与物理安防集成的实践洞察。",
    },
  },
  "fa-IR": {
    home: {
      title: "راهکارهای فناوری اطلاعات و یکپارچه‌سازی سازمانی | JOTO TECH",
      description:
        "JOTO TECH شبکه، امنیت سایبری، سرور، ذخیره‌سازی، ارتباطات یکپارچه و امنیت فیزیکی سازمانی را طراحی، اجرا و پشتیبانی می‌کند.",
    },
    about: {
      title: "درباره JOTO TECH | یکپارچه‌ساز فناوری اطلاعات سازمانی",
      description:
        "JOTO TECH از سال ۲۰۱۰ محیط‌های پیچیده فناوری اطلاعات و امنیت فیزیکی سازمانی را طراحی، یکپارچه و پشتیبانی می‌کند.",
    },
    contact: {
      title: "تماس با JOTO TECH | مشاوره پروژه فناوری اطلاعات سازمانی",
      description:
        "برای شبکه، امنیت، مرکز داده، ارتباطات، امنیت فیزیکی، استقرار چندسایتی و پشتیبانی مدیریت‌شده با JOTO TECH گفتگو کنید.",
    },
    blog: {
      title: "دیدگاه‌ها و تجربه پروژه‌های فناوری اطلاعات | JOTO TECH",
      description:
        "دیدگاه‌های عملی JOTO TECH درباره شبکه سازمانی، امنیت سایبری، عملیات فناوری اطلاعات و تحویل پروژه‌های چندسایتی.",
    },
  },
};
