import React from "react";
import { industries } from "../../../data/industries";
import { getUserOnboardingStatus } from "../../../actions/user";
import OnboardingForm from "../../../components/OnboardingForm";
import { redirect } from "next/navigation";

const OnboardingPage = async () => {
  //check if user is already onborded
  const { isOnboarded } = await getUserOnboardingStatus();

  if (isOnboarded) {
    redirect("/dashboard");
  }
  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
};
export default OnboardingPage;
