import { create } from "zustand";

import {
  createEmptyActivity,
  createEmptyAward,
  createEmptyCertification,
  createEmptyEducation,
  createEmptyExperience,
  createEmptyProject
} from "@/lib/default-resume";
import {
  clampAvatarTransform,
  createEmptyLocalizedActivity,
  createEmptyLocalizedAward,
  createEmptyLocalizedCertification,
  createEmptyLocalizedEducation,
  createEmptyLocalizedExperience,
  createEmptyLocalizedProject,
  createEmptyLocalizedSkillGroup
} from "@/lib/resume-content";
import type {
  AvatarFrame,
  AvatarTransform,
  CareerStage,
  EditableActivityField,
  EditableAwardField,
  EditableCertificationField,
  EditableEducationField,
  EditableExperienceField,
  EditablePersonalField,
  EditableProjectField,
  IndustryFocus,
  Locale,
  ResumeDocument,
  ResumeFormSection,
  SkillGroup,
  TemplateId
} from "@/lib/types";

function updateById<T extends { id: string }>(items: T[], id: string, updater: (item: T) => T) {
  return items.map((item) => (item.id === id ? updater(item) : item));
}

const sharedPersonalFields = new Set<EditablePersonalField>(["email", "phone", "website", "linkedin", "github"]);
const sharedExperienceFields = new Set<EditableExperienceField>(["startDate", "endDate", "current"]);
const sharedEducationFields = new Set<EditableEducationField>(["startDate", "endDate"]);
const sharedProjectFields = new Set<EditableProjectField>(["startDate", "endDate", "link"]);
const sharedCertificationFields = new Set<EditableCertificationField>(["date"]);
const sharedAwardFields = new Set<EditableAwardField>(["date"]);
const sharedActivityFields = new Set<EditableActivityField>(["date"]);

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

function updateActiveContent(resume: ResumeDocument, updater: (content: ResumeDocument["content"][Locale], locale: Locale) => ResumeDocument["content"][Locale]) {
  const locale = resume.contentLocale;
  return {
    ...resume,
    content: {
      ...resume.content,
      [locale]: updater(resume.content[locale], locale)
    }
  };
}

