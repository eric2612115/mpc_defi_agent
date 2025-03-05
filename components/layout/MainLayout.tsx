// components/layout/MainLayout.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Snackbar, Alert, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAccount } from 'wagmi';
import Header from './Header';
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
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        setHasAgent(response.data?.has_agent || false);
      } catch (err) {
        console.error('Error checking agent status:', err);
        setError('Unable to check agent status. Please try again later.');
        
        // For development mode, set hasAgent to true to bypass the creation flow
        const DEVELOPMENT_MODE = process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true';
        if (DEVELOPMENT_MODE) {
          console.warn('⚠️ Development mode: Setting hasAgent to true');
          setHasAgent(true);
        } else {
          setHasAgent(false);
        }
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
        throw new Error(response.error);
      }
      
      setHasAgent(true);
      return true;
    } catch (err) {
      console.error('Error creating agent:', err);
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
        <Header hasAgent={hasAgent} />
        <ConnectWalletPrompt />
      </>
    );
  }

  // If agent is required but not created, show prompt
  // DEVELOPMENT CHANGE: Bypass agent creation in development mode
  if (requireAgent && !hasAgent && isConnected) {
    const DEVELOPMENT_MODE = process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true';
    
    if (DEVELOPMENT_MODE) {
      console.log("Development mode: Bypassing agent creation requirement");
      // Continue to the normal layout below instead of returning the CreateAgentPrompt
    } else {
      return (
        <>
          <Header hasAgent={hasAgent} />
          <CreateAgentPrompt onCreateAgent={handleCreateAgent} />
        </>
      );
    }
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
      {/* Top navigation bar */}
      <Header hasAgent={hasAgent} />
      
      {/* Main content area */}
      <Box
        sx={{ 
        display: 'flex', 
        flexGrow: 1,
        pt: { xs: 8, sm: 9 } // Space for top nav bar
      }}
      >
        {/* Left sidebar (if enabled) */}
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