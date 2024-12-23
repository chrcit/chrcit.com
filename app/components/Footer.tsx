import { Link } from "@remix-run/react";
import { SocialLinks } from "./SocialLinks";

const footerLinks = [
  { name: "Colophon", href: "/colophon" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Imprint", href: "/imprint" },
] as const;

export function Footer() {
  return (
    <footer className="mx-auto flex flex-col gap-5 border-t px-3 py-5">
      <div className="mx-auto flex w-full flex-col items-center justify-between gap-3">
        <SocialLinks />
        <nav>
          <ul className="flex flex-row flex-wrap justify-evenly gap-1 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href} className="px-2">
                <Link
                  to={link.href}
                  className="cursor-pointer underline-offset-2 notouch:hover:underline"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
