# Kế hoạch triển khai Create-CV

## Cách theo dõi
- `[ ]` chưa làm
- `[-]` đang làm
- `[x]` đã xong

## Quy ước branch và commit
- Tạo `dev` từ `main`
- Mỗi phase dùng một feature branch tách từ `dev`
- Khi xong phase: cập nhật file này, chạy kiểm tra cần thiết, commit code + cập nhật plan cùng lúc, rồi merge về `dev`
- Khi toàn bộ MVP ổn định: merge `dev` sang `main`

## Phase 1. Foundation `chore/setup-dev-foundation`
- Trạng thái: `[x]`
- Mục tiêu:
  - Scaffold Next.js App Router bằng Bun-managed dependencies
  - Cấu hình TypeScript, Tailwind, fonts, design tokens
  - Tạo route groups `(marketing)`, `(auth)` và shell cho private routes
  - Thêm env mẫu cho Firebase
  - Cấu hình lint, typecheck, build
- Routes/chức năng:
  - `app/(marketing)`
  - `app/(auth)`
  - `app/dashboard`
  - `app/resume/*`
- Điều kiện hoàn thành:
  - App chạy được
  - Layout gốc sẵn sàng để ráp UI từ `UI.test`
- Commit gợi ý:
  - `chore: scaffold nextjs foundation and project structure`
- Hoàn thành: `2026-03-22`

## Phase 2. Marketing và Template Library `feat/marketing-and-template-library`
- Trạng thái: `[ ]`
- Mục tiêu:
  - Dựng `/` theo `stitch (6)`
  - Dựng `/templates` theo `stitch (4)`
  - Tái sử dụng nav/footer
  - Nối CTA sang luồng tạo CV
- Điều kiện hoàn thành:
  - Landing và template page responsive
  - CTA điều hướng đúng
- Commit gợi ý:
  - `feat: build landing page and template library`

## Phase 3. Authentication `feat/firebase-auth`
- Trạng thái: `[ ]`
- Mục tiêu:
  - Firebase Auth với Email/Password, Google, GitHub
  - Dựng `/login` và `/register`
  - Guard route riêng tư
  - Logout và redirect sau login
- Điều kiện hoàn thành:
  - Login, signup, logout, provider login chạy đủ luồng
- Commit gợi ý:
  - `feat: add firebase authentication with email google github`

## Phase 4. Dashboard và dữ liệu CV `feat/resume-data-dashboard`
- Trạng thái: `[ ]`
- Mục tiêu:
  - Thiết kế schema Firestore cho CV
  - Dựng `/dashboard` theo `stitch (7)`
  - Tạo mới, sửa, nhân bản, xóa CV
  - Chỉ hiển thị CV của user hiện tại
- Điều kiện hoàn thành:
  - CRUD CV hoạt động ổn định
  - Rules chặn truy cập sai user
- Commit gợi ý:
  - `feat: implement resume dashboard and firestore data model`

## Phase 5. Editor và Real-time Preview `feat/editor-live-preview`
- Trạng thái: `[ ]`
- Mục tiêu:
  - Dựng `/resume/[resumeId]/edit` theo `stitch (8)`
  - Form cho personal info, summary, experience, education, skills, projects
  - Zustand store đồng bộ form và preview
  - Upload avatar bằng Firebase Storage
  - Lưu thủ công bằng nút `Save`
- Điều kiện hoàn thành:
  - Preview cập nhật tức thời
  - Reload vẫn nạp lại dữ liệu đã lưu
- Commit gợi ý:
  - `feat: add resume editor with live preview`

## Phase 6. Template renderers `feat/template-renderers`
- Trạng thái: `[ ]`
- Mục tiêu:
  - Dựng 3 template `minimal`, `professional`, `creative`
  - Dùng chung một schema dữ liệu CV
  - Đổi template không mất dữ liệu
- Điều kiện hoàn thành:
  - Cả 3 template render ổn định
  - Chuyển template ngay trong editor mượt
- Commit gợi ý:
  - `feat: add template switching renderers`

## Phase 7. Export PDF `feat/pdf-export-print`
- Trạng thái: `[ ]`
- Mục tiêu:
  - Tích hợp `react-to-print`
  - Chuẩn hóa preview theo A4
  - Hỗ trợ multi-page
  - Thêm print stylesheet để ẩn UI editor khi in
  - Xử lý page break giữa section
- Điều kiện hoàn thành:
  - Xuất PDF không cắt nội dung
  - Text selectable, thân thiện ATS
- Commit gợi ý:
  - `feat: implement multi-page A4 pdf export`

## Phase 8. QA, polish và release `chore/qa-polish-release`
- Trạng thái: `[ ]`
- Mục tiêu:
  - Loading, error, empty states
  - Responsive mobile cho auth, dashboard, editor
  - Smoke test các luồng chính
  - Cập nhật README và hướng dẫn env Firebase
  - Chuẩn bị merge `dev` sang `main`
- Điều kiện hoàn thành:
  - Happy path từ login đến export PDF chạy ổn
  - Tài liệu setup đủ để chạy lại dự án
- Commit gợi ý:
  - `chore: polish qa docs and release flow`

## Test plan bắt buộc
- Auth:
  - Email/password signup/login
  - Google login
  - GitHub login
  - Logout
  - Chặn truy cập route private khi chưa login
- Dashboard:
  - Tạo CV mới
  - Nhân bản CV
  - Xóa CV
  - Empty state
- Editor:
  - Nhập dữ liệu là preview cập nhật ngay
  - Đổi template không mất dữ liệu
  - Upload avatar
  - Save và reload giữ nguyên dữ liệu
- PDF:
  - CV ngắn ra 1 trang
  - CV dài tự ngắt nhiều trang A4
  - Text copy được
- Security:
  - Firestore và Storage rules không cho user truy cập dữ liệu người khác

## Giả định đã chốt
- Repo hiện chỉ có `main`, nên sẽ tạo thêm `dev`
- `UI.test` là chuẩn tham chiếu UI chính
- V1 chỉ làm tính năng CV builder cốt lõi, chưa làm analytics, pricing, AI optimization, settings nâng cao
- Dùng Firebase client SDK trực tiếp ở frontend
- Lưu dữ liệu bằng nút `Save`, không autosave liên tục
- PDF export ưu tiên Chromium và dùng flow in trình duyệt theo A4 multi-page


