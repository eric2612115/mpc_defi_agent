// components/portfolio/WalletOverview.tsx
import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Chip, IconButton, 
  Button, Tooltip, alpha, useTheme
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Send as SendIcon,
  SwapHoriz as SwapIcon,
  Add as AddIcon,
  ArrowDropUp as ArrowUpIcon
} from '@mui/icons-material';

// 錢包類型定義
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
    <Card sx={{ 
      mb: 4,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.customShadows.light,
      borderRadius: 2,
      overflow: 'hidden',
    }}>
      <Box sx={{ 
        p: 3, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Wallet Overview
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </Typography>
              <Tooltip title={copiedAddress ? "Copied!" : "Copy Address"}>
                <IconButton 
                  size="small" 
                  onClick={() => copyAddress(wallet.address)}
                  color={copiedAddress ? "success" : "default"}
                >
                  {copiedAddress ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              ${wallet.totalValue.toLocaleString()}
            </Typography>
            <Chip 
              size="small" 
              icon={<ArrowUpIcon />} 
              label={`${wallet.change24h}% today`} 
              color="success"
              sx={{ fontWeight: 500 }}
            />
          </Box>
        </Box>
      </Box>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<SendIcon />}
            sx={{ borderRadius: 2, flexGrow: 1, maxWidth: 200 }}
          >
            Send
          </Button>
          <Button
            variant="outlined"
            startIcon={<SwapIcon />}
            sx={{ borderRadius: 2, flexGrow: 1, maxWidth: 200 }}
          >
            Swap
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onDeposit}
            sx={{ borderRadius: 2, flexGrow: 1, maxWidth: 200 }}
          >
            Deposit
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WalletOverview;