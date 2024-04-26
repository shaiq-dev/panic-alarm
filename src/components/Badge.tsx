export type BadgeType = "success" | "danger" | "warning";

export type Props = {
  children: React.ReactNode;
  type?: BadgeType;
};

export const Badge = ({ children, type = "success" }: Props) => {
  const dot: Record<BadgeType, string> = {
    success: "--color-green",
    danger: "--color-red",
    warning: "--color-yellow",
  };

  return (
    <div className="inline-flex flex-row items-center text-[9px] font-bold text-[var(--color-text)] h-4 bg-white rounded-full border border-solid border-slate-300 px-1.5">
      <span className="inline-flex justify-center items-center me-1.5">
        <div className="size-1.5 rounded-full" style={{ background: `var(${dot[type]})` }} />
      </span>
      <span className="text-ellipsis overflow-hidden whitespace-nowrap">{children}</span>
    </div>
  );
};
