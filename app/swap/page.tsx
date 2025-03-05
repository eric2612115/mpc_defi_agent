// app/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ConversationWindow from '@/components/conversation/ConversationWindow';
import { useAccount } from 'wagmi';
import MainLayout from '@/components/layout/MainLayout';

export default function HomePage() {
  const { isConnected } = useAccount();
  const [hasAgent, setHasAgent] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Fix for hydration errors - only render conditional content after client-side mount
  useEffect(() => {
    setMounted(true);
    // For demo purposes, we'll set hasAgent to true after mounting
    setHasAgent(true);
  }, []);

  const handleCreateAgent = () => {
    setHasAgent(true);
  };

  return (
    <MainLayout>
      <Box sx={{ pb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Chat with your AI assistant to analyze trades, manage assets, and execute transactions securely.
        </Typography>
      </Box>

      {mounted && (
        <ConversationWindow
          isConnected={isConnected}
          hasAgent={hasAgent}
          onCreateAgent={handleCreateAgent}
        />
      )}
    </MainLayout>
  );
}