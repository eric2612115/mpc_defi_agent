// components/layout/Header.tsx
'use client';
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Avatar,
  useTheme,
  alpha,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ChatBubbleOutline as ChatIcon,
  InsertChartOutlined as ChartIcon,
  AccountBalanceWalletOutlined as WalletIcon,
  InfoOutlined as InfoIcon,
  Notifications as NotificationsIcon,
  SmartToy as AgentIcon,
  AccountCircle as AccountIcon,
  AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Navigation items
const navItems = [
  { 
    label: 'Chat', 
    href: '/', 
    icon: <ChatIcon fontSize="small" />,
    description: 'Talk with AI Assistant'
  },
  { 
    label: 'Analysis', 
    href: '/daily-analysis', 
    icon: <ChartIcon fontSize="small" />,
    description: 'View market insights'
  },
  { 
    label: 'Portfolio', 
    href: '/assets', 
    icon: <WalletIcon fontSize="small" />,
    description: 'Manage your assets'
  },
  { 
    label: 'About', 
    href: '/about', 
    icon: <InfoIcon fontSize="small" />,
    description: 'Learn about MPC security'
  },
];

interface HeaderProps {
  hasAgent?: boolean | null;
}

export default function Header({ hasAgent = false }: HeaderProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues - only render conditional content after client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle mobile drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle notification menu
  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  // Handle profile menu
  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleDisconnect = () => {
    disconnect();
    handleProfileClose();
  };

  // Mobile drawer content
  const mobileDrawerContent = (
    <Box sx={{ width: 280, height: '100%', p: 0 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight={600}>
            AI Trading Assistant
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List sx={{ p: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
            <Link href={item.href} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
              <ListItemButton
                onClick={handleDrawerToggle}
                selected={pathname === item.href}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '20%',
                      height: '60%',
                      width: 3,
                      bgcolor: theme.palette.primary.main,
                      borderRadius: 4
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  color: pathname === item.href 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography 
                      variant="body1" 
                      sx={{
                        fontWeight: pathname === item.href ? 600 : 400,
                        color: pathname === item.href ? theme.palette.primary.main : 'inherit'
                      }}
                    >
                      {item.label}
                    </Typography>
                  }
                  secondary={item.description}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    color: 'text.secondary'
                  }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />
      
      {/* Wallet status (mobile) */}
      <Box sx={{ p: 2 }}>
        {mounted && isConnected ? (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Connected Wallet
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              p: 1.5, 
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1) 
            }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText
                }}
              >
                <AccountIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {hasAgent ? 'AI Agent Created' : 'No AI Agent'}
                </Typography>
              </Box>
            </Box>
            <Button 
              fullWidth 
              variant="outlined" 
              color="primary"
              onClick={handleDisconnect}
              sx={{ mt: 2 }}
            >
              Disconnect
            </Button>
          </Box>
        ) : (
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button 
                fullWidth 
                variant="contained" 
                color="primary"
                onClick={openConnectModal}
                startIcon={<AccountIcon />}
              >
                Connect Wallet
              </Button>
            )}
          </ConnectButton.Custom>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Top app bar */}
      <AppBar 
        position="fixed" 
        color="transparent" 
        elevation={0}
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backdropFilter: 'blur(8px)',
          bgcolor: alpha(theme.palette.background.default, 0.8),
          borderBottom: theme.customBorders?.light || `1px solid ${alpha(theme.palette.divider, 0.5)}`
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64 }, px: { xs: 2, sm: 3 } }}>
          {/* Mobile menu icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo and site name */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mr: { xs: 2, md: 4 }
          }}>
            <AutoAwesomeIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" noWrap component="div" fontWeight={600}>
              AI Trading Assistant
            </Typography>
          </Box>
          
          {/* Desktop navigation */}
          <Box 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              height: 64,
              flexGrow: 1,
            }}
          >
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.href} 
                style={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  position: 'relative' 
                }}
              >
                <Tooltip title={item.description} placement="bottom" arrow>
                  <Box sx={{ 
                    px: 2,
                    py: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: pathname === item.href ? 600 : 400,
                    fontSize: '1rem',
                    color: pathname === item.href 
                      ? theme.palette.primary.main 
                      : theme.palette.text.primary,
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                    '&:after': pathname === item.href ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '3px',
                      bgcolor: theme.palette.primary.main,
                      borderRadius: '3px 3px 0 0'
                    } : {}
                  }}>
                    {item.icon}
                    <Typography variant="body1" fontWeight="inherit" sx={{ ml: 0.5 }}>
                      {item.label}
                    </Typography>
                  </Box>
                </Tooltip>
              </Link>
            ))}
          </Box>

          {/* Notifications icon */}
          {mounted && isConnected && (
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit" 
                onClick={handleNotificationOpen}
                sx={{ ml: { xs: 1, sm: 2 } }}
              >
                <Badge badgeContent={3} color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          )}
          
          {/* Notifications menu */}
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: { 
                width: 320, 
                mt: 1.5, 
                boxShadow: theme.customShadows?.medium || '0 4px 16px rgba(0, 0, 0, 0.2)',
                border: theme.customBorders?.light || `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                borderRadius: 2
              }
            }}
          >
            <Box sx={{ p: 2, borderBottom: theme.customBorders?.light || `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
              <Typography variant="subtitle1" fontWeight={600}>Notifications</Typography>
            </Box>
            <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <AgentIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="AI Agent Created"
                secondary="Your AI trading assistant is ready"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </MenuItem>
            <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <ChartIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="New Market Analysis"
                secondary="Check the latest USDC market analysis"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </MenuItem>
            <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <WalletIcon color="warning" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Transaction Successful"
                secondary="Your transaction was completed"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </MenuItem>
            <Box sx={{ p: 1, borderTop: theme.customBorders?.light || `1px solid ${alpha(theme.palette.divider, 0.5)}`, textAlign: 'center' }}>
              <Typography variant="caption" color="primary">View All Notifications</Typography>
            </Box>
          </Menu>
          
          {/* Wallet status/profile */}
          {mounted && isConnected ? (
            <>
              <Box sx={{ ml: 2 }}>
                <Tooltip title="Account and Settings">
                  <IconButton 
                    onClick={handleProfileOpen}
                    sx={{ 
                      p: 0.5,
                      border: theme.customBorders?.light || `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: hasAgent 
                          ? alpha(theme.palette.primary.main, 0.9)
                          : alpha(theme.palette.text.secondary, 0.1)
                      }}
                    >
                      {hasAgent ? <AgentIcon fontSize="small" /> : <AccountIcon fontSize="small" />}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
              
              {/* Profile menu */}
              <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={handleProfileClose}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  sx: { 
                    width: 250, 
                    mt: 1.5, 
                    boxShadow: theme.customShadows?.medium || '0 4px 16px rgba(0, 0, 0, 0.2)',
                    border: theme.customBorders?.light || `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    borderRadius: 2
                  }
                }}
              >
                <Box sx={{ p: 2, borderBottom: theme.customBorders?.light || `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Wallet Address
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all', mt: 0.5 }}>
                    {address}
                  </Typography>
                </Box>
                <MenuItem onClick={handleProfileClose}>
                  <ListItemIcon>
                    <WalletIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="My Assets" />
                </MenuItem>
                <MenuItem onClick={handleProfileClose}>
                  <ListItemIcon>
                    <AgentIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="AI Settings" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDisconnect}>
                  <ListItemText primary="Disconnect" sx={{ color: theme.palette.error.main }} />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ ml: 2 }}>
              {/* Use RainbowKit's custom connect button */}
              <ConnectButton.Custom>
                {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted: rainbowMounted }) => {
                  return (
                    <div
                      {...(!rainbowMounted && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!mounted) return null;
                        if (!mounted || !isConnected) {
                          return (
                            <Button
                              onClick={openConnectModal}
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<WalletIcon />}
                              sx={{ 
                                px: 2,
                                py: 1,
                                borderRadius: 1.5,
                                boxShadow: theme.customShadows?.button || '0 4px 8px rgba(0, 0, 0, 0.25)'
                              }}
                            >
                              Connect Wallet
                            </Button>
                          );
                        }
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            bgcolor: theme.palette.background.default,
          },
        }}
      >
        {mobileDrawerContent}
      </Drawer>
    </>
  );
}