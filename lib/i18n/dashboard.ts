import type { Locale } from "@/lib/types";

export function getDashboardCopy(locale: Locale) {
  return locale === "vi"
    ? {
        workspace: "Workspace",
        logout: "Đăng xuất",
        loggingOut: "Đang đăng xuất...",
        title: "Không gian resume của bạn",
        subtitle:
          "Tạo, nhân bản và quản lý nhiều phiên bản resume chuẩn ATS cho các vị trí khác nhau mà không cần viết lại toàn bộ hồ sơ mỗi lần.",
        browseTemplates: "Xem template",
        newResume: "Resume mới",
        stats: {
          resumes: "Resume",
          templatesUsed: "Template đã dùng",
          readyToExport: "Sẵn sàng xuất"
        },
        confirmDelete: "Bạn có chắc muốn xóa resume này?",
        createCardTitle: "Tạo CV mới",
        createCardDescription: "Bắt đầu từ bản nháp trống có thể chỉnh sửa và đổi template sau.",
        loading: "Đang tải resume...",
        emptyEyebrow: "Trạng thái trống",
        emptyTitle: "Bạn chưa có resume nào.",
        emptyDescription:
          "Hãy tạo resume đầu tiên từ dashboard hoặc bắt đầu từ thư viện template. Tài liệu của bạn được gắn với đúng tài khoản và khởi tạo bằng nội dung mẫu có thể chỉnh sửa.",
        openTemplates: "Mở template",
        resumeCard: {
          editedOn: "Cập nhật",
          edit: "Chỉnh sửa",
          duplicate: "Nhân bản",
          delete: "Xóa"
        }
      }
    : {
        workspace: "Workspace",
        logout: "Logout",
        loggingOut: "Logging out...",
        title: "Your resume workspace",
        subtitle: "Create, duplicate and manage ATS-ready resume variants for different roles without rewriting your core profile every time.",
        browseTemplates: "Browse templates",
        newResume: "New resume",
        stats: {
          resumes: "Resumes",
          templatesUsed: "Templates used",
          readyToExport: "Ready to export"
        },
        confirmDelete: "Delete this resume?",
        createCardTitle: "Create New CV",
        createCardDescription: "Start from a blank editable starter and switch templates later.",
        loading: "Loading resumes...",
        emptyEyebrow: "Empty state",
        emptyTitle: "No resumes yet.",
        emptyDescription:
          "Create your first resume from the dashboard or start from the template gallery. Your documents stay scoped to your signed-in account and begin with editable real-content placeholders.",
        openTemplates: "Open templates",
        resumeCard: {
          editedOn: "Edited",
          edit: "Edit",
          duplicate: "Duplicate",
          delete: "Delete"
        }
      };
}
