import { PlaceholderPage } from "@/components/ui/placeholder-page";

export default function HomePage() {
  return (
    <PlaceholderPage
      eyebrow="Phase 1"
      title="Architect CV foundation is ready for the marketing build."
      description="The Next.js app, design tokens, route groups, and Firebase-ready configuration are in place. The landing page, auth, dashboard, editor, templates, and PDF flows will be layered on top in the next phases."
      links={[
        { href: "/templates", label: "Open Template Library" },
        { href: "/login", label: "Open Auth Flow" },
        { href: "/dashboard", label: "Open App Shell" }
      ]}
    />
  );
}
