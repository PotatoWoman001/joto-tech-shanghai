import type { SiteContent } from "../content/types";
import { siteContent as englishSiteContent } from "../content/en";
import type { PartnerDetail } from "../content/partners";
import type { Locale } from "./routing";
import { faPartnerProfiles, zhPartnerProfiles } from "./solutionProfiles";

type Dictionary = Record<string, string>;

export const zh: Dictionary = {
  "SOLUTIONS": "解决方案", "SERVICES": "服务", "CASE STUDIES": "客户案例", "ABOUT": "关于我们", "BLOG": "最新资讯", "CONTACT": "联系我们", "Blog": "最新资讯",
  "ENTERPRISE-READY IT SOLUTIONS": "企业级 IT 解决方案", "We Make": "让", "IT": "IT", "Connections": "连接", "Resilience": "韧性", "Progress": "进步", "Happen": "真正发生",
  "Enterprise networks, security, data centers, collaboration and physical safeguarding — designed, built and supported for the world's most demanding companies since 2010.": "自 2010 年起，我们为全球企业提供企业网络、信息安全、数据中心、协作通信与物理安防的设计、实施和运维服务。",
  "[ SINCE 2010 ]": "[ 始于 2010 ]", "Engineered by": "专业方案，", "Certified Professionals": "由认证团队交付", "Architecture, integration and support for complex, multi-vendor environments.": "面向复杂的多厂商环境，提供架构设计、系统集成与持续支持。", "EXPLORE SOLUTIONS": "查看解决方案",
  "WHAT WE DELIVER": "核心能力", "Infrastructure built as one connected system.": "让各类基础设施协同运转。", "A focused portfolio across the network, security, compute, communications and physical safeguards that modern organizations depend on.": "覆盖企业日常运营所需的网络、安全、算力、通信与物理安防能力。",
  "Network": "网络", "Security": "安全", "Server & Storage": "服务器与存储", "Collaboration": "协作通信", "Safeguarding": "物理安防",
  "Campus, branch and data-center connectivity designed for consistent performance, visibility and control.": "为园区、分支机构和数据中心建设性能稳定、状态可视、集中可控的网络连接。", "Layered protection for people, identities, applications, networks and day-to-day operations.": "从人员、身份、应用到网络与日常运营，构建多层安全防护。", "Compute and data platforms sized around resilience, workload needs and practical lifecycle management.": "根据业务连续性、工作负载与生命周期要求，规划计算和数据平台。", "Voice, paging and critical communications that connect teams and reach people when timing matters.": "整合语音、广播与关键通信，让团队协作和紧急通知更及时。", "Connected video, access and physical-security systems for safer workplaces, campuses and facilities.": "整合视频监控、门禁与物理安防系统，保障办公场所、园区和设施安全。",
  "END-TO-END SERVICES": "全生命周期服务", "From the first workshop to steady-state operations.": "覆盖规划、实施与长期运维。", "JOTO brings planning, integration and ongoing service together so multi-vendor environments remain coherent throughout their lifecycle.": "从方案规划、系统集成到持续运维，均由 JOTO 统一协调，确保多厂商环境长期稳定运行。",
  "IT Planning & Consulting": "IT 规划与咨询", "Design & Deployment": "设计与部署", "24×7 Support & Maintenance": "7×24 支持与维护", "Managed Security Services": "托管安全服务", "Managed Outsourcing & Staffing": "托管外包与人才服务", "IT Procurement": "IT 采购",
  "IT strategy, architecture design and cross-border data compliance consulting — before a single box is ordered.": "涵盖 IT 战略、架构设计与跨境数据合规，为后续采购和实施提供依据。", "Turnkey delivery from structured cabling to cloud: engineering, installation, migration and cut-over, on site.": "从综合布线到云平台，覆盖工程设计、安装、迁移与现场割接。", "Round-the-clock multilingual hotline, SLA-backed maintenance, spare parts and daily on-site helpdesk.": "提供 7×24 多语种热线、SLA 维护、备件保障与日常驻场支持。", "MSS with SOC monitoring and Level-3 security operations — proven across a 15,000-server estate.": "提供 SOC 监控与三级安全运营服务，并具备 15,000 台服务器规模环境的实践经验。", "Dedicated on-site IT and AI teams, personnel outsourcing and ITIL-based managed operations.": "提供专属驻场 IT 与 AI 团队、人员外包及基于 ITIL 的托管运营。", "One-stop sourcing of hardware, software and cloud services for organizations operating across global markets.": "面向全球业务，提供硬件、软件与云服务的一站式采购。",
  "SELECTED EXPERIENCE": "项目案例", "Complex environments, delivered with care.": "复杂项目，可靠交付。", "Selected references from JOTO materials. Scope statements remain deliberately concise pending the next client-approval review.": "跨越不同行业，让复杂的技术项目稳定落地、持续运行。",
  "Education": "教育", "Retail & F&B": "零售与餐饮", "Life Sciences & Manufacturing": "生命科学与制造", "E-commerce": "电子商务",
  "WHY JOTO": "选择 JOTO", "A China-based technology partner with an international delivery view.": "立足中国，服务全球的技术合作伙伴。", "Established in Shanghai in 2010, JOTO plans, integrates and supports enterprise IT and physical-security environments across multiple technology domains.": "JOTO 于 2010 年创立于上海，为企业提供涵盖 IT 与物理安防的规划、系统集成和运营支持。", "Our role is to connect strategy with field delivery: one team coordinating architecture, products, deployment and ongoing service across China and selected international locations.": "从架构、产品到部署和持续服务，由同一团队统筹推进，覆盖中国及多个国际市场。",
  "Established in Shanghai": "创立于上海", "Solution domains": "解决方案领域", "MULTI-VENDOR": "多厂商", "Integrated delivery model": "一体化交付模式", "LIFECYCLE": "全生命周期", "Plan, deploy and operate": "规划、部署与运营",
  "TECHNOLOGY PORTFOLIO": "技术生态", "A focused multi-vendor ecosystem.": "汇聚主流厂商，构建完整技术生态。", "A trusted network of technology leaders supporting secure, connected and resilient enterprise environments.": "与经过市场验证的技术厂商合作，为企业构建安全、互联、稳定的 IT 环境。",
  "GLOBAL PRESENCE": "全球布局", "Local execution, coordinated across borders.": "本地执行，跨境协同。", "JOTO materials identify delivery presence across the following markets. Exact office and service coverage can be refined before public launch.": "JOTO 已在以下市场建立交付能力；具体办公室与服务覆盖范围可按项目需求确认。",
  "China": "中国", "Japan": "日本", "Thailand": "泰国", "Singapore": "新加坡", "United States": "美国", "United Kingdom": "英国", "Shanghai": "上海", "Beijing": "北京", "Shenzhen": "深圳", "Suzhou": "苏州", "Hong Kong": "香港", "Tokyo": "东京", "Bangkok": "曼谷", "Cupertino": "库比蒂诺", "Sheridan": "谢里登", "London": "伦敦", "LOCATION": "个地点", "LOCATIONS": "个地点",
  "START A CONVERSATION": "联系 JOTO", "Bring us the environment you need to improve.": "告诉我们您的 IT 项目需求。", "Tell us about your locations, priorities and timeline. We will help shape a practical next step.": "请提供项目地点、优先事项和时间计划，我们会据此提出下一步建议。", "© JOTO TECH. All rights reserved.": "© JOTO TECH。保留所有权利。",
  "ABOUT US": "关于我们", "Built to make": "让", "complex": "复杂", "happen.": "项目顺利落地。", "A customer-oriented technology company turning demanding enterprise requirements into reliable, connected systems since 2010.": "自 2010 年起，我们专注将复杂的企业需求转化为可靠、互联、可持续运营的系统。", "Who we are": "关于 JOTO", "How we work": "服务方式", "Plan & Design": "规划与设计", "Build & Integrate": "建设与集成", "Run & Improve": "运营与优化", "Advisors first.": "先理解业务。", "Integrators always.": "再把方案落地。", "Local hands,": "本地执行，", "worldwide.": "全球协同。", "Start a conversation": "联系 JOTO", "Let’s make what’s next happen.": "一起推进你的下一个项目。",
  "CONTACT US": "联系我们", "Tell us what": "说说你", "you’re": "正在推进的", "building.": "IT 项目。", "Start with the challenge.": "先从问题谈起。", "Our offices": "服务地点", "Find JOTO": "就近联系", "nearby.": "JOTO 团队。", "Global delivery": "全球交付", "Plan a multi-region rollout": "咨询多区域部署",
  "Service hotline": "服务热线", "Shanghai HQ": "上海总部", "Sales & projects": "销售与项目", "Start a call": "拨打电话", "Reach the team": "联系团队", "Write to us": "发送邮件",
  "Send us your requirements": "告诉我们你的项目需求", "Fields marked with * are required.": "标有 * 的字段为必填项。", "Secure enquiry": "安全提交", "Name": "姓名", "Company": "公司", "Work email": "工作邮箱", "Phone / WeChat": "电话 / 微信", "Optional": "选填", "What would you like to solve?": "你希望解决什么问题？", "Your name": "你的姓名", "Company or organization": "公司或组织", "Phone number or WeChat ID": "电话号码或微信号", "Tell us about your environment, goals, timeline or current pain points…": "请说明现有环境、项目目标、时间计划或当前问题……", "Send project brief": "提交项目需求", "Sending…": "发送中……", "Enquiry sent": "已提交", "Please enter your name.": "请输入姓名。", "Please enter your company or organization.": "请输入公司或组织。", "Please enter your work email.": "请输入工作邮箱。", "Please enter a valid email address.": "请输入有效的邮箱地址。", "Please tell us what you would like to solve.": "请说明你希望解决的问题。",
  "Email": "邮箱", "Back to top": "返回顶部", "Explore JOTO TECH": "了解 JOTO TECH", "Hotline": "热线", "Professional Service · Innovation as Priority · Customer Success First": "专业服务 · 持续创新 · 客户成功", "We make IT happen.": "让 IT 真正发生。", "A customer-oriented systems integrator delivering comprehensive IT solutions since 2010.": "始于 2010 年，为企业提供综合 IT 解决方案与系统集成服务。",
  "Primary navigation": "主导航", "Mobile navigation": "移动端导航", "Open menu": "打开菜单", "Close menu": "关闭菜单", "Footer solutions": "页脚解决方案", "Footer company": "页脚公司导航",
};

