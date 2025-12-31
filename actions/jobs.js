"use server";

import { getUserProfile } from "./user";

const JOOBLE_BASE_URL = "https://jooble.org/api/";
const JOOBLE_API_URL = "https://jooble.org/api/v0.2/jobs";

// Convert industry names to job search terms
const industryToJobQuery = {
  "tech-software-development": "software engineer OR full stack developer",
  "tech-ai-ml": "machine learning engineer OR AI engineer OR data scientist",
  "finance-banking": "financial analyst OR investment banker",
  "healthcare-medical": "healthcare data analyst OR medical researcher",
  "marketing-digital": "digital marketing manager OR growth marketer",
  "design-ux-ui": "UX designer OR UI designer",
  "product-management": "product manager",
  "sales-business-development": "sales representative OR business development",
  "hr-talent": "HR manager OR talent acquisition",
  "consulting": "management consultant OR strategy consultant",
  "education": "teacher OR education administrator",
  "legal": "corporate lawyer OR legal counsel",
  "operations": "operations manager OR supply chain",
  "customer-success": "customer success manager",
};

export async function fetchJobListings() {
  try {
    // Get user profile to determine industry
    const userProfile = await getUserProfile();

    if (!userProfile.industry) {
      throw new Error("User industry not set");
    }

    // Get the search query for this industry
    const searchQuery = industryToJobQuery[userProfile.industry] || "software engineer";

    console.log("Fetching jobs for industry:", userProfile.industry, "with query:", searchQuery);
    console.log("API Key exists:", !!process.env.JOOBLE_API_KEY);

    // Make API request to Jooble
    const apiUrl = `${JOOBLE_BASE_URL}${process.env.JOOBLE_API_KEY}`;
    console.log("API URL:", apiUrl.replace(process.env.JOOBLE_API_KEY, '[API_KEY]')); // Hide actual key in logs

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keywords: searchQuery,
        location: "",
        radius: "50",
        salary: "",
        page: "1"
      })
    });

    console.log("API Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error response:", errorText);
      throw new Error(`Jooble API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("API Response data structure:", Object.keys(data));
    console.log("API Response data:", JSON.stringify(data, null, 2));

    // Handle different possible response formats from Jooble
    let jobsArray = [];
    if (data.jobs && Array.isArray(data.jobs)) {
      jobsArray = data.jobs;
    } else if (Array.isArray(data)) {
      jobsArray = data;
    } else if (data.data && Array.isArray(data.data)) {
      jobsArray = data.data;
    }

    console.log("Found", jobsArray.length, "jobs in response");

    // Transform the Jooble API response to our format
    const jobs = jobsArray.map(job => ({
      id: job.id || job.job_id || Math.random().toString(36).substr(2, 9),
      title: job.title || job.job_title || "Job Title",
      company: job.company || job.company_name || job.employer_name || "Company Name",
      location: job.location || job.job_city || "Remote",
      salary: job.salary || job.job_salary || "Salary not disclosed",
      type: job.type || job.job_type || "Full-time",
      postedDate: job.updated || job.posted_date || formatPostedDate(new Date().toISOString()),
      description: (job.snippet || job.description || job.job_description || "No description available").substring(0, 200) + "...",
      skills: extractSkills(job.snippet || job.description || job.job_description || ""),
      applyUrl: job.link || job.job_link || job.apply_url || "#",
      companyLogo: job.company_logo || null,
      isRemote: (job.location || "").toLowerCase().includes('remote') || false,
    }));

    return {
      jobs,
      industry: userProfile.industry,
      searchQuery,
      totalResults: data.totalCount || jobs.length,
    };

  } catch (error) {
    console.error("Error fetching job listings:", error);

    // Log more details for debugging
    if (error.message.includes('API request failed')) {
      console.error("This usually means:");
      console.error("1. Invalid API key");
      console.error("2. API key not activated");
      console.error("3. Network/connectivity issues");
      console.error("4. API quota exceeded");
    }

    throw new Error("Failed to fetch job listings. Please check your Jooble API key and try again.");
  }
}

function formatPostedDate(dateString) {
  if (!dateString) return "Recently posted";

  try {
    const postedDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  } catch (error) {
    return "Recently posted";
  }
}

function extractSkills(description) {
  if (!description) return [];

  // Common skills to look for
  const commonSkills = [
    "JavaScript", "Python", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Rust", "Swift",
    "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Flask", "Spring",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "SQL", "MongoDB", "PostgreSQL",
    "Git", "Agile", "Scrum", "CI/CD", "REST", "GraphQL", "TypeScript", "HTML", "CSS",
    "Machine Learning", "AI", "Data Science", "Analytics", "Tableau", "Power BI",
    "SEO", "SEM", "Social Media", "Content Marketing", "Adobe Creative Suite"
  ];

  const foundSkills = [];
  const lowerDesc = description.toLowerCase();

  for (const skill of commonSkills) {
    if (lowerDesc.includes(skill.toLowerCase()) && foundSkills.length < 5) {
      foundSkills.push(skill);
    }
  }

  return foundSkills;
}
