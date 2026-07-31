# AGENTS.md — Development Standards & Practical Execution Guidelines for Create-CV

This document establishes the technical standards, production-grade development mindset, and operational protocols for AI Agents and Developers contributing to the **Create-CV** platform.

---

## 🎯 1. Production-Grade Engineering Mindset

1. **Production-Ready Code Quality**
   - Never generate temporary or bare-minimum code (naive MVPs). All features must meet commercial standards: polished UI/UX, smooth performance, full type safety, and real-world deployment readiness.
2. **No Symptom Patching**
   - Never swallow exceptions (empty `try-catch` blocks) or return dummy fallbacks to obscure runtime failures.
   - When encountering bugs or build errors, always inspect logs/tracebacks in full and resolve the Root Cause.
3. **Preserve API & Data Contracts**
   - Do not alter type definitions or function signatures without updating all invocation sites across the codebase synchronously.
4. **Empirical Verification Required**
   - Editing a file does not mean the task is complete. All code changes must pass static compilation (`npm run typecheck`) and linting (`npm run lint`) before reporting completion.

---

## 🏗️ 2. Key Technology Stack & Architecture

* **Core Framework**: Next.js 15 (App Router), React 19, TypeScript (Strict Mode).
* **State Management**: Zustand Store ([`store/resume-editor-store.ts`](file:///D:/Demo/Create-CV/store/resume-editor-store.ts)).
* **Styling System**: Tailwind CSS v3 + CSS Custom Properties ([`app/globals.css`](file:///D:/Demo/Create-CV/app/globals.css)).
* **Backend & Authentication**: Firebase Auth & Firestore / Firebase Admin SDK (with automatic fallback to local browser storage in demo mode).
* **PDF Export & Printing**: `react-to-print` combined with browser-native `@media print` CSS engine.
* **Internationalization**: Bilingual Vietnamese & English (`vi` / `en`) i18n system managed in [`lib/i18n/`](file:///D:/Demo/Create-CV/lib/i18n/).

---

## 🎨 3. CV Template Design & PDF Rendering Standards

### A. A4 Standard Page System
- Standard A4 Dimensions: `210mm x 297mm` (equivalent to 793px x 1122px at 96 DPI).
- Specialized CSS utility classes: `.resume-paper`, `.print-friendly`, and `.page-break-avoid`.

### B. Print Media & Page Break Rules (`@media print`)
- Force exact background & text color reproduction using `-webkit-print-color-adjust: exact; print-color-adjust: exact;`.
- Prevent accidental text wrapping on atomic contact strings (Email, LinkedIn, Phone, GitHub URLs) using `word-break: normal` and `white-space: nowrap` on `.resume-contact-entry--atomic`.
- Prevent section splits across page boundaries using `break-inside: avoid`.

### C. Template Architecture & Diversity
Each added template must implement all 5 synchronized components:
1. `TemplateId` union in [`lib/types.ts`](file:///D:/Demo/Create-CV/lib/types.ts)
2. Metadata Preset in [`lib/template-library.ts`](file:///D:/Demo/Create-CV/lib/template-library.ts)
3. i18n Translation Copy in [`lib/i18n/template-meta.ts`](file:///D:/Demo/Create-CV/lib/i18n/template-meta.ts)
4. Marketing Preview Card in [`components/marketing/template-preview.tsx`](file:///D:/Demo/Create-CV/components/marketing/template-preview.tsx)
5. PDF/Screen Render Layout in [`components/resume/resume-document-preview.tsx`](file:///D:/Demo/Create-CV/components/resume/resume-document-preview.tsx)

---

## 🔄 4. Bi-Directional Sync Ergonomics (Form Editor ↔ Preview)

The editor system maintains a strict 2-way synchronization flow:
* **Left Column ➔ Right Column**: Focusing any input field in the left form automatically smooth-scrolls the right CV paper to that section, applying a **Glowing Highlight Border** and an active `Editing` status badge.
* **Right Column ➔ Left Column**: Clicking any section directly on the right CV preview paper automatically smooth-scrolls the left Form column to the matching `SectionCard` and auto-focuses its first input field.

---

## 📋 5. Verification Protocol & Quality Commands

After every code modification, AI Agents must execute the following commands to guarantee code quality:

```bash
# 1. Type Safety & Compilation Check
npm run typecheck

# 2. Code Linting & Formatting Check
npm run lint
```

---

## ✍️ 6. Maintenance & Change Log

* **2026-08-01**: Enhanced Dark Mode contrast, added 5 new premium CV templates (`nordic-minimal`, `emerald-executive`, `tech-matrix`, `editorial-elegance`, `vibrant-gradient`), upgraded real-time category filtering & bi-directional sync navigation. Created `AGENTS.md` guidelines.

---

## 📌 7. Conventional Commits Standard

All commits in the project must strictly follow the **Conventional Commits** specification:

### A. Message Structure
`<type>(<scope>): <short summary in English or Vietnamese>`

### B. Allowed Types:
* `feat`: New features (e.g., new CV templates, real-time filters, bi-directional sync).
* `fix`: Bug fixes (e.g., dark mode contrast, PDF page break, font encoding).
* `docs`: Documentation changes (e.g., `AGENTS.md`, `README.md`).
* `style`: UI/UX styling, CSS tweaks without logic changes.
* `refactor`: Code restructuring without changing behavior.
* `perf`: Performance optimizations.
* `test`: Adding or modifying tests.
* `chore`: Build config, dependencies, toolings.

### C. Standard Commit Examples:
- `feat(templates): add 5 new CV templates and real-time category filter`
- `feat(editor): implement bi-directional focus sync between form and preview`
- `docs(agents): update AGENTS.md development guidelines in English`