export const fa: Dictionary = {
  "SOLUTIONS": "راهکارها", "SERVICES": "خدمات", "CASE STUDIES": "مطالعات موردی", "ABOUT": "درباره ما", "BLOG": "دیدگاه‌ها", "CONTACT": "تماس با ما", "Blog": "دیدگاه‌ها",
  "ENTERPRISE-READY IT SOLUTIONS": "راهکارهای فناوری اطلاعات برای سازمان‌ها", "We Make": "ما", "IT": "فناوری اطلاعات", "Connections": "ارتباطات", "Resilience": "تاب‌آوری", "Progress": "پیشرفت", "Happen": "را ممکن می‌کنیم",
  "Enterprise networks, security, data centers, collaboration and physical safeguarding — designed, built and supported for the world's most demanding companies since 2010.": "از سال ۲۰۱۰، شبکه‌های سازمانی، امنیت، مراکز داده، ارتباطات یکپارچه و حفاظت فیزیکی را برای شرکت‌های پیشرو جهان طراحی، اجرا و پشتیبانی می‌کنیم.",
  "[ SINCE 2010 ]": "[ از سال ۲۰۱۰ ]", "Engineered by": "مهندسی‌شده توسط", "Certified Professionals": "متخصصان دارای گواهینامه", "Architecture, integration and support for complex, multi-vendor environments.": "معماری، یکپارچه‌سازی و پشتیبانی برای محیط‌های پیچیده و چندفروشنده‌ای.", "EXPLORE SOLUTIONS": "مشاهده راهکارها",
  "WHAT WE DELIVER": "آنچه ارائه می‌دهیم", "Infrastructure built as one connected system.": "زیرساختی که به‌صورت یک سامانه یکپارچه کار می‌کند.", "A focused portfolio across the network, security, compute, communications and physical safeguards that modern organizations depend on.": "مجموعه‌ای متمرکز در حوزه شبکه، امنیت، پردازش، ارتباطات و حفاظت فیزیکی که سازمان‌های امروز به آن وابسته‌اند.",
  "Network": "شبکه", "Security": "امنیت", "Server & Storage": "سرور و ذخیره‌سازی", "Collaboration": "ارتباطات یکپارچه", "Safeguarding": "حفاظت فیزیکی",
  "Campus, branch and data-center connectivity designed for consistent performance, visibility and control.": "اتصال پردیس، شعب و مراکز داده با عملکرد پایدار، دیدپذیری و کنترل یکپارچه.", "Layered protection for people, identities, applications, networks and day-to-day operations.": "حفاظت چندلایه از کاربران، هویت‌ها، برنامه‌ها، شبکه‌ها و عملیات روزمره.", "Compute and data platforms sized around resilience, workload needs and practical lifecycle management.": "سکوهای پردازش و داده متناسب با تاب‌آوری، نیاز بارهای کاری و مدیریت عملی چرخه عمر.", "Voice, paging and critical communications that connect teams and reach people when timing matters.": "راهکارهای صوتی، پیجینگ و ارتباطات حیاتی برای اتصال تیم‌ها و اطلاع‌رسانی در لحظات حساس.", "Connected video, access and physical-security systems for safer workplaces, campuses and facilities.": "سامانه‌های یکپارچه نظارت تصویری، کنترل دسترسی و امنیت فیزیکی برای محیط‌های کاری و تأسیسات ایمن‌تر.",
  "END-TO-END SERVICES": "خدمات سرتاسری", "From the first workshop to steady-state operations.": "از نخستین جلسه تا عملیات پایدار.", "JOTO brings planning, integration and ongoing service together so multi-vendor environments remain coherent throughout their lifecycle.": "JOTO برنامه‌ریزی، یکپارچه‌سازی و خدمات مستمر را کنار هم قرار می‌دهد تا محیط‌های چندفروشنده‌ای در تمام چرخه عمر هماهنگ بمانند.",
  "IT Planning & Consulting": "برنامه‌ریزی و مشاوره فناوری اطلاعات", "Design & Deployment": "طراحی و استقرار", "24×7 Support & Maintenance": "پشتیبانی و نگهداری ۲۴×۷", "Managed Security Services": "خدمات امنیت مدیریت‌شده", "Managed Outsourcing & Staffing": "برون‌سپاری و تأمین نیروی مدیریت‌شده", "IT Procurement": "تأمین تجهیزات فناوری اطلاعات",
  "IT strategy, architecture design and cross-border data compliance consulting — before a single box is ordered.": "راهبرد فناوری اطلاعات، طراحی معماری و مشاوره انطباق داده‌های برون‌مرزی، پیش از سفارش هر تجهیز.", "Turnkey delivery from structured cabling to cloud: engineering, installation, migration and cut-over, on site.": "تحویل کلید در دست از کابل‌کشی ساخت‌یافته تا ابر؛ شامل مهندسی، نصب، مهاجرت و راه‌اندازی در محل.", "Round-the-clock multilingual hotline, SLA-backed maintenance, spare parts and daily on-site helpdesk.": "خط پشتیبانی چندزبانه شبانه‌روزی، نگهداری مبتنی بر SLA، قطعات یدکی و میز خدمت روزانه در محل.", "MSS with SOC monitoring and Level-3 security operations — proven across a 15,000-server estate.": "خدمات MSS با پایش SOC و عملیات امنیت سطح سه؛ آزموده‌شده در محیطی با ۱۵٬۰۰۰ سرور.", "Dedicated on-site IT and AI teams, personnel outsourcing and ITIL-based managed operations.": "تیم‌های اختصاصی فناوری اطلاعات و هوش مصنوعی در محل، برون‌سپاری نیرو و عملیات مدیریت‌شده مبتنی بر ITIL.", "One-stop sourcing of hardware, software and cloud services for organizations operating across global markets.": "تأمین یکپارچه سخت‌افزار، نرم‌افزار و خدمات ابری برای سازمان‌های فعال در بازارهای جهانی.",
  "SELECTED EXPERIENCE": "تجربه‌های منتخب", "Complex environments, delivered with care.": "تحویل دقیق در محیط‌های پیچیده.", "Selected references from JOTO materials. Scope statements remain deliberately concise pending the next client-approval review.": "نمونه‌هایی منتخب از سوابق JOTO؛ دامنه پروژه‌ها بر اساس اطلاعات مجاز برای انتشار، به‌صورت خلاصه ارائه شده است.",
  "Education": "آموزش", "Retail & F&B": "خرده‌فروشی و صنایع غذایی", "Life Sciences & Manufacturing": "علوم زیستی و تولید", "E-commerce": "تجارت الکترونیک",
  "WHY JOTO": "چرا JOTO", "A China-based technology partner with an international delivery view.": "شریک فناوری مستقر در چین با توان تحویل بین‌المللی.", "Established in Shanghai in 2010, JOTO plans, integrates and supports enterprise IT and physical-security environments across multiple technology domains.": "JOTO که در سال ۲۰۱۰ در شانگهای تأسیس شد، محیط‌های فناوری اطلاعات سازمانی و امنیت فیزیکی را در حوزه‌های گوناگون برنامه‌ریزی، یکپارچه و پشتیبانی می‌کند.", "Our role is to connect strategy with field delivery: one team coordinating architecture, products, deployment and ongoing service across China and selected international locations.": "نقش ما پیوند دادن راهبرد با اجرای میدانی است؛ یک تیم واحد، معماری، محصولات، استقرار و خدمات مستمر را در چین و بازارهای بین‌المللی منتخب هماهنگ می‌کند.",
  "Established in Shanghai": "تأسیس در شانگهای", "Solution domains": "حوزه راهکار", "MULTI-VENDOR": "چندفروشنده‌ای", "Integrated delivery model": "مدل تحویل یکپارچه", "LIFECYCLE": "چرخه عمر", "Plan, deploy and operate": "برنامه‌ریزی، استقرار و بهره‌برداری",
  "TECHNOLOGY PORTFOLIO": "سبد فناوری", "A focused multi-vendor ecosystem.": "اکوسیستم متمرکز چندفروشنده‌ای.", "A trusted network of technology leaders supporting secure, connected and resilient enterprise environments.": "شبکه‌ای از رهبران معتبر فناوری برای ایجاد محیط‌های سازمانی امن، متصل و تاب‌آور.",
  "GLOBAL PRESENCE": "حضور جهانی", "Local execution, coordinated across borders.": "اجرای محلی، هماهنگی فرامرزی.", "JOTO materials identify delivery presence across the following markets. Exact office and service coverage can be refined before public launch.": "JOTO در بازارهای زیر توان تحویل دارد؛ دامنه دقیق دفاتر و خدمات بر اساس نیاز هر پروژه مشخص می‌شود.",
  "China": "چین", "Japan": "ژاپن", "Thailand": "تایلند", "Singapore": "سنگاپور", "United States": "ایالات متحده", "United Kingdom": "بریتانیا", "Shanghai": "شانگهای", "Beijing": "پکن", "Shenzhen": "شنژن", "Suzhou": "سوژو", "Hong Kong": "هنگ‌کنگ", "Tokyo": "توکیو", "Bangkok": "بانکوک", "Cupertino": "کوپرتینو", "Sheridan": "شریدن", "London": "لندن", "LOCATION": "موقعیت", "LOCATIONS": "موقعیت",
  "START A CONVERSATION": "گفت‌وگو را آغاز کنید", "Bring us the environment you need to improve.": "محیطی را که می‌خواهید بهبود دهید با ما در میان بگذارید.", "Tell us about your locations, priorities and timeline. We will help shape a practical next step.": "درباره موقعیت‌ها، اولویت‌ها و زمان‌بندی خود بگویید تا گام بعدی عملی را با هم تعریف کنیم.", "© JOTO TECH. All rights reserved.": "© JOTO TECH. تمامی حقوق محفوظ است.",
  "ABOUT US": "درباره ما", "Built to make": "ساخته‌شده برای تحقق", "complex": "فناوری اطلاعات پیچیده", "happen.": "در عمل.", "A customer-oriented technology company turning demanding enterprise requirements into reliable, connected systems since 2010.": "شرکتی مشتری‌محور که از سال ۲۰۱۰ نیازهای پیچیده سازمانی را به سامانه‌های قابل‌اعتماد و متصل تبدیل می‌کند.", "Who we are": "ما که هستیم", "How we work": "روش کار ما", "Plan & Design": "برنامه‌ریزی و طراحی", "Build & Integrate": "اجرا و یکپارچه‌سازی", "Run & Improve": "بهره‌برداری و بهبود", "Advisors first.": "ابتدا مشاور.", "Integrators always.": "همیشه یکپارچه‌ساز.", "Local hands,": "تیم‌های محلی،", "worldwide.": "هماهنگی جهانی.", "Start a conversation": "گفت‌وگو را آغاز کنید", "Let’s make what’s next happen.": "گام بعدی را با هم عملی کنیم.",
  "CONTACT US": "تماس با ما", "Tell us what": "بگویید چه چیزی", "you’re": "در حال", "building.": "ساختن هستید.", "Start with the challenge.": "از چالش شروع کنید.", "Our offices": "دفاتر ما", "Find JOTO": "JOTO را", "nearby.": "نزدیک خود بیابید.", "Global delivery": "تحویل جهانی", "Plan a multi-region rollout": "برنامه‌ریزی استقرار چندمنطقه‌ای",
  "Service hotline": "خط خدمات", "Shanghai HQ": "دفتر مرکزی شانگهای", "Sales & projects": "فروش و پروژه‌ها", "Start a call": "تماس بگیرید", "Reach the team": "ارتباط با تیم", "Write to us": "برای ما بنویسید",
  "Send us your requirements": "نیازمندی‌های خود را ارسال کنید", "Fields marked with * are required.": "فیلدهای دارای * الزامی هستند.", "Secure enquiry": "درخواست امن", "Name": "نام", "Company": "شرکت", "Work email": "ایمیل کاری", "Phone / WeChat": "تلفن / وی‌چت", "Optional": "اختیاری", "What would you like to solve?": "چه مسئله‌ای را می‌خواهید حل کنید؟", "Your name": "نام شما", "Company or organization": "شرکت یا سازمان", "Phone number or WeChat ID": "شماره تلفن یا شناسه وی‌چت", "Tell us about your environment, goals, timeline or current pain points…": "درباره محیط، اهداف، زمان‌بندی یا چالش‌های فعلی خود توضیح دهید…", "Send project brief": "ارسال شرح پروژه", "Sending…": "در حال ارسال…", "Enquiry sent": "درخواست ارسال شد", "Please enter your name.": "لطفاً نام خود را وارد کنید.", "Please enter your company or organization.": "لطفاً نام شرکت یا سازمان را وارد کنید.", "Please enter your work email.": "لطفاً ایمیل کاری را وارد کنید.", "Please enter a valid email address.": "لطفاً یک ایمیل معتبر وارد کنید.", "Please tell us what you would like to solve.": "لطفاً مسئله موردنظر را توضیح دهید.",
  "Email": "ایمیل", "Back to top": "بازگشت به بالا", "Explore JOTO TECH": "مشاهده JOTO TECH", "Hotline": "خط خدمات", "Professional Service · Innovation as Priority · Customer Success First": "خدمات حرفه‌ای · نوآوری در اولویت · موفقیت مشتری در صدر", "We make IT happen.": "فناوری اطلاعات را عملی می‌کنیم.", "A customer-oriented systems integrator delivering comprehensive IT solutions since 2010.": "یکپارچه‌ساز سامانه‌های مشتری‌محور با ارائه راهکارهای جامع فناوری اطلاعات از سال ۲۰۱۰.",
  "Primary navigation": "پیمایش اصلی", "Mobile navigation": "پیمایش موبایل", "Open menu": "باز کردن منو", "Close menu": "بستن منو", "Footer solutions": "راهکارهای پایین صفحه", "Footer company": "پیوندهای شرکت در پایین صفحه",
};

