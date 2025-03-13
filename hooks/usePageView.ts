// hooks/usePageView.ts
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ReactGA from 'react-ga4';

function usePageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ReactGA.send({ hitType: "pageview", page: pathname });
    }
  }, [pathname]);
}

export default usePageView;