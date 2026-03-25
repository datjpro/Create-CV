import type { Locale } from "@/lib/types";

export function getMarketingCopy(locale: Locale) {
  return locale === "vi"
    ? {
        header: {
          templates: "Mẫu CV",
          dashboard: "Dashboard",
          pricing: "Bảng giá",
          login: "Đăng nhập",
          createCv: "Tạo CV"
        },
        footer: {
          description: "Trình tạo resume theo phong cách editorial với live preview, đổi template và xuất PDF thân thiện ATS.",
          templates: "Mẫu CV",
          login: "Đăng nhập",
          dashboard: "Dashboard",
          createCv: "Tạo CV",
          pricing: "Bảng giá"
        },
        home: {
          eyebrow: "Trình tạo CV chuẩn ATS",
          title: "Tạo CV chuyên nghiệp với nội dung thật, có thể chỉnh sửa.",
          description:
            "Bắt đầu từ template an toàn cho ATS, viết câu chuyện của riêng bạn và xuất PDF thân thiện với nhà tuyển dụng mà không cần resume mẫu cứng nhắc.",
          primaryCta: "Tạo CV miễn phí",
          secondaryCta: "Xem template",
          socialProof: "Được hơn 2.000 người dùng lựa chọn trong tháng này.",
          collectionEyebrow: "Bộ sưu tập",
          collectionTitle: "Template chọn lọc kèm định hướng theo ngành.",
          collectionDescription:
            "Chọn phong cách phù hợp với lĩnh vực của bạn rồi chỉnh mọi section mà không mất một dòng nội dung nào.",
          featureEyebrow: "Tạo nhanh hơn",
          featureTitle: "Viết một lần, tùy biến nhanh hơn.",
          featureDescription:
            "Editor giữ toàn bộ nội dung, thứ tự ATS, preview và xuất file trong một nơi để bạn tùy chỉnh cho từng vị trí mà không cần làm lại từ đầu.",
          atsTitle: "PDF chuẩn ATS",
          atsBadge: "In",
          atsDescription:
            "Render từ HTML giúp file PDF xuất ra vẫn có thể chọn text và thân thiện với nhà tuyển dụng.",
          livePreview: "Xem trước thời gian thực",
          industryAware: "Template theo từng ngành",
          finalTitle: "Sẵn sàng nâng cấp câu chuyện nghề nghiệp của bạn?",
          finalDescription:
            "Chọn template, nhập kinh nghiệm thật một lần và xuất CV chỉnh chu bất cứ khi nào bạn cần.",
          finalCta: "Tạo CV ngay"
        },
        templatesPage: {
          eyebrow: "Thư viện template",
          title: "Chọn phong cách an toàn cho ATS và viết câu chuyện của riêng bạn.",
          description:
            "Mỗi template đều giữ luồng đọc an toàn cho nhà tuyển dụng, hỗ trợ chỉnh sửa trực tiếp và giúp bạn viết nội dung thật thay vì bắt đầu từ mẫu khóa cứng.",
          filterAll: "Tất cả template",
          filterSafe: "Chuẩn ATS",
          filterNotes: "Có ghi chú theo ngành",
          filterEditable: "Nội dung chỉnh sửa được",
          startRecommended: "Bắt đầu với template gợi ý",
          signatureEyebrow: "Signature Series",
          signatureTitle: "Muốn một lựa chọn an toàn trước khi tùy biến sâu hơn?",
          signatureDescription:
            "Bắt đầu với The Executive rồi chuyển sang Minimal hoặc Modernist sau. Mô hình nội dung của bạn vẫn được giữ nguyên trên mỗi template.",
          signatureCta: "Dùng The Executive",
          useTemplate: "Dùng template"
        }
      }
    : {
        header: {
          templates: "Templates",
          dashboard: "Dashboard",
          pricing: "Pricing",
          login: "Login",
          createCv: "Create CV"
        },
        footer: {
          description: "Editorial resume building with live preview, template switching and ATS-friendly PDF export.",
          templates: "Templates",
          login: "Login",
          dashboard: "Dashboard",
          createCv: "Create CV",
          pricing: "Pricing"
        },
        home: {
          eyebrow: "ATS-ready CV Builder",
          title: "Build your professional CV with real, editable content.",
          description:
            "Start from an ATS-safe template, write your own story and export recruiter-friendly PDFs without hardcoded sample resumes.",
          primaryCta: "Create CV for free",
          secondaryCta: "View templates",
          socialProof: "Joined by 2,000+ professionals this month.",
          collectionEyebrow: "The Collection",
          collectionTitle: "Curated templates with industry guidance built in.",
          collectionDescription:
            "Pick the visual tone that fits your field, then customize every section without losing a single line of content.",
          featureEyebrow: "Fast generation",
          featureTitle: "Write once, tailor faster.",
          featureDescription:
            "The editor keeps your content, ATS order, preview and export flow in one place so you can adapt for each role without starting over.",
          atsTitle: "ATS-ready PDF",
          atsBadge: "Print",
          atsDescription: "HTML-first rendering keeps your exported PDF selectable and recruiter-friendly.",
          livePreview: "Live preview",
          industryAware: "Industry-aware templates",
          finalTitle: "Ready to upgrade your career story?",
          finalDescription: "Choose a template, enter your real experience once, and export a polished CV whenever you need it.",
          finalCta: "Create CV now"
        },
        templatesPage: {
          eyebrow: "Template library",
          title: "Choose an ATS-safe style and write your own story.",
          description:
            "Every template keeps a recruiter-safe reading flow, supports live editing and lets you write real content instead of starting from locked sample text.",
          filterAll: "All templates",
          filterSafe: "ATS-safe",
          filterNotes: "Industry notes included",
          filterEditable: "Editable content",
          startRecommended: "Start from recommended template",
          signatureEyebrow: "Signature Series",
          signatureTitle: "Need a safe default before customizing everything?",
          signatureDescription:
            "Start with The Executive, then switch to Minimal or Modernist later. Your content model stays editable across all templates.",
          signatureCta: "Use The Executive",
          useTemplate: "Use template"
        }
      };
}
