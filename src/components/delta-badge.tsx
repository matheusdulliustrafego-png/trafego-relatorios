import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeltaBadge({
  label,
  pct,
  goodDirection,
}: {
  label: string;
  pct: number;
  goodDirection: "up" | "down" | "neutral";
}) {
  const direction = Math.abs(pct) < 0.5 ? "flat" : pct > 0 ? "up" : "down";
  const isGood =
    goodDirection !== "neutral" &&
    ((goodDirection === "up" && direction === "up") ||
      (goodDirection === "down" && direction === "down"));
  const isBad =
    goodDirection !== "neutral" &&
    ((goodDirection === "up" && direction === "down") ||
      (goodDirection === "down" && direction === "up"));

  const Icon = direction === "flat" ? Minus : direction === "up" ? ArrowUp : ArrowDown;

  return (
    <div className="flex items-center gap-1.5 font-sans text-xs">
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full",
          isGood && "bg-brand-whatsapp/15 text-brand-whatsapp",
          isBad && "bg-destructive/15 text-destructive",
          !isGood && !isBad && "bg-white/[0.06] text-white/50"
        )}
      >
        <Icon className="size-3" strokeWidth={2.5} />
      </span>
      <span className="text-white/45">{label}</span>
      <span
        className={cn(
          "font-medium",
          isGood && "text-brand-whatsapp",
          isBad && "text-destructive",
          !isGood && !isBad && "text-white/70"
        )}
      >
        {direction === "flat" ? "estável" : `${pct > 0 ? "+" : ""}${pct.toFixed(0)}%`}
      </span>
      <span className="text-white/35">vs período anterior</span>
    </div>
  );
}
