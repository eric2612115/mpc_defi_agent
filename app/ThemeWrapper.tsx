// app/ThemeWrapper.tsx (Client Component)
'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { woodTheme } from '@/lib/theme'; // Import the new Bistre theme

function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={woodTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default ThemeRegistry;