type ResumeEditorState = {
  resume: ResumeDocument | null;
  dirty: boolean;
  activeSection: ResumeFormSection;
  setResume: (resume: ResumeDocument) => void;
  markSaved: (resume: ResumeDocument) => void;
  setActiveSection: (section: ResumeFormSection) => void;
  setContentLocale: (locale: Locale) => void;
  copyLocaleContent: (from: Locale, to: Locale) => void;
  updateTitle: (title: string) => void;
  updateTemplate: (templateId: TemplateId) => void;
  updateIndustryFocus: (industryFocus: IndustryFocus) => void;
  updateCareerStage: (careerStage: CareerStage) => void;
  updateSummary: (summary: string) => void;
  setAvatarUrl: (avatarUrl: string) => void;
  updateAvatarFrame: (avatarFrame: AvatarFrame) => void;
  updateAvatarTransform: (avatarTransform: Partial<AvatarTransform>) => void;
  clearAvatar: () => void;
  updatePersonal: (field: EditablePersonalField, value: string) => void;
  updateExperience: (id: string, field: EditableExperienceField, value: string | boolean) => void;
  updateExperienceBullets: (id: string, value: string) => void;
  addExperience: () => void;
  removeExperience: (id: string) => void;
  updateEducation: (id: string, field: EditableEducationField, value: string) => void;
  addEducation: () => void;
  removeEducation: (id: string) => void;
  updateProject: (id: string, field: EditableProjectField, value: string) => void;
  addProject: () => void;
  removeProject: (id: string) => void;
  updateSkillGroup: (id: string, field: keyof SkillGroup, value: string) => void;
  updateSkillGroupSkills: (id: string, value: string) => void;
  addSkillGroup: () => void;
  removeSkillGroup: (id: string) => void;
  updateCertification: (id: string, field: EditableCertificationField, value: string) => void;
  addCertification: () => void;
  removeCertification: (id: string) => void;
  updateAward: (id: string, field: EditableAwardField, value: string) => void;
  addAward: () => void;
  removeAward: (id: string) => void;
  updateActivity: (id: string, field: EditableActivityField, value: string) => void;
  addActivity: () => void;
  removeActivity: (id: string) => void;
};

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
  setContentLocale: (locale) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        contentLocale: locale
      }))
    ),
  copyLocaleContent: (from, to) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        content: {
          ...resume.content,
          [to]: structuredClone(resume.content[from])
        },
        title: to === resume.contentLocale ? resume.content[from].title : resume.title
      }))
    ),
  updateTitle: (title) =>
    set((state) =>
      withDirty(state.resume, (resume) => {
        const nextResume = updateActiveContent(resume, (content) => ({
          ...content,
          title
        }));

        return {
          ...nextResume,
          title
        };
      })
    ),
  updateTemplate: (templateId) => set((state) => withDirty(state.resume, (resume) => ({ ...resume, templateId }))),
  updateIndustryFocus: (industryFocus) => set((state) => withDirty(state.resume, (resume) => ({ ...resume, industryFocus }))),
  updateCareerStage: (careerStage) => set((state) => withDirty(state.resume, (resume) => ({ ...resume, careerStage }))),
  updateSummary: (summary) =>
    set((state) =>
      withDirty(state.resume, (resume) =>
        updateActiveContent(resume, (content) => ({
          ...content,
          summary
        }))
      )
    ),
  setAvatarUrl: (avatarUrl) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        avatarUrl
      }))
    ),
  updateAvatarFrame: (avatarFrame) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        avatarFrame
      }))
    ),
  updateAvatarTransform: (avatarTransform) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        avatarTransform: clampAvatarTransform({
          ...resume.avatarTransform,
          ...avatarTransform
        })
      }))
    ),
  clearAvatar: () =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        avatarUrl: ""
      }))
    ),
  updatePersonal: (field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => {
        if (sharedPersonalFields.has(field)) {
          return {
            ...resume,
            personal: {
              ...resume.personal,
              [field]: value
            }
          };
        }

        return updateActiveContent(resume, (content) => ({
          ...content,
          personal: {
            ...content.personal,
            [field]: value
          }
        }));
      })
    ),
  updateExperience: (id, field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => {
        if (sharedExperienceFields.has(field)) {
          return {
            ...resume,
            experiences: updateById(resume.experiences, id, (item) => ({
              ...item,
              [field]: value
            }))
          };
        }

        return updateActiveContent(resume, (content) => ({
          ...content,
          experiences: updateById(content.experiences, id, (item) => ({
            ...item,
            [field]: value
          }))
        }));
      })
    ),
  updateExperienceBullets: (id, value) =>
    set((state) =>
      withDirty(state.resume, (resume) =>
        updateActiveContent(resume, (content) => ({
          ...content,
          experiences: updateById(content.experiences, id, (item) => ({
            ...item,
            bullets: value
              .split("\n")
              .map((entry) => entry.trim())
              .filter(Boolean)
          }))
        }))
      )
    ),
  addExperience: () =>
    set((state) =>
      withDirty(state.resume, (resume) => {
        const nextItem = createEmptyExperience();
        return {
          ...resume,
          experiences: [...resume.experiences, nextItem],
          content: {
            vi: {
              ...resume.content.vi,
              experiences: [...resume.content.vi.experiences, createEmptyLocalizedExperience(nextItem.id)]
            },
            en: {
              ...resume.content.en,
              experiences: [...resume.content.en.experiences, createEmptyLocalizedExperience(nextItem.id)]
            }
          }
        };
      })
    ),
  removeExperience: (id) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        experiences: resume.experiences.filter((item) => item.id !== id),
        content: {
          vi: {
            ...resume.content.vi,
            experiences: resume.content.vi.experiences.filter((item) => item.id !== id)
          },
          en: {
            ...resume.content.en,
            experiences: resume.content.en.experiences.filter((item) => item.id !== id)
          }
        }
      }))
    ),
  updateEducation: (id, field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => {
        if (sharedEducationFields.has(field)) {
          return {
            ...resume,
            education: updateById(resume.education, id, (item) => ({
              ...item,
              [field]: value
            }))
          };
        }

        return updateActiveContent(resume, (content) => ({
          ...content,
          education: updateById(content.education, id, (item) => ({
            ...item,
            [field]: value
          }))
        }));
      })
    ),
  addEducation: () =>
    set((state) =>
      withDirty(state.resume, (resume) => {
        const nextItem = createEmptyEducation();
        return {
          ...resume,
          education: [...resume.education, nextItem],
          content: {
            vi: {
              ...resume.content.vi,
              education: [...resume.content.vi.education, createEmptyLocalizedEducation(nextItem.id)]
            },
            en: {
              ...resume.content.en,
              education: [...resume.content.en.education, createEmptyLocalizedEducation(nextItem.id)]
            }
          }
        };
      })
    ),
  removeEducation: (id) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        education: resume.education.filter((item) => item.id !== id),
        content: {
          vi: {
            ...resume.content.vi,
            education: resume.content.vi.education.filter((item) => item.id !== id)
          },
          en: {
            ...resume.content.en,
            education: resume.content.en.education.filter((item) => item.id !== id)
          }
        }
      }))
    ),
  updateProject: (id, field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => {
        if (sharedProjectFields.has(field)) {
          return {
            ...resume,
            projects: updateById(resume.projects, id, (item) => ({
              ...item,
              [field]: value
            }))
          };
        }

        return updateActiveContent(resume, (content) => ({
          ...content,
          projects: updateById(content.projects, id, (item) => ({
            ...item,
            [field]: value
          }))
        }));
      })
    ),
  addProject: () =>
    set((state) =>
      withDirty(state.resume, (resume) => {
        const nextItem = createEmptyProject();
        return {
          ...resume,
          projects: [...resume.projects, nextItem],
          content: {
            vi: {
              ...resume.content.vi,
              projects: [...resume.content.vi.projects, createEmptyLocalizedProject(nextItem.id)]
            },
            en: {
              ...resume.content.en,
              projects: [...resume.content.en.projects, createEmptyLocalizedProject(nextItem.id)]
            }
          }
        };
      })
    ),
  removeProject: (id) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        projects: resume.projects.filter((item) => item.id !== id),
        content: {
          vi: {
            ...resume.content.vi,
            projects: resume.content.vi.projects.filter((item) => item.id !== id)
          },
          en: {
            ...resume.content.en,
            projects: resume.content.en.projects.filter((item) => item.id !== id)
          }
        }
      }))
    ),
  updateSkillGroup: (id, field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) =>
        updateActiveContent(resume, (content) => ({
          ...content,
          skillGroups: updateById(content.skillGroups, id, (item) => ({
            ...item,
            [field]: value
          }))
        }))
      )
    ),
  updateSkillGroupSkills: (id, value) =>
    set((state) =>
      withDirty(state.resume, (resume) =>
        updateActiveContent(resume, (content) => ({
          ...content,
          skillGroups: updateById(content.skillGroups, id, (item) => ({
            ...item,
            skills: value
              .split("\n")
              .map((entry) => entry.trim())
              .filter(Boolean)
          }))
        }))
      )
    ),
  addSkillGroup: () =>
    set((state) =>
      withDirty(state.resume, (resume) =>
        updateActiveContent(resume, (content, locale) => ({
          ...content,
          skillGroups: [...content.skillGroups, createEmptyLocalizedSkillGroup(locale, `skill-group-${Date.now()}`)]
        }))
      )
    ),
  removeSkillGroup: (id) =>
    set((state) =>
      withDirty(state.resume, (resume) =>
        updateActiveContent(resume, (content, locale) => ({
          ...content,
          skillGroups:
            content.skillGroups.length > 1
              ? content.skillGroups.filter((item) => item.id !== id)
              : [createEmptyLocalizedSkillGroup(locale, content.skillGroups[0]?.id ?? `skill-group-${Date.now()}`)]
        }))
      )
    ),
  updateCertification: (id, field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => {
        if (sharedCertificationFields.has(field)) {
          return {
            ...resume,
            certifications: updateById(resume.certifications, id, (item) => ({
              ...item,
              [field]: value
            }))
          };
        }

        return updateActiveContent(resume, (content) => ({
          ...content,
          certifications: updateById(content.certifications, id, (item) => ({
            ...item,
            [field]: value
          }))
        }));
      })
    ),
  addCertification: () =>
    set((state) =>
      withDirty(state.resume, (resume) => {
        const nextItem = createEmptyCertification();
        return {
          ...resume,
          certifications: [...resume.certifications, nextItem],
          content: {
            vi: {
              ...resume.content.vi,
              certifications: [...resume.content.vi.certifications, createEmptyLocalizedCertification(nextItem.id)]
            },
            en: {
              ...resume.content.en,
              certifications: [...resume.content.en.certifications, createEmptyLocalizedCertification(nextItem.id)]
            }
          }
        };
      })
    ),
  removeCertification: (id) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        certifications: resume.certifications.filter((item) => item.id !== id),
        content: {
          vi: {
            ...resume.content.vi,
            certifications: resume.content.vi.certifications.filter((item) => item.id !== id)
          },
          en: {
            ...resume.content.en,
            certifications: resume.content.en.certifications.filter((item) => item.id !== id)
          }
        }
      }))
    ),
  updateAward: (id, field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => {
        if (sharedAwardFields.has(field)) {
          return {
            ...resume,
            awards: updateById(resume.awards, id, (item) => ({
              ...item,
              [field]: value
            }))
          };
        }

        return updateActiveContent(resume, (content) => ({
          ...content,
          awards: updateById(content.awards, id, (item) => ({
            ...item,
            [field]: value
          }))
        }));
      })
    ),
  addAward: () =>
    set((state) =>
      withDirty(state.resume, (resume) => {
        const nextItem = createEmptyAward();
        return {
          ...resume,
          awards: [...resume.awards, nextItem],
          content: {
            vi: {
              ...resume.content.vi,
              awards: [...resume.content.vi.awards, createEmptyLocalizedAward(nextItem.id)]
            },
            en: {
              ...resume.content.en,
              awards: [...resume.content.en.awards, createEmptyLocalizedAward(nextItem.id)]
            }
          }
        };
      })
    ),
  removeAward: (id) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        awards: resume.awards.filter((item) => item.id !== id),
        content: {
          vi: {
            ...resume.content.vi,
            awards: resume.content.vi.awards.filter((item) => item.id !== id)
          },
          en: {
            ...resume.content.en,
            awards: resume.content.en.awards.filter((item) => item.id !== id)
          }
        }
      }))
    ),
  updateActivity: (id, field, value) =>
    set((state) =>
      withDirty(state.resume, (resume) => {
        if (sharedActivityFields.has(field)) {
          return {
            ...resume,
            activities: updateById(resume.activities, id, (item) => ({
              ...item,
              [field]: value
            }))
          };
        }

        return updateActiveContent(resume, (content) => ({
          ...content,
          activities: updateById(content.activities, id, (item) => ({
            ...item,
            [field]: value
          }))
        }));
      })
    ),
  addActivity: () =>
    set((state) =>
      withDirty(state.resume, (resume) => {
        const nextItem = createEmptyActivity();
        return {
          ...resume,
          activities: [...resume.activities, nextItem],
          content: {
            vi: {
              ...resume.content.vi,
              activities: [...resume.content.vi.activities, createEmptyLocalizedActivity(nextItem.id)]
            },
            en: {
              ...resume.content.en,
              activities: [...resume.content.en.activities, createEmptyLocalizedActivity(nextItem.id)]
            }
          }
        };
      })
    ),
  removeActivity: (id) =>
    set((state) =>
      withDirty(state.resume, (resume) => ({
        ...resume,
        activities: resume.activities.filter((item) => item.id !== id),
        content: {
          vi: {
            ...resume.content.vi,
            activities: resume.content.vi.activities.filter((item) => item.id !== id)
          },
          en: {
            ...resume.content.en,
            activities: resume.content.en.activities.filter((item) => item.id !== id)
          }
        }
      }))
    )
}));

