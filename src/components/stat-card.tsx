import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { AnimatedCounter } from "@/components/animated-counter";

export function StatCard({
  icon: Icon,
  label,
  value,
  prefix,
  suffix,
  decimals = 0,
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="flex h-full flex-col gap-3 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-5">
        <span className="flex size-9 items-center justify-center rounded-lg border border-brand-silver/20 bg-white/[0.03] text-brand-silver">
          <Icon className="size-4.5" strokeWidth={1.75} />
        </span>
        <div>
          <p className="font-heading text-2xl font-semibold text-white">
            <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
          </p>
          <p className="mt-1 font-sans text-xs text-white/50">{label}</p>
        </div>
      </div>
    </Reveal>
  );
}
