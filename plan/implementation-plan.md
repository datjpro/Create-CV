# K? ho?ch tri?n khai Create-CV

## Cách theo dõi
- `[ ]` chua làm
- `[-]` dang làm
- `[x]` dã xong

## Quy u?c branch và commit
- T?o `dev` t? `main`
- M?i phase dùng m?t feature branch tách t? `dev`
- Khi xong phase: c?p nh?t file này, ch?y ki?m tra c?n thi?t, commit code + c?p nh?t plan cùng lúc, r?i merge v? `dev`
- Khi toàn b? MVP ?n d?nh: merge `dev` sang `main`

## Phase 1. Foundation `chore/setup-dev-foundation`
- Tr?ng thái: `[x]`
- M?c tiêu:
  - Scaffold Next.js App Router b?ng Bun-managed dependencies
  - C?u hình TypeScript, Tailwind, fonts, design tokens
  - T?o route groups `(marketing)`, `(auth)` và shell cho private routes
  - Thêm env m?u cho Firebase
  - C?u hình lint, typecheck, build
- Routes/ch?c nang:
  - `app/(marketing)`
  - `app/(auth)`
  - `app/dashboard`
  - `app/resume/*`
- Ði?u ki?n hoàn thành:
  - App ch?y du?c
  - Layout g?c s?n sàng d? ráp UI t? mockup n?i b?
- Commit g?i ý:
  - `chore: scaffold nextjs foundation and project structure`
- Hoàn thành: `2026-03-22`

## Phase 2. Marketing và Template Library `feat/marketing-and-template-library`
- Tr?ng thái: `[x]`
- M?c tiêu:
  - D?ng `/` theo `stitch (6)`
  - D?ng `/templates` theo `stitch (4)`
  - Tái s? d?ng nav/footer
  - N?i CTA sang lu?ng t?o CV
- Ði?u ki?n hoàn thành:
  - Landing và template page responsive
  - CTA di?u hu?ng dúng
- Commit g?i ý:
  - `feat: build landing page and template library`
- Hoàn thành: `2026-03-22`

## Phase 3. Authentication `feat/firebase-auth`
- Tr?ng thái: `[x]`
- M?c tiêu:
  - Firebase Auth v?i Email/Password, Google, GitHub
  - D?ng `/login` và `/register`
  - Guard route riêng tu
  - Logout và redirect sau login
- Ði?u ki?n hoàn thành:
  - Login, signup, logout, provider login ch?y d? lu?ng
- Commit g?i ý:
  - `feat: add firebase authentication with email google github`
- Hoàn thành: `2026-03-22`

## Phase 4. Dashboard và d? li?u CV `feat/resume-data-dashboard`
- Tr?ng thái: `[x]`
- M?c tiêu:
  - Thi?t k? schema Firestore cho CV
  - D?ng `/dashboard` theo `stitch (7)`
  - T?o m?i, s?a, nhân b?n, xóa CV
  - Ch? hi?n th? CV c?a user hi?n t?i
- Ði?u ki?n hoàn thành:
  - CRUD CV ho?t d?ng ?n d?nh
  - Rules ch?n truy c?p sai user
- Commit g?i ý:
  - `feat: implement resume dashboard and firestore data model`
- Hoàn thành: `2026-03-22`

## Phase 5. Editor và Real-time Preview `feat/editor-live-preview`
- Tr?ng thái: `[x]`
- M?c tiêu:
  - D?ng `/resume/[resumeId]/edit` theo `stitch (8)`
  - Form cho personal info, summary, experience, education, skills, projects
  - Zustand store d?ng b? form và preview
  - Avatar upload du?c hoãn khi không dùng Blaze; editor gi? avatar placeholder
  - Luu th? công b?ng nút `Save`
- Ði?u ki?n hoàn thành:
  - Preview c?p nh?t t?c th?i
  - Reload v?n n?p l?i d? li?u dã luu
- Commit g?i ý:
  - `feat: add resume editor with live preview`
- Hoàn thành: `2026-03-22`

## Phase 6. Template renderers `feat/template-renderers`
- Tr?ng thái: `[x]`
- M?c tiêu:
  - D?ng 3 template `minimal`, `professional`, `creative`
  - Dùng chung m?t schema d? li?u CV
  - Ð?i template không m?t d? li?u
- Ði?u ki?n hoàn thành:
  - C? 3 template render ?n d?nh
  - Chuy?n template ngay trong editor mu?t
- Commit g?i ý:
  - `feat: add template switching renderers`
- Hoàn thành: `2026-03-22`

## Phase 7. Export PDF `feat/pdf-export-print`
- Tr?ng thái: `[x]`
- M?c tiêu:
  - Tích h?p `react-to-print`
  - Chu?n hóa preview theo A4
  - H? tr? multi-page
  - Thêm print stylesheet d? ?n UI editor khi in
  - X? lý page break gi?a section
- Ði?u ki?n hoàn thành:
  - Xu?t PDF không c?t n?i dung
  - Text selectable, thân thi?n ATS
- Commit g?i ý:
  - `feat: implement multi-page A4 pdf export`
- Hoàn thành: `2026-03-22`

## Phase 8. QA, polish và release `chore/qa-polish-release`
- Tr?ng thái: `[x]`
- M?c tiêu:
  - Loading, error, empty states
  - Responsive mobile cho auth, dashboard, editor
  - Smoke test các lu?ng chính
  - C?p nh?t README và hu?ng d?n env Firebase
  - Chu?n b? merge `dev` sang `main`
- Ði?u ki?n hoàn thành:
  - Happy path t? login d?n export PDF ch?y ?n
  - Tài li?u setup d? d? ch?y l?i d? án
- Commit g?i ý:
  - `chore: polish qa docs and release flow`
- Hoàn thành: `2026-03-22`

## Deferred sau MVP
- `[ ]` Avatar upload qua Firebase Storage
  - Lý do: project không dùng Blaze nên chua b?t Storage th?t
  - Tr?ng thái hi?n t?i: editor không upload avatar, dùng placeholder an toàn
  - Hu?ng b? sung sau: resize + nén ?nh ? client, upload Storage, luu URL/path vào Firestore

## Test plan b?t bu?c
- Auth:
  - Email/password signup/login
  - Google login
  - GitHub login
  - Logout
  - Ch?n truy c?p route private khi chua login
- Dashboard:
  - T?o CV m?i
  - Nhân b?n CV
  - Xóa CV
  - Empty state
- Editor:
  - Nh?p d? li?u là preview c?p nh?t ngay
  - Ð?i template không m?t d? li?u
  - Save và reload gi? nguyên d? li?u
- PDF:
  - CV ng?n ra 1 trang
  - CV dài t? ng?t nhi?u trang A4
  - Text copy du?c
- Security:
  - Firestore rules không cho user truy c?p d? li?u ngu?i khác

## Gi? d?nh dã ch?t
- Repo hi?n ch? có `main`, nên s? t?o thêm `dev`
- Mockup UI n?i b? là chu?n tham chi?u UI chính
- V1 ch? làm tính nang CV builder c?t lõi, chua làm analytics, pricing, AI optimization, settings nâng cao
- Dùng Firebase client SDK tr?c ti?p ? frontend
- Luu d? li?u b?ng nút `Save`, không autosave liên t?c
- PDF export uu tiên Chromium và dùng flow in trình duy?t theo A4 multi-page
- Không dùng Firebase Storage ? giai do?n hi?n t?i n?u project không nâng Blaze