Object.assign(zh, {
  "services": "服务",
  "About Us": "关于我们", "Services": "服务", "Case Studies": "客户案例", "Contact Us": "联系我们", "Contact": "联系",
  "CUSTOMER ECOSYSTEM": "服务客户", "TRUSTED BY INDUSTRY LEADERS": "获得各行业领先企业信赖", "Customer logos row": "客户标志行",
  "Global delivery network": "全球交付网络", "World map showing JOTO's international delivery footprint": "JOTO 国际交付网络地图", "Connected teams supporting international operations across time zones.": "跨时区协作，为国际业务提供持续支持。",
  "JOTO TECH provides comprehensive IT solutions across networks, security, data centers, collaboration and physical safeguarding — alongside planning, consulting and managed services.": "JOTO TECH 提供网络、安全、数据中心、协作通信与物理安防解决方案，同时覆盖规划咨询和托管服务。",
  "Our senior team brings experience from": "我们的资深团队曾任职于", ", with a track record of supporting complex environments for global enterprises.": "等企业，并长期服务全球企业的复杂 IT 环境。", "Professional service. Innovation first. Customer success always.": "专业服务，持续创新，以客户成功为目标。",
  "Requirements, architecture and cross-border planning grounded in how your business actually operates.": "从实际业务出发，完成需求梳理、架构设计与跨境规划。", "One accountable engineering team across network, security, data center and physical systems.": "由一支统一负责的工程团队统筹网络、安全、数据中心与物理系统。", "Managed services, on-site helpdesk and 24×7 maintenance throughout the technology lifecycle.": "在技术全生命周期内提供托管服务、驻场支持与 7×24 维护。", "Open the JOTO contact page": "打开 JOTO 联系页面",
  "A new office, a security program or a global rollout — share the challenge and we’ll come back with a practical plan, usually within one business day.": "无论是新建办公室、安全项目还是全球部署，请告诉我们项目情况；团队通常会在一个工作日内回复并提出初步建议。", "Project brief": "项目需求", "Share a few details about your organization and what you need to solve. Our team will respond within one business day.": "请简要介绍企业情况和需要解决的问题，团队将在一个工作日内回复。", "Thank you. Your project brief has been sent, and our team will reply within one business day.": "项目需求已提交，团队将在一个工作日内回复。", "We could not send your enquiry. Please try again or email": "暂时无法提交，请重试或发送邮件至", "By submitting, you agree that JOTO TECH may use this information to respond to your enquiry.": "提交即表示你同意 JOTO TECH 使用这些信息回复本次咨询。",
  "View": "查看", "Explore": "探索", "case studies": "客户案例", "use cases": "应用场景", "Contact JOTO": "联系 JOTO", "Start a project": "启动项目", "solutions · designed, deployed and supported by JOTO": "解决方案 · 由 JOTO 设计、部署并支持",
  "Network / Cisco": "网络 / Cisco", "Cisco solutions,": "Cisco 解决方案，", "delivered by JOTO.": "由 JOTO 负责落地。", "JOTO helps enterprises plan, deploy and operate Cisco network infrastructure across offices, campuses, factories and data centers. Our team brings practical experience across Catalyst, Nexus, Meraki and Cisco UCS, with support covering both project delivery and daily operations.": "JOTO 为办公室、园区、工厂和数据中心提供 Cisco 网络的规划、部署与运营服务。团队具备 Catalyst、Nexus、Meraki 和 Cisco UCS 的实际项目经验，服务覆盖项目交付和日常运维。",
  "Cisco expertise, backed by delivery experience.": "Cisco 专业能力，来自实际交付经验。", "Cisco services from JOTO": "JOTO 的 Cisco 服务", "Consulting & Design": "咨询与设计", "Integration & Support": "集成与支持", "Managed Services": "托管服务", "Selected Deployments": "代表项目", "Cisco infrastructure, proven in the field.": "经过实际项目验证的 Cisco 基础设施。", "Discuss your Cisco project with JOTO.": "咨询 JOTO 的 Cisco 项目团队。",
  "Enterprise-focused design": "面向企业的设计", "China and cross-border delivery": "中国及跨境交付", "Long-term operational support": "长期运营支持", "Network assessment and requirements": "网络评估与需求梳理", "Topology and high-availability design": "拓扑与高可用设计", "Wired and wireless coverage planning": "有线与无线覆盖规划", "Hardware, licensing and rollout planning": "硬件、许可与上线规划", "Catalyst, wireless and Meraki deployment": "Catalyst、无线与 Meraki 部署", "Nexus and UCS integration": "Nexus 与 UCS 集成", "Migration, cutover and validation": "迁移、割接与验证", "Configuration, tuning and documentation": "配置、调优与文档", "Monitoring, incident response and backups": "监控、事件响应与备份", "Software and firmware maintenance": "软件与固件维护", "Performance optimization": "性能优化", "Remote and on-site engineering support": "远程与现场工程支持",
  "Campus networking": "园区网络", "Wireless infrastructure": "无线基础设施", "On-site support": "驻场支持", "Network security": "网络安全", "Endpoint protection": "终端防护", "Security operations": "安全运营", "Data-center networking": "数据中心网络", "Compute and storage": "计算与存储", "Physical security": "物理安防", "Global workplace design": "全球办公环境设计", "Network and security": "网络与安全", "Site deployment": "现场部署",
  "Cisco Catalyst switches, wireless access points and Catalyst Center management interface": "Cisco Catalyst 交换机、无线接入点与 Catalyst Center 管理界面", "Cisco networking infrastructure · planned, deployed and supported by JOTO": "Cisco 网络基础设施 · 由 JOTO 规划、部署并支持",
  "JOTO provides Cisco-based network design, deployment and ongoing support for enterprises operating across China and international locations. Our work extends beyond product supply: we help customers translate business and technical requirements into reliable infrastructure, integrate Cisco with the wider IT environment, and support the network after go-live.": "JOTO 面向中国及国际市场提供 Cisco 网络设计、部署和持续支持。除产品供应外，我们还负责需求梳理、基础设施规划、系统集成和上线后的网络运维。",
  "Network architecture built around offices, campuses, factories and data centers, with capacity, coverage, availability and long-term growth considered from the start.": "围绕办公室、园区、工厂和数据中心构建网络架构，从一开始就统筹容量、覆盖、可用性与长期增长。", "Coordination across headquarters standards, local environments, on-site delivery, supply chains and ongoing support for China and international locations.": "协调总部标准、本地环境、现场交付、供应链和持续支持，覆盖中国及国际项目地点。", "Monitoring, incident response, configuration changes, software maintenance, spare-parts coordination and on-site assistance after go-live.": "上线后提供监控、事件响应、配置变更、软件维护、备件协调与现场支持。",
  "From network planning to integration and ongoing support, JOTO provides the services required to keep Cisco infrastructure aligned with day-to-day business needs.": "JOTO 提供网络规划、系统集成和持续运维，确保 Cisco 基础设施满足日常业务需要。", "JOTO turns business, site and infrastructure requirements into a practical network architecture.": "JOTO 将业务、站点与基础设施需求转化为可实施的网络架构。", "JOTO deploys Cisco infrastructure and integrates it with the wider IT environment.": "JOTO 负责 Cisco 基础设施部署，并与现有 IT 环境完成集成。", "JOTO keeps Cisco environments monitored, maintained and supported across agreed locations.": "JOTO 按约定范围提供 Cisco 环境的监控、维护与技术支持。",
  "Selected environments where JOTO has designed, deployed or supported Cisco technology as part of a wider business-critical solution.": "以下项目展示 JOTO 在关键业务场景中对 Cisco 技术的设计、部署与支持能力。", "Campus Network & Security": "园区网络与安全", "End-to-end IT Infrastructure": "一体化 IT 基础设施", "IT Procurement & Managed Services": "IT 采购与托管服务", "5 campuses, 2019–2022": "5 个园区，2019–2022", "Across five new international schools, JOTO delivered the full IT infrastructure — including Cisco's largest DNA deployment in China.": "JOTO 为五所新建国际学校交付完整 IT 基础设施，其中包括 Cisco DNA 在中国规模最大的部署项目。", "Cisco DNA architecture — 3,500+ Wi-Fi 5/6 APs": "Cisco DNA 架构 — 3,500+ 个 Wi-Fi 5/6 接入点", "800+ Cisco Catalyst 9200/9300 switches": "800+ 台 Cisco Catalyst 9200/9300 交换机", "Daily on-site helpdesk": "日常驻场服务台", "JOTO is responsible for the construction and maintenance of IT and security infrastructure for Danaher's offices across China.": "JOTO 负责 Danaher 中国各办公室 IT 与安全基础设施的建设和维护。", "Cisco Nexus data-center network": "Cisco Nexus 数据中心网络", "Cisco UCS servers": "Cisco UCS 服务器", "Ongoing nationwide maintenance": "全国范围持续维护", "As Chewy expands into China, JOTO handles its IT procurement, installation and ongoing maintenance.": "在 Chewy 拓展中国业务的过程中，JOTO 负责 IT 采购、安装与持续维护。", "Cisco Meraki networking": "Cisco Meraki 网络", "Site deployment and installation": "现场部署与安装", "On-site technical support": "现场技术支持", "Tell us about your sites, users, current infrastructure and support requirements. Our team can help assess the next practical step for your Cisco environment.": "请提供站点、用户、现有基础设施和支持需求，我们将据此评估 Cisco 项目的后续工作。",
});

