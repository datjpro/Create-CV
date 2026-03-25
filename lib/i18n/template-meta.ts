import type { Locale, TemplateId } from "@/lib/types";

export function getTemplateMetaCopy(
  locale: Locale
): Record<
  TemplateId,
  {
    category: string;
    name: string;
    hook: string;
    description: string;
    badge?: string;
    featuredCopy: string;
    atsReadabilityLevel: string;
    layoutStyle: string;
    notes: string;
  }
> {
  return locale === "vi"
    ? {
        professional: {
          category: "Professional",
          name: "The Executive",
          hook: "Phân cấp cân bằng cho các vai trò doanh nghiệp và corporate",
          description:
            "Template một cột có cấu trúc rõ ràng cho vận hành, tài chính, pháp lý và các luồng tuyển dụng corporate phổ biến.",
          badge: "Phổ biến",
          featuredCopy:
            "Bố cục chuẩn ATS, chỉnh chu cho business, finance, operations và các individual contributor giàu kinh nghiệm.",
          atsReadabilityLevel: "Ưu tiên ATS",
          layoutStyle: "Một cột có cấu trúc",
          notes: "Phù hợp khi bạn muốn một tài liệu bảo thủ, đáng tin và có nhịp section rõ ràng."
        },
        minimal: {
          category: "Minimal",
          name: "The Minimalist",
          hook: "Bố cục ưu tiên khoảng trống cho resume kỹ thuật và sản phẩm",
          description:
            "Hệ thống một cột sạch sẽ, ưu tiên ATS, dễ quét nhanh và hợp với resume kỹ thuật có nhóm kỹ năng.",
          featuredCopy: "Rất hợp cho software, product, data và các resume thiên về nội dung rõ ràng.",
          atsReadabilityLevel: "An toàn ATS tối đa",
          layoutStyle: "Một cột tối giản",
          notes: "Đặc biệt hợp cho IT, product, data và những ai muốn format gọn, ít nhiễu."
        },
        creative: {
          category: "Creative",
          name: "The Modernist",
          hook: "Typography biểu cảm nhưng vẫn giữ luồng một cột an toàn cho ATS",
          description:
            "Bố cục một cột giàu cá tính hơn cho marketing, content và các vai trò gần với design mà vẫn giữ khả năng đọc máy.",
          badge: "Mới",
          featuredCopy:
            "Phù hợp khi bạn muốn nhiều cá tính hơn cho vai trò marketing hoặc sáng tạo nhưng vẫn giữ cấu trúc an toàn cho recruiter.",
          atsReadabilityLevel: "An toàn ATS",
          layoutStyle: "Một cột giàu biểu cảm",
          notes: "Giữ thứ tự đọc tuyến tính nhưng tăng cá tính cho trang qua typography và điểm nhấn."
        },
        "dark-portfolio": {
          category: "Portfolio",
          name: "The Nightfolio",
          hook: "Portfolio nền tối ưu tiên ảnh, kinh nghiệm và dự án",
          description:
            "Template portfolio nền tối với cột nhận diện bên trái và canvas chính nhấn mạnh dự án cho resume developer.",
          badge: "Showcase",
          featuredCopy:
            "Dành cho software candidate và hồ sơ thiên về portfolio muốn tăng personal branding mà vẫn giữ khả năng xuất file tốt.",
          atsReadabilityLevel: "Tối ưu cho ATS",
          layoutStyle: "Portfolio tách đôi nền tối",
          notes: "Hợp cho portfolio dev, freelancer và ứng viên muốn dự án có trọng lượng thị giác lớn hơn."
        },
        "corporate-slate": {
          category: "Corporate",
          name: "The Slate Board",
          hook: "Bố cục sáng, sắc nét với nhịp điệu executive rõ hơn",
          description:
            "Resume tông slate dịu, nhấn mạnh kinh nghiệm, summary và khả năng quét nhanh cho team tuyển dụng corporate.",
          featuredCopy:
            "Lựa chọn polished an toàn hơn khi bạn muốn tông corporate cao cấp hơn template professional mặc định.",
          atsReadabilityLevel: "Ưu tiên ATS",
          layoutStyle: "Một cột tông slate",
          notes: "Phù hợp cho operations, consulting, business, legal và vai trò đa chức năng."
        },
        "compact-fresher": {
          category: "Compact",
          name: "The First Page",
          hook: "Bố cục gọn nhưng dễ đọc cho sinh viên và người mới ra trường",
          description:
            "Layout compact dành nhiều không gian hơn cho học vấn, dự án và nhóm kỹ năng mà vẫn thân thiện khi xuất file.",
          featuredCopy:
            "Thiết kế cho sinh viên và ứng viên đầu sự nghiệp cần đưa dự án và học vấn nổi bật vào trong một trang.",
          atsReadabilityLevel: "An toàn ATS tối đa",
          layoutStyle: "Một cột compact",
          notes: "Dùng khi bạn cần một resume junior một trang với spacing chặt hơn nhưng thứ bậc vẫn rõ ràng."
        },
        "modern-columns": {
          category: "Hybrid",
          name: "The Split Ledger",
          hook: "Bố cục hai vùng có cấu trúc cho product, marketing và resume hybrid",
          description:
            "Bố cục hai vùng hiện đại, tách phần bối cảnh cá nhân khỏi nội dung nặng về kinh nghiệm mà không tạo cảm giác rối.",
          featuredCopy:
            "Hợp cho product, growth, marketing và ứng viên đa chức năng muốn một cấu trúc editorial rõ hơn.",
          atsReadabilityLevel: "An toàn ATS",
          layoutStyle: "Editorial hai vùng",
          notes: "Cân bằng cấu trúc thị giác mạnh hơn với spacing thân thiện cho recruiter và in ấn."
        },
        "clean-showcase": {
          category: "Showcase",
          name: "The Clean Pitch",
          hook: "Trình bày dự án và kỹ năng sắc nét hơn mà không gây rối mắt",
          description: "Bố cục showcase sáng cho software, creative-tech và freelancer cần kể chuyện dự án rõ hơn.",
          featuredCopy: "Phù hợp khi bạn muốn một resume hướng dự án, polished nhưng vẫn gọn và chuyên nghiệp.",
          atsReadabilityLevel: "An toàn ATS",
          layoutStyle: "Showcase một cột",
          notes: "Lý tưởng khi dự án và chiều sâu kỹ năng cần nổi bật hơn timeline corporate truyền thống."
        }
      }
    : {
        professional: {
          category: "Professional",
          name: "The Executive",
          hook: "Balanced hierarchy for business and corporate roles",
          description: "A structured one-column template for operations, finance, legal and broad corporate hiring flows.",
          badge: "Popular",
          featuredCopy: "A polished ATS-safe layout for business, finance, operations and experienced individual contributors.",
          atsReadabilityLevel: "ATS-first",
          layoutStyle: "Structured one-column",
          notes: "Best when you want a conservative, high-trust document with strong section rhythm."
        },
        minimal: {
          category: "Minimal",
          name: "The Minimalist",
          hook: "Whitespace-first layout for technical and product resumes",
          description: "A clean one-column system designed for ATS safety, easy scanning and technical resumes with grouped skills.",
          featuredCopy: "Ideal for software, product, data and other text-first resumes where content clarity matters most.",
          atsReadabilityLevel: "Maximum ATS safety",
          layoutStyle: "Minimal one-column",
          notes: "Works especially well for IT, product, data and applicants who want a no-noise format."
        },
        creative: {
          category: "Creative",
          name: "The Modernist",
          hook: "Expressive typography with ATS-safe single-column flow",
          description:
            "A more distinctive one-column layout for marketing, content and design-adjacent roles without sacrificing machine readability.",
          badge: "New",
          featuredCopy: "Best when you want more personality for marketing or creative roles while keeping a recruiter-safe structure.",
          atsReadabilityLevel: "ATS-safe",
          layoutStyle: "Expressive one-column",
          notes: "Keeps the reading order linear while giving the page more character through type and accents."
        },
        "dark-portfolio": {
          category: "Portfolio",
          name: "The Nightfolio",
          hook: "Dark photo-first portfolio with experience and project emphasis",
          description: "A dark portfolio-oriented template with a left identity rail and a projects-heavy main canvas for developer resumes.",
          badge: "Showcase",
          featuredCopy: "Built for software and portfolio-driven candidates who want stronger personal branding without losing export readability.",
          atsReadabilityLevel: "ATS-adapted",
          layoutStyle: "Dark split portfolio",
          notes: "Best for dev portfolios, freelance profiles and candidates who want projects to carry more visual weight."
        },
        "corporate-slate": {
          category: "Corporate",
          name: "The Slate Board",
          hook: "Crisp light layout with stronger executive rhythm",
          description: "A calm, slate-toned resume that emphasizes experience, summary and clean scanning for corporate hiring teams.",
          featuredCopy: "A safer polished alternative when you want a more premium corporate tone than the default professional template.",
          atsReadabilityLevel: "ATS-first",
          layoutStyle: "Slate one-column",
          notes: "Works well for operations, consulting, business, legal and cross-functional roles."
        },
        "compact-fresher": {
          category: "Compact",
          name: "The First Page",
          hook: "Dense but readable starter layout for students and fresh graduates",
          description: "A compact layout that gives more space to education, projects and grouped skills while staying export friendly.",
          featuredCopy: "Designed for students and early-career applicants who need to fit strong projects and education into a single page.",
          atsReadabilityLevel: "Maximum ATS safety",
          layoutStyle: "Compact one-column",
          notes: "Use this when you need a one-page junior resume with tighter spacing but clear hierarchy."
        },
        "modern-columns": {
          category: "Hybrid",
          name: "The Split Ledger",
          hook: "Structured two-zone layout for product, marketing and hybrid resumes",
          description:
            "A modern two-zone composition that separates profile context from experience-heavy content without becoming visually noisy.",
          featuredCopy: "Good for product, growth, marketing and cross-functional candidates who want a more editorial page structure.",
          atsReadabilityLevel: "ATS-safe",
          layoutStyle: "Two-zone editorial",
          notes: "Balances stronger visual structure with recruiter-friendly spacing and printable sections."
        },
        "clean-showcase": {
          category: "Showcase",
          name: "The Clean Pitch",
          hook: "Sharper project and skills presentation without visual clutter",
          description: "A bright showcase layout for software, creative-tech and freelance profiles that need stronger project storytelling.",
          featuredCopy: "Best when you want a polished project-forward resume that still feels professional and lightweight.",
          atsReadabilityLevel: "ATS-safe",
          layoutStyle: "Showcase one-column",
          notes: "Ideal when projects and skill depth should stand out more than a traditional corporate timeline."
        }
      };
}
