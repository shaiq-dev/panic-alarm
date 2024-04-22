export const NoiseFilter = () => {
  return (
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
  );
};
