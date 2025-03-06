// components/layout/Header.tsx
'use client';
import React, { useState } from 'react';
import {
  alpha,
  AppBar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  SmartToy as SmartToyIcon,
} from '@mui/icons-material';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface HeaderProps {
  hasAgent?: boolean;
}

interface MobileHeaderProps {
    hasAgent?: boolean | null;
  }

export default function Header({ hasAgent = false }: HeaderProps) {
  const theme = useTheme();
  const { isConnected } = useAccount();
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const handleNotificationOpen = (event: any) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleProfileOpen = (event: any) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  return (
    <AppBar 
      elevation={0} 
      position="fixed"
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: { xs: 'none', md: 'block' } // Only visible on desktop
      }}
    >
      <Toolbar>
        {/* Logo and title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              mr: 2
            }}
          >
            <SmartToyIcon />
          </Box>
          <Typography fontWeight={600} variant="h6">
            AI Trading Assistant
          </Typography>
        </Box>

        {/* Right-side actions */}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
          {/* Only show these if connected */}
          {isConnected && (
            <>
              <IconButton 
                onClick={handleNotificationOpen}
                size="large"
                sx={{ ml: 2 }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <IconButton
                onClick={handleProfileOpen}
                size="large"
                sx={{ ml: 2 }}
              >
                <AccountIcon />
              </IconButton>

              {/* Notification Menu */}
              <Menu
                anchorEl={notificationAnchor}
                id="notification-menu"
                onClose={handleNotificationClose}
                open={Boolean(notificationAnchor)}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    width: 320,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                    mt: 1.5,
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1.5,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Typography fontWeight={600} variant="subtitle1">
                    Notifications
                  </Typography>
                </Box>
                <MenuItem onClick={handleNotificationClose}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle2">Portfolio Alert</Typography>
                    <Typography color="text.secondary" variant="body2">
                      ETH price increased by 5% in the last 24 hours
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle2">New Market Analysis</Typography>
                    <Typography color="text.secondary" variant="body2">
                      Daily market analysis is now available
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle2">Transaction Completed</Typography>
                    <Typography color="text.secondary" variant="body2">
                      Your recent swap transaction has been confirmed
                    </Typography>
                  </Box>
                </MenuItem>
                <Box sx={{ p: 1.5, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
                  <Typography 
                    component="span" 
                    color="primary" 
                    sx={{ cursor: 'pointer', fontWeight: 500 }}
                    variant="body2"
                  >
                    View All Notifications
                  </Typography>
                </Box>
              </Menu>

              {/* Profile Menu */}
              <Menu
                anchorEl={profileAnchor}
                id="profile-menu"
                onClose={handleProfileClose}
                open={Boolean(profileAnchor)}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                    mt: 1.5,
                    width: 200,
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleProfileClose}>
                  Profile Settings
                </MenuItem>
                <MenuItem onClick={handleProfileClose}>
                  Portfolio
                </MenuItem>
                <MenuItem onClick={handleProfileClose}>
                  Account Security
                </MenuItem>
              </Menu>
            </>
          )}

          {/* Wallet Connect Button */}
          <Box sx={{ ml: 2 }}>
            <ConnectButton />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}