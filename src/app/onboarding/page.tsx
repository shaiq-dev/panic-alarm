import { addWatch } from "@/app/_actions/add-watch";
import { getColorSwatches } from "@/app/_actions/fetch/get-color-swatches";
import OnboardingClientComponent from "./_components/OnboardingClientComponent";

export default async function OnboardingPage() {
  const colors = await getColorSwatches();

  return <OnboardingClientComponent colorSwatches={colors} action={addWatch} />;
}