Object.assign(fa, {
  "services": "خدمات",
  "About Us": "درباره ما", "Services": "خدمات", "Case Studies": "مطالعات موردی", "Contact Us": "تماس با ما", "Contact": "تماس",
  "CUSTOMER ECOSYSTEM": "اکوسیستم مشتریان", "TRUSTED BY INDUSTRY LEADERS": "مورد اعتماد رهبران صنایع", "Customer logos row": "ردیف نشان مشتریان",
  "Global delivery network": "شبکه تحویل جهانی", "World map showing JOTO's international delivery footprint": "نقشه جهان و گستره تحویل بین‌المللی JOTO", "Connected teams supporting international operations across time zones.": "تیم‌های متصل که در مناطق زمانی مختلف از عملیات بین‌المللی پشتیبانی می‌کنند.",
  "JOTO TECH provides comprehensive IT solutions across networks, security, data centers, collaboration and physical safeguarding — alongside planning, consulting and managed services.": "JOTO TECH راهکارهای جامع فناوری اطلاعات در شبکه، امنیت، مراکز داده، ارتباطات یکپارچه و حفاظت فیزیکی را همراه با برنامه‌ریزی، مشاوره و خدمات مدیریت‌شده ارائه می‌دهد.",
  "Our senior team brings experience from": "تیم ارشد ما تجربه فعالیت در", ", with a track record of supporting complex environments for global enterprises.": "را دارد و سابقه پشتیبانی از محیط‌های پیچیده شرکت‌های بین‌المللی را در کارنامه خود ثبت کرده است.", "Professional service. Innovation first. Customer success always.": "خدمات حرفه‌ای؛ نوآوری در اولویت؛ موفقیت مشتری، همیشه.",
  "Requirements, architecture and cross-border planning grounded in how your business actually operates.": "نیازمندی‌ها، معماری و برنامه‌ریزی فرامرزی بر پایه شیوه واقعی فعالیت کسب‌وکار شما.", "One accountable engineering team across network, security, data center and physical systems.": "یک تیم مهندسی پاسخ‌گو برای شبکه، امنیت، مرکز داده و سامانه‌های فیزیکی.", "Managed services, on-site helpdesk and 24×7 maintenance throughout the technology lifecycle.": "خدمات مدیریت‌شده، میز خدمت در محل و نگهداری ۲۴×۷ در تمام چرخه عمر فناوری.", "Open the JOTO contact page": "باز کردن صفحه تماس JOTO",
  "A new office, a security program or a global rollout — share the challenge and we’ll come back with a practical plan, usually within one business day.": "برای دفتر جدید، برنامه امنیتی یا استقرار جهانی، چالش خود را مطرح کنید؛ معمولاً ظرف یک روز کاری با برنامه‌ای عملی پاسخ می‌دهیم.", "Project brief": "شرح پروژه", "Share a few details about your organization and what you need to solve. Our team will respond within one business day.": "چند نکته درباره سازمان و مسئله موردنظر بنویسید؛ تیم ما ظرف یک روز کاری پاسخ خواهد داد.", "Thank you. Your project brief has been sent, and our team will reply within one business day.": "سپاسگزاریم. شرح پروژه ارسال شد و تیم ما ظرف یک روز کاری پاسخ خواهد داد.", "We could not send your enquiry. Please try again or email": "ارسال درخواست ممکن نشد. دوباره تلاش کنید یا ایمیل بزنید به", "By submitting, you agree that JOTO TECH may use this information to respond to your enquiry.": "با ارسال فرم موافقت می‌کنید که JOTO TECH از این اطلاعات برای پاسخ به درخواست شما استفاده کند.",
  "View": "مشاهده", "Explore": "بررسی", "case studies": "مطالعات موردی", "use cases": "کاربردها", "Contact JOTO": "تماس با JOTO", "Start a project": "شروع پروژه", "solutions · designed, deployed and supported by JOTO": "راهکارها · طراحی، استقرار و پشتیبانی توسط JOTO",
  "Network / Cisco": "شبکه / Cisco", "Cisco solutions,": "راهکارهای Cisco،", "delivered by JOTO.": "با اجرای JOTO.", "JOTO helps enterprises plan, deploy and operate Cisco network infrastructure across offices, campuses, factories and data centers. Our team brings practical experience across Catalyst, Nexus, Meraki and Cisco UCS, with support covering both project delivery and daily operations.": "JOTO به سازمان‌ها کمک می‌کند زیرساخت شبکه Cisco را در دفاتر، پردیس‌ها، کارخانه‌ها و مراکز داده برنامه‌ریزی، مستقر و بهره‌برداری کنند. تیم ما در Catalyst، Nexus، Meraki و Cisco UCS تجربه عملی دارد و از تحویل پروژه تا عملیات روزانه پشتیبانی می‌کند.",
  "Cisco expertise, backed by delivery experience.": "تخصص Cisco با پشتوانه تجربه اجرایی.", "Cisco services from JOTO": "خدمات Cisco از JOTO", "Consulting & Design": "مشاوره و طراحی", "Integration & Support": "یکپارچه‌سازی و پشتیبانی", "Managed Services": "خدمات مدیریت‌شده", "Selected Deployments": "استقرارهای منتخب", "Cisco infrastructure, proven in the field.": "زیرساخت Cisco، آزموده‌شده در میدان عمل.", "Discuss your Cisco project with JOTO.": "پروژه Cisco خود را با JOTO در میان بگذارید.",
  "Enterprise-focused design": "طراحی سازمان‌محور", "China and cross-border delivery": "تحویل در چین و فرامرزی", "Long-term operational support": "پشتیبانی عملیاتی بلندمدت", "Network assessment and requirements": "ارزیابی شبکه و نیازمندی‌ها", "Topology and high-availability design": "طراحی توپولوژی و دسترس‌پذیری بالا", "Wired and wireless coverage planning": "برنامه‌ریزی پوشش سیمی و بی‌سیم", "Hardware, licensing and rollout planning": "برنامه‌ریزی سخت‌افزار، مجوز و استقرار", "Catalyst, wireless and Meraki deployment": "استقرار Catalyst، بی‌سیم و Meraki", "Nexus and UCS integration": "یکپارچه‌سازی Nexus و UCS", "Migration, cutover and validation": "مهاجرت، انتقال و اعتبارسنجی", "Configuration, tuning and documentation": "پیکربندی، بهینه‌سازی و مستندسازی", "Monitoring, incident response and backups": "پایش، پاسخ به رخداد و پشتیبان‌گیری", "Software and firmware maintenance": "نگهداری نرم‌افزار و میان‌افزار", "Performance optimization": "بهینه‌سازی عملکرد", "Remote and on-site engineering support": "پشتیبانی مهندسی دورکار و در محل",
  "Campus networking": "شبکه پردیس", "Wireless infrastructure": "زیرساخت بی‌سیم", "On-site support": "پشتیبانی در محل", "Network security": "امنیت شبکه", "Endpoint protection": "حفاظت نقاط پایانی", "Security operations": "عملیات امنیت", "Data-center networking": "شبکه مرکز داده", "Compute and storage": "پردازش و ذخیره‌سازی", "Physical security": "امنیت فیزیکی", "Global workplace design": "طراحی محیط کار جهانی", "Network and security": "شبکه و امنیت", "Site deployment": "استقرار در محل",
  "Cisco Catalyst switches, wireless access points and Catalyst Center management interface": "سوئیچ‌های Cisco Catalyst، نقاط دسترسی بی‌سیم و رابط مدیریت Catalyst Center", "Cisco networking infrastructure · planned, deployed and supported by JOTO": "زیرساخت شبکه Cisco · برنامه‌ریزی، استقرار و پشتیبانی توسط JOTO",
  "JOTO provides Cisco-based network design, deployment and ongoing support for enterprises operating across China and international locations. Our work extends beyond product supply: we help customers translate business and technical requirements into reliable infrastructure, integrate Cisco with the wider IT environment, and support the network after go-live.": "JOTO طراحی، استقرار و پشتیبانی مستمر شبکه مبتنی بر Cisco را برای سازمان‌های فعال در چین و بازارهای بین‌المللی ارائه می‌دهد. خدمات ما فراتر از تأمین محصول است: نیازهای کسب‌وکار و فنی را به زیرساختی قابل‌اعتماد تبدیل می‌کنیم، Cisco را با محیط کلی فناوری اطلاعات یکپارچه می‌سازیم و پس از راه‌اندازی از شبکه پشتیبانی می‌کنیم.",
  "Network architecture built around offices, campuses, factories and data centers, with capacity, coverage, availability and long-term growth considered from the start.": "معماری شبکه برای دفاتر، پردیس‌ها، کارخانه‌ها و مراکز داده با درنظرگرفتن ظرفیت، پوشش، دسترس‌پذیری و رشد بلندمدت از ابتدا.", "Coordination across headquarters standards, local environments, on-site delivery, supply chains and ongoing support for China and international locations.": "هماهنگی استانداردهای دفتر مرکزی، محیط‌های محلی، تحویل در محل، زنجیره تأمین و پشتیبانی مستمر در چین و مکان‌های بین‌المللی.", "Monitoring, incident response, configuration changes, software maintenance, spare-parts coordination and on-site assistance after go-live.": "پایش، پاسخ به رخداد، تغییرات پیکربندی، نگهداری نرم‌افزار، هماهنگی قطعات یدکی و کمک در محل پس از راه‌اندازی.",
  "From network planning to integration and ongoing support, JOTO provides the services required to keep Cisco infrastructure aligned with day-to-day business needs.": "از برنامه‌ریزی شبکه تا یکپارچه‌سازی و پشتیبانی مستمر، JOTO خدمات لازم را برای هماهنگی زیرساخت Cisco با نیازهای روزمره کسب‌وکار ارائه می‌دهد.", "JOTO turns business, site and infrastructure requirements into a practical network architecture.": "JOTO نیازهای کسب‌وکار، سایت و زیرساخت را به معماری شبکه‌ای عملی تبدیل می‌کند.", "JOTO deploys Cisco infrastructure and integrates it with the wider IT environment.": "JOTO زیرساخت Cisco را مستقر و با محیط کلی فناوری اطلاعات یکپارچه می‌کند.", "JOTO keeps Cisco environments monitored, maintained and supported across agreed locations.": "JOTO محیط‌های Cisco را در مکان‌های توافق‌شده پایش، نگهداری و پشتیبانی می‌کند.",
  "Selected environments where JOTO has designed, deployed or supported Cisco technology as part of a wider business-critical solution.": "نمونه‌هایی منتخب که در آن JOTO فناوری Cisco را به‌عنوان بخشی از راهکاری حیاتی برای کسب‌وکار طراحی، مستقر یا پشتیبانی کرده است.", "Campus Network & Security": "شبکه و امنیت پردیس", "End-to-end IT Infrastructure": "زیرساخت سرتاسری فناوری اطلاعات", "IT Procurement & Managed Services": "تأمین فناوری اطلاعات و خدمات مدیریت‌شده", "5 campuses, 2019–2022": "۵ پردیس، ۲۰۱۹–۲۰۲۲", "Across five new international schools, JOTO delivered the full IT infrastructure — including Cisco's largest DNA deployment in China.": "JOTO زیرساخت کامل فناوری اطلاعات پنج مدرسه بین‌المللی جدید را تحویل داد؛ از جمله بزرگ‌ترین استقرار Cisco DNA در چین.", "Cisco DNA architecture — 3,500+ Wi-Fi 5/6 APs": "معماری Cisco DNA — بیش از ۳۵۰۰ نقطه دسترسی Wi-Fi 5/6", "800+ Cisco Catalyst 9200/9300 switches": "بیش از ۸۰۰ سوئیچ Cisco Catalyst 9200/9300", "Daily on-site helpdesk": "میز خدمت روزانه در محل", "JOTO is responsible for the construction and maintenance of IT and security infrastructure for Danaher's offices across China.": "JOTO مسئول ساخت و نگهداری زیرساخت فناوری اطلاعات و امنیت دفاتر Danaher در سراسر چین است.", "Cisco Nexus data-center network": "شبکه مرکز داده Cisco Nexus", "Cisco UCS servers": "سرورهای Cisco UCS", "Ongoing nationwide maintenance": "نگهداری مستمر در سراسر کشور", "As Chewy expands into China, JOTO handles its IT procurement, installation and ongoing maintenance.": "هم‌زمان با توسعه Chewy در چین، JOTO تأمین، نصب و نگهداری مستمر فناوری اطلاعات آن را بر عهده دارد.", "Cisco Meraki networking": "شبکه Cisco Meraki", "Site deployment and installation": "استقرار و نصب در محل", "On-site technical support": "پشتیبانی فنی در محل", "Tell us about your sites, users, current infrastructure and support requirements. Our team can help assess the next practical step for your Cisco environment.": "درباره سایت‌ها، کاربران، زیرساخت فعلی و نیازهای پشتیبانی خود بگویید تا گام عملی بعدی برای محیط Cisco را ارزیابی کنیم.",
});

