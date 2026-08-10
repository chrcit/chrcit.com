import { useEffect, useState } from 'react';

export function DisablePreviewMode() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(window === window.parent && !window.opener);
  }, []);

  return show ? (
    <a
      href="/api/preview-mode/disable"
      className="fixed top-4 right-4 z-50 rounded-md bg-red-500 px-4 py-2 text-white shadow-lg transition-colors hover:bg-red-600"
    >
      Disable Preview Mode
    </a>
  ) : null;
}
