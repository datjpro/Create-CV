# AGENTS.md — Quy Chuẩn Phát Triển & Hướng Dẫn Thực Chiến Dự Án Create-CV

Tài liệu này quy định các tiêu chuẩn kỹ thuật, tư duy lập trình thực chiến và quy trình làm việc chuẩn Production dành cho các AI Agent và Developer tham gia phát triển hệ thống **Create-CV**.

---

## 🎯 1. Triết Lý & Tư Duy Dev Thực Chiến (Production-Grade Mindset)

1. **Chất Lượng Chuẩn Production (Production-Ready Code)**
   - Không tạo ra mã nguồn tạm bợ (MVP sơ sài). Mọi tính năng viết ra phải đạt tiêu chuẩn thương mại: UI/UX polished, mượt mà, type-safe và sẵn sàng triển khai thực tế.
2. **Không Sửa Lỗi Ngọn (No Symptom Patching)**
   - Tuyệt đối không nuốt ngoại lệ (`try-catch` rỗng), không trả về dữ liệu ảo (dummy fallbacks) để che đậy lỗi runtime. 
   - Khi gặp sự cố, luôn kiểm tra log/traceback đầy đủ và xử lý triệt để nguyên nhân gốc (Root Cause).
3. **Bảo Toàn Contract & API (Preserve Contracts)**
   - Không tự ý thay đổi type definition hay function signature mà không cập nhật đồng bộ toàn bộ các điểm gọi (invocation sites) trong codebase.
4. **Nghiệm Thu Bằng Kết Quả Thực Tế (Empirical Verification)**
   - Sửa file chưa đồng nghĩa với hoàn thành công việc. Mọi thay đổi mã nguồn bắt buộc phải qua bước biên dịch tĩnh (`npm run typecheck`) và linter (`npm run lint`) thành công trước khi công bố kết quả.

---

## 🏗️ 2. Kiến Trúc & Công Nghệ Key (Tech Stack Standards)

* **Core Stack**: Next.js 15 (App Router), React 19, TypeScript (Strict Mode).
* **State Management**: Zustand Store (`store/resume-editor-store.ts`).
* **Styling System**: Tailwind CSS v3 + CSS Custom Properties (`app/globals.css`).
* **Backend & Auth**: Firebase / Firebase Admin SDK.
* **PDF Export & Print**: `react-to-print` kết hợp `@media print` CSS engine.
* **Internationalization**: Hệ thống i18n hỗ trợ song ngữ Việt - Anh (`vi` / `en`) chuẩn hóa tại `lib/i18n/`.

---

## 🎨 3. Quy Chuẩn Thiết Kế Mẫu CV & Xuất File PDF

### A. Chuẩn Khung Trang In A4
- Kích thước tiêu chuẩn CV: `210mm x 297mm` (Tương đương 793px x 1122px tại 96 DPI).
- Sử dụng các class chuyên dụng `.resume-paper`, `.print-friendly`, và `.page-break-avoid`.

### B. Quy Tắc Ngắt Trang & Phông Chữ Khi In (@media print)
- Ép màu sắc chính xác tuyệt đối khi xuất file bằng `-webkit-print-color-adjust: exact; print-color-adjust: exact;`.
- Chống ngắt dòng sai ở các chuỗi liên hoàn (Email, LinkedIn, Phone, Github URL) bằng `word-break: normal`, `white-space: nowrap` trên thẻ nguyên tử `.resume-contact-entry--atomic`.
- Tránh ngắt đôi thẻ công việc/học vấn giữa 2 trang bằng `break-inside: avoid`.