Object.assign(zh, {
  "Learn more": "了解更多",
  "Campus networking and ongoing on-site support for international-school environments in China.": "为中国的国际学校环境提供园区网络与持续驻场支持。",
  "Security-infrastructure reinforcement supporting large-scale business operations in China.": "强化安全基础设施，支持在中国的大规模业务运营。",
  "Multi-site IT and security infrastructure delivery and maintenance for offices in China.": "为中国多个办公地点交付并维护 IT 与安全基础设施。",
  "Workplace infrastructure design and deployment supporting international business expansion.": "设计并部署办公基础设施，支持国际业务拓展。",
  "Shanghai (HQ)": "上海（总部）",
  "Yangtze River Delta": "长三角", "Greater Bay Area": "粤港澳大湾区", "Sheridan, Wyoming": "怀俄明州谢里登", "Language selector": "语言选择", "Open solution branches": "展开解决方案分类", "Close solution branches": "收起解决方案分类",
});

Object.assign(fa, {
  "Learn more": "بیشتر بدانید",
  "Campus networking and ongoing on-site support for international-school environments in China.": "شبکه پردیس و پشتیبانی مستمر در محل برای مدارس بین‌المللی در چین.",
  "Security-infrastructure reinforcement supporting large-scale business operations in China.": "تقویت زیرساخت امنیت برای پشتیبانی از عملیات گسترده کسب‌وکار در چین.",
  "Multi-site IT and security infrastructure delivery and maintenance for offices in China.": "تحویل و نگهداری زیرساخت فناوری اطلاعات و امنیت در چندین دفتر در چین.",
  "Workplace infrastructure design and deployment supporting international business expansion.": "طراحی و استقرار زیرساخت محیط کار برای پشتیبانی از توسعه بین‌المللی کسب‌وکار.",
  "Shanghai (HQ)": "شانگهای (دفتر مرکزی)",
  "Yangtze River Delta": "دلتای رود یانگ‌تسه", "Greater Bay Area": "منطقه خلیج بزرگ", "Sheridan, Wyoming": "شریدن، وایومینگ", "Language selector": "انتخاب زبان", "Open solution branches": "باز کردن دسته‌های راهکار", "Close solution branches": "بستن دسته‌های راهکار",
});

