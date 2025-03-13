// app/Analytics.tsx  (或 components/Analytics.tsx)
'use client';

import ReactGA from 'react-ga4';
import { useEffect } from 'react';

const Analytics = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ReactGA.initialize(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!); 

      ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
    }
  }, []);

  return null; 
};

export default Analytics;