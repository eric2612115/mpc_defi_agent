// components/layout/Sidebar.tsx
'use client';
import React, { useEffect, useState } from 'react';
import {
  alpha,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme
} from '@mui/material';
import {
  AccountCircle as AccountIcon,
  ArrowDropDown as ArrowDownIcon,
  ArrowDropUp as ArrowUpIcon,
  BarChartOutlined as ChartIcon,
  ChatBubbleOutline as ChatIcon,
  InfoOutlined as InfoIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  SupportAgentOutlined as SupportIcon,
  AccountBalanceWalletOutlined as WalletIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount, useDisconnect } from 'wagmi';

// Sidebar width
const drawerWidth = 240;

// Navigation items
const allNavItems = [
  { label: 'Chat with AI', href: '/', icon: <ChatIcon fontSize="small" /> },
  { label: 'Daily Analysis', href: '/daily-analysis', icon: <ChartIcon fontSize="small" /> },
  { label: 'Portfolio', href: '/assets', icon: <WalletIcon fontSize="small" /> },
  { label: 'About', href: '/about', icon: <InfoIcon fontSize="small" /> }
];

export default function Sidebar() {
  const theme = useTheme();
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [tickers, setTickers] = useState({
    BTCUSDT: { price: 51389.65, change_24h: -1.2 },
    ETHUSDT: { price: 3245.78, change_24h: 2.4 },
    SOLUSDT: { price: 143.47, change_24h: 6.24 }
  });

  // Fix hydration issues - only render conditional content after client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch ticker data every 30 seconds
  useEffect(() => {
    const fetchTickers = async () => {
      try {
      // 使用環境變量中的API基本URL
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000';
        const response = await fetch(`${API_BASE_URL}/api/public-data/tickers`);
        const data = await response.json();
        if (data && data.tickers) {
          setTickers(data.tickers);
        }
      } catch (error) {
        console.error('Error fetching ticker data:', error);
      }
    };

    // Fetch immediately on mount
    fetchTickers();

    // Set up interval for updates
    const intervalId = setInterval(fetchTickers, 30000); // 30 seconds

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Settings menu handlers
  const handleSettingsClick = (event: any) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  // Notification menu handlers
  const handleNotificationClick = (event: any) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleDisconnect = () => {
    disconnect();
    handleSettingsClose();
  };

  // Format address for display
  const formatAddress = (address: any) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Prepare token data for display
  const tokenData = [
    { id: 'bt', symbol: 'BTC', name: 'Bitcoin', price: tickers.BTCUSDT?.price || 0, change: tickers.BTCUSDT?.change_24h || 0 },
    { id: 'et', symbol: 'ETH', name: 'Ethereum', price: tickers.ETHUSDT?.price || 0, change: tickers.ETHUSDT?.change_24h || 0 },
    { id: 'so', symbol: 'SOL', name: 'Solana', price: tickers.SOLUSDT?.price || 0, change: tickers.SOLUSDT?.change_24h || 0 },
  ];

  // Sidebar content
  const sidebarContent = (
    <>
      {/* WiseAI card with wallet info */}
      <Card
        elevation={0}
        sx={{
          m: 2,
          mb: 3,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha('#8A5D32', 0.9)} 0%, ${alpha('#B07941', 0.9)} 100%)`,
          boxShadow: theme.customShadows?.card || '0 6px 16px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${alpha('#B07941', 0.3)}`,
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            {/* Bell icon instead of robot avatar */}
            <IconButton
              onClick={handleNotificationClick}
              size="small"
              sx={{
                bgcolor: '#F2E6C7',
                color: '#B07941',
                width: 40,
                height: 40,
                mr: 1.5,
                '&:hover': { bgcolor: '#F2E6C7' },
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
            
            <Box>
              <Typography color="white" fontWeight={600} variant="subtitle2">
                WiseAI
              </Typography>
              {mounted && isConnected && address ? (
                <Typography color={alpha('#fff', 0.8)} variant="caption">
                  {formatAddress(address)}
                </Typography>
              ) : (
                <Typography color={alpha('#fff', 0.8)} variant="caption">
                  Not connected
                </Typography>
              )}
            </Box>
            
            {/* Settings Icon */}
            <IconButton
              onClick={handleSettingsClick}
              size="small"
              sx={{
                ml: 'auto',
                color: 'white',
                '&:hover': { bgcolor: alpha('#fff', 0.1) },
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
            
            {/* Notifications Menu */}
            <Menu
              PaperProps={{
                sx: { width: 280, mt: 1.5 }
              }}
              anchorEl={notificationAnchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              onClose={handleNotificationClose}
              open={Boolean(notificationAnchorEl)}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Box sx={{ p: 2, borderBottom: '1px solid #E6D6A9' }}>
                <Typography fontWeight={600} variant="subtitle1">Notifications</Typography>
              </Box>
              <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <AccountIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="AI Agent Created"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondary="Your AI trading assistant is ready"
                />
              </MenuItem>
              <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <ChartIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="New Market Analysis"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondary="Check the latest USDC market analysis"
                />
              </MenuItem>
              <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <WalletIcon color="warning" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Transaction Successful"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondary="Your transaction was completed"
                />
              </MenuItem>
              <Box sx={{ p: 1, borderTop: '1px solid #E6D6A9', textAlign: 'center' }}>
                <Typography color="primary" variant="caption">View All Notifications</Typography>
              </Box>
            </Menu>
            
            {/* Settings Menu */}
            <Menu
              anchorEl={settingsAnchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              onClose={handleSettingsClose}
              open={Boolean(settingsAnchorEl)}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {mounted && isConnected ? [
                <MenuItem key="account">
                  <ListItemIcon>
                    <AccountIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Account Settings" />
                </MenuItem>,
                <MenuItem key="disconnect" onClick={handleDisconnect}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Disconnect Wallet" />
                </MenuItem>
              ] : (
                <MenuItem>
                  <ListItemText primary="Connect Wallet" />
                </MenuItem>
              )}
            </Menu>
          </Box>
          
          {mounted && isConnected ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                bgcolor: alpha('#000', 0.1),
                borderRadius: 1.5,
                border: `1px solid ${alpha('#fff', 0.1)}`,
              }}
            >
              <Typography color={alpha('#fff', 0.9)} variant="caption">
                Balance
              </Typography>
              <Typography color="white" fontWeight={600} variant="subtitle2">
                $12,435.89
              </Typography>
            </Box>
          ) : (
            <Button 
              fullWidth 
              size="small"
              sx={{ 
                bgcolor: alpha('#fff', 0.2), 
                color: 'white',
                '&:hover': { bgcolor: alpha('#fff', 0.3) },
                mt: 1
              }}
              variant="contained"
            >
              Connect Wallet
            </Button>
          )}
        </CardContent>
      </Card>

      {/* All navigation items in a single list */}
      <List sx={{ px: 2 }}>
        {allNavItems.map((item) => (
          <ListItem disablePadding key={item.label} sx={{ mb: 0.5 }}>
            <Link href={item.href} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
              <ListItemButton
                selected={pathname === item.href}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha('#B07941', 0.08),
                    '&:hover': {
                      bgcolor: alpha('#B07941', 0.12),
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '25%',
                      height: '50%',
                      width: 3,
                      bgcolor: '#B07941',
                      borderRadius: 4,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: pathname === item.href
                      ? '#B07941'
                      : '#7D6547',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: pathname === item.href ? 600 : 400,
                    color: pathname === item.href ? '#B07941' : 'inherit',
                  }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1.5, mx: 2 }} />

      {/* Market trends widget */}
      <Box sx={{ px: 3, py: 1 }}>
        <Typography color="#7D6547" gutterBottom variant="subtitle2">
          Trending Tokens
        </Typography>
        {tokenData.map((token) => (
          <Box 
            key={token.id}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1.5,
              borderBottom: token.id !== 'so' ? '1px solid rgba(0,0,0,0.05)' : 'none'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 1.5, 
                  bgcolor: 'rgba(0,0,0,0.05)',
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}
              >
                {token.id.toUpperCase()}
              </Avatar>
              <Box>
                <Typography fontWeight={500} variant="body2">
                  {token.symbol}
                </Typography>
                <Typography color="#7D6547" variant="caption">
                  {token.name}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography fontWeight={500} variant="body1">
                ${token.price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </Typography>
              <Box
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  color: token.change >= 0 ? '#2E7D32' : '#D32F2F'
                }}
              >
                {token.change >= 0 ? 
                  <ArrowUpIcon fontSize="small" /> : 
                  <ArrowDownIcon fontSize="small" />
                }
                <Typography 
                  color="inherit" 
                  fontWeight={500}
                  variant="caption"
                >
                  {Math.abs(token.change).toFixed(2)}%
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
        <Box sx={{ mt: 2 }}>
          <Button 
            fullWidth 
            size="small" 
            sx={{ 
              borderRadius: 4,
              py: 0.5,
              textTransform: 'none',
              fontSize: '0.75rem',
              color: '#B07941',
              borderColor: '#B07941'
            }}
            variant="outlined"
          >
            View More Trends
          </Button>
        </Box>
      </Box>
    </>
  );

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          borderRight: `1px solid #E6D6A9`,
          bgcolor: '#F8EDD7',
          height: '100%',
          boxShadow: 'none',
          overflow: 'hidden'
        },
      }}
      variant="permanent"
    >
      <Box sx={{ height: '100%', overflow: 'auto', pb: 2 }}>
        {sidebarContent}
      </Box>
    </Drawer>
  );
}