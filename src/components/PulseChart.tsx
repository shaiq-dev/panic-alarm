import { Title, Text, Flex, Stack, Select } from "@mantine/core";
import { AreaChart } from "@mantine/charts";

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
  return (
    <Stack py="var(--default-section-gap)" gap={0}>
      <Flex align="center" justify="space-between" mb="var(--default-gap)">
        <div>
          <Title order={3} fw={500}>
            Pulse
          </Title>
          <Text size="sm" c="dimmed" maw={400}>
            Last 24 hour pulse rate. You can view history of upto 7 days.
          </Text>
        </div>
        <Select
          placeholder="Pick value"
          data={["React", "Angular", "Vue", "Svelte", "Past 24 Hours"]}
          defaultValue={"Past 24 Hours"}
          className="disable-mantine-input-focus"
        />
      </Flex>
      <AreaChart
        h={280}
        data={data}
        dataKey="time"
        series={[{ name: "Rate", color: "red.5" }]}
        yAxisProps={{ domain: [0, 200] }}
        curveType="natural"
        gridAxis="none"
        connectNulls
        withTooltip={false}
        strokeWidth={1.5}
      />
    </Stack>
  );
};
