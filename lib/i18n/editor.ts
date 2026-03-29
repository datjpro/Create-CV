import type { Locale, ResumeFormSection } from "@/lib/types";

const sectionLabels: Record<Locale, Record<ResumeFormSection, string>> = {
  en: {
    personal: "Profile",
    summary: "Summary",
    skills: "Skills",
    projects: "Projects",
    experience: "Experience",
    education: "Education",
    certifications: "Certifications",
    awards: "Awards",
    activities: "Activities"
  },
  vi: {
    personal: "H? so",
    summary: "Tóm t?t",
    skills: "K? nang",
    projects: "D? án",
    experience: "Kinh nghi?m",
    education: "H?c v?n",
    certifications: "Ch?ng ch?",
    awards: "Gi?i thu?ng",
    activities: "Ho?t d?ng"
  }
};

export function getEditorCopy(locale: Locale) {
  return locale === "vi"
    ? {
        sections: sectionLabels.vi,
        loading: "Ðang t?i editor...",
        unavailableTitle: "Không th? m? editor",
        unavailableDescription: "Không th? t?i resume du?c yêu c?u.",
        backToDashboard: "Quay l?i dashboard",
        title: "Ch?nh s?a resume",
        unsaved: "Có thay d?i chua luu",
        upToDate: "M?i th? dã du?c c?p nh?t",
        complete: "hoàn thành",
        exportPdf: "Xu?t PDF",
        exportHint:
          "Hãy dùng Save as PDF trong h?p tho?i in c?a trình duy?t. T?t header và footer c?a trình duy?t d? file s?ch nh?t.",
        build: "So?n th?o",
        preview: "Xem tru?c",
        saved: "Ðã luu t?t c? thay d?i.",
        photoStored: "?nh dã du?c luu trong trình duy?t này cho resume hi?n t?i.",
        copiedToEn: "Ðã sao chép n?i dung hi?n t?i sang b?n ti?ng Anh.",
        copiedToVi: "Ðã sao chép n?i dung hi?n t?i sang b?n ti?ng Vi?t.",
        contentLocale: {
          label: "N?i dung CV",
          description: "Ch?n ngôn ng? dang ch?nh và cung là ngôn ng? dùng d? xem tru?c, xu?t PDF.",
          vi: "Ti?ng Vi?t",
          en: "Ti?ng Anh",
          copyToEn: "Copy sang EN",
          copyToVi: "Copy sang VI",
          sharedFields: "Email, di?n tho?i, website, liên k?t và ngày tháng du?c dùng chung cho c? hai ngôn ng?."
        },
        personal: {
          title: "Cài d?t resume",
          description:
            "Ch?n c?u trúc phù h?p nh?t v?i v? trí b?n nh?m t?i, sau dó di?n n?i dung th?t mà b?n mu?n nhà tuy?n d?ng d?c.",
          resumeTitle: "Tiêu d? resume",
          resumeTitlePlaceholder: "ví d?: Product Designer Resume",
          templateStyle: "Ki?u template",
          industryFocus: "Ð?nh hu?ng ngành",
          careerStage: "Giai do?n s? nghi?p",
          photoBrowserOnly: "?nh ch? du?c luu trên trình duy?t này",
          photoDescription:
            "Thêm ?nh d?i di?n c?c b? cho thi?t b? này. ?nh s? xu?t hi?n trong preview và file CV, nhung file ?nh không du?c t?i lên Firebase Storage.",
          uploading: "Ðang t?i ?nh...",
          replacePhoto: "Thay ?nh",
          uploadPhoto: "T?i ?nh lên",
          removePhoto: "Xóa ?nh",
          photoFrame: "Khung ?nh",
          photoZoom: "Phóng to / thu nh?",
          photoZoomHint: "Kéo ?nh tr?c ti?p trong khung d? can v? trí guong m?t ho?c b? c?c phù h?p.",
          photoResetPosition: "Ð?t l?i v? trí ?nh",
          square: "Vuông",
          portrait: "D?c",
          fullName: "H? và tên",
          fullNamePlaceholder: "Jane Nguyen",
          professionalTitle: "Ch?c danh ngh? nghi?p",
          professionalTitlePlaceholder: "Frontend Engineer",
          email: "Email",
          emailPlaceholder: "name@email.com",
          phone: "S? di?n tho?i",
          phonePlaceholder: "+84 9xx xxx xxx",
          location: "Ð?a di?m",
          locationPlaceholder: "TP. H? Chí Minh",
          website: "Website",
          websitePlaceholder: "portfolio.com",
          linkedin: "LinkedIn",
          linkedinPlaceholder: "linkedin.com/in/yourname",
          github: "GitHub",
          githubPlaceholder: "github.com/yourname"
        },
        summary: {
          title: "Tóm t?t ngh? nghi?p",
          label: "Tóm t?t",
          placeholder: "Tóm t?t di?m m?nh, kinh nghi?m và v? trí m?c tiêu c?a b?n trong 2-4 dòng."
        },
        skills: {
          title: "K? nang",
          groupName: "Tên nhóm",
          groupNamePlaceholderIt: "Ngôn ng? l?p trình",
          groupNamePlaceholderDefault: "K? nang c?t lõi",
          skillsList: "K? nang, m?i dòng m?t m?c",
          skillsPlaceholderIt: "TypeScript\nReact\nNext.js",
          skillsPlaceholderDefault: "Giao ti?p v?i stakeholder\nC?i ti?n quy trình\nÐi?u ph?i tuy?n d?ng",
          removeGroup: "Xóa nhóm",
          addGroup: "Thêm nhóm k? nang"
        },
        projects: {
          title: "D? án",
          description:
            "Dùng ph?n này cho nh?ng công vi?c n?i b?t, nh?t là khi b?n còn d?u s? nghi?p, chuy?n ngành ho?c nh?m t?i các vai trò k? thu?t.",
          name: "Tên d? án",
          namePlaceholder: "Dashboard phân tích realtime",
          role: "Vai trò",
          rolePlaceholder: "Lead developer",
          link: "Liên k?t",
          linkPlaceholder: "https://...",
          startDate: "Ngày b?t d?u",
          startDatePlaceholder: "2025",
          endDate: "Ngày k?t thúc",
          endDatePlaceholder: "2026",
          itemDescription: "Mô t?",
          itemDescriptionPlaceholder: "Mô t? ng?n g?n ph?m vi, công ngh? ho?c k?t qu? c?a d? án.",
          remove: "Xóa d? án",
          add: "Thêm d? án"
        },
        experience: {
          title: "Kinh nghi?m làm vi?c",
          description:
            "Li?t kê nh?ng vai trò quan tr?ng nh?t, m?i nh?t tru?c. Gi? bullet ng?n g?n và do du?c.",
          jobTitle: "Ch?c danh",
          jobTitlePlaceholder: "Software Engineer",
          employer: "Công ty",
          employerPlaceholder: "Acme Corp",
          startDatePlaceholder: "2024",
          endDatePlaceholder: "Hi?n t?i ho?c 2026",
          currentRole: "Công vi?c hi?n t?i",
          context: "B?i c?nh",
          contextPlaceholder: "Tóm t?t team, nhi?m v? ho?c ph?m vi c?a vai trò.",
          bullets: "Bullet, m?i dòng m?t ý",
          bulletsPlaceholder:
            "Tang 18% t? l? chuy?n d?i nh? thi?t k? l?i funnel\nRút th?i gian làm báo cáo t? 2 ngày xu?ng còn 4 gi?",
          remove: "Xóa m?c này",
          add: "Thêm kinh nghi?m"
        },
        education: {
          title: "H?c v?n",
          description:
            "Ph?n này có th? du?c d?y lên cao hon t? d?ng khi b?n ch?n giai do?n s? nghi?p d?u trong cài d?t h? so.",
          degree: "B?ng c?p",
          degreePlaceholder: "C? nhân Khoa h?c Máy tính",
          school: "Tru?ng",
          schoolPlaceholder: "Tên tru?ng",
          locationPlaceholder: "Hà N?i",
          startDatePlaceholder: "2020",
          remove: "Xóa m?c này",
          add: "Thêm h?c v?n",
          itemDescriptionPlaceholder:
            "Môn h?c liên quan, GPA, lu?n van, gi?i thu?ng ho?c chuong trình trao d?i n?u c?n."
        },
        certifications: {
          title: "Ch?ng ch?",
          description: "Dùng m?c này cho gi?y phép, ch?ng nh?n ho?c các ch?ng ch? k? thu?t chính quy.",
          name: "Tên ch?ng ch?",
          namePlaceholder: "AWS Certified Cloud Practitioner",
          issuer: "Ðon v? c?p",
          issuerPlaceholder: "Amazon Web Services",
          date: "Ngày",
          datePlaceholder: "2025",
          itemDescriptionPlaceholder: "Ghi chú ng?n (tùy ch?n) v? ph?m vi, di?m s? ho?c m?c d? liên quan.",
          remove: "Xóa ch?ng ch?",
          add: "Thêm ch?ng ch?"
        },
        awards: {
          title: "Gi?i thu?ng",
          description: "Thêm h?c b?ng, ghi nh?n ho?c k?t qu? cu?c thi giúp tang d? tin c?y.",
          titleLabel: "Tên gi?i thu?ng",
          titlePlaceholder: "Dean's List",
          issuerPlaceholder: "Tru?ng ho?c t? ch?c",
          datePlaceholder: "2024",
          itemDescriptionPlaceholder: "B?i c?nh ng?n (tùy ch?n) v? lý do b?n nh?n du?c gi?i.",
          remove: "Xóa gi?i thu?ng",
          add: "Thêm gi?i thu?ng"
        },
        activities: {
          title: "Ho?t d?ng",
          description:
            "Dùng m?c này cho kinh nghi?m lãnh d?o, tình nguy?n, câu l?c b? ho?c di?n thuy?t khi h? tr? cho v? trí m?c tiêu.",
          name: "Tên ho?t d?ng",
          namePlaceholder: "Volunteer mentor",
          organization: "T? ch?c",
          organizationPlaceholder: "Tên t? ch?c",
          datePlaceholder: "2023-2025",
          itemDescriptionPlaceholder: "Mô t? dóng góp ho?c tác d?ng lãnh d?o m?t cách ng?n g?n.",
          remove: "Xóa ho?t d?ng",
          add: "Thêm ho?t d?ng"
        },
        previewPanel: {
          title: "Xem tru?c",
          fallback: "Thay d?i bên trái s? c?p nh?t tài li?u này ngay.",
          printHint: "Hãy dùng h?p tho?i in c?a trình duy?t và t?t header và footer d? PDF s?ch nh?t."
        }
      }
    : {
        sections: sectionLabels.en,
        loading: "Loading editor...",
        unavailableTitle: "Unable to open editor",
        unavailableDescription: "Unable to load the requested resume.",
        backToDashboard: "Back to dashboard",
        title: "Edit resume",
        unsaved: "Unsaved changes",
        upToDate: "All changes saved",
        complete: "complete",
        exportPdf: "Export PDF",
        exportHint:
          "Use Save as PDF in your browser print dialog. Turn off the browser headers and footers for the cleanest file.",
        build: "Build",
        preview: "Preview",
        saved: "Saved all changes.",
        photoStored: "Photo is stored in this browser for the current resume.",
        copiedToEn: "Copied the current content into the English version.",
        copiedToVi: "Copied the current content into the Vietnamese version.",
        contentLocale: {
          label: "Resume language",
          description: "Choose which language you are editing. The preview and PDF export will use this language too.",
          vi: "Vietnamese",
          en: "English",
          copyToEn: "Copy to EN",
          copyToVi: "Copy to VI",
          sharedFields: "Email, phone, website, links, and date fields stay shared across both languages."
        },
        personal: {
          title: "Resume settings",
          description:
            "Choose the structure that fits your target role best, then enter the real content you want recruiters to read.",
          resumeTitle: "Resume title",
          resumeTitlePlaceholder: "e.g. Product Designer Resume",
          templateStyle: "Template style",
          industryFocus: "Industry focus",
          careerStage: "Career stage",
          photoBrowserOnly: "Photo is stored in this browser only",
          photoDescription:
            "Add a local profile photo for this device. It will show up in preview and export, but the image file is not uploaded to Firebase Storage.",
          uploading: "Uploading...",
          replacePhoto: "Replace photo",
          uploadPhoto: "Upload photo",
          removePhoto: "Remove photo",
          photoFrame: "Photo frame",
          photoZoom: "Zoom",
          photoZoomHint: "Drag the image inside the frame to line up the face or composition with the existing layout.",
          photoResetPosition: "Reset photo position",
          square: "Square",
          portrait: "Portrait",
          fullName: "Full name",
          fullNamePlaceholder: "Jane Nguyen",
          professionalTitle: "Professional title",
          professionalTitlePlaceholder: "Frontend Engineer",
          email: "Email",
          emailPlaceholder: "name@email.com",
          phone: "Phone",
          phonePlaceholder: "+84 9xx xxx xxx",
          location: "Location",
          locationPlaceholder: "Ho Chi Minh City",
          website: "Website",
          websitePlaceholder: "portfolio.com",
          linkedin: "LinkedIn",
          linkedinPlaceholder: "linkedin.com/in/yourname",
          github: "GitHub",
          githubPlaceholder: "github.com/yourname"
        },
        summary: {
          title: "Professional summary",
          label: "Summary",
          placeholder: "Summarize your strengths, experience and target role in 2-4 lines."
        },
        skills: {
          title: "Skills",
          groupName: "Group name",
          groupNamePlaceholderIt: "Languages",
          groupNamePlaceholderDefault: "Core Skills",
          skillsList: "Skills, one per line",
          skillsPlaceholderIt: "TypeScript\nReact\nNext.js",
          skillsPlaceholderDefault: "Stakeholder communication\nProcess improvement\nHiring coordination",
          removeGroup: "Remove group",
          addGroup: "Add skill group"
        },
        projects: {
          title: "Projects",
          description:
            "Use this section for standout work, especially if you are early-career, changing fields or targeting technical roles.",
          name: "Project name",
          namePlaceholder: "Realtime analytics dashboard",
          role: "Role",
          rolePlaceholder: "Lead developer",
          link: "Link",
          linkPlaceholder: "https://...",
          startDate: "Start date",
          startDatePlaceholder: "2025",
          endDate: "End date",
          endDatePlaceholder: "2026",
          itemDescription: "Description",
          itemDescriptionPlaceholder: "Describe the scope, stack or result of the project in a few concise lines.",
          remove: "Remove project",
          add: "Add project"
        },
        experience: {
          title: "Work experience",
          description: "List the roles that matter most, newest first. Keep bullets short and measurable.",
          jobTitle: "Job title",
          jobTitlePlaceholder: "Software Engineer",
          employer: "Employer",
          employerPlaceholder: "Acme Corp",
          startDatePlaceholder: "2024",
          endDatePlaceholder: "Present or 2026",
          currentRole: "Current role",
          context: "Context",
          contextPlaceholder: "Summarize the team, mission or scope of the role.",
          bullets: "Bullets, one per line",
          bulletsPlaceholder:
            "Improved conversion by 18% through funnel redesign\nReduced report turnaround time from 2 days to 4 hours",
          remove: "Remove entry",
          add: "Add another experience"
        },
        education: {
          title: "Education",
          description: "Move this section higher automatically by choosing an early-career stage in the profile settings.",
          degree: "Degree",
          degreePlaceholder: "B.S. in Computer Science",
          school: "School",
          schoolPlaceholder: "University name",
          locationPlaceholder: "Hanoi",
          startDatePlaceholder: "2020",
          remove: "Remove entry",
          add: "Add education",
          itemDescriptionPlaceholder:
            "Relevant coursework, GPA, thesis, honors or exchange program details if useful."
        },
        certifications: {
          title: "Certifications",
          description: "Use this for licenses, certificates or formal technical credentials.",
          name: "Certification name",
          namePlaceholder: "AWS Certified Cloud Practitioner",
          issuer: "Issuer",
          issuerPlaceholder: "Amazon Web Services",
          date: "Date",
          datePlaceholder: "2025",
          itemDescriptionPlaceholder: "Optional note about scope, score or relevance.",
          remove: "Remove certification",
          add: "Add certification"
        },
        awards: {
          title: "Awards",
          description: "Add scholarships, recognitions or competition results that reinforce credibility.",
          titleLabel: "Award title",
          titlePlaceholder: "Dean's List",
          issuerPlaceholder: "University or organization",
          datePlaceholder: "2024",
          itemDescriptionPlaceholder: "Optional context about why you received it.",
          remove: "Remove award",
          add: "Add award"
        },
        activities: {
          title: "Activities",
          description:
            "Use this for leadership, volunteering, clubs or speaking experience when it supports your target role.",
          name: "Activity name",
          namePlaceholder: "Volunteer mentor",
          organization: "Organization",
          organizationPlaceholder: "Organization name",
          datePlaceholder: "2023-2025",
          itemDescriptionPlaceholder: "Describe the contribution or leadership impact in a concise way.",
          remove: "Remove activity",
          add: "Add activity"
        },
        previewPanel: {
          title: "Live preview",
          fallback: "Changes on the left update this document immediately.",
          printHint: "Use your browser print dialog and turn off headers and footers for the cleanest PDF."
        }
      };
}

