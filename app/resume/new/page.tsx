import { PlaceholderPage } from "@/components/ui/placeholder-page";

export default function NewResumePage() {
  return (
    <PlaceholderPage
      eyebrow="Resume Creation"
      title="Resume creation workflow placeholder"
      description="This route will create a new resume document and redirect into the split editor during the data/dashboard phase."
      links={[{ href: "/dashboard", label: "Back to Dashboard" }]}
    />
  );
}
