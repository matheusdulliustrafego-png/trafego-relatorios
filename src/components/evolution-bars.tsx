"use client";

import { motion } from "framer-motion";
import { formatNumber } from "@/lib/format";

export function EvolutionBars({
  periods,
}: {
  periods: { label: string; value: number; isCurrent: boolean }[];
}) {
  const max = Math.max(...periods.map((p) => p.value), 1);

  return (
    <div className="flex flex-col gap-4">
      {periods.map((period, i) => (
        <div key={`${period.label}-${i}`} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between font-sans text-sm">
            <span className={period.isCurrent ? "font-medium text-white" : "text-white/50"}>
              {period.label}
              {period.isCurrent ? (
                <span className="ml-2 rounded-full border border-brand-silver/25 px-2 py-0.5 font-subheading text-[10px] font-semibold uppercase tracking-wider text-brand-silver">
                  Atual
                </span>
              ) : null}
            </span>
            <span className={period.isCurrent ? "font-semibold text-white" : "font-medium text-white/60"}>
              {formatNumber(period.value)}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.max((period.value / max) * 100, 3)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={
                period.isCurrent
                  ? "h-full rounded-full bg-gradient-to-r from-brand-silver/50 to-brand-silver"
                  : "h-full rounded-full bg-white/20"
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
