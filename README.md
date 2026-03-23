# Create-CV

Create-CV is a web-based CV builder designed to help students and junior candidates create ATS-friendly resumes quickly, customize content in real time, and export recruiter-readable PDFs directly from the browser.

## Project purpose
This project was built to solve a common problem in student job applications:
- many resume builders focus too much on visuals and produce layouts that are not ATS-safe
- users often have to rewrite the same resume multiple times for different roles
- beginners need a guided editor instead of a fixed sample CV that does not match their real profile

Create-CV addresses that by combining a guided resume editor, multiple template styles, account-based resume management, and browser-native PDF export in one system.

## What the system does
- provides a marketing landing page and template gallery
- supports authentication with Firebase and a local demo fallback
- gives each signed-in user a protected dashboard for resume management
- creates editable resumes from blank structured starter data instead of locked sample content
- lets users edit resumes in a split-screen editor with live preview
- supports ATS-oriented section structure including summary, grouped skills, projects, experience, education, certifications, awards, and activities
- allows template switching without losing resume data
- exports resumes to PDF using browser print flow while keeping text selectable

## What has been implemented
### Core features
- account registration and login flow
- protected dashboard with resume create, list, duplicate, delete, and edit actions
- idempotent `/resume/new` flow to avoid duplicate resume creation during effect replay
- Firebase Firestore integration for persistent resume storage
- local demo mode when Firebase configuration is missing

### Resume editor
- real-time resume editor with live preview
- editable personal information, summary, projects, work experience, education, certifications, awards, and activities
- grouped skills model for ATS-friendly technical or professional skill presentation
- industry focus selector: general, IT/software, marketing/creative, finance/legal
- career stage selector to change section order for fresher, student, and experienced users
- blank structured starter resume instead of hardcoded sample persona content

### Template and rendering system
- three resume templates: Professional, Minimal, Creative
- all templates normalized to ATS-safe single-column reading flow
- dynamic section ordering based on industry focus and career stage
- template metadata showing best-fit industries, ATS readability level, and layout style
- compact A4-oriented preview/export layout to reduce unnecessary page overflow

### Marketing and UX
- auth-aware marketing CTA flow for guest and signed-in users
- template gallery showing recommended industries and ATS notes
- synchronized marketing copy around editable content and ATS-safe templates
- dashboard and homepage updated to reflect real product behavior

## Stack
- Bun for package management and scripts
- Next.js App Router + React + TypeScript
- Tailwind CSS with a custom design-token layer from `DESIGN.md`
- Firebase Auth and Firestore when env vars are provided
- local demo auth/data mode when Firebase is not configured
- Zustand for editor state synchronization

## Routes
- `/` landing page
- `/templates` template library
- `/login` and `/register` auth flow
- `/dashboard` protected resume workspace
- `/resume/new?template=<professional|minimal|creative>` create flow
- `/resume/[resumeId]/edit` editor, live preview, template switching, and PDF export

## Local setup
1. Install dependencies:
   `bun install`
2. Start the dev server:
   `bun run dev`
3. Open `http://localhost:3000`

## Firebase configuration
Copy `.env.example` to `.env.local` and fill:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

If those values are missing, the app automatically runs in demo mode:
- email/password accounts are stored locally in browser storage
- Google/GitHub buttons create demo sessions locally
- resumes are stored per browser in local storage

If Firebase Storage is not enabled on Blaze:
- Authentication still works
- Firestore resume CRUD still works
- live preview, template switching, and PDF export still work
- avatar upload remains intentionally disabled

## Scripts
- `bun run dev`
- `bun run lint`
- `bun run typecheck`
- `bun run build`

## Verification completed
The project has been verified with:
- `npm run typecheck`
- `npm run lint`
- `cmd /c npm run build`

## CV-ready summary
You can adapt the project into CV bullets like these:
- Built a Next.js and TypeScript web application for ATS-friendly CV creation with live editing, template switching, and browser-based PDF export.
- Implemented Firebase-authenticated resume management with create, update, duplicate, delete, and protected dashboard workflows, plus a local demo fallback mode.
- Designed a dynamic resume data model supporting grouped skills, projects, certifications, awards, and career-stage-based section ordering for different job targets.
- Refactored multiple resume templates into ATS-safe single-column layouts and optimized A4 export density to reduce unnecessary multi-page output.
- Improved UX by adding auth-aware marketing CTAs, industry-fit template guidance, and editable blank starter content instead of hardcoded sample resumes.

## Plan tracking
Implementation status is tracked in:
- `plan/implementation-plan.md`
