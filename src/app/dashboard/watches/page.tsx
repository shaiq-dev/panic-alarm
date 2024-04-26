import { Container, Title } from "@mantine/core";
import { addWatch } from "@/app/_actions/add-watch";
import { getColorSwatches } from "@/app/_actions/fetch/get-color-swatches";
import { getWatches } from "@/app/_actions/fetch/get-watches";
import { WATCH_PAGE_DESCRIPTION, WATCH_PAGE_TITLE } from "@/constants/app-strings";
import { AddWatchModal } from "./_components/AddWatchModal";
import { WatchList } from "./_components/WatchList";

export default async function WatchesPage() {
  const watches = await getWatches();
  const colors = await getColorSwatches();

  return (
    <Container size="sm">
      <div className="flex flex-col h-full pt-20">
        <Title order={2} fw={500}>
          {WATCH_PAGE_TITLE}
        </Title>
        <div className="flex-ic space-between pb-6">
          <p className="text-sm text-dimmed pe-16">{WATCH_PAGE_DESCRIPTION}</p>
          <div className="block">
            <AddWatchModal colorSwatches={colors} action={addWatch} />
          </div>
        </div>
        <WatchList watches={watches} />
      </div>
    </Container>
  );
}
