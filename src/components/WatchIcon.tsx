export interface WatchIconProps {
  size: number;
  fill: string;
}

export const WatchIcon = (props: WatchIconProps) => {
  const { size, fill } = props;

  return (
    <>
      <svg width="0" height="0" style={{ display: "block", position: "absolute" }}>
        <defs>
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="19.5"
              numOctaves="10"
              result="turbulence"
            />
            <feComposite operator="in" in="turbulence" in2="SourceAlpha" result="composite" />
            <feColorMatrix in="composite" type="luminanceToAlpha" />
            <feBlend in="SourceGraphic" in2="composite" mode="color-burn" />
          </filter>
        </defs>
      </svg>
      <svg
        stroke="currentColor"
        fill={fill}
        strokeWidth="0"
        viewBox="0 0 512 512"
        height={size}
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="240"
          height="240"
          x="136"
          y="136"
          rx="56"
          ry="56"
          filter="url('#noise')"
          style={{
            fill: `color-mix(in srgb, ${fill} 80%, transparent)`,
          }}
        ></rect>
        <path
          filter="url('#noise')"
          d="M336 96V32a16 16 0 0 0-16-16H192a16 16 0 0 0-16 16v64a80.09 80.09 0 0 0-80 80v160a80.09 80.09 0 0 0 80 80v64a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-64a80.09 80.09 0 0 0 80-80V176a80.09 80.09 0 0 0-80-80zm56 224a72.08 72.08 0 0 1-72 72H192a72.08 72.08 0 0 1-72-72V192a72.08 72.08 0 0 1 72-72h128a72.08 72.08 0 0 1 72 72z"
        ></path>
      </svg>
    </>
  );
};
