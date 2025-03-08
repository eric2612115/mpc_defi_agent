// components/layout/Header.tsx
'use client';
import React, { useEffect, useState } from 'react';
import {
  alpha,
  AppBar,
  Badge,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import EnhancedTransactionTicker from '../common/EnhancedTransactionTicker';
import Sidebar from './Sidebar';

// Define the TransactionNotice type to match what EnhancedTransactionTicker expects
interface TransactionNotice {
  id: string;
  type: "buy" | "swap" | "sell";
  user: string;
  token: string;
  amount: string;
  value: string;
  timestamp: string;
}

// Correctly typed mock notices
const mockNotices: TransactionNotice[] = [
  {
    id: '1',
    type: 'buy',
    user: '0x71C7...76F',
    token: 'ETH',
    amount: '2.54',
    value: '$8,791.23',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    type: 'swap',
    user: '0x8a25...48D',
    token: 'USDC',
    amount: '5,000',
    value: '1.42 ETH',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString()
  },
  {
    id: '3',
    type: 'sell',
    user: '0x4321...65',
    token: 'LINK',
    amount: '150',
    value: '$2,250.00',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString()
  }
];

interface HeaderProps {
  hasAgent?: boolean;
  isWalletConnected?: boolean;
  sidebarWidth?: number;
}

export default function Header({ hasAgent = false, isWalletConnected = false, sidebarWidth = 240 }: HeaderProps) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Only render on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle drawer toggle
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Check if we should show tickers - only when wallet is connected AND agent exists
  // This is the key fix - now we check both conditions
  const showTickers = isWalletConnected && hasAgent;

  return (
    <>
      {/* Only show header on mobile */}
      {isMobile && (
        <AppBar 
          elevation={0} 
          position="fixed"
          sx={{ 
            zIndex: 1200,
            bgcolor: scrolled ? alpha('#F8EDD7', 0.95) : 'transparent',
            borderBottom: scrolled ? `1px solid ${theme.palette.divider}` : 'none',
            transition: 'background-color 0.3s ease, border-bottom 0.3s ease',
            boxShadow: scrolled ? theme.customShadows?.light : 'none',
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Left side */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={toggleDrawer}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>

              <Typography
                component="div"
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
                variant="h6"
              >
                AI Trading Assistant
              </Typography>
            </Box>

            {/* Right side - only show notifications when wallet is connected */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isWalletConnected && (
                <IconButton color="inherit">
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              )}
            </Box>
          </Toolbar>

          {/* Transaction ticker for mobile - only when showTickers is true */}
          {showTickers && mounted && (
            <Box
              sx={{
                width: '100%',
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                borderTop: `1px solid ${theme.palette.divider}`,
                py: 1,
                px: 2
              }}
            >
              <EnhancedTransactionTicker 
                autoPlay={true}
                interval={5000}
                notices={mockNotices}
                position="header"
              />
            </Box>
          )}
        </AppBar>
      )}

      {/* Desktop version - only show transaction ticker when showTickers is true */}
      {!isMobile && mounted && showTickers && (
        <Box
          sx={{
            position: 'fixed',
            top: scrolled ? 0 : 16,
            left: 0,
            right: 0,
            zIndex: 1100,
            px: 2,
            ml: `${sidebarWidth}px`,
            width: `calc(100% - ${sidebarWidth}px)`,
            transition: 'top 0.3s ease',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <EnhancedTransactionTicker 
            autoPlay={true}
            interval={5000}
            notices={mockNotices}
            position="standalone"
          />
        </Box>
      )}

      {/* Mobile sidebar drawer */}
      {isMobile && (
        <Drawer
          anchor="left"
          onClose={toggleDrawer}
          open={drawerOpen}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              bgcolor: theme.palette.background.default,
              zIndex: 1300,
            },
          }}
        >
          {/* Drawer top - close button */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              p: 1,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* Import Sidebar component - only show full content if hasAgent */}
          {isWalletConnected ? (
            <Sidebar hasAgent={hasAgent} />
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.primary">
                Please connect your wallet to see options.
              </Typography>
            </Box>
          )}
        </Drawer>
      )}
    </>
  );
}