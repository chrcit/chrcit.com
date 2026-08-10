import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

type Props = {
  children?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function Container({ className, children, ...rest }: Props) {
  return (
    <div
      {...rest}
      className={clsx(
        'mx-auto w-full max-w-[var(--content-width)] px-5 sm:px-7 lg:px-10',
        className
      )}
    >
      {children}
    </div>
  );
}
