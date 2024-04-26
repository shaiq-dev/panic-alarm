import { dateAsLocal } from "@/utils/date-utils";

export interface Props {
  rank: number;
  type: "high" | "low";
  occuredAt: Date;
  change: number;
  bpm: number;
}

export const AlertOccurance = (props: Props) => {
  const { rank, type, occuredAt, change, bpm } = props;
  const isHigh = type === "high";

  const color = isHigh ? "var(--color-red)" : "var(--color-teal)";

  return (
    <div className="flex-ic border def-border rounded px-4 py-2 mb-2">
      <div className="text-lg font-semibold mr-4">#{rank}</div>
      <div>
        <div className="text-sm">Recorded {isHigh ? "High" : "Low"}</div>
        <div className="text-xs text-dimmed">{dateAsLocal(occuredAt)}</div>
      </div>
      <div
        className="ml-8 text-xs py-1 px-2 rounded font-normal"
        style={{
          background: `color-mix(in srgb, ${color} 20%, transparent)`,
          color,
        }}
      >
        {change}% {isHigh ? "Increase" : "Decrease"}
      </div>
      <div className="ml-auto text-right">
        <div className="text-base font-medium">{bpm}</div>
        <div className="text-xs text-dimmed">/BPM</div>
      </div>
    </div>
  );
};
