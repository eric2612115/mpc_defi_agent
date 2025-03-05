// components/portfolio/DepositDialog.tsx
import React, { useState } from 'react';
import {
  Box, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, IconButton, InputAdornment,
  InputLabel, MenuItem, Select, SelectChangeEvent,
  TextField, Typography
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
    <Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open}>
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
          
          <TextField
            InputProps={{
              endAdornment: selectedToken ? (
                <InputAdornment position="end">{selectedToken}</InputAdornment>
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
            Deposit your tokens to the {walletType} wallet. The transaction will be processed on the blockchain.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} sx={{ borderRadius: 2 }} variant="outlined">
          Cancel
        </Button>
        <Button 
          disabled={!selectedToken || !depositAmount} 
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