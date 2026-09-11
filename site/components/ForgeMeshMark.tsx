// The mark used to load an SVG with animations baked inside it; an <img> of an
// animated SVG is re-rasterised every frame (plus the drop-shadow filter on top),
// and page CSS / reduced-motion cannot reach inside the file. It cost more paint
// time than the whole hero canvas (2026-09-11 CPU investigation). Now: static
// SVG + a compositor-only opacity pulse driven by .forge-mark-animated.
type ForgeMeshMarkProps = {
  size?: number;
  className?: string;
  animated?: boolean;
};

export function ForgeMeshMark({ size = 28, className = '', animated = true }: ForgeMeshMarkProps) {
  return (
    <img
      src="/fm-nobg-static.svg"
      width={size}
      height={size}
      className={`forge-mark ${animated ? 'forge-mark-animated' : ''} ${className}`}
      alt="ForgeMesh"
      draggable={false}
    />
  );
}
