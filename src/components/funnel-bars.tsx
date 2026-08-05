"use client";

import { motion } from "framer-motion";
import { formatNumber } from "@/lib/format";

export function FunnelBars({
  steps,
}: {
  steps: { label: string; value: number }[];
}) {
  const max = Math.max(...steps.map((s) => s.value), 1);

  return (
    <div className="flex flex-col gap-4">
      {steps.map((step, i) => (
        <div key={step.label} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between font-sans text-sm">
            <span className="text-white/60">{step.label}</span>
            <span className="font-medium text-white">{formatNumber(step.value)}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.max((step.value / max) * 100, 3)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-brand-silver/40 to-brand-silver"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
