import { getWatches } from "@/app/_actions/fetch/get-watches";
import DashboardClientComponent from "./_components/DashboardClientComponent";

export default async function DashboardPage() {
  const watches = await getWatches();

  return <DashboardClientComponent watches={watches} />;
}
