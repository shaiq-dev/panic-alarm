import { LuShieldAlert } from "react-icons/lu";
import { AlertOccurance } from "./AlertOccurance";

export const ActivityHistory = () => {
  return (
    <div className="mt-4">
      {/* Single Alert */}
      <div className="flex flex-col mb-3">
        {/* Top header */}
        <div className="flex items-center">
          <div
            className="center size-6 rounded-full mr-3"
            style={{
              background: "color-mix(in srgb, #ecb12f 20%, transparent)",
              color: "#ecb12f",
            }}
          >
            <LuShieldAlert size={16} />
          </div>
          <div className="text-sm font-normal">Automatic Alert, Occurred 3 Times</div>
        </div>
        {/* Main div with left border */}
        <div className="flex flex-col border-l def-border ml-3 pl-6 pb-3">
          <span className="text-xs text-dimmed mb-3">16:12 PM at Bangalore</span>
          {/* Alerts stack - first occurance to last */}
          <AlertOccurance rank={1} type="high" occuredAt={new Date()} change={2} bpm={86} />
          <AlertOccurance rank={2} type="high" occuredAt={new Date()} change={2.3} bpm={90} />
          <AlertOccurance rank={3} type="low" occuredAt={new Date()} change={3} bpm={63} />
          <AlertOccurance rank={3} type="low" occuredAt={new Date()} change={3} bpm={63} />
          <AlertOccurance rank={3} type="low" occuredAt={new Date()} change={3} bpm={63} />
          <AlertOccurance rank={3} type="low" occuredAt={new Date()} change={3} bpm={63} />
        </div>
      </div>

      {/* Single Alert */}
      <div className="flex flex-col mb-3">
        {/* Top header */}
        <div className="flex items-center">
          <div
            className="center size-6 rounded-full mr-3"
            style={{
              background: "color-mix(in srgb, #ecb12f 20%, transparent)",
              color: "#ecb12f",
            }}
          >
            <LuShieldAlert size={16} />
          </div>
          <div className="text-sm font-normal">Automatic Alert, Occurred 3 Times</div>
        </div>
        {/* Main div with left border */}
        <div className="flex flex-col border-l def-border ml-3 pl-6 pb-3">
          <span className="text-xs text-dimmed mb-3">16:12 PM at Bangalore</span>
          {/* Alerts stack - first occurance to last */}
          <AlertOccurance rank={1} type="high" occuredAt={new Date()} change={2} bpm={86} />
          <AlertOccurance rank={1} type="high" occuredAt={new Date()} change={2} bpm={86} />
          <AlertOccurance rank={1} type="high" occuredAt={new Date()} change={2} bpm={86} />
          <AlertOccurance rank={2} type="high" occuredAt={new Date()} change={2.3} bpm={90} />
          <AlertOccurance rank={2} type="high" occuredAt={new Date()} change={2.3} bpm={90} />
          <AlertOccurance rank={2} type="high" occuredAt={new Date()} change={2.3} bpm={90} />
        </div>
      </div>
    </div>
  );
};
