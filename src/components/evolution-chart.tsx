"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/format";

const WIDTH = 640;
const HEIGHT = 260;
const PAD_LEFT = 44;
const PAD_RIGHT = 20;
const PAD_TOP = 36;
const PAD_BOTTOM = 36;

function niceMax(value: number): number {
  if (value <= 0) return 10;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const steps = [1, 2, 2.5, 5, 10];
  for (const step of steps) {
    const candidate = step * magnitude;
    if (candidate >= value) return candidate;
  }
  return 10 * magnitude;
}

export function EvolutionChart({
  periods,
}: {
  periods: { label: string; value: number; isCurrent: boolean }[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const innerWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const max = niceMax(Math.max(...periods.map((p) => p.value), 1));

  const points = periods.map((p, i) => {
    const x = periods.length > 1 ? PAD_LEFT + (i / (periods.length - 1)) * innerWidth : PAD_LEFT + innerWidth / 2;
    const y = PAD_TOP + innerHeight - (p.value / max) * innerHeight;
    return { ...p, x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD_TOP + innerHeight} L ${points[0].x} ${PAD_TOP + innerHeight} Z`;

  const gridSteps = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Evolução de leads por período">
        <defs>
          <linearGradient id="evolutionArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridSteps.map((step) => {
          const y = PAD_TOP + innerHeight - step * innerHeight;
          return (
            <g key={step}>
              <line
                x1={PAD_LEFT}
                x2={WIDTH - PAD_RIGHT}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
              <text x={PAD_LEFT - 10} y={y + 4} textAnchor="end" fontSize="11" fill="rgba(255,255,255,0.35)">
                {formatNumber(Math.round(max * step))}
              </text>
            </g>
          );
        })}

        <motion.path
          d={areaPath}
          fill="url(#evolutionArea)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        <motion.path
          d={linePath}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />

        {points.map((p, i) => (
          <g key={p.label + i}>
            <text x={p.x} y={HEIGHT - 10} textAnchor="middle" fontSize="11" fill={p.isCurrent ? "#ffffff" : "rgba(255,255,255,0.45)"} fontWeight={p.isCurrent ? 600 : 400}>
              {p.label}
            </text>
            <text
              x={p.x}
              y={p.y - (p.isCurrent ? 20 : 14)}
              textAnchor="middle"
              fontSize={p.isCurrent ? 15 : 12}
              fontWeight={p.isCurrent ? 700 : 500}
              fill={p.isCurrent ? "#ffffff" : "rgba(255,255,255,0.55)"}
            >
              {formatNumber(p.value)}
            </text>
            <circle cx={p.x} cy={p.y} r={2} fill="#0d0d0d" stroke="none" />
            <circle
              cx={p.x}
              cy={p.y}
              r={p.isCurrent ? 6 : 4}
              fill={p.isCurrent ? "#22d3ee" : "#0d0d0d"}
              stroke="#22d3ee"
              strokeWidth={2}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={16}
              fill="transparent"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              role="button"
              aria-label={`${p.label}: ${formatNumber(p.value)} leads`}
            />
          </g>
        ))}
      </svg>

      {hovered !== null ? (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-white/10 bg-brand-charcoal px-3 py-2 shadow-xl"
          style={{
            left: `${(points[hovered].x / WIDTH) * 100}%`,
            top: `${(points[hovered].y / HEIGHT) * 100}%`,
            marginTop: -12,
          }}
        >
          <p className="font-sans text-[11px] text-white/50">{points[hovered].label}</p>
          <p className="font-sans text-sm font-semibold text-white">{formatNumber(points[hovered].value)} leads</p>
        </div>
      ) : null}
    </div>
  );
}
