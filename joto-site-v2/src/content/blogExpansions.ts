import type { BlogBodyBlock } from "./blog";
import type { Locale } from "../i18n/routing";

type ArticleExpansions = Record<string, Record<Locale, BlogBodyBlock[]>>;

export const blogArticleExpansions: ArticleExpansions = {
  "enterprise-network-growth": {
    en: [
      { type: "heading", text: "The warning usually arrives as a small request" },
      {
        type: "paragraph",
        text: "A new floor needs to open in three weeks. A cloud application is suddenly business-critical. A warehouse adds scanners, cameras and guest devices. None of these requests sounds like a network transformation, yet together they expose every shortcut in the original design. Address space runs out, switch configurations drift, wireless coverage becomes unpredictable and a change in one site creates an outage somewhere else.",
      },
      {
        type: "paragraph",
        text: "The useful question is not whether the current network is fast enough. It is whether the organization can add users, locations and services without making the environment harder to understand. Growth should increase capacity, not operational mystery.",
      },
      { type: "heading", text: "Five decisions that make growth safer" },
      {
        type: "list",
        items: [
          "Create a small number of repeatable site patterns instead of designing every office from zero.",
          "Reserve addressing, uplink capacity, power and rack space for the next stage of growth.",
          "Segment by business purpose and risk, not by whichever switch port happened to be available.",
          "Make monitoring, configuration backup and lifecycle data part of the design baseline.",
          "Give every standard an owner, a review date and a documented exception process.",
        ],
      },
      {
        type: "paragraph",
        text: "These decisions are deliberately less glamorous than a product comparison. They are also the reason a network remains manageable after the project team leaves. A clear site pattern lets teams deploy faster; a controlled exception process prevents one urgent request from becoming a permanent undocumented architecture.",
      },
      { type: "heading", text: "Capacity is more than bandwidth" },
      {
        type: "paragraph",
        text: "Teams often forecast internet traffic but forget the limits that fail first: available switch ports, power budgets for access points and cameras, wireless airtime, firewall policy complexity, log-storage volume and the number of changes the support team can safely process. Capacity planning should describe all of these constraints and connect them to business forecasts.",
      },
      {
        type: "paragraph",
        text: "A quarterly review can stay practical: compare growth assumptions with actual use, identify devices approaching end of support, inspect recurring incidents and verify that diagrams still match reality. The goal is not a perfect model. It is an early warning system that creates time to act before an expansion becomes an emergency.",
      },
      { type: "heading", text: "A quick growth-readiness check" },
      {
        type: "list",
        items: [
          "Can the team explain which applications and sites are most business-critical?",
          "Can a new standard site be costed and configured from an approved pattern?",
          "Are configuration changes, backups and software versions visible in one place?",
          "Are resilience tests performed, or is redundancy only assumed from the diagram?",
          "Does every known exception have an owner and a plan to remove or accept it?",
        ],
      },
      {
        type: "paragraph",
        text: "If several answers are uncertain, buying additional hardware will provide only temporary relief. The stronger next step is to make the operating model visible, reduce unnecessary variation and decide what the network must make easy for the business over the next two or three years.",
      },
      {
        type: "paragraph",
        text: "That conversation should include business, application, security and facilities owners as well as the network team. Their forecasts reveal where demand will emerge; operations evidence shows where the current design already carries hidden risk.",
      },
    ],
    "zh-CN": [
      { type: "heading", text: "问题通常从一个看似很小的需求开始" },
      {
        type: "paragraph",
        text: "新楼层要在三周后启用，一套云应用突然成为核心业务，仓库同时增加扫码枪、摄像机和访客终端。每一项单独看都不像网络改造，但它们叠加起来，会迅速暴露原有设计中的妥协：地址空间不够、交换机配置逐渐分叉、无线覆盖变得不可预测，一个站点的临时变更还可能影响另一个站点。",
      },
      {
        type: "paragraph",
        text: "因此，真正值得问的并不是“现在的网络够不够快”，而是“业务增加用户、地点和服务时，环境会不会同时变得更难理解”。好的扩展应增加能力，而不是增加运维谜题。团队需要知道哪些部分可以复制，哪些部分必须评审，以及谁有权接受例外。",
      },
      { type: "heading", text: "让增长更安全的五个关键决定" },
      {
        type: "list",
        items: [
          "建立少量可复用的站点模型，而不是每个办公室都从零开始设计。",
          "为下一阶段预留地址、上联带宽、供电预算、机柜空间和无线容量。",
          "按照业务用途与风险进行分区，而不是根据当时哪个端口方便来连接。",
          "把监控、配置备份、软件版本和生命周期记录纳入设计基线。",
          "为每项标准设置负责人、复审日期和可追踪的例外审批流程。",
        ],
      },
      {
        type: "paragraph",
        text: "这些决定没有设备参数那么醒目，却决定了项目团队离场后网络是否仍然可维护。统一的站点模型可以缩短部署时间；清晰的例外机制则可以防止一次紧急需求，最终变成没人说得清、也没人敢改的永久架构。标准化并不意味着所有地点完全相同，而是让差异被看见、被批准、被记录。",
      },
      { type: "heading", text: "容量不只等于带宽" },
      {
        type: "paragraph",
        text: "许多团队会预测互联网流量，却忽略最先触顶的往往是其他限制：可用交换机端口、无线接入点和摄像机的 PoE 供电、无线空口时间、防火墙策略复杂度、日志存储量，以及支持团队每天能够安全完成的变更数量。容量规划应把这些限制都列出来，并与招聘、开店、扩产和应用上线计划对应。",
      },
      {
        type: "paragraph",
        text: "季度复审不需要做成厚重报告。对比原来的增长假设与真实使用量，标记接近停止支持的设备，分析反复出现的故障，并确认拓扑和资产记录仍与现场一致，就已经可以形成有效预警。目标不是建立一个永远正确的模型，而是在扩容变成紧急事故之前，为团队争取判断和行动的时间。",
      },
      { type: "heading", text: "一份可以马上使用的增长检查清单" },
      {
        type: "list",
        items: [
          "团队能否明确说明哪些应用、站点和用户群最关键？",
          "新建标准站点能否直接从批准模板估算、配置和验收？",
          "配置变更、备份状态、软件版本和生命周期是否集中可见？",
          "冗余是否做过真实切换测试，而不只是画在拓扑图上？",
          "每个已知例外是否有负责人，以及关闭、整改或正式接受的日期？",
        ],
      },
      {
        type: "paragraph",
        text: "如果其中多项答案仍然模糊，继续购买设备只能暂时缓解压力。更有效的下一步，是把运维模式画清楚、减少没有价值的差异，并共同决定未来两到三年网络应该让哪些业务动作变得更容易。网络真正的扩展能力，最终体现在团队是否能够从容变化，而不是机房里还剩多少空端口。",
      },
      {
        type: "paragraph",
        text: "这场讨论不应只由网络团队完成。业务、应用、安全和设施负责人掌握未来需求会从哪里出现，运维记录则能指出现有设计已经在哪些位置承受隐性风险。把两类信息放在一起，扩展计划才不会只是技术人员对增长的猜测。",
      },
    ],
    "fa-IR": [
      { type: "heading", text: "هشدار معمولاً با یک درخواست کوچک آغاز می‌شود" },
      {
        type: "paragraph",
        text: "افتتاح یک طبقه جدید، حیاتی شدن یک برنامه ابری یا اضافه شدن اسکنر و دوربین در انبار، به‌تنهایی پروژه تحول شبکه نیست. اما همین درخواست‌ها کمبود آدرس، تفاوت پیکربندی، ضعف پوشش بی‌سیم و وابستگی‌های پنهان را آشکار می‌کنند. پرسش اصلی سرعت امروز نیست؛ پرسش این است که آیا رشد، محیط را دشوارتر و مبهم‌تر می‌کند یا نه.",
      },
      { type: "heading", text: "پنج تصمیم برای رشد ایمن‌تر" },
      {
        type: "list",
        items: [
          "چند الگوی تکرارپذیر سایت بسازید و هر دفتر را از صفر طراحی نکنید.",
          "برای آدرس، ظرفیت لینک، برق و فضای رک مرحله بعدی رشد را در نظر بگیرید.",
          "بخش‌بندی را بر اساس هدف کسب‌وکار و ریسک انجام دهید.",
          "پایش، پشتیبان پیکربندی و چرخه عمر را بخشی از خط مبنا بدانید.",
          "برای هر استاندارد مالک، تاریخ بازبینی و فرآیند استثنا تعیین کنید.",
        ],
      },
      { type: "heading", text: "ظرفیت فقط پهنای باند نیست" },
      {
        type: "paragraph",
        text: "پورت سوئیچ، بودجه PoE، زمان هوایی بی‌سیم، پیچیدگی سیاست فایروال، فضای لاگ و توان تیم پشتیبانی می‌توانند پیش از لینک اینترنت محدود شوند. بازبینی فصلی باید فرض رشد را با مصرف واقعی، عمر تجهیزات و رخدادهای تکراری مقایسه کند.",
      },
      { type: "heading", text: "آزمون آمادگی برای رشد" },
      {
        type: "paragraph",
        text: "اگر تیم نتواند یک سایت استاندارد را از روی الگوی تأییدشده قیمت‌گذاری و پیکربندی کند، تغییرات و نسخه‌ها را یکجا ببیند یا افزونگی را در عمل آزمایش کند، خرید تجهیزات فقط زمان می‌خرد. گام قوی‌تر، روشن کردن مدل عملیاتی و کاهش تفاوت غیرضروری است.",
      },
      {
        type: "paragraph",
        text: "گفت‌وگو باید مالکان کسب‌وکار، برنامه، امنیت و تأسیسات را نیز دربرگیرد تا پیش‌بینی تقاضا با شواهد عملیات ترکیب شود.",
      },
    ],
  },

  "multi-site-network-rollout": {
    en: [
      { type: "heading", text: "The opening date does not care about the project chart" },
      {
        type: "paragraph",
        text: "A rollout can look green in a status meeting while one site still has no carrier handoff, another has a rack without power and a third cannot grant after-hours access. These details are not administrative noise. They are the conditions that decide whether the technical design can become an operating service.",
      },
      {
        type: "paragraph",
        text: "The most reliable programmes use a site-readiness gate before equipment travels. The gate is simple and evidence-based: approved drawings, confirmed rack and power, tested cabling, available WAN service, named local contacts and an agreed installation window. A site that does not pass is visible early instead of failing on cutover night.",
      },
      { type: "heading", text: "Build a golden site, then learn from it" },
      {
        type: "paragraph",
        text: "The first completed location should be treated as a controlled rehearsal. It tests the architecture, bill of materials, staging instructions, installation sequence, test scripts and handover pack. The team should record what took longer than expected, which assumptions were wrong and which decisions must be added to the standard before the next wave.",
      },
      {
        type: "list",
        items: [
          "Freeze the standard configuration and document approved variables.",
          "Photograph rack, patching and device placement as acceptance evidence.",
          "Measure wireless coverage and critical application paths, not only device reachability.",
          "Run rollback and escalation steps while the project team is still present.",
          "Update the rollout kit before releasing the next group of sites.",
        ],
      },
      { type: "heading", text: "Cutover day needs choreography" },
      {
        type: "paragraph",
        text: "A good cutover plan reads like a sequence, not a collection of tasks. It identifies the last safe point to stop, who can approve a rollback, how users will be informed, which business service is tested first and where evidence is stored. This prevents the common midnight debate in which everyone is technically busy but nobody owns the decision.",
      },
      {
        type: "paragraph",
        text: "Remote and on-site roles should be explicit. The engineer at the rack sees cabling and device state; the remote team sees controller, cloud and cross-site behavior. The fastest recovery comes when both views are connected through one incident channel and one shared timeline.",
      },
      { type: "heading", text: "The first morning is part of acceptance" },
      {
        type: "paragraph",
        text: "Some failures only appear when people arrive: roaming between meeting rooms, authentication at shift change, printer discovery, voice quality and application performance under normal load. Keeping the deployment team available through the first operating period turns acceptance from a screenshot exercise into a test of the service users actually receive.",
      },
      {
        type: "list",
        items: [
          "Confirm business owners have signed off critical user journeys.",
          "Transfer diagrams, credentials, backups, warranties and support contacts.",
          "List every accepted exception with an owner and target date.",
          "Review early incidents across all sites before the next rollout wave.",
        ],
      },
      {
        type: "paragraph",
        text: "A final programme review should compare planned effort with actual effort by site. The differences improve future estimates, expose recurring readiness gaps and help leadership decide whether the next wave needs more standardisation, earlier surveys or stronger local coordination.",
      },
    ],
    "zh-CN": [
      { type: "heading", text: "开业日期不会因为项目表是绿色就自动顺利" },
      {
        type: "paragraph",
        text: "项目周会上所有任务可能都显示正常，但某个站点的运营商线路还没交付，另一个站点的机柜没有通电，第三个站点又无法安排夜间进场。这些并不是琐碎的行政问题，而是决定技术方案能否真正变成可用服务的前提。多站点项目最危险的错觉，是把“设备已经发货”当成“站点已经准备好”。",
      },
      {
        type: "paragraph",
        text: "可靠项目会在设备出库前设置站点就绪门槛，并要求用证据通过：图纸已批准、机柜与电源已确认、布线完成测试、广域网服务可用、本地联系人已确定、安装窗口和安全要求已经书面确认。未通过的站点应提前暴露，而不是在割接当晚才临时决定怎么处理。",
      },
      { type: "heading", text: "先做好一个黄金站点，再带着经验复制" },
      {
        type: "paragraph",
        text: "第一个完成的地点不应只被视为“第一家”，而应当是一场受控演练。它需要同时验证架构、物料清单、预配置说明、安装顺序、测试脚本和移交包。团队要记录哪些步骤比预期更慢、哪些现场假设不成立、哪些选择必须写入统一标准，然后再释放下一批站点。",
      },
      {
        type: "list",
        items: [
          "冻结标准配置，并明确哪些参数可以按站点调整。",
          "用机柜、跳线和设备位置照片作为验收证据。",
          "验证无线覆盖与关键业务路径，而不只测试设备是否能 ping 通。",
          "项目团队仍在现场时，实际演练回退和升级流程。",
          "把第一站的经验更新到部署工具包后，再启动下一波。",
        ],
      },
      { type: "heading", text: "割接日需要像舞台一样编排" },
      {
        type: "paragraph",
        text: "好的割接计划是一条有判断点的时间线，而不是任务集合。它要写清最后一个可以安全停止的节点、谁有权批准回退、用户如何接收通知、先验证哪一条关键业务链路，以及日志、照片和测试结果放在哪里。这样可以避免深夜最常见的混乱：每个人都很忙，却没有人负责做决定。",
      },
      {
        type: "paragraph",
        text: "远程和现场责任也应明确。机柜旁的工程师看到的是电源、布线和设备状态；远程团队看到的是控制器、云平台和跨站点行为。两种视角必须进入同一个事件通道、共享同一条时间线。否则现场会不断重复测试，远程团队也无法判断异常发生在本地、线路还是平台。",
      },
      { type: "heading", text: "第一个正常工作日也是验收的一部分" },
      {
        type: "paragraph",
        text: "有些问题只有员工真正到场后才会出现：会议室之间漫游不稳定、换班时认证集中、打印机发现失败、语音质量下降，或者关键应用在正常负载下变慢。因此，让部署团队覆盖首个真实运营时段，可以把验收从“设备截图全部正常”变成“用户实际获得的服务能够工作”。",
      },
      {
        type: "list",
        items: [
          "让业务负责人确认关键用户路径，而不只由技术人员签字。",
          "完整移交拓扑、账户、配置备份、保修和支持联系人。",
          "为每个已接受的例外设置负责人和关闭日期。",
          "在下一批站点启动前，汇总所有已上线地点的早期事件。",
        ],
      },
      {
        type: "paragraph",
        text: "项目还应按站点比较计划工时与实际投入。差异能够帮助团队改善下一轮估算，识别反复出现的就绪缺口，并判断下一批交付究竟需要更严格的标准、更早的现场勘察，还是更强的本地协调。这样，每完成一个站点，整个交付体系都会变得更成熟。",
      },
    ],
    "fa-IR": [
      { type: "heading", text: "تاریخ افتتاح به رنگ سبز برنامه پروژه توجهی ندارد" },
      {
        type: "paragraph",
        text: "ممکن است گزارش پروژه مناسب باشد اما یک سایت هنوز لینک اپراتور نداشته باشد، رک دیگری برق نداشته باشد و ورود شبانه در محل سوم ممکن نباشد. این جزئیات اداری نیستند؛ شرط تبدیل طراحی فنی به سرویس عملیاتی‌اند. دروازه آمادگی سایت باید پیش از ارسال تجهیزات با مدرک تأیید شود.",
      },
      { type: "heading", text: "یک سایت طلایی بسازید و از آن یاد بگیرید" },
      {
        type: "paragraph",
        text: "محل نخست یک تمرین کنترل‌شده برای معماری، فهرست تجهیزات، ترتیب نصب، اسکریپت آزمون و بسته تحویل است. زمان‌های غیرمنتظره و فرض‌های اشتباه باید پیش از موج بعدی به استاندارد اضافه شوند.",
      },
      {
        type: "list",
        items: [
          "پیکربندی استاندارد و متغیرهای مجاز را تثبیت کنید.",
          "از رک و کابل‌کشی به‌عنوان مدرک پذیرش عکس بگیرید.",
          "مسیرهای حیاتی و پوشش بی‌سیم را فراتر از دسترسی دستگاه آزمایش کنید.",
          "بازگشت و ارجاع را در حضور تیم پروژه تمرین کنید.",
        ],
      },
      { type: "heading", text: "روز بهره‌برداری بخشی از پذیرش است" },
      {
        type: "paragraph",
        text: "رومینگ، احراز هویت در تغییر شیفت، چاپ، صدا و عملکرد برنامه تنها با ورود کاربران واقعی آشکار می‌شوند. پشتیبانی تیم استقرار در نخستین دوره کاری، پذیرش را از چند تصویر به آزمون سرویس واقعی تبدیل می‌کند.",
      },
      {
        type: "paragraph",
        text: "مقایسه تلاش برنامه‌ریزی‌شده و واقعی هر سایت، برآورد موج بعدی و شناسایی کمبودهای تکراری آمادگی را بهتر می‌کند.",
      },
    ],
  },

  "practical-security-response": {
    en: [
      { type: "heading", text: "At 02:13, an alert is only a question" },
      {
        type: "paragraph",
        text: "Imagine an impossible-travel alert for a finance user, followed by an endpoint warning and unusual outbound traffic. Three consoles show three events. The business needs one answer: is this a compromised account, a traveling employee, a misconfigured service or something else? Until identity, device, network path and business role are connected, the team has signals but no incident story.",
      },
      {
        type: "paragraph",
        text: "The first fifteen minutes should reduce uncertainty. Confirm the identity and asset, establish what changed, check whether similar activity exists elsewhere and decide whether containment is safer than continued observation. A severity label is useful only when it changes who responds, how quickly they respond and what authority they have.",
      },
      { type: "heading", text: "Triage with four lenses" },
      {
        type: "list",
        items: [
          "Identity: who or what authenticated, and does the behavior fit the role?",
          "Asset: what device or workload is involved, who owns it and how critical is it?",
          "Path: where did the activity begin, what controls did it cross and where did it go?",
          "Blast radius: which credentials, systems, data and locations could be affected next?",
        ],
      },
      {
        type: "paragraph",
        text: "These lenses stop the team from treating every alert as an isolated technical artifact. They also make collaboration faster: network, endpoint, identity and application owners can contribute to the same timeline without arguing over which console contains the truth.",
      },
      { type: "heading", text: "Containment should be proportionate and reversible" },
      {
        type: "paragraph",
        text: "Disabling an account or isolating a device may be correct, but the action can also stop payroll, production or a critical clinical workflow. Playbooks should distinguish evidence-gathering actions from disruptive controls, identify who can approve each step and define how service will be restored if the hypothesis proves wrong.",
      },
      {
        type: "paragraph",
        text: "Useful automation collects context, captures volatile evidence and proposes the next check. It should not hide judgment. High-impact actions need visible authority, especially when the security team does not own the affected business service.",
      },
      { type: "heading", text: "Turn every incident into a better filter" },
      {
        type: "paragraph",
        text: "After closure, ask which signal first indicated the real problem, which data was missing, where the team waited for approval and whether a control prevented lateral movement. This converts incident review into engineering work: tune a detection, enrich an asset record, clarify an escalation path or remove an unnecessary privilege.",
      },
      {
        type: "list",
        items: [
          "Keep one shared timeline of observations, decisions and actions.",
          "Record why an alert was escalated or closed, not only its final status.",
          "Measure time lost to missing context and unclear ownership.",
          "Test playbooks with realistic tabletop exercises before a major incident.",
          "Review recurring alerts that consume attention without changing action.",
        ],
      },
    ],
    "zh-CN": [
      { type: "heading", text: "凌晨 2:13，一条告警首先只是一个问题" },
      {
        type: "paragraph",
        text: "假设财务用户触发了“不可能旅行”告警，几分钟后终端平台又报告可疑进程，网络侧同时发现异常外联。三个控制台显示三条事件，但业务真正需要的只有一个答案：这是账户被盗、员工正在出差、服务配置错误，还是更严重的攻击？在身份、设备、网络路径和业务角色没有被连成一条时间线之前，团队拥有的是信号，而不是事件全貌。",
      },
      {
        type: "paragraph",
        text: "前十五分钟的目标不是立刻证明攻击成立，而是快速减少不确定性：确认身份和资产，找出最近发生的变化，检查类似行为是否出现在其他位置，并判断立即隔离是否比继续观察更安全。严重级别只有在它能够改变响应人、响应时间和授权范围时才有意义。",
      },
      { type: "heading", text: "用四个视角完成初步研判" },
      {
        type: "list",
        items: [
          "身份：谁或什么完成了认证，这种行为是否符合该角色的正常工作方式？",
          "资产：涉及哪台设备或工作负载，谁负责，它承载的业务有多关键？",
          "路径：活动从哪里开始，经过哪些控制点，最终去了哪里？",
          "影响范围：哪些凭据、系统、数据和地点可能成为下一步受影响对象？",
        ],
      },
      {
        type: "paragraph",
        text: "这四个视角可以避免团队把每条告警都当成孤立的技术产物。网络、终端、身份和应用负责人可以围绕同一条事实时间线协作，而不是争论哪个控制台才是真相。真正有效的安全运营，不是让所有工具发出更多声音，而是让不同工具共同解释同一个业务风险。",
      },
      { type: "heading", text: "控制动作应与风险相称，并且能够恢复" },
      {
        type: "paragraph",
        text: "停用账户或隔离设备可能是正确决定，但也可能中断工资结算、生产线或关键业务流程。响应手册应区分“收集证据”和“会造成业务影响的控制动作”，明确每一步由谁批准，并规定如果原始判断错误，如何安全恢复服务。否则团队会在真正需要动作时因为害怕影响业务而犹豫。",
      },
      {
        type: "paragraph",
        text: "自动化最适合用于补充上下文、保存易失证据、关联相似事件并推荐下一项检查，而不是掩盖判断。尤其当安全团队并不拥有受影响的业务服务时，高影响动作必须有可见、可追踪的授权。快速响应并不等于跳过责任边界。",
      },
      { type: "heading", text: "让每一次事件都改善下一次过滤能力" },
      {
        type: "paragraph",
        text: "事件关闭后，不应只统计处理时长。更有价值的问题是：最早指出真实风险的是哪条信号？团队当时缺少什么数据？等待哪项批准花了最多时间？哪些控制真正阻止了横向移动？这些答案会转化为具体工程动作，例如调整检测逻辑、补齐资产负责人、简化升级路径或移除多余权限。",
      },
      {
        type: "list",
        items: [
          "维护一条共享时间线，记录观察、判断、授权和动作。",
          "记录告警为何升级或关闭，而不只保留最终状态。",
          "衡量因为上下文缺失和责任不清造成的等待时间。",
          "在重大事件发生前，用真实场景进行桌面演练。",
          "定期清理反复消耗注意力、却不会改变处置动作的告警。",
        ],
      },
      {
        type: "paragraph",
        text: "安全运营成熟度并不体现在屏幕数量或每天处理多少告警，而体现在团队能否用越来越少的时间形成更可靠的判断。每一次事件都应该让资产信息更完整、授权更清楚、检测更准确、协作更顺畅。这样，下一次凌晨 2:13 出现的就不再是一堆彼此无关的红点，而是一条能够被理解和处理的业务风险。",
      },
    ],
    "fa-IR": [
      { type: "heading", text: "در ساعت ۲:۱۳، هشدار فقط یک پرسش است" },
      {
        type: "paragraph",
        text: "هشدار سفر ناممکن برای کاربر مالی، اخطار نقطه پایانی و ترافیک خروجی غیرعادی ممکن است در سه کنسول جدا دیده شوند. کسب‌وکار یک پاسخ می‌خواهد: حساب تصاحب شده، کاربر در سفر است یا سرویس اشتباه پیکربندی شده؟ تا زمانی که هویت، دستگاه، مسیر شبکه و نقش کسب‌وکار به یک خط زمانی متصل نشوند، رویداد قابل فهم نیست.",
      },
      { type: "heading", text: "ارزیابی با چهار نگاه" },
      {
        type: "list",
        items: [
          "هویت: چه کسی یا چه چیزی احراز شد و آیا رفتار با نقش سازگار است؟",
          "دارایی: دستگاه یا بارکاری متعلق به کیست و چه اهمیتی دارد؟",
          "مسیر: فعالیت از کجا آغاز شد و از کدام کنترل‌ها عبور کرد؟",
          "دامنه اثر: چه اعتبارنامه، سامانه، داده یا مکانی در معرض خطر بعدی است؟",
        ],
      },
      { type: "heading", text: "مهار باید متناسب و برگشت‌پذیر باشد" },
      {
        type: "paragraph",
        text: "غیرفعال کردن حساب یا جداسازی دستگاه می‌تواند حقوق، تولید یا سرویس حیاتی را متوقف کند. راهنما باید جمع‌آوری مدرک را از اقدام مخرب جدا، اختیار هر مرحله را روشن و مسیر بازیابی در صورت اشتباه بودن فرض را تعریف کند.",
      },
      { type: "heading", text: "هر رخداد باید فیلتر بعدی را بهتر کند" },
      {
        type: "paragraph",
        text: "پس از پایان، مشخص کنید کدام سیگنال واقعاً مفید بود، چه داده‌ای نبود و انتظار برای کدام تأیید زمان گرفت. نتیجه باید به تنظیم تشخیص، تکمیل دارایی، روشن شدن ارجاع یا حذف دسترسی اضافی تبدیل شود.",
      },
    ],
  },

  "it-operations-in-china": {
    en: [
      { type: "heading", text: "The global standard meets the local Tuesday morning" },
      {
        type: "paragraph",
        text: "A global team may have an excellent architecture, ticket process and security baseline. Then a site in China loses a carrier circuit on a Tuesday morning, the vendor needs a local contact, building access requires advance registration and the global service desk cannot see whether anyone has reached the rack. The standard is not wrong; it is incomplete without a local execution path.",
      },
      {
        type: "paragraph",
        text: "Strong regional operations preserve global intent while translating it into people, suppliers, access procedures, language and evidence that work locally. The aim is not to create a separate China environment. It is to make one service model executable in China and visible to the rest of the organization.",
      },
      { type: "heading", text: "Write the boundary before the incident" },
      {
        type: "list",
        items: [
          "Which locations, network segments, platforms and physical systems are in scope?",
          "Which team owns monitoring, triage, approval, on-site work and vendor coordination?",
          "What constitutes a priority incident and who can authorize an emergency change?",
          "Which records must be bilingual or understandable without local system access?",
          "How are carrier, hardware and software escalations tracked back into one service record?",
        ],
      },
      {
        type: "paragraph",
        text: "A practical RACI is more valuable than a generic support statement. It should be tested against real events: an access point fails during an executive visit, a firewall change is required outside the global window, a camera stops recording or a circuit becomes unstable. If the teams cannot identify the next owner in under a minute, the boundary is still too vague.",
      },
      { type: "heading", text: "Make the handoff bilingual in meaning, not only language" },
      {
        type: "paragraph",
        text: "Translation alone does not create shared understanding. A ticket should contain the business impact, affected site and service, observations, actions already taken, evidence links and the precise decision required from the receiving team. Screenshots without a timeline and device logs without a site name force the next team to restart the investigation.",
      },
      {
        type: "paragraph",
        text: "Short bilingual runbooks for recurring actions can remove delay: carrier escalation, site-access request, device replacement, emergency configuration backup and post-change validation. The best runbook is not the longest one; it is the one a remote engineer and an on-site technician interpret in the same way under pressure.",
      },
      { type: "heading", text: "Create visibility without creating reporting theatre" },
      {
        type: "paragraph",
        text: "Global teams need evidence that standards are being followed, but local teams should not spend their day recreating the same status in multiple formats. One operational record should feed incident review, change evidence, asset updates and service reporting wherever possible.",
      },
      {
        type: "list",
        items: [
          "Track recurring faults by site, carrier, model and root cause.",
          "Reconcile asset and configuration changes after on-site work.",
          "Review exceptions to global policy with an owner and expiry date.",
          "Use service reviews to make decisions, not merely present ticket counts.",
        ],
      },
      {
        type: "paragraph",
        text: "When regional operations work well, the local team is not a pair of hands and the global team is not a distant approval queue. Each side contributes context the other cannot see. The operating model turns those perspectives into one service: locally executable, globally governed and understandable from the evidence it leaves behind.",
      },
      {
        type: "paragraph",
        text: "The most useful service review therefore ends with a small set of owned decisions: remove a recurring cause, clarify one boundary, update one runbook or retire one exception. Visibility matters because it changes the service, not because it fills a dashboard.",
      },
    ],
    "zh-CN": [
      { type: "heading", text: "全球标准最终要面对本地某个普通的周二早晨" },
      {
        type: "paragraph",
        text: "全球团队可能已经拥有成熟架构、工单流程和安全基线，但中国站点在周二早晨突然发生运营商线路故障时，供应商需要本地联系人，楼宇进场要提前登记，全球服务台又无法判断是否已经有人到达机柜。全球标准本身并没有错，只是如果缺少本地执行路径，它在关键时刻仍然无法落地。",
      },
      {
        type: "paragraph",
        text: "成熟的区域运维会保留全球治理意图，同时把它翻译成人员、供应商、进场流程、语言和可追踪证据。目标不是建立一个与全球割裂的“中国环境”，而是让同一套服务模式可以在中国被执行，也可以被其他地区清楚看见和理解。",
      },
      { type: "heading", text: "不要等事故发生后再讨论边界" },
      {
        type: "list",
        items: [
          "哪些地点、网段、平台和物理安全系统属于服务范围？",
          "监控、初判、审批、现场操作和供应商协调分别由谁负责？",
          "什么情况属于高优先级事件，谁能批准紧急变更？",
          "哪些记录必须双语，或无需访问本地系统也能被理解？",
          "运营商、硬件和软件厂商的升级如何回写到同一服务记录？",
        ],
      },
      {
        type: "paragraph",
        text: "一份能够对应真实事件的 RACI，比一句“提供本地支持”更有价值。可以用具体情景测试它：高管访问期间无线接入点故障、全球变更窗口之外必须调整防火墙、摄像机停止录像，或线路开始间歇性抖动。如果双方不能在一分钟内说出下一位负责人，说明服务边界仍然不够清楚。",
      },
      { type: "heading", text: "交接需要双语的含义，而不只是双语的文字" },
      {
        type: "paragraph",
        text: "翻译并不自动带来共同理解。合格工单应包含业务影响、受影响站点和服务、已经观察到的现象、已执行动作、证据链接，以及接收团队需要作出的准确决定。只有截图没有时间线、只有设备日志没有站点名称，都会迫使下一支团队从头调查。",
      },
      {
        type: "paragraph",
        text: "针对高频动作准备简短双语手册，可以显著减少等待：运营商升级、现场进场申请、设备替换、紧急配置备份和变更后验证。最好的手册不是最长的，而是远程工程师和现场技术人员在压力下仍能作出同样理解的那一份。",
      },
      { type: "heading", text: "建立可见性，但不要制造报表表演" },
      {
        type: "paragraph",
        text: "全球团队需要证据确认标准得到执行，但本地团队不应把大量时间花在多个模板中重复填写同一状态。理想情况下，一条运维记录可以同时支持事件复盘、变更证据、资产更新和服务报告。信息只记录一次，却可以在需要的位置被复用。",
      },
      {
        type: "list",
        items: [
          "按站点、运营商、设备型号和根因追踪重复故障。",
          "现场操作结束后，及时核对资产与配置变化。",
          "为全球策略例外设置负责人、理由和失效日期。",
          "让服务评审形成决定，而不是只展示工单数量。",
        ],
      },
      {
        type: "paragraph",
        text: "当区域运维真正有效时，本地团队不是单纯的“现场双手”，全球团队也不是遥远的审批队列。双方都掌握对方看不到的上下文：一方理解本地条件，一方把握整体架构和风险。好的运维模式把两种视角组合成同一项服务——能够在本地执行、接受全球治理，并通过留下的证据被所有相关团队理解。",
      },
      {
        type: "paragraph",
        text: "因此，最有价值的服务评审不应以一页仪表盘结束，而应形成少量有负责人的决定：消除一个重复根因、澄清一项边界、更新一份手册，或关闭一条例外。可见性之所以重要，是因为它能改变服务，而不是因为它让报表看起来更完整。",
      },
    ],
    "fa-IR": [
      { type: "heading", text: "استاندارد جهانی با واقعیت محلی روبه‌رو می‌شود" },
      {
        type: "paragraph",
        text: "معماری و فرآیند جهانی ممکن است عالی باشد، اما هنگام قطع مدار در چین، فروشنده به تماس محلی، ساختمان به ثبت ورود و میز خدمت به دید روشن از رک نیاز دارد. استاندارد بدون مسیر اجرای محلی کامل نیست.",
      },
      { type: "heading", text: "مرز را پیش از رخداد بنویسید" },
      {
        type: "list",
        items: [
          "سایت‌ها، سامانه‌ها و بخش‌های شبکه در دامنه را مشخص کنید.",
          "مالک پایش، بررسی، تأیید، کار حضوری و هماهنگی فروشنده را تعیین کنید.",
          "اختیار تغییر اضطراری و تعریف رخداد اولویت‌دار را روشن کنید.",
          "مدارک لازم برای تیم جهانی را به شکل قابل فهم نگه دارید.",
        ],
      },
      { type: "heading", text: "تحویل فقط ترجمه واژه‌ها نیست" },
      {
        type: "paragraph",
        text: "رکورد باید اثر کسب‌وکار، سایت و سرویس، مشاهدات، اقدام‌های انجام‌شده، پیوند مدرک و تصمیم مورد انتظار را منتقل کند. راهنمای کوتاه دو‌زبانه برای ارجاع اپراتور، ورود به سایت و تعویض دستگاه، تفسیر مشترک ایجاد می‌کند.",
      },
      { type: "heading", text: "دید ایجاد کنید، نه نمایش گزارش" },
      {
        type: "paragraph",
        text: "یک رکورد عملیاتی باید تا حد ممکن خوراک بازبینی رخداد، مدرک تغییر، دارایی و گزارش خدمت باشد. عملیات موفق، اجرای محلی را با حاکمیت جهانی و شواهد قابل فهم پیوند می‌دهد.",
      },
      {
        type: "paragraph",
        text: "بازبینی مفید باید با چند تصمیم دارای مالک پایان یابد: حذف علت تکراری، روشن کردن مرز، به‌روزرسانی راهنما یا بستن یک استثنا.",
      },
    ],
  },

  "five-campus-standardisation": {
    en: [
      { type: "heading", text: "A campus is not ready when the racks look finished" },
      {
        type: "paragraph",
        text: "In a new school environment, the network must be ready before thousands of ordinary moments begin at once: students joining wireless, teachers presenting, administrators accessing systems, visitors arriving, phones ringing and support teams responding. Construction progress can make infrastructure appear complete while ceilings, room uses and device locations are still changing around it.",
      },
      {
        type: "paragraph",
        text: "Across five campus sites, the value of a common architecture was not visual uniformity. It was the ability to repeat decisions, compare evidence and support each location through one operational language while still respecting the actual condition and opening sequence of every building.",
      },
      { type: "heading", text: "Standardise the invisible work" },
      {
        type: "list",
        items: [
          "Use common naming, addressing, configuration templates and software baselines.",
          "Define repeatable survey, staging, installation and acceptance packages.",
          "Validate access-point placement against completed spaces, not early drawings alone.",
          "Track construction dependencies and late room changes as operational risks.",
          "Produce the same evidence set for every campus so support can compare like with like.",
        ],
      },
      {
        type: "paragraph",
        text: "With more than 3,500 Wi-Fi 5 and Wi-Fi 6 access points and more than 800 Cisco Catalyst 9200 and 9300 switches in scope, small inconsistencies would quickly become a large support burden. A naming difference repeated hundreds of times is no longer cosmetic; it slows fault isolation, inventory checks and change planning.",
      },
      { type: "heading", text: "Design acceptance around a school day" },
      {
        type: "paragraph",
        text: "Technical acceptance should include the journeys the campus depends on: roaming between teaching areas, authentication at busy arrival times, coverage in halls and shared spaces, reachability of core services, voice quality and the support desk's ability to locate an affected device. This is more meaningful than proving every device is merely online.",
      },
      {
        type: "paragraph",
        text: "Opening support also matters. Daily on-site helpdesk coverage creates a rapid feedback loop between user experience and infrastructure behavior. Early incidents reveal whether documentation is usable, ownership is clear and configuration standards work under real load.",
      },
      { type: "heading", text: "What this programme teaches" },
      {
        type: "paragraph",
        text: "Multi-campus delivery succeeds when architecture, construction coordination and operations are planned as one programme. If they are separated, the network team inherits late building changes and the support team inherits undocumented project decisions. Keeping them connected allows every campus to benefit from lessons learned at the previous one.",
      },
      {
        type: "list",
        items: [
          "Treat room and construction changes as inputs to network assurance.",
          "Review early-service incidents before the next campus opens.",
          "Keep standards strict but make approved exceptions visible.",
          "Measure readiness through user journeys and support capability.",
        ],
      },
      {
        type: "paragraph",
        text: "The result of standardisation is not five identical buildings. It is five environments that can be understood, operated and improved through a shared method. That is what turns a large equipment deployment into a sustainable campus service.",
      },
      {
        type: "paragraph",
        text: "The shared method also creates a better starting point for future campuses. New teams inherit tested assumptions, known exceptions and operational evidence instead of repeating the discovery work under opening-day pressure.",
      },
    ],
    "zh-CN": [
      { type: "heading", text: "机柜看起来完成，并不代表园区已经准备好" },
      {
        type: "paragraph",
        text: "新学校启用时，成千上万个普通动作会在同一时间发生：学生接入无线、教师投屏、行政人员访问系统、访客到达、电话响起、支持团队开始处理请求。施工现场可能让基础设施看起来已经完成，但吊顶、房间用途和终端位置仍在持续变化，任何一项都可能影响原有覆盖和布线假设。",
      },
      {
        type: "paragraph",
        text: "在五个园区中，共同架构的价值并不是让所有机房看起来一样，而是让团队能够重复关键决定、比较验收证据，并用同一种运维语言支持各个地点，同时仍然尊重每栋建筑真实的施工条件和开校顺序。",
      },
      { type: "heading", text: "真正需要标准化的是那些看不见的工作" },
      {
        type: "list",
        items: [
          "统一命名、地址规划、配置模板和软件版本基线。",
          "建立可复用的勘察、预配置、安装和验收包。",
          "根据完工后的真实空间验证接入点位置，而不只依赖早期图纸。",
          "把施工依赖与晚期房间变更作为运维风险持续追踪。",
          "每个园区保留同样的证据集，使支持团队可以横向比较。",
        ],
      },
      {
        type: "paragraph",
        text: "项目范围包含超过 3,500 个 Wi-Fi 5/6 无线接入点和超过 800 台 Cisco Catalyst 9200/9300 交换机。如此规模下，很小的不一致也会迅速变成巨大的支持成本。一个命名差异如果重复几百次，就不再是格式问题，而会直接拖慢故障定位、资产核对和变更规划。",
      },
      { type: "heading", text: "按照真实校园的一天来设计验收" },
      {
        type: "paragraph",
        text: "技术验收应覆盖园区真正依赖的用户路径：教学区之间漫游、入校高峰时的集中认证、礼堂和公共区域覆盖、核心系统可达性、语音质量，以及服务台能否快速定位受影响终端。证明每台设备都在线，只能说明基础连通，并不能证明学校已经获得稳定服务。",
      },
      {
        type: "paragraph",
        text: "开校后的支持同样重要。日常驻场服务台在用户体验与基础设施行为之间建立了快速反馈回路。早期事件会检验文档是否真正可用、责任是否清楚、配置标准在真实负载下是否成立，并为后续园区提供比实验室测试更有价值的经验。",
      },
      { type: "heading", text: "这个项目最重要的交付启示" },
      {
        type: "paragraph",
        text: "多园区交付只有在架构、施工协调和运维被视为同一个项目时才会顺利。如果三者被割裂，网络团队会在最后阶段被动接收建筑变更，支持团队则会在上线后接收没有记录的项目决定。把它们持续连接起来，后一个园区才能真正复用前一个园区的经验。",
      },
      {
        type: "list",
        items: [
          "把房间与施工变化纳入网络质量保障，而不是只当成工程备注。",
          "下一园区启用前，集中复盘已上线园区的早期事件。",
          "保持标准严格，同时让批准的例外清晰可见。",
          "用用户路径与支持能力衡量就绪，而不是只看设备上线率。",
        ],
      },
      {
        type: "paragraph",
        text: "标准化的结果并不是五栋完全相同的建筑，而是五个可以通过同一套方法被理解、运维和持续改善的环境。只有这样，大规模设备部署才会转化为可持续的校园服务，而不是在开校后留下一个数量庞大、却难以共同管理的设备集合。",
      },
      {
        type: "paragraph",
        text: "这套共同方法也为未来园区提供了更可靠的起点。新的项目团队可以直接继承已经验证的假设、已知例外和真实运维证据，不必在开校压力下重新发现同一批问题。标准化因此不仅提高当前交付效率，也让组织的下一次建设更有把握。",
      },
    ],
    "fa-IR": [
      { type: "heading", text: "تکمیل رک به معنای آمادگی پردیس نیست" },
      {
        type: "paragraph",
        text: "با آغاز مدرسه، اتصال دانش‌آموز، ارائه معلم، سیستم اداری، تلفن و پشتیبانی هم‌زمان فعال می‌شوند. در حالی که زیرساخت کامل به نظر می‌رسد، سقف، کاربرد اتاق و محل دستگاه ممکن است هنوز تغییر کند.",
      },
      { type: "heading", text: "کار نامرئی را استاندارد کنید" },
      {
        type: "list",
        items: [
          "نام‌گذاری، آدرس، الگوی پیکربندی و نسخه نرم‌افزار مشترک داشته باشید.",
          "بسته تکرارپذیر بررسی، آماده‌سازی، نصب و پذیرش تعریف کنید.",
          "محل نقطه دسترسی را با فضای نهایی و نه فقط نقشه اولیه بسنجید.",
          "برای هر پردیس مجموعه مدرک یکسان تولید کنید.",
        ],
      },
      { type: "heading", text: "پذیرش را بر اساس یک روز مدرسه طراحی کنید" },
      {
        type: "paragraph",
        text: "رومینگ، احراز هویت در زمان ورود، پوشش سالن، سرویس‌های اصلی، کیفیت صدا و توان میز خدمت برای یافتن دستگاه، معیارهای واقعی‌تری از آنلاین بودن تجهیزات‌اند. پشتیبانی روزانه در محل نیز بازخورد کاربر را سریع به رفتار زیرساخت متصل می‌کند.",
      },
      { type: "heading", text: "درس برنامه" },
      {
        type: "paragraph",
        text: "معماری، هماهنگی ساخت و عملیات باید یک برنامه باشند. استانداردسازی پنج ساختمان یکسان نمی‌سازد؛ پنج محیط قابل فهم و قابل بهبود با روش مشترک می‌سازد.",
      },
      {
        type: "paragraph",
        text: "این روش مشترک، فرض‌های آزموده و شواهد عملیاتی را به نقطه شروع مطمئن‌تری برای پردیس بعدی تبدیل می‌کند.",
      },
    ],
  },

  "connected-it-and-safeguarding": {
    en: [
      { type: "heading", text: "Follow one door event through the building" },
      {
        type: "paragraph",
        text: "A badge is presented at a secure door. The reader checks a controller, the controller consults an identity record, the event crosses the network, video may be bookmarked, an operator may receive an alarm and the incident must be retained for review. What appears to be a physical action is already a chain of digital dependencies.",
      },
      {
        type: "paragraph",
        text: "If the door fails, the cause could be power, cabling, network segmentation, time synchronization, identity data, controller health or an expired certificate. Separate teams can each report that their own component is healthy while the user still cannot enter. Connected planning gives the organization a way to see and test the whole service.",
      },
      { type: "heading", text: "Map the dependency chain before choosing integrations" },
      {
        type: "list",
        items: [
          "Document devices, controllers, servers, cloud services and operator stations.",
          "Trace authentication, video and alarm data flows across network zones.",
          "Define power, storage, retention, time and resilience requirements.",
          "Identify which integrations are essential and which merely add convenience.",
          "Assign owners for the complete user journey, not only individual products.",
        ],
      },
      {
        type: "paragraph",
        text: "This map makes design trade-offs visible. A camera resolution change affects bandwidth and retention. A new identity source affects access provisioning and revocation. Moving a controller to the cloud changes internet and fail-safe requirements. These are shared architecture decisions, not isolated product settings.",
      },
      { type: "heading", text: "Segmentation must protect without making support blind" },
      {
        type: "paragraph",
        text: "Physical-security devices should not sit in an unrestricted corporate network, but isolation must preserve required management, time, update and event paths. The design should state exactly which systems communicate, in which direction and for what purpose. Broad allow rules create risk; undocumented blocks create fragile operations.",
      },
      {
        type: "paragraph",
        text: "Monitoring should also reflect the service. Knowing that a camera answers a ping is less useful than knowing whether it is streaming, recording with correct time and available to the authorized operator. Health checks should follow the outcome that safeguarding teams depend on.",
      },
      { type: "heading", text: "Practice a joint incident" },
      {
        type: "paragraph",
        text: "Run a tabletop scenario in which a door controller becomes unreachable during an evacuation, video timestamps differ from access events or an operator account is compromised. The exercise should reveal who leads, which systems provide evidence, what can be changed urgently and how privacy and chain of custody are preserved.",
      },
      {
        type: "list",
        items: [
          "Keep synchronized time across access, video, network and incident systems.",
          "Test fail-safe and fail-secure behavior with facilities and safety owners.",
          "Review privileged access and shared operator accounts regularly.",
          "Coordinate maintenance windows across IT and physical-security vendors.",
          "Store incident evidence with clear access, retention and export controls.",
        ],
      },
      {
        type: "paragraph",
        text: "Bringing IT and physical security together does not mean merging every role or console. It means designing their dependencies, evidence and decisions as one service while keeping access and accountability precise. The building becomes safer when teams can see the same event, understand the same timeline and act through a rehearsed path.",
      },
    ],
    "zh-CN": [
      { type: "heading", text: "沿着一次门禁事件走完整栋建筑" },
      {
        type: "paragraph",
        text: "员工在受控门口刷卡，读卡器连接控制器，控制器查询身份记录，事件经过网络，附近视频可能被自动标记，值守人员可能收到告警，相关记录还需要保留用于复盘。一个看起来完全属于物理空间的动作，实际上已经是一条由身份、网络、计算、存储和人员共同组成的数字依赖链。",
      },
      {
        type: "paragraph",
        text: "如果这扇门无法打开，原因可能是供电、布线、网络分区、时间同步、身份数据、控制器健康状态，甚至证书过期。不同团队可能都能证明自己负责的组件“正常”，用户却仍然无法进入。统一规划的价值，就是让组织能够看到、测试并支持完整服务，而不只是单个产品。",
      },
      { type: "heading", text: "在讨论集成之前，先画出依赖链" },
      {
        type: "list",
        items: [
          "记录设备、控制器、服务器、云服务和操作员工作站。",
          "追踪认证、视频和告警数据如何跨越不同网络区域。",
          "明确供电、存储、留存时间、时钟和冗余要求。",
          "区分哪些集成是业务必需，哪些只是操作便利。",
          "为完整用户路径设置负责人，而不只为单个产品设置负责人。",
        ],
      },
      {
        type: "paragraph",
        text: "依赖图可以让设计取舍提前变得可见。提升摄像机分辨率会同时改变带宽与留存容量；更换身份源会影响门禁授权与离职回收；把控制器迁移到云端会改变互联网依赖和离线运行要求。这些都属于共同架构决策，而不是某个产品界面里的独立设置。",
      },
      { type: "heading", text: "网络隔离要提供保护，也不能让支持团队失明" },
      {
        type: "paragraph",
        text: "物理安全设备不应直接位于不受限制的办公网络，但隔离设计仍需保留必要的管理、时间同步、升级和事件通道。方案应准确说明哪些系统可以通信、方向是什么、目的是什么。过于宽泛的放行规则会制造风险，未记录的阻断规则则会制造脆弱运维。",
      },
      {
        type: "paragraph",
        text: "监控方式也应围绕服务结果。知道摄像机可以 ping 通，远不如知道它是否正在正确推流、录像时间是否准确、授权操作员是否能够调阅有价值。健康检查需要跟随安全团队真正依赖的结果，而不是只跟随最容易采集的设备指标。",
      },
      { type: "heading", text: "安排一次 IT 与物理安全共同参加的演练" },
      {
        type: "paragraph",
        text: "可以模拟门禁控制器在疏散期间失联、视频时间戳与刷卡事件不一致，或操作员账户被盗。演练需要回答谁负责指挥、哪些系统提供证据、哪些动作可以紧急执行，以及如何保护隐私与证据链。很多责任问题只有放进具体时间线后，才会从组织结构图中真正暴露出来。",
      },
      {
        type: "list",
        items: [
          "让门禁、视频、网络和事件系统保持可信的统一时间。",
          "与物业和安全负责人共同测试断电后的开门或闭锁逻辑。",
          "定期复审高权限访问和共享操作员账户。",
          "协调 IT 与物理安全厂商的维护窗口。",
          "通过明确的访问、留存和导出控制保存事件证据。",
        ],
      },
      {
        type: "paragraph",
        text: "让 IT 与物理安全协同，并不意味着合并所有岗位或控制台，而是把它们之间的依赖、证据和决策设计成同一项服务，同时保持访问权限和责任边界精确。只有当团队能看到同一事件、理解同一时间线，并沿着演练过的路径采取行动时，互联建筑才会真正更安全，而不是只是连接了更多设备。",
      },
    ],
    "fa-IR": [
      { type: "heading", text: "یک رویداد در را در سراسر ساختمان دنبال کنید" },
      {
        type: "paragraph",
        text: "کارت به خوانشگر نزدیک می‌شود، کنترلر هویت را بررسی می‌کند، رویداد از شبکه عبور می‌کند، ویدئو علامت می‌خورد و اپراتور هشدار می‌گیرد. یک عمل فیزیکی، زنجیره‌ای از وابستگی دیجیتال است. خرابی می‌تواند از برق، کابل، بخش‌بندی، زمان، هویت، کنترلر یا گواهی باشد.",
      },
      { type: "heading", text: "پیش از یکپارچه‌سازی، وابستگی را ترسیم کنید" },
      {
        type: "list",
        items: [
          "دستگاه، کنترلر، سرور، ابر و ایستگاه اپراتور را ثبت کنید.",
          "جریان هویت، ویدئو و هشدار را میان ناحیه‌های شبکه دنبال کنید.",
          "برق، ذخیره، نگهداری، زمان و تاب‌آوری را تعریف کنید.",
          "مالک سفر کامل کاربر را مشخص کنید، نه فقط محصول.",
        ],
      },
      { type: "heading", text: "بخش‌بندی باید محافظت کند، نه اینکه پشتیبانی را کور کند" },
      {
        type: "paragraph",
        text: "جداسازی باید مسیر مدیریت، زمان، به‌روزرسانی و رویداد مورد نیاز را حفظ کند. سلامت واقعی دوربین فقط پاسخ پینگ نیست؛ پخش، ضبط با زمان درست و دسترسی اپراتور مجاز اهمیت دارد.",
      },
      { type: "heading", text: "رخداد مشترک را تمرین کنید" },
      {
        type: "paragraph",
        text: "سناریوی قطع کنترلر هنگام تخلیه، اختلاف زمان ویدئو و دسترسی یا تصاحب حساب اپراتور را اجرا کنید. همکاری IT و امنیت فیزیکی به معنای ادغام نقش‌ها نیست؛ یعنی وابستگی، مدرک و تصمیم مشترک با مسئولیت دقیق.",
      },
    ],
  },
};
