import { create } from "zustand";

import {
  createEmptyActivity,
  createEmptyAward,
  createEmptyCertification,
  createEmptyEducation,
  createEmptyExperience,
  createEmptyProject,
  createEmptySkillGroup
} from "@/lib/default-resume";
import type {
  ActivityItem,
  AwardItem,
  CareerStage,
  CertificationItem,
  EducationItem,
  ExperienceItem,
  IndustryFocus,
  ProjectItem,
  ResumeDocument,
  ResumeFormSection,
  SkillGroup,
  TemplateId
} from "@/lib/types";

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
  updateIndustryFocus: (industryFocus: IndustryFocus) => void;
  updateCareerStage: (careerStage: CareerStage) => void;
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
  updateSkillGroup: (id: string, field: keyof SkillGroup, value: string) => void;
  updateSkillGroupSkills: (id: string, value: string) => void;
  addSkillGroup: () => void;
  removeSkillGroup: (id: string) => void;
  updateCertification: (id: string, field: keyof CertificationItem, value: string) => void;
  addCertification: () => void;
  removeCertification: (id: string) => void;
  updateAward: (id: string, field: keyof AwardItem, value: string) => void;
  addAward: () => void;
  removeAward: (id: string) => void;
  updateActivity: (id: string, field: keyof ActivityItem, value: string) => void;
  addActivity: () => void;
  removeActivity: (id: string) => void;
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
  updateIndustryFocus: (industryFocus) => set((state) => withDirty(state.resume, (resume) => ({ ...resume, industryFocus }))),
  updateCareerStage: (careerStage) => set((state) => withDirty(state.resume, (resume) => ({ ...resume, careerStage }))),
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
        experiences: [...resume.experiences, createEmptyExperience()]
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
        education: [...resume.education, createEmptyEducation()]
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
        projects: [...resume.projects, createEmptyProject()]
      }))
    ),
  removeProject: (id) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        projects: resume.projects.filter((item) => item.id !== id)
      }))
    ),
  updateSkillGroup: (id, field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        skillGroups: updateById(resume.skillGroups, id, (item) => ({
          ...item,
          [field]: value
        }))
      }))
    ),
  updateSkillGroupSkills: (id, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        skillGroups: updateById(resume.skillGroups, id, (item) => ({
          ...item,
          skills: value
            .split("\n")
            .map((entry) => entry.trim())
            .filter(Boolean)
        }))
      }))
    ),
  addSkillGroup: () =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        skillGroups: [...resume.skillGroups, createEmptySkillGroup(`Group ${resume.skillGroups.length + 1}`)]
      }))
    ),
  removeSkillGroup: (id) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        skillGroups: resume.skillGroups.filter((item) => item.id !== id)
      }))
    ),
  updateCertification: (id, field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        certifications: updateById(resume.certifications, id, (item) => ({
          ...item,
          [field]: value
        }))
      }))
    ),
  addCertification: () =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        certifications: [...resume.certifications, createEmptyCertification()]
      }))
    ),
  removeCertification: (id) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        certifications: resume.certifications.filter((item) => item.id !== id)
      }))
    ),
  updateAward: (id, field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        awards: updateById(resume.awards, id, (item) => ({
          ...item,
          [field]: value
        }))
      }))
    ),
  addAward: () =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        awards: [...resume.awards, createEmptyAward()]
      }))
    ),
  removeAward: (id) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        awards: resume.awards.filter((item) => item.id !== id)
      }))
    ),
  updateActivity: (id, field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        activities: updateById(resume.activities, id, (item) => ({
          ...item,
          [field]: value
        }))
      }))
    ),
  addActivity: () =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        activities: [...resume.activities, createEmptyActivity()]
      }))
    ),
  removeActivity: (id) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        activities: resume.activities.filter((item) => item.id !== id)
      }))
    )
}));
