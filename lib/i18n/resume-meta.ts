import type { CareerStage, IndustryFocus, Locale } from "@/lib/types";

export function getResumeMetaCopy(locale: Locale) {
  const industryFocus: Record<Locale, Record<IndustryFocus, { label: string; note: string }>> = {
    en: {
      general: { label: "General corporate", note: "Best for operations, HR, admin and broad business roles." },
      it: { label: "IT and software", note: "Keeps technical skills and projects prominent for engineering roles." },
      marketing: { label: "Marketing and creative", note: "Keeps voice concise while still leaving room for campaigns and portfolio work." },
      finance: { label: "Finance and legal", note: "Prioritizes conservative structure and a highly scannable order." }
    },
    vi: {
      general: { label: "Corporate tổng quát", note: "Phù hợp cho vận hành, HR, admin và các vai trò business tổng quát." },
      it: { label: "IT và phần mềm", note: "Giữ kỹ năng kỹ thuật và dự án nổi bật hơn cho các vai trò engineering." },
      marketing: { label: "Marketing và sáng tạo", note: "Giữ văn phong cô đọng nhưng vẫn có chỗ cho campaign và portfolio." },
      finance: { label: "Tài chính và pháp lý", note: "Ưu tiên cấu trúc bảo thủ và thứ tự rất dễ quét." }
    }
  };

  const careerStage: Record<Locale, Record<CareerStage, { label: string; note: string }>> = {
    en: {
      student: { label: "Student or new graduate", note: "Education is promoted higher in the resume." },
      under_3_years: { label: "Under 3 years experience", note: "Balances education and experience for early-career roles." },
      "3_plus_years": { label: "3+ years experience", note: "Experience stays ahead of education by default." }
    },
    vi: {
      student: { label: "Sinh viên hoặc mới tốt nghiệp", note: "Học vấn được đẩy lên cao hơn trong resume." },
      under_3_years: { label: "Dưới 3 năm kinh nghiệm", note: "Cân bằng giữa học vấn và kinh nghiệm cho giai đoạn đầu sự nghiệp." },
      "3_plus_years": { label: "Từ 3 năm kinh nghiệm", note: "Kinh nghiệm mặc định đứng trước học vấn." }
    }
  };

  return locale === "vi"
    ? {
        industryFocus: industryFocus.vi,
        careerStage: careerStage.vi,
        skillSectionLabel: { default: "Kỹ năng", it: "Kỹ năng kỹ thuật" },
        summaryHint: {
          general: "Viết 2-4 dòng về kinh nghiệm, điểm mạnh và hướng đi bạn đang nhắm tới.",
          it: "Viết 2-4 dòng về stack, số năm kinh nghiệm và kiểu bài toán kỹ thuật bạn giải quyết.",
          marketing: "Mở đầu bằng tác động campaign, thế mạnh về brand/channel và nhóm đối tượng bạn hiểu rõ nhất.",
          finance: "Giữ ngắn gọn và trang trọng. Nhấn mạnh độ chính xác, kiến thức domain và trách nhiệm đo được."
        },
        skillsHint: {
          general: "Dùng các nhóm ngắn, dễ tìm kiếm như Kỹ năng cốt lõi, Công cụ, Chứng chỉ hoặc Ngoại ngữ.",
          it: "Nhóm kỹ năng theo các mục như Ngôn ngữ, Framework, Cơ sở dữ liệu và DevOps/Công cụ.",
          marketing: "Dùng các nhóm như Kênh, Analytics, Nội dung, Campaign và Công cụ.",
          finance: "Dùng các nhóm như Kỹ năng cốt lõi, Hệ thống, Compliance, Phân tích hoặc Báo cáo."
        }
      }
    : {
        industryFocus: industryFocus.en,
        careerStage: careerStage.en,
        skillSectionLabel: { default: "Skills", it: "Technical Skills" },
        summaryHint: {
          general: "Write 2-4 lines covering your experience, strengths and the direction you are targeting.",
          it: "Write 2-4 lines covering your stack, years of experience and the kind of engineering problems you solve.",
          marketing: "Lead with campaign impact, brand or channel strengths and the audience you understand best.",
          finance: "Keep this concise and formal. Emphasize accuracy, domain knowledge and measurable responsibility."
        },
        skillsHint: {
          general: "Use short searchable groups such as Core Skills, Tools, Certifications or Languages.",
          it: "Group skills by categories such as Languages, Frameworks, Databases and DevOps/Tools.",
          marketing: "Use groups like Channels, Analytics, Content, Campaigns and Tools.",
          finance: "Use groups like Core Skills, Systems, Compliance, Analysis or Reporting."
        }
      };
}

