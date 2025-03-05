// components/portfolio/WalletOverview.tsx
import React, { useState } from 'react';
import {
  alpha, Box, Button, Card, CardContent, Chip, 
  IconButton, Tooltip, Typography, useTheme
} from '@mui/material';
import {
  ArrowDropUp as ArrowUpIcon,
  Check as CheckIcon,
  ContentCopy as CopyIcon,
  Send as SendIcon,
  SwapHoriz as SwapIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Wallet type definition
export interface Wallet {
  address: string;
  totalValue: number;
  change24h: number;
}

interface WalletOverviewProps {
  wallet: Wallet;
  onDeposit: () => void;
}

const WalletOverview: React.FC<WalletOverviewProps> = ({ wallet, onDeposit }) => {
  const theme = useTheme();
  const [copiedAddress, setCopiedAddress] = useState(false);

  const copyAddress = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <Card
      sx={{ 
        mb: 4,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.customShadows.light,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{ 
          p: 3, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography gutterBottom variant="h6">
              Wallet Overview
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 1 }} variant="body2">
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </Typography>
              <Tooltip title={copiedAddress ? "Copied!" : "Copy Address"}>
                <IconButton 
                  color={copiedAddress ? "success" : "default"} 
                  onClick={() => copyAddress(wallet.address)}
                  size="small"
                >
                  {copiedAddress ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ mb: 0.5 }} variant="h5">
              ${wallet.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Typography>
            {wallet.change24h !== 0 && (
              <Chip 
                color={wallet.change24h >= 0 ? "success" : "error"} 
                icon={wallet.change24h >= 0 ? <ArrowUpIcon /> : undefined} 
                label={`${wallet.change24h >= 0 ? '+' : ''}${wallet.change24h}% today`} 
                size="small"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>
        </Box>
      </Box>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
          <Button
            startIcon={<SendIcon />}
            sx={{ borderRadius: 2, flexGrow: 1, maxWidth: 200 }}
            variant="outlined"
          >
            Send
          </Button>
          <Button
            startIcon={<SwapIcon />}
            sx={{ borderRadius: 2, flexGrow: 1, maxWidth: 200 }}
            variant="outlined"
          >
            Swap
          </Button>
          <Button
            onClick={onDeposit}
            startIcon={<AddIcon />}
            sx={{ borderRadius: 2, flexGrow: 1, maxWidth: 200 }}
            variant="contained"
          >
            Deposit
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WalletOverview;