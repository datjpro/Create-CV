import { PlaceholderPage } from "@/components/ui/placeholder-page";

export default function DashboardPage() {
  return (
    <PlaceholderPage
      eyebrow="Dashboard"
      title="Private workspace scaffolded."
      description="Resume list management, duplication, deletion, and Firestore integration will be added in the dashboard phase."
      links={[{ href: "/resume/new", label: "Create Placeholder Resume" }]}
    />
  );
}
