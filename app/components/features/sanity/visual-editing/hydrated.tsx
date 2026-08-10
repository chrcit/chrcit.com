import type { JSX, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

let isHydrating = true;

export function Hydrated(props: PropsWithChildren): JSX.Element {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  return isHydrated && props.children ? <>{props.children}</> : <></>;
}
