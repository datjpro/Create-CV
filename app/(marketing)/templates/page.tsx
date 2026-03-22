import { PlaceholderPage } from "@/components/ui/placeholder-page";

export default function TemplatesPage() {
  return (
    <PlaceholderPage
      eyebrow="Template Library"
      title="Template routes are scaffolded."
      description="This route group is ready to receive the template gallery mapped from the UI.test stitch assets."
      links={[{ href: "/", label: "Back to Home" }]}
    />
  );
}
