"use client";

import { Button } from "./ui/button";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "../lib/schema";
import useFetch from "../hooks/use-fetch";
import { saveResume } from "../actions/resume";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import EntryForm from "./EntryForm";
import { entriesToMarkdown } from "../lib/helper";
import MDEditor from "@uiw/react-md-editor";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const ResumeBuilder = ({ initialContent }) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [resumeMode, setResumeMode] = useState("preview");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useUser();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {
        email: "",
        mobile: "",
        linkedin: "",
        twitter: "",
      },
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(` [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`${contactInfo.twitter}`);

    return parts.length > 0
      ? `<div align={"center"}>${user?.fullName}</div>\n\n <div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  useEffect(() => {
    if (wsaveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }

    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const onSubmit = async () => {
    try {
      await saveResumeFn(previewContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    let tempContainer = null;

    try {
      // Dynamically import html2pdf
      const html2pdf = (await import("html2pdf.js")).default;

      // Get current content
      const currentContent =
        activeTab === "edit" ? getCombinedContent() : previewContent;
      if (!currentContent || currentContent.trim() === "") {
        alert(
          "Please add some content to your resume before generating a PDF.",
        );
        setIsGenerating(false);
        return;
      }

      // Create a temporary container for PDF generation
      tempContainer = document.createElement("div");
      tempContainer.id = "temp-pdf-container";
      tempContainer.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 210mm;
        min-height: 297mm;
        background: #ffffff !important;
        color: #000000 !important;
        padding: 40px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        box-sizing: border-box;
        z-index: 99999;
      `;

      // Append to body first
      document.body.appendChild(tempContainer);

      // Render MDEditor.Markdown using React
      const React = await import("react");
      const ReactDOM = await import("react-dom/client");
      const root = ReactDOM.createRoot(tempContainer);

      root.render(
        React.createElement(MDEditor.Markdown, {
          source: currentContent,
          style: {
            background: "#ffffff",
            color: "#000000",
          },
        }),
      );

      // Wait for React to render
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Suppress CSS parsing errors
      const originalError = console.error;
      console.error = (...args) => {
        const errorMsg = args[0]?.toString() || "";
        if (
          errorMsg.includes("lab") ||
          errorMsg.includes("color function") ||
          errorMsg.includes("oklch")
        ) {
          return;
        }
        originalError.apply(console, args);
      };

      const opt = {
        margin: [10, 10],
        filename: `resume-${user?.fullName?.replace(/\s+/g, "-") || "resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          width: tempContainer.scrollWidth || 794,
          height: tempContainer.scrollHeight || 1123,
          windowWidth: tempContainer.scrollWidth || 794,
          windowHeight: tempContainer.scrollHeight || 1123,
          onclone: (clonedDoc) => {
            try {
              const root = clonedDoc.documentElement;
              root.style.setProperty("--background", "#ffffff", "important");
              root.style.setProperty("--foreground", "#000000", "important");

              // Force all elements to use standard colors
              const allElements = clonedDoc.querySelectorAll("*");
              allElements.forEach((el) => {
                if (el.style) {
                  el.style.color = el.style.color || "#000000";
                  el.style.backgroundColor =
                    el.style.backgroundColor || "#ffffff";
                }
              });
            } catch (e) {
              // Ignore
            }
          },
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      await html2pdf().set(opt).from(tempContainer).save();

      // Clean up React root
      root.unmount();

      // Restore console.error
      console.error = originalError;
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error(
        `Failed to generate PDF: ${error.message || "Unknown error"}. Please check the browser console for details.`,
      );
    } finally {
      // Clean up temporary container
      if (tempContainer && tempContainer.parentNode) {
        tempContainer.parentNode.removeChild(tempContainer);
      }
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={
          "flex flex-col md:flex-row justify-between items-center gap-2"
        }
      >
        <h1 className={"font-bold gradient-title text-5xl md:text-6xl"}>
          Resume Builder
        </h1>

        <div className={"space-x-2"}>
          <Button
            variant={"destructive"}
            className={"cursor-pointer"}
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className={"mr-2 h-4 w-4 animate-spin"} />
                Saving...
              </>
            ) : (
              <>
                <Save className={"h-4 w-4"} />
                Save
              </>
            )}
          </Button>
          <Button
            onClick={generatePDF}
            disabled={isGenerating}
            className={"cursor-pointer"}
          >
            {isGenerating ? (
              <>
                <Loader2 className={"h-4 w-4 animate-spin"} />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className={"h-4 w-4"} />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <form className={"space-y-8"}>
            <div className={"space-y-4"}>
              <h3 className={"text-lg font-medium"}>Contact Information</h3>
              <div
                className={
                  "grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50"
                }
              >
                <div className={"space-y-2"}>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register("contactInfo.email")}
                    type={"email"}
                    placeholder={"your@email.com"}
                    error={errors.contactInfo?.email}
                  />

                  {errors.contactInfo?.email && (
                    <p className={"text-sm text-red-500"}>
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>

                <div className={"space-y-2"}>
                  <label className="text-sm font-medium">Mobile number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type={"tel"}
                    placeholder={"+251 234 567 8900"}
                  />

                  {errors.contactInfo?.mobile && (
                    <p className={"text-sm text-red-500"}>
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                <div className={"space-y-2"}>
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type={"url"}
                    placeholder={"https://linkedin.com/in/your-profile"}
                  />

                  {errors.contactInfo?.linkedin && (
                    <p className={"text-sm text-red-500"}>
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>
                <div className={"space-y-2"}>
                  <label className="text-sm font-medium">
                    Twitter/X profile
                  </label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type={"url"}
                    placeholder={"https://twitter.com/your-account"}
                  />

                  {errors.contactInfo?.twitter && (
                    <p className={"text-sm text-red-500"}>
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className={"text-lg font-medium"}>Professional Summary</h3>
              <Controller
                name={"summary"}
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className={"h-32"}
                    placeholder={"Write a compelling professional summary..."}
                    error={errors.summary}
                  />
                )}
              />

              {errors.summary && (
                <p className={"text-sm text-red-500"}>
                  {errors.summary.message}
                </p>
              )}
            </div>

            <div>
              <h3 className={"text-lg font-medium"}>Skills</h3>
              <Controller
                name={"skills"}
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className={"h-32"}
                    placeholder={"List your key skills..."}
                  />
                )}
              />
              {errors.skills && (
                <p className={"text-sm text-red-500"}>
                  {errors.skills.message}
                </p>
              )}
            </div>

            <div>
              <h3 className={"text-lg font-medium"}>Work Experience</h3>
              <Controller
                name={"experience"}
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type={"Experience"}
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.experience && (
                <p className={"text-sm text-red-500"}>
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div>
              <h3 className={"text-lg font-medium"}>Education</h3>
              <Controller
                name={"education"}
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type={"Education"}
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.education && (
                <p className={"text-sm text-red-500"}>
                  {errors.education.message}
                </p>
              )}
            </div>

            <div>
              <h3 className={"text-lg font-medium"}>Projects</h3>
              <Controller
                name={"projects"}
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type={"Project"}
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.projects && (
                <p className={"text-sm text-red-500"}>
                  {errors.projects.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>
        <TabsContent value="preview">
          <Button
            variant={"link"}
            type={"button"}
            className={"mb-2"}
            onClick={() =>
              setResumeMode(resumeMode === "preview" ? "edit" : "preview")
            }
          >
            {resumeMode === "preview" ? (
              <>
                <Edit className={"h-4 w-4"} />
                Edit Resume
              </>
            ) : (
              <>
                <Monitor className={"h-4 w-4"} />
                Show Preview
              </>
            )}
          </Button>

          {resumeMode !== "preview" && (
            <div
              className={
                "flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2"
              }
            >
              <AlertTriangle className={"h-5 w-5"} />
              <span className={"text-sm"}>
                You will lose edited markdown if you update the form data
              </span>
            </div>
          )}

          <div className={"border rounded-lg"}>
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ResumeBuilder;
