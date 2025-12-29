"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Briefcase, Clock, ExternalLink, Linkedin, Search, Star, Users, MapPin, DollarSign, Globe } from "lucide-react";
import { toast } from "sonner";
import { getUserProfile } from "../actions/user";

const JobApplicationForm = () => {
  const [formData, setFormData] = useState({
    linkedin: "",
    desiredRole: "",
    jobPostingUrl: "",
    location: "",
    salaryExpectation: "",
    jobPreferences: "",
  });
  const [userProfile, setUserProfile] = useState(null);
  const [jobResults, setJobResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const desiredRoles = [
    "Software Engineer",
    "Senior Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Product Manager",
    "UX/UI Designer",
    "Marketing Manager",
    "Sales Representative",
    "Business Analyst",
    "Project Manager",
    "Data Analyst",
    "Machine Learning Engineer",
    "Cybersecurity Analyst",
    "System Administrator",
    "Technical Writer",
    "QA Engineer",
    "Scrum Master",
    "Engineering Manager",
    "CTO",
    "HR Specialist",
  ];

  const locations = [
    "Remote",
    "On-site",
    "Hybrid",
    "Open to relocation",
  ];

  const salaryRanges = [
    "Under $50,000",
    "$50,000 - $80,000",
    "$80,000 - $120,000",
    "$120,000 - $160,000",
    "$160,000 - $200,000",
    "$200,000+",
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        toast.error("Failed to load your profile");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.linkedin || !formData.desiredRole) {
      toast.error("Please fill in LinkedIn and desired role");
      return;
    }

    setIsLoading(true);

    try {
      // In a real implementation, this would call your AI service
      // For now, we'll simulate the response
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate personalized job recommendations based on user profile and job posting
      const jobPostingAnalysis = formData.jobPostingUrl ? {
        analyzedPosting: {
          company: "TechCorp Inc.",
          title: "Senior Software Engineer",
          requirements: [
            "5+ years of experience in full-stack development",
            "Strong knowledge of React and Node.js",
            "Experience with cloud platforms (AWS/Azure)",
            "Bachelor's degree in Computer Science or equivalent",
          ],
          responsibilities: [
            "Design and develop scalable web applications",
            "Collaborate with cross-functional teams",
            "Mentor junior developers",
            "Participate in code reviews and architecture decisions",
          ],
          benefits: [
            "Competitive salary and equity package",
            "Health, dental, and vision insurance",
            "Flexible work arrangements",
            "Professional development budget",
          ],
        },
        matchAnalysis: {
          skillMatch: "85%",
          experienceMatch: "Good fit",
          cultureFit: "Strong alignment with your background",
        },
        applicationTips: [
          "Highlight your experience with similar technologies",
          "Quantify your impact in previous roles",
          "Show enthusiasm for the company's mission",
          "Prepare specific examples of your problem-solving skills",
        ],
      } : null;

      const personalizedResults = {
        userProfile: {
          industry: userProfile.industry,
          experience: userProfile.experience,
          skills: userProfile.skills,
        },
        desiredRole: formData.desiredRole,
        jobPostingAnalysis,
        recommendations: {
          nextSteps: [
            "Update your LinkedIn profile with your recent achievements",
            "Network with professionals in your desired role",
            "Consider gaining relevant certifications",
            "Build a portfolio showcasing your skills",
            "Prepare for interviews in your target role",
            ...(formData.jobPostingUrl ? ["Tailor your resume to match the job requirements", "Research the company thoroughly"] : []),
          ],
          skillGaps: [
            "Advanced leadership skills",
            "Industry-specific certifications",
            "Project management experience",
            "Technical expertise in emerging technologies",
          ],
          networking: [
            "Join LinkedIn groups in your target industry",
            "Attend industry conferences and meetups",
            "Connect with alumni from your desired companies",
            "Participate in relevant online communities",
          ],
        },
        marketInsights: {
          demand: "High demand for this role",
          competition: "Moderate competition",
          growth: "Strong growth potential",
        },
      };

      setJobResults(personalizedResults);
      toast.success(formData.jobPostingUrl ? "Job posting analyzed and recommendations generated!" : "Career recommendations generated!");
    } catch (error) {
      toast.error("Failed to generate recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      linkedin: "",
      desiredRole: "",
      jobPostingUrl: "",
      location: "",
      salaryExpectation: "",
      jobPreferences: "",
    });
    setJobResults(null);
  };

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-screen overflow-y-auto">
      {/* User Profile Summary */}
      {userProfile && (
        <Card className="border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-medium capitalize">{userProfile.industry?.replace(/-/g, ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-medium">{userProfile.experience} years</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Skills</p>
                <p className="font-medium">{userProfile.skills}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Search Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LinkedIn Profile */}
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn Profile URL
                </Label>
                <Input
                  id="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                />
              </div>

              {/* Desired Role */}
              <div className="space-y-2">
                <Label htmlFor="desiredRole" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Desired Role
                </Label>
                <Select
                  value={formData.desiredRole}
                  onValueChange={(value) => handleInputChange("desiredRole", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select desired role" />
                  </SelectTrigger>
                  <SelectContent>
                    {desiredRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Job Posting URL */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="jobPostingUrl" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Job Posting URL (Optional)
                </Label>
                <Input
                  id="jobPostingUrl"
                  type="url"
                  placeholder="https://company.com/careers/job-posting"
                  value={formData.jobPostingUrl}
                  onChange={(e) => handleInputChange("jobPostingUrl", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Paste a job posting URL to get personalized recommendations based on that specific role
                </p>
              </div>

              {/* Location Preference */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location Preference
                </Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => handleInputChange("location", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location preference" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Expectation */}
              <div className="space-y-2">
                <Label htmlFor="salaryExpectation" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Salary Expectation
                </Label>
                <Select
                  value={formData.salaryExpectation}
                  onValueChange={(value) => handleInputChange("salaryExpectation", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select salary range" />
                  </SelectTrigger>
                  <SelectContent>
                    {salaryRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Job Preferences */}
            <div className="space-y-2">
              <Label htmlFor="jobPreferences">
                Additional Preferences (Optional)
              </Label>
              <Textarea
                id="jobPreferences"
                placeholder="Tell us about your job preferences, company culture, work-life balance, etc."
                value={formData.jobPreferences}
                onChange={(e) => handleInputChange("jobPreferences", e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Recommendations...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    {formData.jobPostingUrl ? "Analyze Job & Get Recommendations" : "Get Career Recommendations"}
                  </div>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Career Recommendations Results */}
      {jobResults && (
        <div className="space-y-6">
          <Card className="border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Personalized Career Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Job Posting Analysis */}
              {jobResults.jobPostingAnalysis && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-900 dark:text-green-100">
                    <Globe className="h-4 w-4" />
                    Job Posting Analysis
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">Company</p>
                      <p className="text-green-900 dark:text-green-100">{jobResults.jobPostingAnalysis.analyzedPosting.company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">Position</p>
                      <p className="text-green-900 dark:text-green-100">{jobResults.jobPostingAnalysis.analyzedPosting.title}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Your Match</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="bg-white/50 dark:bg-black/20 rounded p-2 text-center">
                        <p className="text-xs text-green-700 dark:text-green-300">Skills Match</p>
                        <p className="font-medium text-green-900 dark:text-green-100">{jobResults.jobPostingAnalysis.matchAnalysis.skillMatch}</p>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 rounded p-2 text-center">
                        <p className="text-xs text-green-700 dark:text-green-300">Experience</p>
                        <p className="font-medium text-green-900 dark:text-green-100">{jobResults.jobPostingAnalysis.matchAnalysis.experienceMatch}</p>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 rounded p-2 text-center">
                        <p className="text-xs text-green-700 dark:text-green-300">Culture Fit</p>
                        <p className="font-medium text-green-900 dark:text-green-100">{jobResults.jobPostingAnalysis.matchAnalysis.cultureFit}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Key Requirements</p>
                    <div className="flex flex-wrap gap-1">
                      {jobResults.jobPostingAnalysis.analyzedPosting.requirements.slice(0, 3).map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-white/70 dark:bg-black/30 border-green-300">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Application Tips</p>
                    <ul className="text-xs text-green-800 dark:text-green-200 space-y-1">
                      {jobResults.jobPostingAnalysis.applicationTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Market Insights */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Market Insights for {jobResults.desiredRole}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Demand</p>
                    <p className="font-medium text-green-600">{jobResults.marketInsights.demand}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Competition</p>
                    <p className="font-medium text-yellow-600">{jobResults.marketInsights.competition}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Growth</p>
                    <p className="font-medium text-blue-600">{jobResults.marketInsights.growth}</p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Recommended Next Steps
                </h3>
                <div className="space-y-2">
                  {jobResults.recommendations.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Gaps */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Skills to Develop
                </h3>
                <div className="flex flex-wrap gap-2">
                  {jobResults.recommendations.skillGaps.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Networking Opportunities */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Networking Opportunities
                </h3>
                <div className="space-y-2">
                  {jobResults.recommendations.networking.map((opportunity, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-muted/20 rounded">
                      <ExternalLink className="h-4 w-4 text-primary" />
                      <span className="text-sm">{opportunity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Transition Tips */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Career Transition Tips</h3>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <p>• Leverage your {jobResults.userProfile.experience} years of experience in {jobResults.userProfile.industry?.replace(/-/g, ' ')}</p>
                  <p>• Highlight transferable skills: {jobResults.userProfile.skills}</p>
                  <p>• Consider lateral moves or internal transitions to build experience</p>
                  <p>• Update your resume to emphasize relevant achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default JobApplicationForm;
