import { PrivateRouteShell } from "@/components/auth/private-route-shell";
import { ResumeEditorScreen } from "@/components/editor/resume-editor-screen";

export default async function ResumeEditorPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = await params;

  return (
    <PrivateRouteShell>
      <ResumeEditorScreen resumeId={resumeId} />
    </PrivateRouteShell>
  );
}
