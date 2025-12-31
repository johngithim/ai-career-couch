"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ExternalLink,
  MapPin,
  DollarSign,
  Clock,
  Building,
  Briefcase,
  BookmarkPlus,
  Search,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { getUserProfile } from "../actions/user";
import { fetchJobListings } from "../actions/jobs";

const JobUpdatesList = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [jobListings, setJobListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());

  useEffect(() => {
    const fetchUserProfileAndJobs = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);

        // Fetch real job listings based on user's industry
        await fetchJobsFromAPI(true);
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load your profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfileAndJobs();
  }, []);

  const fetchJobsFromAPI = async (isInitialLoad = false) => {
    if (!isInitialLoad) {
      setIsRefreshing(true);
    }

    try {
      const result = await fetchJobListings();
      setJobListings(result.jobs);

      if (!isInitialLoad) {
        toast.success(`Found ${result.jobs.length} new job listings!`);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error(error.message || "Failed to fetch job listings. Please check your Jooble API key.");

      // Fallback to mock data if API fails
      if (userProfile?.industry) {
        const mockJobs = generateMockJobs(userProfile.industry);
        setJobListings(mockJobs);
        toast.info("Showing sample jobs. Please check your API configuration.");
      }
    } finally {
      if (!isInitialLoad) {
        setIsRefreshing(false);
      }
    }
  };

  const generateMockJobs = (industry) => {
    // This would be replaced with real API calls
    const baseJobs = [
      {
        id: 1,
        title: "Senior Software Engineer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        salary: "$150,000 - $200,000",
        type: "Full-time",
        postedDate: "2 days ago",
        description: "Join our team to build scalable web applications using modern technologies.",
        skills: ["React", "Node.js", "AWS", "TypeScript"],
        applyUrl: "https://example.com/job/1",
      },
      {
        id: 2,
        title: "Product Manager",
        company: "InnovateLabs",
        location: "New York, NY",
        salary: "$130,000 - $170,000",
        type: "Full-time",
        postedDate: "1 day ago",
        description: "Lead product development initiatives and drive user experience improvements.",
        skills: ["Product Strategy", "Analytics", "Agile", "User Research"],
        applyUrl: "https://example.com/job/2",
      },
      {
        id: 3,
        title: "Data Scientist",
        company: "DataFlow Solutions",
        location: "Austin, TX",
        salary: "$120,000 - $160,000",
        type: "Full-time",
        postedDate: "3 days ago",
        description: "Analyze complex datasets and build predictive models for business insights.",
        skills: ["Python", "Machine Learning", "SQL", "Tableau"],
        applyUrl: "https://example.com/job/3",
      },
    ];

    // Customize jobs based on industry
    return baseJobs.map(job => ({
      ...job,
      title: customizeJobTitle(job.title, industry),
      description: customizeJobDescription(job.description, industry),
    }));
  };

  const customizeJobTitle = (title, industry) => {
    const industryMap = {
      "tech-software-development": "Senior Full Stack Developer",
      "tech-ai-ml": "AI/ML Engineer",
      "finance-banking": "Financial Analyst",
      "healthcare-medical": "Healthcare Data Analyst",
      "marketing-digital": "Digital Marketing Manager",
    };
    return industryMap[industry] || title;
  };

  const customizeJobDescription = (description, industry) => {
    const industryContexts = {
      "tech-software-development": "Build cutting-edge web applications and APIs",
      "tech-ai-ml": "Develop AI-powered solutions and machine learning models",
      "finance-banking": "Analyze financial data and create investment strategies",
      "healthcare-medical": "Improve patient outcomes through data-driven healthcare solutions",
      "marketing-digital": "Drive digital marketing campaigns and user acquisition",
    };
    return industryContexts[industry] || description;
  };

  const handleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
      toast.success("Job removed from saved jobs");
    } else {
      newSavedJobs.add(jobId);
      toast.success("Job saved for later!");
    }
    setSavedJobs(newSavedJobs);
  };

  const handleApply = (applyUrl) => {
    window.open(applyUrl, '_blank');
  };

  const handleRefresh = () => {
    fetchJobsFromAPI(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            Latest Jobs in {userProfile?.industry?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h2>
          <p className="text-muted-foreground">
            {jobListings.length} new opportunities found
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Job listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobListings.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200 border">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1 line-clamp-2">
                    {job.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span className="text-sm">{job.company}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSaveJob(job.id)}
                  className="flex-shrink-0"
                >
                  <BookmarkPlus
                    className={`h-4 w-4 ${
                      savedJobs.has(job.id)
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{job.salary}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{job.postedDate}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {job.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{job.skills.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleApply(job.applyUrl)}
                  className="flex-1 flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Apply Now
                </Button>
                <Button variant="outline" size="sm">
                  <Briefcase className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobListings.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't find any new job listings for your industry right now.
          </p>
          <Button onClick={handleRefresh} variant="outline">
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobUpdatesList;
