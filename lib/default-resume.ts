import type { ResumeDocument, TemplateId } from "@/lib/types";

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildDefaultResume(userId: string, templateId: TemplateId = "professional", resumeId?: string): ResumeDocument {
  const now = Date.now();

  return {
    id: resumeId ?? createId("resume"),
    userId,
    title: "Untitled Resume",
    status: "draft",
    templateId,
    avatarUrl: "",
    personal: {
      fullName: "Alex Architect",
      title: "Senior Architectural Designer",
      email: "alex.design@email.com",
      phone: "+1 555 123 4567",
      location: "New York, NY",
      website: "portfolio.example.com",
      linkedin: "linkedin.com/in/alexarchitect",
      github: "github.com/alexarchitect"
    },
    summary:
      "Innovative architectural designer with 8+ years of experience delivering premium residential and commercial projects with a strong focus on sustainable materials and BIM workflows.",
    experiences: [
      {
        id: createId("exp"),
        jobTitle: "Senior Architectural Designer",
        employer: "Skyline Partners",
        location: "New York, NY",
        startDate: "2019",
        endDate: "",
        current: true,
        description:
          "Led the design of a $45M sustainable residential project and coordinated delivery across design, structural and visualization teams.",
        bullets: [
          "Managed a team of 4 junior architects across schematic and design development phases.",
          "Reduced drafting time by 20% through custom Revit families and QA standards.",
          "Presented client-ready concept packages for premium residential developments."
        ]
      }
    ],
    education: [
      {
        id: createId("edu"),
        degree: "M.Arch Architecture",
        school: "Columbia University",
        location: "New York, NY",
        startDate: "2014",
        endDate: "2016",
        description: "Focused on urban housing systems, sustainable material studies and digital fabrication."
      }
    ],
    skills: ["Revit", "AutoCAD", "Rhino 3D", "V-Ray", "Adobe CC", "Sustainable Design"],
    projects: [
      {
        id: createId("project"),
        name: "Heritage Tower Repositioning",
        role: "Lead Designer",
        startDate: "2023",
        endDate: "2024",
        description:
          "Directed concept-to-delivery design for a mixed-use tower repositioning project with a sustainability-first brief.",
        link: "https://portfolio.example.com/heritage-tower"
      }
    ],
    createdAt: now,
    updatedAt: now
  };
}
