import { Studio } from 'sanity';
import { useEffect } from 'react';

import config from '@root/sanity.config';

export function StudioApp() {
  useEffect(() => {
    document.documentElement.setAttribute('data-sanity-studio', '');
    return () => {
      document.documentElement.removeAttribute('data-sanity-studio');
    };
  }, []);

  return <Studio config={config} scheme="dark" />;
}
