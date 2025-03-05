// components/layout/MobileHeader.tsx
'use client';
import React, { useState } from 'react';
import {
  alpha,
  AppBar,
  Avatar,
  Badge,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  SmartToy as SmartToyIcon,
} from '@mui/icons-material';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Sidebar from './Sidebar';

interface MobileHeaderProps {
  hasAgent?: boolean | null;
}

export default function MobileHeader({ hasAgent = false }: MobileHeaderProps) {
  const theme = useTheme();
  const { isConnected, address } = useAccount();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <AppBar 
        elevation={0} 
        position="fixed"
        sx={{ 
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: { xs: 'block', md: 'none' },
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  height: 32, 
                  mr: 1,
                  width: 32
                }}
              >
                <SmartToyIcon fontSize="small" />
              </Avatar>
              <Typography fontWeight={600} variant="subtitle1">
                AI Trading
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" sx={{ mr: 1 }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            {isConnected ? (
              <Typography sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 8,
                color: theme.palette.primary.main,
                fontWeight: 500,
                px: 1.5,
                py: 0.5
              }} variant="caption">
                {formatAddress(address)}
              </Typography>
            ) : (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <IconButton
                    onClick={openConnectModal}
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    <Avatar
                      sx={{ 
                        bgcolor: 'transparent',
                        color: theme.palette.primary.main,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        height: 28, 
                        width: 28
                      }}
                    >
                      Connect
                    </Avatar>
                  </IconButton>
                )}
              </ConnectButton.Custom>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        onClose={toggleDrawer}
        open={drawerOpen}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        <Box sx={{ mt: 7 }}>
          {/* Use the same Sidebar component but with a prop to indicate mobile view */}
          <Sidebar isMobile={true} onMobileClose={toggleDrawer} />
        </Box>
      </Drawer>
    </>
  );
}