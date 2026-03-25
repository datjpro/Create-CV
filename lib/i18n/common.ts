import type { Locale, ResumeStatus } from "@/lib/types";

export function getCommonCopy(locale: Locale) {
  const status: Record<Locale, Record<ResumeStatus, string>> = {
    en: { draft: "Draft", ready: "Ready" },
    vi: { draft: "Nháp", ready: "Sẵn sàng" }
  };

  return locale === "vi"
    ? {
        brandName: "CV-Tech",
        bestFor: "Phù hợp cho",
        backToDashboard: "Quay lại dashboard",
        loading: "Đang tải...",
        retry: "Thử lại",
        save: "Lưu",
        saving: "Đang lưu...",
        delete: "Xóa",
        duplicate: "Nhân bản",
        edit: "Chỉnh sửa",
        createCv: "Tạo CV",
        createResume: "Tạo resume",
        templates: "Mẫu CV",
        dashboard: "Dashboard",
        settings: "Cài đặt",
        login: "Đăng nhập",
        pricing: "Bảng giá",
        present: "Hiện tại",
        status: status.vi
      }
    : {
        brandName: "CV-Tech",
        bestFor: "Best for",
        backToDashboard: "Back to dashboard",
        loading: "Loading...",
        retry: "Retry",
        save: "Save",
        saving: "Saving...",
        delete: "Delete",
        duplicate: "Duplicate",
        edit: "Edit",
        createCv: "Create CV",
        createResume: "Create resume",
        templates: "Templates",
        dashboard: "Dashboard",
        settings: "Settings",
        login: "Login",
        pricing: "Pricing",
        present: "Present",
        status: status.en
      };
}
