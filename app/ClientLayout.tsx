// app/ClientLayout.tsx
'use client';
import React from 'react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

// This component is not needed anymore as you're handling wagmi setup in _app.tsx
// It's kept here as a placeholder in case you need client-side only logic
export default function ClientLayout({ children }: ClientLayoutProps) {
  return <>{children}</>;
}