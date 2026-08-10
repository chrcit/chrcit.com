import type { FOOTER_QUERYResult } from '@gen/sanity';
import { Link } from 'react-router';
import { ComplexImage, NavLink } from '@/components/features/sanity';
import { Container } from '@/components/ui';
import { cleanString } from '@/components/features/sanity/helpers/stega';

export function Footer({
  footer,
  dataSanity,
}: {
  footer: FOOTER_QUERYResult | null;
  dataSanity?: string;
}) {
  return (
    <footer className="border-border border-t" data-sanity={dataSanity}>
      <Container className="py-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            {footer?.logo ? (
              <Link to="/" className="inline-block">
                <ComplexImage
                  value={footer.logo}
                  sizes="150px"
                  widths={[75, 150, 300]}
                  className="h-7 w-[150px]"
                  imgClassName="object-contain object-left"
                  showBlurPlaceholder={false}
                />
              </Link>
            ) : (
              <p className="text-sm font-semibold">Christian Cito</p>
            )}
            <p className="text-foreground/50 mt-2 text-xs">
              Vienna and the internet · {new Date().getFullYear()}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {footer?.mainNav?.map((item, idx) => (
              <NavLink
                key={`main-${idx}`}
                link={item}
                className="text-foreground/65 hover:text-foreground"
              />
            ))}
            {footer?.secondaryNav?.map((item, idx) => (
              <NavLink
                key={`secondary-${idx}`}
                link={item}
                className="text-foreground/65 hover:text-foreground"
              />
            ))}
            {!footer?.secondaryNav?.length ? (
              <>
                <Link
                  className="text-foreground/65 hover:text-foreground"
                  to="/imprint"
                >
                  Imprint
                </Link>
                <Link
                  className="text-foreground/65 hover:text-foreground"
                  to="/privacy-policy"
                >
                  Privacy
                </Link>
              </>
            ) : null}
            {footer?.socials?.map((social, idx) => (
              <a
                key={idx}
                href={cleanString(social.url) || '#'}
                target="_blank"
                rel="noreferrer"
                className="text-foreground/65 hover:text-foreground"
              >
                {cleanString(social.platform)}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
