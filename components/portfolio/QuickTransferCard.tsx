// components/portfolio/QuickTransferCard.tsx
import React, { useState } from 'react';
import {
  alpha, Box, Button, Card, CardContent, Chip, 
  CircularProgress, Divider, FormControl, 
  Grid, IconButton, InputAdornment, InputLabel, 
  MenuItem, Paper, Radio, Select, SelectChangeEvent, 
  TextField, Tooltip, Typography, useTheme
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  ContentCopy as CopyIcon,
  Info as InfoIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';

// Available tokens will be passed from the parent component
interface TokenInfo {
  symbol: string;
  name: string;
  balance: number;
  value: number;
}

interface MultisigWallet {
  name: string;
  multisig_address: string;
}

interface QuickTransferCardProps {
  userWalletAddress: string;
  userWalletName?: string;
  totalBalance: number;
  availableTokens: TokenInfo[];
  relatedWallets: MultisigWallet[];
  onTransfer: (data: {
    token: string;
    amount: string;
    recipient: string;
  }) => void;
  isLoadingWallets?: boolean;
}

const QuickTransferCard: React.FC<QuickTransferCardProps> = ({
  userWalletAddress,
  userWalletName = 'My Wallet',
  totalBalance,
  availableTokens,
  relatedWallets,
  onTransfer,
  isLoadingWallets = false
}) => {
  const theme = useTheme();
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Get the selected token's balance
  const selectedTokenData = availableTokens.find(token => token.symbol === selectedToken);
  const maxTransferAmount = selectedTokenData?.balance || 0;

  // Format wallet addresses for display
  const formatAddress = (address: string): string => {
    if (!address || address.length < 8) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Copy address to clipboard
  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // Handle recipient selection
  const handleRecipientChange = (walletAddress: string) => {
    setSelectedRecipient(walletAddress);
  };

  // Handle token selection
  const handleTokenChange = (event: SelectChangeEvent) => {
    setSelectedToken(event.target.value);
    setTransferAmount(''); // Reset transfer amount
  };

  // Set maximum transfer amount
  const handleSetMaxAmount = () => {
    if (selectedTokenData) {
      setTransferAmount(selectedTokenData.balance.toString());
    }
  };

  // Execute transfer
  const handleTransfer = () => {
    if (!selectedRecipient || !selectedToken || !transferAmount) {
      return;
    }

    setLoading(true);
    
    // Call transfer function
    onTransfer({
      token: selectedToken,
      amount: transferAmount,
      recipient: selectedRecipient
    });

    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      // Reset form
      setTransferAmount('');
    }, 1500);
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.customShadows?.light,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Grid container>
          {/* Left side - Sender wallet */}
          <Grid 
            item 
            md={4} 
            sm={5} 
            sx={{ 
              p: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              borderRight: { xs: 'none', sm: `1px solid ${theme.palette.divider}` },
              borderBottom: { xs: `1px solid ${theme.palette.divider}`, sm: 'none' }
            }} 
            xs={12}
          >
            <Box sx={{ mb: 3 }}>
              <Typography color="text.secondary" gutterBottom variant="subtitle2">
                From
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5
                  }}
                >
                  <WalletIcon color="primary" />
                </Box>
                <Box>
                  <Typography fontWeight={600} variant="subtitle1">
                    {userWalletName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography color="text.secondary" variant="caption">
                      {formatAddress(userWalletAddress)}
                    </Typography>
                    <Tooltip title={copiedAddress ? "Copied!" : "Copy Address"}>
                      <IconButton 
                        color={copiedAddress ? "success" : "default"} 
                        onClick={() => copyAddress(userWalletAddress)}
                        size="small"
                      >
                        {copiedAddress ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  mt: 2,
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.background.paper, 0.6),
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Typography color="text.secondary" variant="caption">
                  Total Balance
                </Typography>
                <Typography fontWeight={600} sx={{ mt: 0.5 }} variant="h5">
                  ${totalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Typography>
              </Box>
            </Box>

            {/* Token selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="token-select-label">Select Token</InputLabel>
              <Select
                id="token-select"
                label="Select Token"
                labelId="token-select-label"
                onChange={handleTokenChange}
                value={selectedToken}
              >
                {availableTokens.map((token) => (
                  <MenuItem key={token.symbol} value={token.symbol}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Typography>{token.symbol}</Typography>
                      <Typography color="text.secondary" variant="caption">
                        Balance: {token.balance}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Transfer amount */}
            <TextField
              InputProps={{
                endAdornment: selectedToken ? (
                  <InputAdornment position="end">
                    <Button 
                      onClick={handleSetMaxAmount} 
                      size="small" 
                      sx={{ fontSize: '0.75rem', minWidth: 'auto' }}
                    >
                      MAX
                    </Button>
                    <Box component="span" sx={{ ml: 0.5 }}>
                      {selectedToken}
                    </Box>
                  </InputAdornment>
                ) : null,
              }}
              disabled={!selectedToken}
              fullWidth
              label="Amount"
              onChange={(e) => setTransferAmount(e.target.value)}
              sx={{ mb: 2 }}
              value={transferAmount}
            />

            {selectedToken && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography color="text.secondary" variant="caption">
                  Available: {selectedTokenData?.balance} {selectedToken}
                </Typography>
                {selectedTokenData && transferAmount && !isNaN(parseFloat(transferAmount)) && (
                  <Typography color="text.secondary" variant="caption">
                    ≈ ${(selectedTokenData.value / selectedTokenData.balance * parseFloat(transferAmount)).toFixed(2)}
                  </Typography>
                )}
              </Box>
            )}
          </Grid>

          {/* Middle arrow - only displayed on tablet and desktop */}
          <Grid
            item
            md={1}
            sm={2}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <ArrowForwardIcon color="primary" />
            </Box>
          </Grid>

          {/* Right side - Recipient wallet selection */}
          <Grid item md={7} sm={5} sx={{ p: 3 }} xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography color="text.secondary" gutterBottom variant="subtitle2">
                To
              </Typography>
              
              {/* Loading state for wallets */}
              {isLoadingWallets ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : relatedWallets.length === 0 ? (
                <Box
                  sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    bgcolor: alpha(theme.palette.warning.main, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                  }}
                >
                  <Typography color="text.secondary" variant="body2">
                    No related wallets found. You need to create or connect to a multi-signature wallet first.
                  </Typography>
                </Box>
              ) : (
                /* Recipient wallet selection */
                <Box sx={{ maxHeight: 240, overflow: 'auto' }}>
                  {relatedWallets.map((wallet) => (
                    <Box
                      key={wallet.multisig_address}
                      onClick={() => handleRecipientChange(wallet.multisig_address)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        mb: 1,
                        borderRadius: 2,
                        border: `1px solid ${
                          selectedRecipient === wallet.multisig_address
                            ? theme.palette.primary.main
                            : theme.palette.divider
                        }`,
                        bgcolor: selectedRecipient === wallet.multisig_address
                          ? alpha(theme.palette.primary.main, 0.05)
                          : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.03),
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                        }
                      }}
                    >
                      <Radio
                        checked={selectedRecipient === wallet.multisig_address}
                        name="recipient-radio-buttons"
                        onChange={() => handleRecipientChange(wallet.multisig_address)}
                        sx={{ p: 0.5, mr: 1 }}
                        value={wallet.multisig_address}
                      />
                      <Box>
                        <Typography fontWeight={600} variant="subtitle2">
                          {wallet.name}
                        </Typography>
                        <Typography color="text.secondary" variant="caption">
                          {formatAddress(wallet.multisig_address)}
                        </Typography>
                      </Box>
                      <Chip
                        label="Multi-Sig"
                        size="small"
                        sx={{
                          ml: 'auto',
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main,
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Transfer button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <Button
                  color="primary"
                  disabled={!selectedRecipient || !selectedToken || !transferAmount || loading || relatedWallets.length === 0 || isLoadingWallets}
                  onClick={handleTransfer}
                  size="large"
                  startIcon={<ArrowForwardIcon />}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    minWidth: 120
                  }}
                  variant="contained"
                >
                  Transfer
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickTransferCard;