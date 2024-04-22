"use client";

import { FocusTrap, Modal, Select } from "@mantine/core";
import { AreaChart } from "@mantine/charts";
import { useDisclosure } from "@mantine/hooks";

export const data = [
  {
    time: "00:00",
    Rate: 120,
  },
  {
    time: "01:00",
    Rate: 100,
  },
  {
    time: "02:00",
    Rate: 118,
  },
  {
    time: "03:00",
    Rate: 110,
  },
  {
    time: "04:00",
    Rate: 75,
  },
  {
    time: "05:00",
    Rate: 120,
  },
  {
    time: "06:00",
    Rate: 120,
  },
  {
    time: "07:00",
    Rate: 100,
  },
  {
    time: "08:00",
    Rate: 140,
  },
  {
    time: "09:00",
    Rate: 120,
  },
  {
    time: "10:00",
    Rate: 180,
  },
  {
    time: "11:00",
    Rate: 120,
  },
  {
    time: "12:00",
  },
  {
    time: "13:00",
  },
  {
    time: "14:00",
    Rate: 0,
  },
];

export const PulseChart = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <section className="flex flex-col py-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="heading">Pulse</h3>
            <span className="text-sm text-dimmed max-w-[400px]">
              Last 24 hour pulse rate. You can view history of upto 7 days.
              <br />
              <span className="link font-normal" onClick={open}>
                Check Realtime ECG
              </span>
            </span>
          </div>
          <Select
            placeholder="Pick value"
            data={["React", "Angular", "Vue", "Svelte", "Past 24 Hours"]}
            defaultValue={"Past 24 Hours"}
            className="disable-mantine-input-focus"
          />
        </div>
        <AreaChart
          h={284}
          data={data}
          dataKey="time"
          series={[{ name: "Rate", color: "var(--color-red)" }]}
          yAxisProps={{ domain: [0, 200] }}
          curveType="linear"
          gridAxis="none"
          connectNulls
          withTooltip={false}
          strokeWidth={1.5}
        />
      </section>
      <Modal
        opened={opened}
        onClose={close}
        title="Sinus Rhythm"
        size={"70%"}
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 2.5,
        }}
        centered
        closeOnClickOutside={false}
      >
        <FocusTrap.InitialFocus />
        {/* Modal content */}
        <div className="w-full h-72" />
      </Modal>
    </>
  );
};