function translateValue<T>(value: T, dictionary: Dictionary): T {
  if (typeof value === "string") return (dictionary[value] ?? value) as T;
  if (Array.isArray(value)) return value.map((item) => translateValue(item, dictionary)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, translateValue(item, dictionary)]),
    ) as T;
  }
  return value;
}

function buildSiteContent(locale: Locale): SiteContent {
  if (locale === "en") return englishSiteContent;
  const localized = translateValue(englishSiteContent, locale === "zh-CN" ? zh : fa);
  const zhLocale = locale === "zh-CN";
  const descriptions = new Map<string, string>();

  localized.solutions.categories = localized.solutions.categories.map((category) => ({
    ...category,
    imageAlt: zhLocale ? `${category.title}解决方案场景` : `نمای راهکار ${category.title}`,
    vendors: category.vendors.map((vendor) => {
      const description = zhLocale
        ? `${vendor.name} 提供${category.title}领域的产品与技术，JOTO 负责方案规划、系统集成与后续支持。`
        : `${vendor.name} محصولات و توانمندی‌های تخصصی برای محیط‌های سازمانی ${category.title} ارائه می‌دهد و JOTO برنامه‌ریزی، یکپارچه‌سازی و پشتیبانی آن را انجام می‌دهد.`;
      descriptions.set(vendor.name, description);
      return { ...vendor, description };
    }),
  }));
  localized.partners.items = localized.partners.items.map((vendor) => ({
    ...vendor,
    description: descriptions.get(vendor.name) ?? vendor.description,
  }));
  localized.services.items = localized.services.items.map((service) => ({
    ...service,
    imageAlt: zhLocale ? `${service.title}服务场景` : `نمای خدمات ${service.title}`,
  }));
  return localized;
}

