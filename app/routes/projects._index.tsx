import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ProjectListLayout } from "~/components/layouts/ProjectListLayout";
import { getProjects } from "~/utils/content";

export function loader() {
  const projects = getProjects();
  return json({ projects });
}

export default function ProjectsPage() {
  const { projects } = useLoaderData<typeof loader>();
  return <ProjectListLayout projects={projects} />;
}
