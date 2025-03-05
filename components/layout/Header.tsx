// components/layout/Header.tsx
'use client';
import React, { useEffect, useState } from 'react';
import {
  alpha,
  AppBar,
  Badge,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  SmartToy as AgentIcon,
  AutoAwesome as AutoAwesomeIcon,
  BarChartOutlined as ChartIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountBalanceWalletOutlined as WalletIcon
} from '@mui/icons-material';

// Header component with simplified design
export default function Header({ hasAgent = false, onMenuToggle }: any) {
  const theme = useTheme();
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues - only render conditional content after client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <AppBar 
      elevation={0} 
      position="fixed"
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: '#F8EDD7', // Fully opaque background
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
    </AppBar>
  );
}