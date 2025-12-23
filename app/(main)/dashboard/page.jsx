import { getUserOnboardingStatus } from "../../../actions/user";
import { redirect } from "next/navigation";
import { getIndustryInsights } from "../../../actions/dashboard";
import DashboardView from "../../../components/DashboardView";
import "ldrs/react/Cardio.css";

const IndustryInsightsPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  const insights = await getIndustryInsights();

  if (!isOnboarded) {
    redirect("/onboarding ");
  }
  return (
    <div className={"container mx-auto"}>
      <DashboardView insights={insights} />
    </div>
  );
};
export default IndustryInsightsPage;
