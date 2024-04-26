import { Container } from "@mantine/core";
import { getWatches } from "../../_actions/fetch/get-watches";
import { ActiveWatchSelector } from "../_components/ActiveWatchSelector";
import { AddPeople } from "./_components/AddPeople";

export default async function SettingsPage() {
  const watches = await getWatches();

  return (
    <Container size="sm">
      <div className="flex justify-between pt-20 pb-10">
        <div>
          <h2 className="heading-xl">Settings</h2>
          <p className="text-sm text-dimmed">All settings will be applied to the selected watch</p>
        </div>
        <ActiveWatchSelector watches={watches} useLayout="settings" />
      </div>
      <div className="flex flex-col">
        <AddPeople />
      </div>
    </Container>
  );
}
