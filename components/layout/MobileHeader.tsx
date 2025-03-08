'use client';
import React, { useEffect, useState } from 'react';
import {
  alpha,
  AppBar,
  Badge,
  Box,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAccount } from 'wagmi';
import EnhancedTransactionTicker from '../common/EnhancedTransactionTicker';
import Sidebar from './Sidebar';

// Define the TransactionNotice type
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

interface MobileHeaderProps {
  hasAgent?: boolean;
  isWalletConnected?: boolean;
}

export default function MobileHeader({ hasAgent = false, isWalletConnected = false }: MobileHeaderProps) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState<HTMLElement | null>(null);
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

  // Check if we should show tickers - only when wallet is connected AND agent exists
  const showTickers = isWalletConnected && hasAgent;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  // Don't render content until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <>
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
              onClick={handleDrawerToggle}
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
              <IconButton 
                color="inherit"
                onClick={handleNotificationOpen}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Transaction ticker for mobile - only when showTickers is true */}
        {showTickers && (
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

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: { width: 280, mt: 1.5 }
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #E6D6A9' }}>
          <Typography fontWeight={600} variant="subtitle1">Notifications</Typography>
        </Box>
        <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
          <Box>
            <Typography fontWeight={500} variant="body2">AI Agent Created</Typography>
            <Typography color="text.secondary" variant="caption">Your AI trading assistant is ready</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
          <Box>
            <Typography fontWeight={500} variant="body2">New Market Analysis</Typography>
            <Typography color="text.secondary" variant="caption">Check the latest USDC market analysis</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
          <Box>
            <Typography fontWeight={500} variant="body2">Transaction Successful</Typography>
            <Typography color="text.secondary" variant="caption">Your transaction was completed</Typography>
          </Box>
        </MenuItem>
        <Box sx={{ p: 1, borderTop: '1px solid #E6D6A9', textAlign: 'center' }}>
          <Typography color="primary" variant="caption">View All Notifications</Typography>
        </Box>
      </Menu>

      {/* Mobile sidebar drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
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
          <IconButton onClick={handleDrawerToggle}>
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
    </>
  );
}