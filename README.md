# Create-CV — Production-Grade Web-Based Resume Builder

**Create-CV** is an editorial, web-based resume builder designed to help professionals, students, software engineers, and executives build recruiter-friendly, ATS-safe resumes with real-time editing, bi-directional focus navigation, live template switching, and browser-native PDF export.

---

## 🌟 Key Features

### 🎨 13 Premium Industry-Tailored CV Templates
Choose from 13 curated, recruiter-tested resume templates designed across distinct visual aesthetics:
* **The Executive (`professional`)**: Structured, conservative single-column for business, finance & corporate roles.
* **The Minimalist (`minimal`)**: Whitespace-first single column for technical & data-centric resumes.
* **The Modernist (`creative`)**: Expressive typography with single-column ATS safety for creative roles.
* **The Nightfolio (`dark-portfolio`)**: Dark portfolio layout with an identity sidebar for software developers.
* **The Slate Board (`corporate-slate`)**: Slate-toned layout with elevated section hierarchy for consulting & operations.
* **The First Page (`compact-fresher`)**: Compact single-page format for students & early-career applicants.
* **The Split Ledger (`modern-columns`)**: Two-zone editorial composition for product & marketing professionals.
* **The Clean Pitch (`clean-showcase`)**: Showcase single column emphasizing project storytelling.
* **The Nordic Modern (`nordic-minimal`)**: *NEW* Scandinavian editorial layout with warm serif typography.
* **The Emerald Executive (`emerald-executive`)**: *NEW* Deep forest emerald banner layout for directors & senior executives.
* **The Tech Matrix (`tech-matrix`)**: *NEW* Code-inspired layout with terminal badge tags for software engineers & DevOps.
* **The Editorial Serif (`editorial-elegance`)**: *NEW* High-fashion & publication-grade magazine layout with Playfair serif contrast.
* **The Modern Accent (`vibrant-gradient`)**: *NEW* Indigo-to-Teal gradient banner with floating card components.

### 🔄 Bi-Directional Form & Preview Synchronization
* **Left ➔ Right Highlight**: Focusing any input field on the left form panel automatically scrolls the right CV preview paper to that section, highlighting it with a **glowing border** and an `Editing` badge.
* **Right ➔ Left Click Navigation**: Clicking any section directly on the CV preview paper automatically smooth-scrolls the left form column to that `SectionCard` and auto-focuses its first input field.

### 🎯 Real-Time Template Gallery Filtering & Search
* Interactive category tabs (*All*, *Minimal*, *Executive*, *Technical*, *Creative*, *Editorial*, *Portfolio*, *Corporate*).
* Instant keyword search across template names, hooks, layout styles, and target industries.

### 🌐 Bilingual Internationalization (i18n)
* Complete dual-language support for Vietnamese (`vi`) and English (`en`).
* One-click content copying between Vietnamese and English locales.

### 🖨️ Recruiter-Safe PDF Export Engine
* Browser-native `@media print` engine with 100% exact color reproduction (`-webkit-print-color-adjust: exact`).
* Atomic contact field protection (`.resume-contact-entry--atomic`) preventing unnatural line breaks on emails, LinkedIn handles, or GitHub URLs.
* Smart page-break prevention (`break-inside: avoid`) ensuring sections stay intact across A4 pages.

---

## 🏗️ Technology Stack

* **Framework**: Next.js 15 (App Router), React 19, TypeScript (Strict Mode)
* **State Management**: Zustand Store (`store/resume-editor-store.ts`)
* **Styling**: Tailwind CSS v3 + CSS Custom Properties & Custom Tokens (`app/globals.css`)
* **Backend & Auth**: Firebase Auth & Firestore (with local browser storage fallback for demo mode)
* **PDF Engine**: `react-to-print` + CSS `@media print`
* **Package Manager**: Bun / npm

---

## 🚦 Application Routes

* `/` — Landing page with hero banner, template highlights & feature showcase
* `/templates` — Interactive template library with category filter & real-time search
* `/dashboard` — Protected resume workspace (create, list, edit, duplicate, delete)
* `/resume/new?template=<id>` — Fast resume creation flow
* `/resume/[resumeId]/edit` — Split-screen editor with bi-directional sync, template switcher & PDF export
* `/login` & `/register` — Authentication flows (Firebase Auth / Demo mode)

---

## 🚀 Local Quickstart

### Prerequisites
Make sure you have Node.js (v18+) or Bun installed.

### Installation & Running

```bash
# 1. Install dependencies
npm install
# or: bun install

# 2. Run local development server
npm run dev
# or: bun run dev

# 3. Open browser at
http://localhost:3000
```

---

## 🔑 Firebase Configuration (Optional)

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **Note**: If environment variables are omitted, Create-CV automatically operates in **Local Demo Mode**, persisting resumes securely in local browser storage.

---

## 🧪 Verification Protocol

Run tests & lint checks prior to committing:

```bash
# 1. TypeScript compilation check
npm run typecheck

# 2. Linter & style check
npm run lint
```

---

## 📝 License & Rules

Refer to [`AGENTS.md`](file:///D:/Demo/Create-CV/AGENTS.md) for engineering standards, commit conventions, and development guidelines.
