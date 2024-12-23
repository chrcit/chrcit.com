import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ProjectLayout } from "~/components/layouts/ProjectLayout";
import { getProject } from "~/utils/content";
import { getEmbedConsent } from "~/utils/embed-consent";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const project = getProject(params.slug ?? "");
  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }

  const embedConsent = await getEmbedConsent(request);

  return json({
    project,
    embedConsent,
  });
}

export default function ProjectPage() {
  const { project, embedConsent } = useLoaderData<typeof loader>();

  return (
    <ProjectLayout
      title={project.title}
      description={project.description}
      tags={project.tags}
      image={project.image}
      content={project.body.code}
      embedConsent={embedConsent}
    />
  );
}
