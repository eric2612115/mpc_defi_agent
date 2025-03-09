// components/portfolio/DepositDialog.tsx
import React, { useEffect, useState } from 'react';
import {
  alpha,
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, IconButton, InputAdornment,
  InputLabel, MenuItem, Select, SelectChangeEvent,
  TextField, Typography, useTheme
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

// Available tokens list
const availableTokens = [
  { value: 'ETH', label: 'Ethereum (ETH)' },
  { value: 'USDC', label: 'USD Coin (USDC)' },
  { value: 'LINK', label: 'Chainlink (LINK)' },
  { value: 'UNI', label: 'Uniswap (UNI)' },
  { value: 'AAVE', label: 'Aave (AAVE)' }
];

interface DepositDialogProps {
  open: boolean;
  walletType: 'personal' | 'multisig';
  preSelectedToken?: string;
  preSelectedAmount?: string;  // Add support for prefilled amount
  tokenBalances?: {[key: string]: number}; // Map of token symbols to balances
  selectedWalletName?: string; // Name of the selected multi-signature wallet
  onClose: () => void;
  onSubmit: (token: string, amount: string) => void;
}

const DepositDialog: React.FC<DepositDialogProps> = ({ 
  open, 
  walletType,
  preSelectedToken,
  preSelectedAmount,
  tokenBalances = {},
  selectedWalletName,
  onClose, 
  onSubmit 
}) => {
  const theme = useTheme();
  const [selectedToken, setSelectedToken] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Set pre-selected token and amount if provided
  useEffect(() => {
    if (open) {
      if (preSelectedToken) {
        setSelectedToken(preSelectedToken);
      }
      
      if (preSelectedAmount) {
        setDepositAmount(preSelectedAmount);
      } else if (preSelectedToken && tokenBalances[preSelectedToken]) {
        // If token is preselected but no amount, use max balance
        setDepositAmount(tokenBalances[preSelectedToken].toString());
      }
    }
  }, [preSelectedToken, preSelectedAmount, tokenBalances, open]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      // Only reset if dialog is closed
      setSelectedToken('');
      setDepositAmount('');
    }
  }, [open]);

  // Check if form is valid
  useEffect(() => {
    const amountIsValid = depositAmount.trim() !== '' && 
                          !isNaN(Number(depositAmount)) && 
                          Number(depositAmount) > 0;
    setIsValid(selectedToken !== '' && amountIsValid);
  }, [selectedToken, depositAmount]);

  const handleTokenChange = (event: SelectChangeEvent) => {
    setSelectedToken(event.target.value);
  };

  const handleClose = () => {
    setSelectedToken('');
    setDepositAmount('');
    onClose();
  };

  const handleSubmit = () => {
    if (isValid) {
      onSubmit(selectedToken, depositAmount);
      setSelectedToken('');
      setDepositAmount('');
    }
  };

  return (
    <Dialog 
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.customShadows?.medium
        }
      }} 
      fullWidth 
      maxWidth="xs" 
      onClose={handleClose}
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography component="div" variant="h6">
          {walletType === 'personal' 
            ? 'Deposit to Personal Wallet' 
            : selectedWalletName 
              ? `Deposit to ${selectedWalletName}` 
              : 'Deposit to Multi-Signature Wallet'
          }
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {preSelectedToken ? (
            // If token is preselected, show readonly display
            <Box
              sx={{ 
                p: 2, 
                mb: 3, 
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.background.paper, 0.6)
              }}
            >
              <Typography color="text.secondary" variant="caption">
                Token
              </Typography>
              <Typography fontWeight={500} variant="subtitle1">
                {preSelectedToken}
              </Typography>
            </Box>
          ) : (
            // Otherwise show dropdown
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="token-select-label">Select Token</InputLabel>
              <Select
                label="Select Token"
                labelId="token-select-label"
                onChange={handleTokenChange}
                value={selectedToken}
              >
                {availableTokens.map((token) => (
                  <MenuItem key={token.value} value={token.value}>
                    {token.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          
          <TextField
            InputProps={{
              endAdornment: selectedToken || preSelectedToken ? (
                <InputAdornment position="end">
                  {/* Add max button */}
                  {!preSelectedAmount && (
                    <Button 
                      onClick={() => {
                        const token = preSelectedToken || selectedToken;
                        if (token && tokenBalances[token]) {
                          setDepositAmount(tokenBalances[token].toString());
                        }
                      }} 
                      size="small"
                      sx={{ mr: 1, fontSize: '0.75rem' }}
                    >
                      MAX
                    </Button>
                  )}
                  {preSelectedToken || selectedToken}
                </InputAdornment>
              ) : null,
            }}
            fullWidth
            label="Amount"
            onChange={(e) => setDepositAmount(e.target.value)}
            sx={{ mb: 2 }}
            type="number"
            value={depositAmount}
            variant="outlined"
          />
          
          <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
            {walletType === 'personal'
              ? 'Deposit your tokens to your personal wallet. The transaction will be processed on the blockchain.'
              : 'Deposit your tokens to the multi-signature wallet. The transaction will require additional approvals before execution.'}
          </Typography>

          {walletType === 'multisig' && (
            <Box
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.info.main, 0.05),
                borderRadius: 1,
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
              }}
            >
              <Typography color="text.secondary" variant="caption">
                <strong>Note:</strong> Funds deposited to a multi-signature wallet require multiple signatures to withdraw. Make sure you understand the wallet&apos;s security policy before proceeding.
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} sx={{ borderRadius: 2 }} variant="outlined">
          Cancel
        </Button>
        <Button 
          disabled={!isValid} 
          onClick={handleSubmit} 
          sx={{ borderRadius: 2 }}
          variant="contained"
        >
          Deposit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DepositDialog;