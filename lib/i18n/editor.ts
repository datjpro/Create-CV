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
    personal: "Hồ sơ",
    summary: "Tóm tắt",
    skills: "Kỹ năng",
    projects: "Dự án",
    experience: "Kinh nghiệm",
    education: "Học vấn",
    certifications: "Chứng chỉ",
    awards: "Giải thưởng",
    activities: "Hoạt động"
  }
};

export function getEditorCopy(locale: Locale) {
  return locale === "vi"
    ? {
        sections: sectionLabels.vi,
        loading: "Đang tải editor...",
        unavailableTitle: "Không thể mở editor",
        unavailableDescription: "Không thể tải resume được yêu cầu.",
        backToDashboard: "Quay lại dashboard",
        title: "Chỉnh sửa resume",
        unsaved: "Có thay đổi chưa lưu",
        upToDate: "Mọi thứ đã được cập nhật",
        complete: "hoàn thành",
        exportPdf: "Xuất PDF",
        exportHint:
          "Hãy dùng Save as PDF trong hộp thoại in của trình duyệt. Tắt header và footer của trình duyệt để file sạch nhất.",
        build: "Soạn thảo",
        preview: "Xem trước",
        saved: "Đã lưu tất cả thay đổi.",
        photoStored: "Ảnh đã được lưu trong trình duyệt này cho resume hiện tại.",
        personal: {
          title: "Cài đặt resume",
          description:
            "Chọn cấu trúc phù hợp nhất với vị trí bạn nhắm tới, sau đó điền nội dung thật mà bạn muốn nhà tuyển dụng đọc.",
          resumeTitle: "Tiêu đề resume",
          resumeTitlePlaceholder: "ví dụ: Product Designer Resume",
          templateStyle: "Kiểu template",
          industryFocus: "Định hướng ngành",
          careerStage: "Giai đoạn sự nghiệp",
          photoBrowserOnly: "Ảnh chỉ được lưu trên trình duyệt này",
          photoDescription:
            "Thêm ảnh đại diện cục bộ cho thiết bị này. Ảnh sẽ xuất hiện trong preview và file CV, nhưng file ảnh không được tải lên Firebase Storage.",
          uploading: "Đang tải ảnh...",
          replacePhoto: "Thay ảnh",
          uploadPhoto: "Tải ảnh lên",
          removePhoto: "Xóa ảnh",
          photoFrame: "Khung ảnh",
          square: "Vuông",
          portrait: "Dọc",
          fullName: "Họ và tên",
          fullNamePlaceholder: "Jane Nguyen",
          professionalTitle: "Chức danh nghề nghiệp",
          professionalTitlePlaceholder: "Frontend Engineer",
          email: "Email",
          emailPlaceholder: "name@email.com",
          phone: "Số điện thoại",
          phonePlaceholder: "+84 9xx xxx xxx",
          location: "Địa điểm",
          locationPlaceholder: "TP. Hồ Chí Minh",
          website: "Website",
          websitePlaceholder: "portfolio.com",
          linkedin: "LinkedIn",
          linkedinPlaceholder: "linkedin.com/in/yourname",
          github: "GitHub",
          githubPlaceholder: "github.com/yourname"
        },
        summary: {
          title: "Tóm tắt nghề nghiệp",
          label: "Tóm tắt",
          placeholder: "Tóm tắt điểm mạnh, kinh nghiệm và vị trí mục tiêu của bạn trong 2-4 dòng."
        },
        skills: {
          title: "Kỹ năng",
          groupName: "Tên nhóm",
          groupNamePlaceholderIt: "Ngôn ngữ lập trình",
          groupNamePlaceholderDefault: "Kỹ năng cốt lõi",
          skillsList: "Kỹ năng, mỗi dòng một mục",
          skillsPlaceholderIt: "TypeScript\nReact\nNext.js",
          skillsPlaceholderDefault: "Giao tiếp với stakeholder\nCải tiến quy trình\nĐiều phối tuyển dụng",
          removeGroup: "Xóa nhóm",
          addGroup: "Thêm nhóm kỹ năng"
        },
        projects: {
          title: "Dự án",
          description:
            "Dùng phần này cho những công việc nổi bật, nhất là khi bạn còn đầu sự nghiệp, chuyển ngành hoặc nhắm tới các vai trò kỹ thuật.",
          name: "Tên dự án",
          namePlaceholder: "Dashboard phân tích realtime",
          role: "Vai trò",
          rolePlaceholder: "Lead developer",
          link: "Liên kết",
          linkPlaceholder: "https://...",
          startDate: "Ngày bắt đầu",
          startDatePlaceholder: "2025",
          endDate: "Ngày kết thúc",
          endDatePlaceholder: "2026",
          itemDescription: "Mô tả",
          itemDescriptionPlaceholder: "Mô tả ngắn gọn phạm vi, công nghệ hoặc kết quả của dự án.",
          remove: "Xóa dự án",
          add: "Thêm dự án"
        },
        experience: {
          title: "Kinh nghiệm làm việc",
          description:
            "Liệt kê những vai trò quan trọng nhất, mới nhất trước. Giữ bullet ngắn gọn và đo được.",
          jobTitle: "Chức danh",
          jobTitlePlaceholder: "Software Engineer",
          employer: "Công ty",
          employerPlaceholder: "Acme Corp",
          startDatePlaceholder: "2024",
          endDatePlaceholder: "Hiện tại hoặc 2026",
          currentRole: "Công việc hiện tại",
          context: "Bối cảnh",
          contextPlaceholder: "Tóm tắt team, nhiệm vụ hoặc phạm vi của vai trò.",
          bullets: "Bullet, mỗi dòng một ý",
          bulletsPlaceholder:
            "Tăng 18% tỷ lệ chuyển đổi nhờ thiết kế lại funnel\nRút thời gian làm báo cáo từ 2 ngày xuống còn 4 giờ",
          remove: "Xóa mục này",
          add: "Thêm kinh nghiệm"
        },
        education: {
          title: "Học vấn",
          description:
            "Phần này có thể được đẩy lên cao hơn tự động khi bạn chọn giai đoạn sự nghiệp đầu trong cài đặt hồ sơ.",
          degree: "Bằng cấp",
          degreePlaceholder: "Cử nhân Khoa học Máy tính",
          school: "Trường",
          schoolPlaceholder: "Tên trường",
          locationPlaceholder: "Hà Nội",
          startDatePlaceholder: "2020",
          remove: "Xóa mục này",
          add: "Thêm học vấn",
          itemDescriptionPlaceholder:
            "Môn học liên quan, GPA, luận văn, giải thưởng hoặc chương trình trao đổi nếu cần."
        },
        certifications: {
          title: "Chứng chỉ",
          description: "Dùng mục này cho giấy phép, chứng nhận hoặc các chứng chỉ kỹ thuật chính quy.",
          name: "Tên chứng chỉ",
          namePlaceholder: "AWS Certified Cloud Practitioner",
          issuer: "Đơn vị cấp",
          issuerPlaceholder: "Amazon Web Services",
          date: "Ngày",
          datePlaceholder: "2025",
          itemDescriptionPlaceholder: "Ghi chú ngắn (tùy chọn) về phạm vi, điểm số hoặc mức độ liên quan.",
          remove: "Xóa chứng chỉ",
          add: "Thêm chứng chỉ"
        },
        awards: {
          title: "Giải thưởng",
          description: "Thêm học bổng, ghi nhận hoặc kết quả cuộc thi giúp tăng độ tin cậy.",
          titleLabel: "Tên giải thưởng",
          titlePlaceholder: "Dean's List",
          issuerPlaceholder: "Trường hoặc tổ chức",
          datePlaceholder: "2024",
          itemDescriptionPlaceholder: "Bối cảnh ngắn (tùy chọn) về lý do bạn nhận được giải.",
          remove: "Xóa giải thưởng",
          add: "Thêm giải thưởng"
        },
        activities: {
          title: "Hoạt động",
          description:
            "Dùng mục này cho kinh nghiệm lãnh đạo, tình nguyện, câu lạc bộ hoặc diễn thuyết khi hỗ trợ cho vị trí mục tiêu.",
          name: "Tên hoạt động",
          namePlaceholder: "Volunteer mentor",
          organization: "Tổ chức",
          organizationPlaceholder: "Tên tổ chức",
          datePlaceholder: "2023-2025",
          itemDescriptionPlaceholder: "Mô tả đóng góp hoặc tác động lãnh đạo một cách ngắn gọn.",
          remove: "Xóa hoạt động",
          add: "Thêm hoạt động"
        },
        previewPanel: {
          title: "Xem trước",
          fallback: "Thay đổi bên trái sẽ cập nhật tài liệu này ngay.",
          printHint: "Hãy dùng hộp thoại in của trình duyệt và tắt header và footer để PDF sạch nhất."
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
