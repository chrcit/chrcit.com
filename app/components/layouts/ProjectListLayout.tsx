import { Link } from "@remix-run/react";
import { RootLayout } from "./RootLayout";

interface Project {
  title: string;
  description: string;
  slug: string;
  tags: string[];
  image?: string;
}

interface ProjectListLayoutProps {
  projects: Project[];
}

export function ProjectListLayout({ projects }: ProjectListLayoutProps) {
  return (
    <RootLayout
      title="Projects"
      description="A collection of my projects and work."
      activeTab="/projects"
    >
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="prose prose-lg">
          <h1>Projects</h1>
          <p className="lead">
            Here are some of the projects I've worked on. Most of them are open
            source and available on GitHub.
          </p>
        </div>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                to={`/projects/${project.slug}`}
                className="group block h-full space-y-4 rounded-lg border border-gray-200 p-6 no-underline transition-all hover:border-brand"
              >
                {project.image && (
                  <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                      width={600}
                      height={400}
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-brand">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-gray-600">{project.description}</p>
                  {project.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </RootLayout>
  );
}
