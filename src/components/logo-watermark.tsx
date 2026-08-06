export function LogoWatermark() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <span
        className="select-none font-heading font-bold leading-none tracking-tighter text-gradient-silver opacity-[0.07]"
        style={{ fontSize: "min(48vw, 26rem)" }}
      >
        TR
      </span>
    </div>
  );
}
