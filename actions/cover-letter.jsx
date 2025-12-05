"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateCoverLetter(data) {
  // Validate API key
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not configured");
    throw new Error("AI service is not configured. Please contact support.");
  }

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  // Validate required input data
  if (!data.companyName || !data.jobTitle || !data.jobDescription) {
    throw new Error("Company name, job title, and job description are required");
  }

  // Prepare user data with fallbacks
  const industry = user.industry || "Not specified";
  const experience = user.experience ? `${user.experience} years` : "Not specified";
  const skills = Array.isArray(user.skills) && user.skills.length > 0
    ? user.skills.join(", ")
    : "Not specified";
  const bio = user.bio || "Not specified";

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${
      data.companyName
    }.

    About the candidate:
    - Industry: ${industry}
    - Years of Experience: ${experience}
    - Skills: ${skills}
    - Professional Background: ${bio}

    Job Description:
    ${data.jobDescription}

    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements

    Format the letter in markdown.
  `;

  try {
    // Initialize AI model here to catch initialization errors
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text().trim();

    if (!content) {
      throw new Error("AI service returned empty response");
    }

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName.trim(),
        jobTitle: data.jobTitle.trim(),
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error);

    // Provide more specific error messages
    if (error.message?.includes("API_KEY")) {
      throw new Error("AI service authentication failed. Please contact support.");
    } else if (error.message?.includes("quota") || error.message?.includes("limit")) {
      throw new Error("AI service quota exceeded. Please try again later.");
    } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
      throw new Error("Network error. Please check your connection and try again.");
    } else {
      throw new Error("Failed to generate cover letter. Please try again.");
    }
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}
