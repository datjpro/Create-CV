import { PrivatePlaceholder } from "@/components/auth/private-placeholder";
import { PrivateRouteShell } from "@/components/auth/private-route-shell";

export default function ResumeEditorPage() {
  return (
    <PrivateRouteShell>
      <PrivatePlaceholder
        eyebrow="Editor"
        title="Protected editor route is ready."
        description="The split editor and live preview will be mounted here after the dashboard data flow is in place."
        actions={[{ href: "/dashboard", label: "Back to dashboard" }]}
      />
    </PrivateRouteShell>
  );
}
