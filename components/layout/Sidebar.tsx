// components/layout/Sidebar.tsx
'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
  Card,
  CardContent,
  Avatar,
  IconButton,
  alpha,
  useTheme,
  Collapse,
  Badge,
  Chip
} from '@mui/material';
import {
  ChatBubbleOutline as ChatIcon,
  AccountBalanceWalletOutlined as WalletIcon,
  BarChartOutlined as ChartIcon,
  InfoOutlined as InfoIcon,
  SmartToy as AgentIcon,
  ReceiptLongOutlined as ReceiptIcon,
  SupportAgentOutlined as SupportIcon,
  CurrencyExchangeOutlined as ExchangeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Settings as SettingsIcon,
  EmojiEventsOutlined as AirdropIcon,
  NewReleases as NewIcon,
  ArrowDropUp as ArrowUpIcon,
  ArrowDropDown as ArrowDownIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';

// Sidebar width
const drawerWidth = 240;

// Mock data for market trends
const trendingTokens = [
  { symbol: 'ETH', name: 'Ethereum', price: 3245.78, change: 2.4 },
  { symbol: 'BTC', name: 'Bitcoin', price: 51389.65, change: -1.2 },
  { symbol: 'USDC', name: 'USD Coin', price: 1.00, change: 0.01 },
];

export default function Sidebar() {
  const theme = useTheme();
  const pathname = usePathname();
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(true);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  // Fix hydration issues - only render conditional content after client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle submenus
  const toggleTools = () => {
    setToolsOpen(!toolsOpen);
  };

  const toggleResources = () => {
    setResourcesOpen(!resourcesOpen);
  };

  // Main navigation items
  const mainNavItems = [
    { label: 'Chat with AI', href: '/', icon: <ChatIcon fontSize="small" /> },
    { label: 'Daily Analysis', href: '/daily-analysis', icon: <ChartIcon fontSize="small" /> },
    { label: 'Portfolio', href: '/assets', icon: <WalletIcon fontSize="small" /> },
  ];

  // Tools navigation items
  const toolsNavItems = [
    { label: 'Transaction History', href: '/transactions', icon: <ReceiptIcon fontSize="small" /> },
    { label: 'Swap', href: '/swap', icon: <ExchangeIcon fontSize="small" /> },
    { label: 'Airdrops', href: '/airdrops', icon: <AirdropIcon fontSize="small" />, badge: 2 },
  ];

  // Resources navigation items
  const resourcesNavItems = [
    { label: 'FAQ', href: '/faq', icon: <InfoIcon fontSize="small" /> },
    { label: 'About MPC', href: '/about-mpc', icon: <InfoIcon fontSize="small" /> },
    { label: 'Contact Support', href: '/contact', icon: <SupportIcon fontSize="small" /> },
  ];

  // Sidebar content
  const sidebarContent = (
    <>
      {/* User AI agent status card */}
      {mounted && isConnected && (
        <Card
          elevation={0}
          sx={{
            m: 2,
            mb: 3,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
            boxShadow: theme.customShadows.card,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.primary.main,
                  width: 36,
                  height: 36,
                  mr: 1.5,
                }}
              >
                <AgentIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} color="white">
                  AI Trading Assistant
                </Typography>
                <Typography variant="caption" color={alpha('#fff', 0.8)}>
                  Smart asset management
                </Typography>
              </Box>
              <IconButton
                size="small"
                sx={{
                  ml: 'auto',
                  color: 'white',
                  '&:hover': { bgcolor: alpha('#fff', 0.1) },
                }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Box>
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
              <Typography variant="caption" color={alpha('#fff', 0.9)}>
                Total Assets Managed
              </Typography>
              <Typography variant="subtitle2" fontWeight={600} color="white">
                $12,435.89
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Main navigation items */}
      <List sx={{ px: 2 }}>
        {mainNavItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
            <Link href={item.href} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
              <ListItemButton
                selected={pathname === item.href}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '25%',
                      height: '50%',
                      width: 3,
                      bgcolor: theme.palette.primary.main,
                      borderRadius: 4,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: pathname === item.href
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: pathname === item.href ? 600 : 400,
                    color: pathname === item.href ? theme.palette.primary.main : 'inherit',
                  }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1.5, mx: 2 }} />

      {/* Tools navigation items */}
      <ListItemButton onClick={toggleTools} sx={{ px: 3, py: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Trading Tools
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          {toolsOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </Box>
      </ListItemButton>

      <Collapse in={toolsOpen} timeout="auto">
        <List disablePadding sx={{ px: 2 }}>
          {toolsNavItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <Link href={item.href} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <ListItemButton
                  selected={pathname === item.href}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    pl: 2,
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: pathname === item.href
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    }}
                  >
                    {item.badge ? (
                      <Badge badgeContent={item.badge} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10 } }}>
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: pathname === item.href ? 600 : 400,
                      color: pathname === item.href ? theme.palette.primary.main : 'inherit',
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Collapse>

      {/* Resources navigation items */}
      <ListItemButton onClick={toggleResources} sx={{ px: 3, py: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Resources & Support
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          {resourcesOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </Box>
      </ListItemButton>

      <Collapse in={resourcesOpen} timeout="auto">
        <List disablePadding sx={{ px: 2 }}>
          {resourcesNavItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <Link href={item.href} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <ListItemButton
                  selected={pathname === item.href}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    pl: 2,
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: pathname === item.href
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: pathname === item.href ? 600 : 400,
                      color: pathname === item.href ? theme.palette.primary.main : 'inherit',
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Collapse>

      <Divider sx={{ my: 1.5, mx: 2 }} />

      {/* Market trends widget */}
      <Box sx={{ px: 3, py: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Trending Tokens
        </Typography>
        <List disablePadding>
          {trendingTokens.map((token) => (
            <ListItem 
              key={token.symbol} 
              disablePadding 
              sx={{ 
                mb: 0.5, 
                borderRadius: 1,
                '&:hover': {
                  bgcolor: alpha(theme.palette.background.paper, 0.3)
                }
              }}
            >
              <Box sx={{ 
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 28, 
                      height: 28, 
                      mr: 1, 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    {token.symbol.substring(0, 2)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {token.symbol}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {token.name}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" fontWeight={500}>
                    ${token.price.toFixed(2)}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: token.change >= 0 ? theme.palette.success.main : theme.palette.error.main
                  }}>
                    {token.change >= 0 ? 
                      <ArrowUpIcon fontSize="small" /> : 
                      <ArrowDownIcon fontSize="small" />
                    }
                    <Typography 
                      variant="caption" 
                      fontWeight={500}
                      color="inherit"
                    >
                      {Math.abs(token.change)}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 1 }}>
          <Button 
            fullWidth 
            variant="outlined" 
            size="small"
            color="primary"
            sx={{ 
              borderRadius: 1.5, 
              py: 0.5,
              textTransform: 'none',
              fontSize: '0.75rem'
            }}
          >
            View More Trends
          </Button>
        </Box>
      </Box>
    </>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          borderRight: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.background.paper, 0.4),
          mt: '64px', // Space for top nav bar
          height: 'calc(100% - 64px)',
          boxShadow: 'none',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
}