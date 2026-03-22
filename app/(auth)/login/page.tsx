import { PlaceholderPage } from "@/components/ui/placeholder-page";

export default function LoginPage() {
  return (
    <PlaceholderPage
      eyebrow="Authentication"
      title="Login experience will be implemented in the auth phase."
      description="Firebase configuration, provider buttons, and redirect handling will be added in the next feature branch."
      links={[{ href: "/register", label: "Open Register" }]}
    />
  );
}
