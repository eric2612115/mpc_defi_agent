// components/portfolio/DepositDialog.tsx
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Button, TextField, Select,
  MenuItem, FormControl, InputLabel, IconButton,
  InputAdornment, SelectChangeEvent
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

// 可選擇的代幣列表
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
  onClose: () => void;
  onSubmit: (token: string, amount: string) => void;
}

const DepositDialog: React.FC<DepositDialogProps> = ({ 
  open, 
  walletType,
  onClose, 
  onSubmit 
}) => {
  const [selectedToken, setSelectedToken] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  const handleTokenChange = (event: SelectChangeEvent) => {
    setSelectedToken(event.target.value);
  };

  const handleClose = () => {
    setSelectedToken('');
    setDepositAmount('');
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(selectedToken, depositAmount);
    setSelectedToken('');
    setDepositAmount('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Deposit Tokens
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="token-select-label">Select Token</InputLabel>
            <Select
              labelId="token-select-label"
              value={selectedToken}
              label="Select Token"
              onChange={handleTokenChange}
            >
              {availableTokens.map((token) => (
                <MenuItem key={token.value} value={token.value}>
                  {token.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Amount"
            variant="outlined"
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: selectedToken ? (
                <InputAdornment position="end">{selectedToken}</InputAdornment>
              ) : null,
            }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Deposit your tokens to the {walletType} wallet. The transaction will be processed on the blockchain.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!selectedToken || !depositAmount}
          sx={{ borderRadius: 2 }}
        >
          Deposit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DepositDialog;