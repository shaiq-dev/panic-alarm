import { Container, Title } from "@mantine/core";

import { getWatches } from "./_actions";
import { WatchList } from "./_components/WatchList";
import { AddWatch } from "./_components/AddWatch";

export default async function WatchPage() {
  const watches = await getWatches();

  return (
    <Container size="sm">
      <div className="flex flex-col h-full pt-20">
        <Title order={2} fw={500}>
          Your Watche&apos;s
        </Title>
        <div className="flex items-center space-between pb-6">
          <p className="text-sm text-dimmed pe-16">
            All your watche&apos;s at one place. You can check their status or
            modify them. A watch can be added to only one account at a time.
          </p>
          <div className="block">
            <AddWatch />
          </div>
        </div>
        <WatchList watches={watches} />
      </div>
    </Container>
  );
}
