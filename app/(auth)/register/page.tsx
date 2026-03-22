import { PlaceholderPage } from "@/components/ui/placeholder-page";

export default function RegisterPage() {
  return (
    <PlaceholderPage
      eyebrow="Authentication"
      title="Registration flow placeholder"
      description="This route already exists so the app shell can be validated before the full Firebase auth integration lands."
      links={[{ href: "/login", label: "Back to Login" }]}
    />
  );
}
