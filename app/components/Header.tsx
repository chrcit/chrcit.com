import { Link, useLocation } from "@remix-run/react";
import { type ActiveTabType, navigationLinks } from "~/utils/navigation";
import { SocialLinks } from "./SocialLinks";
import clsx from "clsx";

interface HeaderProps {
  activeTab?: ActiveTabType;
}

export function Header({ activeTab }: HeaderProps) {
  const location = useLocation();

  return (
    <header className="flex w-full flex-grow flex-col items-center justify-between gap-5 px-4 py-5 sm:flex-row lg:flex-col lg:gap-10 lg:px-0">
      <Link to="/" className="relative block cursor-pointer lg:mt-10">
        <img
          className="relative z-20 aspect-[200/243] h-auto max-w-[100px] lg:max-w-[175px] xl:max-w-[200px]"
          width={200}
          src="/images/cut-out.png"
          alt="Image of Christian Cito, a 26 year old white man. I'm wearing a loose blue shirt and am looking to the side."
        />
      </Link>

      <nav className="flex w-fit flex-col gap-2 italic lg:w-full lg:flex-grow">
        <SocialLinks
          size={20}
          className="justify-center sm:justify-end lg:hidden"
        />
        <ul className="flex flex-wrap items-center justify-center gap-2 overflow-auto lg:flex-col lg:items-start lg:justify-start xxs:flex-nowrap">
          {navigationLinks.map((link) => {
            const isActive = activeTab
              ? activeTab === link.href
              : location.pathname === link.href;

            return (
              <li
                key={link.href}
                className="pb-6 pt-4 lg:border-b group-first:lg:border-t"
              >
                <Link
                  className={clsx(
                    "group relative block w-full cursor-pointer break-keep px-3 text-[#444] underline-offset-2 lg:px-5",
                    isActive && "text-brand",
                    "notouch:hover:text-brand",
                  )}
                  to={link.href}
                  data-active={isActive}
                >
                  <span
                    className={clsx(
                      "absolute left-0 top-1/2 -translate-y-[calc(50%+0.2rem)] text-3xl xl:text-5xl",
                      isActive && "text-brand",
                      "notouch:group-hover:text-brand",
                    )}
                  >
                    /
                  </span>
                  <span
                    className={clsx(
                      "ml-2 text-xl font-medium text-[#444] xl:text-2xl notouch:group-hover:!text-brand",
                      isActive && "!text-brand",
                    )}
                  >
                    {link.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
