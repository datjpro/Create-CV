import { PrivatePlaceholder } from "@/components/auth/private-placeholder";
import { PrivateRouteShell } from "@/components/auth/private-route-shell";

export default function ResumeEditorPage() {
  return (
    <PrivateRouteShell>
      <PrivatePlaceholder
        eyebrow="Editor"
        title="Resume document route is now data-backed."
        description="The create flow already redirects here with a real resume id. The full split editor and live preview will land in the next phase."
        actions={[{ href: "/dashboard", label: "Back to dashboard" }]}
      />
    </PrivateRouteShell>
  );
}
