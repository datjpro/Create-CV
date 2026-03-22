import { PrivatePlaceholder } from "@/components/auth/private-placeholder";
import { PrivateRouteShell } from "@/components/auth/private-route-shell";

export default function NewResumePage() {
  return (
    <PrivateRouteShell>
      <PrivatePlaceholder
        eyebrow="Resume creation"
        title="Protected creation route is ready."
        description="This route now requires authentication and is ready for the Firestore-backed create-and-redirect flow in the next phase."
        actions={[{ href: "/dashboard", label: "Back to dashboard" }]}
      />
    </PrivateRouteShell>
  );
}
