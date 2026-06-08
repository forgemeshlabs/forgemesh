type ForgeMeshMarkProps = {
  size?: number;
  className?: string;
  animated?: boolean;
};

export function ForgeMeshMark({ size = 28, className = '', animated = true }: ForgeMeshMarkProps) {
  return (
    <img
      src="/fm-nobg.svg"
      width={size}
      height={size}
      className={`forge-mark ${animated ? 'forge-mark-animated' : ''} ${className}`}
      alt="ForgeMesh"
      draggable={false}
    />
  );
}
