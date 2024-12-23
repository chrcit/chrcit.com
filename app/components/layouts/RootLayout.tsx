import { type PropsWithChildren, useState } from "react";
import { type ActiveTabType } from "~/utils/navigation";
import { BaseLayout } from "./BaseLayout";
import { Header } from "../Header";
import { Footer } from "../Footer";
import clsx from "clsx";

interface RootLayoutProps extends PropsWithChildren {
  title: string;
  description: string;
  activeTab: ActiveTabType;
}

export function RootLayout({
  children,
  title,
  description,
  activeTab,
}: RootLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <BaseLayout title={title} description={description}>
      <div className="flex w-full flex-col lg:fixed lg:left-0 lg:top-0 lg:z-10 lg:h-[100dvh] lg:flex-row">
        <aside
          aria-expanded={isSidebarExpanded}
          className={clsx(
            "group/sidebar flex flex-col justify-between lg:w-[60px] lg:border-r lg:px-5",
            "relative max-h-[100dvh] flex-shrink-0 overflow-clip overflow-y-auto border-b transition-all lg:border-b-0",
            isSidebarExpanded && "w-full lg:w-[200px] xl:w-[350px]",
          )}
          aria-label="Sidebar with Header and Footer"
        >
          <button
            type="button"
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="absolute left-3 top-3 hidden rounded-md p-1 text-gray-500 lg:block notouch:hover:bg-slate-200 notouch:hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={clsx(
                "transition-all duration-300",
                isSidebarExpanded ? "scale-x-[1]" : "scale-x-[-1]",
              )}
            >
              <path d="M3 19V5" />
              <path d="m13 6-6 6 6 6" />
              <path d="M7 12h14" />
            </svg>
          </button>

          <div className={clsx("lg:hidden", isSidebarExpanded && "block")}>
            <Header activeTab={activeTab} />
          </div>

          <div className={clsx("hidden", isSidebarExpanded && "lg:block")}>
            <Footer />
          </div>
        </aside>

        <div className="xl:pl-18 relative min-h-[100dvh] flex-grow scroll-smooth lg:z-20 lg:overflow-auto lg:pl-10 lg:shadow-2xl xl:pl-14">
          {children}

          <div className="lg:hidden">
            <Footer />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
