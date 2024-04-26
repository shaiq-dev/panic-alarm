import classnames from "classnames";
import { ImConnection } from "react-icons/im";
import { IoPulse } from "react-icons/io5";
import { IconType } from "react-icons/lib";
import { LuShieldAlert } from "react-icons/lu";
import { MdTouchApp } from "react-icons/md";

const StatsConfig: Record<string, [string, string, IconType]> = {
  beats: ["Average Beats", "#2eb67d", IoPulse],
  autoAlerts: ["Automatic Alerts", "#ecb12f", LuShieldAlert],
  triggeredAlerts: ["Triggered Alerts", "#e01d5a", MdTouchApp],
  connection: ["Connection", "#1264a3", ImConnection],
};

export interface Props {
  beats: number;
  autoAlerts: number;
  triggeredAlerts: number;
  connection: string;
}

export const WatchQuickStats = (props: Props) => {
  const { beats, autoAlerts, triggeredAlerts, connection } = props;

  return (
    <section className="py-10">
      <div className="grid grid-cols-4">
        {Object.entries({ beats, autoAlerts, triggeredAlerts, connection }).map(([k, v], idx) => {
          const [name, color, icon] = StatsConfig[k];
          const Icon = icon;
          const cn = classnames("flex flex-col border-solid", {
            "pl-4": idx !== 0,
            "pr-4": idx !== 3,
            "border-r": idx !== 3,
          });

          return (
            <div key={idx} className={cn}>
              <div className="flex items-center mb-3">
                <div
                  className="center rounded-full size-8 mr-3"
                  style={{
                    background: `color-mix(in srgb, ${color} 20%, transparent)`,
                    color,
                  }}
                >
                  <Icon size={18} />
                </div>
                <span className="text-sm leading-none">{name}</span>
              </div>
              <span className="font-normal text-3xl">{v}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
