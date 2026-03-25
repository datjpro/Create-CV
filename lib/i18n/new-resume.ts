import type { Locale } from "@/lib/types";

export function getNewResumeCopy(locale: Locale) {
  return locale === "vi"
    ? {
        loadingTitle: "Đang tạo resume...",
        loadingDescription: "Chúng tôi đang chuẩn bị template {template} và đưa bạn thẳng vào editor.",
        eyebrow: "Resume mới",
        title: "Chọn template trước khi chúng tôi tạo CV cho bạn.",
        description:
          "Chọn bố cục phù hợp nhất với vị trí bạn nhắm tới. Chúng tôi sẽ tạo một resume có thể chỉnh sửa từ template đó và đưa bạn vào editor ngay.",
        back: "Quay lại dashboard",
        useTemplate: "Dùng template này"
      }
    : {
        loadingTitle: "Creating your resume...",
        loadingDescription: "We are preparing your {template} template and taking you straight into the editor.",
        eyebrow: "New resume",
        title: "Choose a template before we create your CV.",
        description:
          "Pick the layout that fits your role best. We will create one editable resume from that template and take you straight into the editor.",
        back: "Back to dashboard",
        useTemplate: "Use this template"
      };
}
