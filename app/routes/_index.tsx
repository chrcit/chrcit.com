import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { RootLayout } from "~/components/layouts/RootLayout";
import { Particles } from "~/components/Particles";

export const meta: MetaFunction = () => {
  return [
    { title: "Christian Cito" },
    { name: "description", content: "Personal website of Christian Cito" },
  ];
};

export async function loader() {
  return json({
    title: "Christian Cito",
    description: "Personal website of Christian Cito",
  });
}

export default function Index() {
  const { title, description } = useLoaderData<typeof loader>();

  return (
    <RootLayout activeTab="home" title={title} description={description}>
      <div className="relative min-h-screen">
        <Particles className="absolute inset-0 -z-10" />
        <div className="mx-auto max-w-2xl px-4 py-32">
          <h1 className="font-serif text-5xl font-bold">{title}</h1>
          <p className="mt-4 text-xl text-gray-600">{description}</p>
        </div>
      </div>
    </RootLayout>
  );
}
