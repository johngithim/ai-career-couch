import React from "react";
import { getUserOnboardingStatus } from "../../../actions/user";
import { redirect } from "next/navigation";
import JobApplicationForm from "../../../components/JobApplicationForm";

const JobApplicationsPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  return (
    <div className={"container mx-auto py-6"}>
      <div className={"max-w-4xl mx-auto"}>
        <div className={"text-center mb-8"}>
          <h1 className={"text-4xl font-bold gradient-title mb-4"}>
            Job Applications
          </h1>
          <p className={"text-muted-foreground text-lg"}>
            Find your perfect job match by providing your details and discover
            tailored job requirements
          </p>
        </div>
        <JobApplicationForm />
      </div>
    </div>
  );
};

export default JobApplicationsPage;
