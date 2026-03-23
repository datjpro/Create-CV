import { PrivateRouteShell } from "@/components/auth/private-route-shell";
import { NewResumePageClient } from "@/components/resume/new-resume-page-client";
import { isTemplateId } from "@/lib/template-library";
import type { TemplateId } from "@/lib/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readTemplateId(value: string | string[] | undefined): TemplateId | null {
  const templateValue = Array.isArray(value) ? value[0] : value;
  return isTemplateId(templateValue) ? templateValue : null;
}

export default async function NewResumePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const templateId = readTemplateId(params.template);

  return (
    <PrivateRouteShell>
      <NewResumePageClient templateId={templateId} />
    </PrivateRouteShell>
  );
}
