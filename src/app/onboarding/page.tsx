import { getColorSwatches } from "@/app/_actions/get-color-swatches";
import  OnboardingClientComponent  from "./_components/OnboardingClientComponent";

export default async function OnboardingPage() {
  const colors = await getColorSwatches();

  return <OnboardingClientComponent colors={colors} />;
}
