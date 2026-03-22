import { PrivatePlaceholder } from "@/components/auth/private-placeholder";
import { PrivateRouteShell } from "@/components/auth/private-route-shell";

export default function DashboardPage() {
  return (
    <PrivateRouteShell>
      <PrivatePlaceholder
        eyebrow="Dashboard"
        title="Your private workspace is protected."
        description="Authentication, redirects and logout are wired in. The resume listing and CRUD experience will land in the dashboard phase."
        actions={[{ href: "/resume/new", label: "Continue to resume flow" }]}
      />
    </PrivateRouteShell>
  );
}
