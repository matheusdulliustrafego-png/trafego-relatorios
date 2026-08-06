"use client";

import { motion } from "framer-motion";
import { formatNumber, formatPercent } from "@/lib/format";

const GAP = 34;
const BAND_HEIGHT = 92;
const MIN_PCT = 46;
const MAX_PCT = 100;
const GAMMA = 0.4;
const GRADIENT =
  "linear-gradient(180deg, #3b82f6 0%, #7c6ef2 35%, #ec4899 68%, #f97316 100%)";

export function FunnelReal({
  steps,
}: {
  steps: { label: string; value: number }[];
}) {
  const n = steps.length;
  const max = steps[0]?.value || 1;

  const pct = steps.map((s, i) => {
    if (i === 0) return MAX_PCT;
    const ratio = Math.max(s.value / max, 0.0001);
    return MIN_PCT + (MAX_PCT - MIN_PCT) * Math.pow(ratio, GAMMA);
  });
  const boundaries = [...pct, Math.max(pct[n - 1] - 12, MIN_PCT - 14)];
  const totalHeight = n * BAND_HEIGHT + (n - 1) * GAP;

  return (
    <div className="flex flex-col items-center" style={{ gap: GAP }}>
      {steps.map((step, i) => {
        const top = boundaries[i];
        const bottom = boundaries[i + 1];
        const clipPath = `polygon(${(100 - top) / 2}% 0%, ${(100 + top) / 2}% 0%, ${(100 + bottom) / 2}% 100%, ${(100 - bottom) / 2}% 100%)`;
        const offsetY = i * (BAND_HEIGHT + GAP);
        const conversao =
          i > 0 ? formatPercent((steps[i].value / steps[i - 1].value) * 100) : null;

        return (
          <div key={step.label} className="relative w-full">
            {conversao ? (
              <span
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/15 bg-brand-black px-2.5 py-0.5 font-sans text-[11px] font-medium text-white/60"
                style={{ top: -(GAP / 2) }}
              >
                {conversao} avançaram
              </span>
            ) : null}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto flex items-center justify-center"
              style={{
                height: BAND_HEIGHT,
                width: "100%",
                clipPath,
                background: GRADIENT,
                backgroundSize: `100% ${totalHeight}px`,
                backgroundPosition: `0 -${offsetY}px`,
              }}
            >
              <div className="flex flex-col items-center gap-0.5 text-center [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-white/85">
                  {step.label}
                </span>
                <span className="font-heading text-lg font-semibold text-white sm:text-xl">
                  {formatNumber(step.value)}
                </span>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
