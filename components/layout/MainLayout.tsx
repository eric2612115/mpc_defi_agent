// components/layout/MainLayout.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Snackbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAccount } from 'wagmi';
import Header from './Header';
import MobileHeader from './MobileHeader';
import Sidebar from './Sidebar';
import ConnectWalletPrompt from '../common/ConnectWalletPrompt';
import CreateAgentPrompt from '../common/CreateAgentPrompt';
import apiClient from '../../lib/apiClient';

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  requireWallet?: boolean;
  requireAgent?: boolean;
}

export default function MainLayout({ 
  children, 
  showSidebar = true,
  requireWallet = true,
  requireAgent = true
}: MainLayoutProps) {
  const theme = useTheme();
  const { isConnected, address } = useAccount();
  const [hasAgent, setHasAgent] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Check if already mounted on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user has already created an Agent
  useEffect(() => {
    if (!mounted || !isConnected || !address) {
      setHasAgent(false);
      setLoading(false);
      return;
    }

    const checkAgentStatus = async () => {
      try {
        setLoading(true);
        const response = await apiClient.checkAgentStatus(address);
        
        // Gracefully handle errors - don't throw if error exists,
        // instead log and set hasAgent to false (default safe state)
        if (response.error) {
          console.warn("Error checking agent status, defaulting to no agent:", response.error);
          setHasAgent(false);
          setError("Unable to verify agent status. Some features may be unavailable.");
        } else {
          setHasAgent(response.data?.has_agent || false);
          console.log("MainLayout: Agent status check result:", response.data?.has_agent);
        }
      } catch (err) {
        console.error('Uncaught error checking agent status:', err);
        setError('Unable to check agent status. Please try again later.');
        setHasAgent(false);
      } finally {
        setLoading(false);
      }
    };

    checkAgentStatus();
  }, [mounted, isConnected, address]);

  // Create Agent handler
  const handleCreateAgent = async () => {
    if (!address) return false;
    
    try {
      setLoading(true);
      const response = await apiClient.createAgent(address);
      
      if (response.error) {
        console.warn("Error creating agent:", response.error);
        setError('Failed to create your AI agent. Please try again.');
        return false;
      }
      
      setHasAgent(true);
      return true;
    } catch (err) {
      console.error('Uncaught error creating agent:', err);
      setError('Failed to create your AI agent. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handle error snackbar close
  const handleCloseError = () => {
    setError(null);
  };

  // Show loading
  if (!mounted || loading) {
    return (
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          bgcolor: theme.palette.background.default
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // If wallet connection is required but not connected, show prompt
  if (requireWallet && !isConnected) {
    return (
      <>
        {isMobile ? <MobileHeader hasAgent={hasAgent ?? undefined} /> : <Header hasAgent={hasAgent ?? undefined} />}
        <ConnectWalletPrompt />
      </>
    );
  }

  // If agent is required but not created, show prompt
  if (requireAgent && !hasAgent && isConnected) {
    return (
      <>
        {isMobile ? <MobileHeader hasAgent={hasAgent ?? undefined} /> : <Header hasAgent={hasAgent ?? undefined} />}
        <CreateAgentPrompt onCreateAgent={handleCreateAgent} />
      </>
    );
  }

  return (
    <Box
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Top navigation - different component for mobile vs desktop */}
      {isMobile ? <MobileHeader hasAgent={hasAgent ?? undefined} /> : <Header hasAgent={hasAgent ?? undefined} />}
      
      {/* Main content area */}
      <Box
        sx={{ 
          display: 'flex', 
          flexGrow: 1,
          pt: { xs: 8, sm: 9 } // Space for top nav bar
        }}
      >
        {/* Left sidebar (only show on desktop and when enabled) */}
        {showSidebar && !isMobile && (
          <Sidebar />
        )}
        
        {/* Main content */}
        <Box 
          component="main" 
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: { xs: '100%', md: `calc(100% - ${showSidebar ? '240px' : '0px'})` },
          }}
        >
          {children}
        </Box>
      </Box>
      
      {/* Error notification */}
      <Snackbar 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        open={!!error}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}