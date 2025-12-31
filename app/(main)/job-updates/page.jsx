import React from "react";
import { getUserOnboardingStatus } from "../../../actions/user";
import { redirect } from "next/navigation";
import JobUpdatesList from "../../../components/JobUpdatesList";

const JobUpdatesPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  return (
    <div className={"container mx-auto py-6"}>
      <div className={"max-w-6xl mx-auto"}>
        <div className={"text-center mb-8"}>
          <h1 className={"text-4xl font-bold gradient-title mb-4"}>
            Job Updates
          </h1>
          <p className={"text-muted-foreground text-lg"}>
            Discover new job opportunities in your industry. Stay updated with
            the latest openings that match your career interests.
          </p>
        </div>
        <JobUpdatesList />
      </div>
    </div>
  );
};

export default JobUpdatesPage;