### C. Đa Dạng Mẫu Thiết Kế (Template Diversity)
Mỗi template bổ sung phải có đủ 5 thành phần đồng bộ:
1. `TemplateId` union trong [`lib/types.ts`](file:///D:/Demo/Create-CV/lib/types.ts)
2. Metadata Preset trong [`lib/template-library.ts`](file:///D:/Demo/Create-CV/lib/template-library.ts)
3. Bản dịch i18n trong [`lib/i18n/template-meta.ts`](file:///D:/Demo/Create-CV/lib/i18n/template-meta.ts)
4. Thẻ xem trước Marketing trong [`components/marketing/template-preview.tsx`](file:///D:/Demo/Create-CV/components/marketing/template-preview.tsx)
5. Layout render PDF/Screen trong [`components/resume/resume-document-preview.tsx`](file:///D:/Demo/Create-CV/components/resume/resume-document-preview.tsx)

---

## 🔄 4. Tương Tác 2 Chiều Giữa Form Editor & Preview (Bi-Directional Ergonomics)

Hệ thống editor bắt buộc duy trì luồng đồng bộ 2 chiều:
* **Chiều Cột Trái ➔ Cột Phải**: Khi focus vào bất kỳ ô nhập liệu bên trái, tờ CV bên phải phải tự động cuộn mượt đến mục đó, đồng thời bật hiệu ứng **Glowing Highlight Border** và Badge chỉ thị `Đang chỉnh sửa`.
* **Chiều Cột Phải ➔ Cột Trái**: Khi nhấp trực tiếp vào bất kỳ section nào trên bản CV xem trước, cột Form bên trái tự động cuộn mượt đến `SectionCard` tương ứng và tự động focus con trỏ chuột vào ô input đầu tiên.

---

## 📋 5. Quy Trình Kiểm Thử & Chạy Lệnh Nghiệm Thu (Verification Protocol)

Sau mỗi lần thực hiện thay đổi mã nguồn, Agent phải tự động thực thi chuỗi lệnh sau để đảm bảo chất lượng:

```bash
# 1. Kiểm tra An Toàn Type trong toàn bộ mã nguồn TypeScript
npm run typecheck

# 2. Kiểm tra Quy Tắc Mã Nguồn & Định Dạng Code
npm run lint
```

---

## ✍️ 6. Nhật Ký Thay Đổi & Bảo Trì Dự Án (Maintenance Log)

* **2026-08-01**: Khắc phục các lỗi tương phản Dark Mode, bổ sung 5 Mẫu CV mới (`nordic-minimal`, `emerald-executive`, `tech-matrix`, `editorial-elegance`, `vibrant-gradient`), nâng cấp hệ thống Bộ lọc real-time & Tương tác đồng bộ 2 chiều giữa Form Editor và Preview. Tạo tài liệu quy chuẩn `AGENTS.md`.

---

## 📌 7. Quy Chuẩn Git Commit (Conventional Commits Standard)

Mọi commit trong dự án phải tuân theo chuẩn **Conventional Commits** để đảm bảo lịch sử mã nguồn chuyên nghiệp và dễ truy vết:

### A. Cấu Trúc Thông Điệp Commit
`<type>(<scope>): <mô tả ngắn gọn bằng Tiếng Việt hoặc Tiếng Anh>`

### B. Danh Sách Type Định Nghĩa:
* `feat`: Bổ sung tính năng mới (VD: mẫu CV mới, bộ lọc real-time, tương tác đồng bộ 2 chiều).
* `fix`: Sửa lỗi (VD: sửa tương phản dark mode, sửa lỗi ngắt trang PDF, sửa lỗi mã hóa phông chữ).
* `docs`: Bổ sung hoặc cập nhật tài liệu dự án (VD: `AGENTS.md`, `README.md`).
* `style`: Thay đổi UI/UX, CSS, giao diện không làm thay đổi logic code.
* `refactor`: Cải tiến cấu trúc mã nguồn mà không thay đổi tính năng.
* `perf`: Tối ưu hiệu năng ứng dụng.
* `test`: Bổ sung hoặc sửa đổi kịch bản kiểm thử.
* `chore`: Cấu hình build, dependencies, tooling.

### C. Ví Dụ Commit Chuẩn:
- `feat(templates): bổ sung 5 mẫu CV mới và bộ lọc danh mục real-time`
- `feat(editor): nâng cấp tương tác đồng bộ 2 chiều giữa form editor và cv preview`
- `docs(agents): tạo quy chuẩn phát triển dự án thực tế trong AGENTS.md`