export const siteContentByLocale: Record<Locale, SiteContent> = {
  en: englishSiteContent,
  "zh-CN": buildSiteContent("zh-CN"),
  "fa-IR": buildSiteContent("fa-IR"),
};

export function translate(locale: Locale, source: string): string {
  if (locale === "zh-CN") return zh[source] ?? source;
  if (locale === "fa-IR") return fa[source] ?? source;
  return source;
}

export function translateObject<T>(locale: Locale, value: T): T {
  return locale === "en" ? value : translateValue(value, locale === "zh-CN" ? zh : fa);
}

export function localizePartnerDetail(
  locale: Locale,
  detail: PartnerDetail | undefined,
): PartnerDetail | undefined {
  if (!detail || locale === "en") return detail;
  const translated = translateObject(locale, detail);
  if (detail.pathname === "/solutions/network/cisco") return translated;

  const partner = detail.partnerName;
  const solution = translate(locale, detail.solutionName);
  const zhLocale = locale === "zh-CN";
  const profile = (zhLocale ? zhPartnerProfiles : faPartnerProfiles)[detail.pathname];
  if (!profile) return translated;
  const capabilities = zhLocale
    ? [
        ["业务与技术需求评估", `${partner} 方案架构设计`, "容量、风险与实施规划"],
        [`${partner} 产品配置与部署`, "与现有环境集成", "迁移、测试与交付文档"],
        ["健康状态与性能监控", "配置、软件与生命周期维护", "远程及现场技术支持"],
      ]
    : [
        ["ارزیابی نیازهای کسب‌وکار و فنی", `طراحی معماری راهکار ${partner}`, "برنامه‌ریزی ظرفیت، ریسک و اجرا"],
        [`پیکربندی و استقرار محصولات ${partner}`, "یکپارچه‌سازی با محیط موجود", "مهاجرت، آزمون و مستندات تحویل"],
        ["پایش سلامت و عملکرد", "نگهداری پیکربندی، نرم‌افزار و چرخه عمر", "پشتیبانی فنی دورکار و در محل"],
      ];

  return {
    ...translated,
    eyebrow: `${solution} / ${partner}`,
    title: profile.title,
    accent: profile.accent,
    introduction: profile.introduction,
    heroVisual: {
      ...translated.heroVisual,
      alt: zhLocale ? `${partner} ${solution}解决方案环境` : `محیط راهکار ${solution} شرکت ${partner}`,
      caption: zhLocale ? `${partner} 技术 · 由 JOTO 规划、部署并支持` : `فناوری ${partner} · برنامه‌ریزی، استقرار و پشتیبانی توسط JOTO`,
    },
    relationshipTitle: profile.relationshipTitle,
    relationshipDescription: zhLocale
      ? `JOTO 围绕“${profile.serviceTitles.join("、")}”组织 ${partner} 方案，让架构、实施和后续运营保持一致。`
      : `JOTO خدمات ${partner} را در سه مسیر «${profile.serviceTitles.join("، ")}» سازمان‌دهی می‌کند تا معماری، اجرا و عملیات مستمر هماهنگ بمانند.`,
    reasons: profile.serviceTitles.map((title, index) => ({
      title,
      description: zhLocale
        ? [
            `先梳理与“${title}”相关的业务目标、现状和实施边界。`,
            `围绕“${title}”完成配置、集成、验证与交付。`,
            `通过“${title}”持续提升环境的稳定性、可视性和可维护性。`,
          ][index]
        : [
            `اهداف کسب‌وکار، وضعیت موجود و مرزهای اجرای «${title}» ابتدا روشن می‌شود.`,
            `پیکربندی، یکپارچه‌سازی، آزمون و تحویل «${title}» به‌صورت هماهنگ انجام می‌شود.`,
            `با «${title}» پایداری، دیدپذیری و قابلیت نگهداری محیط بهبود می‌یابد.`,
          ][index],
    })),
    servicesTitle: zhLocale ? `JOTO 的 ${partner} 服务` : `خدمات ${partner} از JOTO`,
    servicesDescription: zhLocale
      ? `服务覆盖${profile.serviceTitles.join("、")}，并根据客户环境确定实施范围。`
      : `خدمات شامل ${profile.serviceTitles.join("، ")} است و دامنه اجرا با محیط مشتری هماهنگ می‌شود.`,
    services: translated.services.map((service, index) => ({
      ...service,
      title: profile.serviceTitles[index],
      description: zhLocale
        ? [`根据业务、技术和站点需求规划“${profile.serviceTitles[index]}”。`, `完成“${profile.serviceTitles[index]}”相关技术的配置、部署和集成。`, `围绕“${profile.serviceTitles[index]}”持续监控、维护并优化环境。`][index]
        : [`«${profile.serviceTitles[index]}» بر اساس نیازهای کسب‌وکار، فنی و سایت طراحی می‌شود.`, `فناوری‌های مرتبط با «${profile.serviceTitles[index]}» پیکربندی، مستقر و یکپارچه می‌شوند.`, `محیط از مسیر «${profile.serviceTitles[index]}» به‌طور مستمر پایش و بهینه می‌شود.`][index],
      capabilities: capabilities[index],
      imageAlt: zhLocale ? `${partner} 服务场景` : `صحنه خدمات ${partner}`,
    })),
    casesEyebrow: zhLocale ? "代表项目" : "پروژه‌های منتخب",
    casesTitle: zhLocale ? "代表项目。" : "پروژه‌های منتخب.",
    casesDescription: "",
    cases: [],
    ctaTitle: profile.ctaTitle,
    ctaDescription: profile.ctaDescription,
  };
}
