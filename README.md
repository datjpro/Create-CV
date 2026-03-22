# Create-CV

Create-CV is a Bun-managed Next.js resume builder that combines:
- marketing landing pages and a template gallery
- Firebase-ready authentication with a no-config demo fallback
- a protected dashboard for resume CRUD
- a split resume editor with real-time preview
- three renderer styles: Professional, Minimal, Creative
- browser-native PDF export using `react-to-print`
- avatar upload currently deferred while the project stays off Firebase Blaze

## Stack
- Bun for package management and scripts
- Next.js App Router + React + TypeScript
- Tailwind CSS with a custom design-token layer from `DESIGN.md`
- Firebase Auth and Firestore when env vars are provided
- Local demo auth/data mode when Firebase is not configured
- Zustand for editor state synchronization

## Routes
- `/` landing page
- `/templates` template library
- `/login` and `/register` auth flow
- `/dashboard` protected resume workspace
- `/resume/new?template=<professional|minimal|creative>` create flow
- `/resume/[resumeId]/edit` editor, live preview and PDF export

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

Firebase rules are included here:
- `firebase/firestore.rules`
- `firebase/storage.rules`

Do not replace `firebase/firestore.rules` with a global deny-all rule like:
- `allow read, write: if false;`

That rule is safe as a temporary lockdown, but it will block all resume CRUD flows in this app. The included rules already scope access to the signed-in owner only.

If you stay on the free plan and do not enable Firebase Storage with Blaze:
- Authentication still works
- Firestore resume CRUD still works
- live preview, template switching and PDF export still work
- avatar upload is intentionally disabled in the editor for now

## Scripts
- `bun run dev`
- `bun run lint`
- `bun run typecheck`
- `bun run build`

## PDF export notes
- Export is driven by the browser print dialog.
- For the cleanest output, choose `Save as PDF` and disable browser headers/footers.
- The preview is HTML/CSS based, so exported text remains selectable for ATS-friendly parsing.

## QA checklist
The following checks were used during implementation:
- `bun run typecheck`
- `bun run lint`
- `bun run build`

Manual happy-path checks:
- register or sign in
- create a resume from dashboard or template gallery
- edit personal info, summary, experience, education, skills and projects
- confirm preview updates instantly
- switch template styles in the editor
- save and reload the editor
- export via `Export PDF`

## Plan tracking
Implementation status is tracked in:
- `plan/implementation-plan.md`
