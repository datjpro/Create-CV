import { create } from "zustand";

import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeDocument,
  ResumeFormSection,
  TemplateId
} from "@/lib/types";

function createId(prefix: string) {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}`;
}

function updateById<T extends { id: string }>(items: T[], id: string, updater: (item: T) => T) {
  return items.map((item) => (item.id === id ? updater(item) : item));
}

type ResumeEditorState = {
  resume: ResumeDocument | null;
  dirty: boolean;
  activeSection: ResumeFormSection;
  setResume: (resume: ResumeDocument) => void;
  markSaved: (resume: ResumeDocument) => void;
  setActiveSection: (section: ResumeFormSection) => void;
  updateTitle: (title: string) => void;
  updateTemplate: (templateId: TemplateId) => void;
  updateSummary: (summary: string) => void;
  setAvatarUrl: (avatarUrl: string) => void;
  updatePersonal: (field: keyof ResumeDocument["personal"], value: string) => void;
  updateExperience: (id: string, field: keyof ExperienceItem, value: string | boolean) => void;
  updateExperienceBullets: (id: string, value: string) => void;
  addExperience: () => void;
  removeExperience: (id: string) => void;
  updateEducation: (id: string, field: keyof EducationItem, value: string) => void;
  addEducation: () => void;
  removeEducation: (id: string) => void;
  updateProject: (id: string, field: keyof ProjectItem, value: string) => void;
  addProject: () => void;
  removeProject: (id: string) => void;
  addSkill: (value: string) => void;
  updateSkill: (index: number, value: string) => void;
  removeSkill: (index: number) => void;
};

function withDirty(resume: ResumeDocument | null, updater: (resume: ResumeDocument) => ResumeDocument) {
  if (!resume) {
    return { resume, dirty: false };
  }

  const nextResume = updater(resume);
  nextResume.updatedAt = Date.now();

  return {
    resume: nextResume,
    dirty: true
  };
}

export const useResumeEditorStore = create<ResumeEditorState>((set) => ({
  resume: null,
  dirty: false,
  activeSection: "personal",
  setResume: (resume) =>
    set({
      resume,
      dirty: false,
      activeSection: "personal"
    }),
  markSaved: (resume) =>
    set({
      resume,
      dirty: false
    }),
  setActiveSection: (activeSection) => set({ activeSection }),
  updateTitle: (title) => set((state) => withDirty(state.resume, (resume) => ({ ...resume, title }))),
  updateTemplate: (templateId) => set((state) => withDirty(state.resume, (resume) => ({ ...resume, templateId }))),
  updateSummary: (summary) => set((state) => withDirty(state.resume, (resume) => ({ ...resume, summary }))),
  setAvatarUrl: (avatarUrl) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        avatarUrl
      }))
    ),
  updatePersonal: (field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        personal: {
          ...resume.personal,
          [field]: value
        }
      }))
    ),
  updateExperience: (id, field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        experiences: updateById(resume.experiences, id, (item) => ({
          ...item,
          [field]: value
        }))
      }))
    ),
  updateExperienceBullets: (id, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        experiences: updateById(resume.experiences, id, (item) => ({
          ...item,
          bullets: value
            .split("\n")
            .map((entry) => entry.trim())
            .filter(Boolean)
        }))
      }))
    ),
  addExperience: () =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        experiences: [
          ...resume.experiences,
          {
            id: createId("exp"),
            jobTitle: "",
            employer: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
            bullets: []
          }
        ]
      }))
    ),
  removeExperience: (id) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        experiences: resume.experiences.filter((item) => item.id !== id)
      }))
    ),
  updateEducation: (id, field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        education: updateById(resume.education, id, (item) => ({
          ...item,
          [field]: value
        }))
      }))
    ),
  addEducation: () =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        education: [
          ...resume.education,
          {
            id: createId("edu"),
            degree: "",
            school: "",
            location: "",
            startDate: "",
            endDate: "",
            description: ""
          }
        ]
      }))
    ),
  removeEducation: (id) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        education: resume.education.filter((item) => item.id !== id)
      }))
    ),
  updateProject: (id, field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        projects: updateById(resume.projects, id, (item) => ({
          ...item,
          [field]: value
        }))
      }))
    ),
  addProject: () =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        projects: [
          ...resume.projects,
          {
            id: createId("project"),
            name: "",
            role: "",
            startDate: "",
            endDate: "",
            description: "",
            link: ""
          }
        ]
      }))
    ),
  removeProject: (id) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        projects: resume.projects.filter((item) => item.id !== id)
      }))
    ),
  addSkill: (value) =>
    set((state) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return { resume: state.resume, dirty: state.dirty };
      }

      return withDirty(state.resume, (resume) => ({
        ...resume,
        skills: [...resume.skills, trimmed]
      }));
    }),
  updateSkill: (index, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        skills: resume.skills.map((skill, skillIndex) => (skillIndex === index ? value : skill))
      }))
    ),
  removeSkill: (index) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        skills: resume.skills.filter((_, skillIndex) => skillIndex !== index)
      }))
    )
}));
