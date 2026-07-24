import {
  Activity,
  Cloud,
  GitBranch,
  Network,
  ShieldCheck,
  Wifi,
  type LucideIcon,
} from "lucide-react";

const capabilities: Array<{
  title: string;
  description: string;
  Icon: LucideIcon;
}> = [
  {
    title: "High-availability Network Design",
    description: "Capacity, redundancy and continuity planned from the start.",
    Icon: Network,
  },
  {
    title: "Cloud-managed Campus",
    description: "Centralized wired and wireless operations across every site.",
    Icon: Cloud,
  },
  {
    title: "SD-WAN & Branch Connectivity",
    description: "Policy-driven connectivity across branches and global hubs.",
    Icon: GitBranch,
  },
  {
    title: "SASE & Zero Trust",
    description: "Secure access for users, devices and applications.",
    Icon: ShieldCheck,
  },
  {
    title: "Experience Monitoring",
    description: "Continuous visibility into health and user experience.",
    Icon: Activity,
  },
  {
    title: "Wireless at Scale",
    description: "Enterprise Wi-Fi built for density, roaming and growth.",
    Icon: Wifi,
  },
];

export default function SolutionCapabilityIconPreviewPage() {
  return (
    <main
      className="min-h-screen bg-[#070b0a] px-6 py-12 text-white antialiased lg:px-12"
      dir="ltr"
      style={{ textAlign: "left" }}
    >
      <header className="mx-auto flex max-w-[1440px] items-end justify-between gap-8 border-b border-white/16 pb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-joto-green">
            [ Refined direction ]
          </p>
          <h1 className="mt-4 text-4xl font-medium tracking-[-0.055em] md:text-6xl">
            Precision Line · 居中版
          </h1>
        </div>
        <p className="max-w-md text-right text-sm leading-6 text-white/48">
          六列等宽，图标、标题和说明使用同一中轴；去掉角落编号、装饰框和光晕。
        </p>
      </header>

      <section className="mx-auto max-w-[1440px] py-14">
        <div className="grid gap-x-8 gap-y-12 lg:grid-cols-6">
          {capabilities.map(({ title, description, Icon }) => (
            <article
              className="flex min-h-[18rem] flex-col items-center px-2"
              key={title}
            >
              <div className="flex h-20 w-full items-center justify-center">
                <Icon
                  aria-hidden="true"
                  className="h-12 w-12 stroke-[2.1] text-joto-green"
                />
              </div>
              <div className="w-full max-w-[11rem] pt-5 text-left">
                <h2 className="min-h-[4.25rem] text-lg font-medium leading-tight tracking-[-0.035em]">
                  {title}
                </h2>
                <p className="mt-2 text-xs leading-5 text-white/42">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
