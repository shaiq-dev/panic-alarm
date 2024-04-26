import { Container } from "@mantine/core";
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
      <div className="flex justify-between pt-20 pb-10">
        <div>
          <h2 className="heading-xl">{WATCH_PAGE_TITLE}</h2>
          <p className="text-sm text-dimmed">{WATCH_PAGE_DESCRIPTION}</p>
        </div>
        <AddWatchModal colorSwatches={colors} action={addWatch} />
      </div>
      <div className="flex flex-col">
        <WatchList watches={watches} />
      </div>
    </Container>
  );
}
