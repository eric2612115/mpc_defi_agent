// components/common/ConnectWalletPrompt.tsx
'use client';
import React from 'react';
import { Box, Typography, Paper, Button, alpha, useTheme } from '@mui/material';
import { AccountBalanceWallet as WalletIcon, Security as SecurityIcon, SmartToy as SmartToyIcon } from '@mui/icons-material';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function ConnectWalletPrompt() {
  const theme = useTheme();

  const features = [
    {
      icon: <SmartToyIcon fontSize="large" />,
      title: 'AI Trading Assistant',
      description: 'Get personalized investment advice and let the AI handle portfolio management',
    },
    {
      icon: <SecurityIcon fontSize="large" />,
      title: 'Secure MPC Technology',
      description: 'Your assets stay protected with multi-party computation security',
    },
    {
      icon: <WalletIcon fontSize="large" />,
      title: 'Portfolio Management',
      description: 'Full control over your assets with comprehensive portfolio tracking',
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        p: { xs: 2, sm: 4 },
        textAlign: 'center',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          maxWidth: 800,
          width: '100%',
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(
            theme.palette.background.default,
            0.8
          )} 100%)`,
          backdropFilter: 'blur(10px)',
          boxShadow: theme.customShadows.card,
        }}
      >
        <Typography 
          fontWeight={600} 
          gutterBottom 
          sx={{ 
            color: theme.palette.primary.main,
            mb: 1
          }}
          variant="h4"
        >
          Welcome to AI Trading Assistant
        </Typography>
        <Typography gutterBottom sx={{ mb: 4, color: alpha(theme.palette.text.primary, 0.8) }} variant="subtitle1">
          Connect your wallet to start managing your portfolio with advanced AI assistance
        </Typography>

        <Box sx={{ mb: 4 }}>
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button
                onClick={openConnectModal}
                size="large"
                startIcon={<WalletIcon />}
                sx={{
                  minWidth: 220,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: 2,
                  boxShadow: theme.customShadows.button,
                }}
                variant="contained"
              >
                Connect Wallet
              </Button>
            )}
          </ConnectButton.Custom>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            mt: 5,
            mb: 2,
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.background.paper, 0.7),
                  transform: 'translateY(-5px)',
                  boxShadow: theme.customShadows.medium,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2,
                  '& .MuiSvgIcon-root': {
                    color: theme.palette.primary.main,
                    fontSize: '2.5rem',
                  },
                }}
              >
                {feature.icon}
              </Box>
              <Typography fontWeight={600} gutterBottom variant="h6">
                {feature.title}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}