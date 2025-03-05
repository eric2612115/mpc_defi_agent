// components/layout/Header.tsx
'use client';
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  SmartToy as AgentIcon,
  BarChartOutlined as ChartIcon,
  AccountBalanceWalletOutlined as WalletIcon,
  AutoAwesome as AutoAwesomeIcon
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
      position="fixed" 
      elevation={0}
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: '#F8EDD7', // Fully opaque background
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
    </AppBar>
  );
}