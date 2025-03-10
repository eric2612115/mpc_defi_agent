import React, { useEffect, useState } from 'react';
import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions, 
  DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, 
  InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Tooltip, Typography
} from '@mui/material';
import { 
  Launch as LaunchIcon 
} from '@mui/icons-material';
import { WalletService } from '../../lib/wallet/services/WalletService';
import { useAccount, useChainId } from 'wagmi';
import { useQueryAiInfo } from '../../hooks/useQueryAiInfo';
import { openExplorer } from '../../utils/explorerUtils';

interface CreateMultisigModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateMultisigModal: React.FC<CreateMultisigModalProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const { address } = useAccount();
  const currentChainId = useChainId();
  const [walletName, setWalletName] = useState('');
  const [threshold, setThreshold] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch AI address for the current user
  const { 
    data: aiInfo, 
    isLoading: isLoadingAi, 
    refetch: refetchAiInfo,
    error: aiError 
  } = useQueryAiInfo({
    ownerAddress: address || '',
    enabled: open && Boolean(address)
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setWalletName('');
      setThreshold('1');
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!aiInfo?.aiAddress) {
      if(address) {
        WalletService.walletControllerCreateAi({
          requestBody: {
            ownerAddress: address,
          }
        }).then((result) => {
          refetchAiInfo();
          console.log("AI address created:", result);
        }).catch((err) => {
          console.error("Error creating AI address:", err);
        });
      }
    }
  }, [address, aiInfo, refetchAiInfo]);

  const handleThresholdChange = (event: SelectChangeEvent) => {
    setThreshold(event.target.value);
  };

  const validateForm = (): boolean => {
    // if (!walletName.trim()) {
    //   setError('Wallet name is required');
    //   return false;
    // }

    if (!address) {
      setError('Your wallet address is not available');
      return false;
    }

    if (!aiInfo?.aiAddress) {
      setError('AI address is not available. Please try again later.');
      return false;
    }

    return true;
  };

  const handleCreateWallet = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Create owners array with user address and AI address
      const owners = [address as string];
      
      if (aiInfo?.aiAddress) {
        owners.push(aiInfo.aiAddress);
      }

      await WalletService.walletControllerCreateWallet({
        requestBody: {
          chain: currentChainId?.toString() || '1',
          ownerAddress: address as string,
        }
      });

      // Success
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to create multi-sig wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to create wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" onClose={loading ? undefined : onClose} open={open}>
      <DialogTitle>Create New Multi-signature Wallet</DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Wallet Name */}
          {/* <TextField
            disabled={loading || isLoadingAi}
            fullWidth
            label="Wallet Name"
            margin="normal"
            onChange={(e) => setWalletName(e.target.value)}
            value={walletName}
          /> */}

          {/* Owners Information */}
          <Typography sx={{ mt: 2, mb: 1 }} variant="subtitle2">
            Owner Addresses
          </Typography>
          
          {/* User Address */}
          <Box sx={{ mb: 2 }}>
            <TextField
              InputProps={{
                readOnly: true,
                sx: {
                  bgcolor: 'background.paper',
                  '& .MuiInputBase-input.Mui-disabled': {
                    color: 'text.primary',
                    WebkitTextFillColor: 'unset',
                    opacity: 0.8
                  }
                },
                endAdornment: address && (
                  <Tooltip title="View on Explorer">
                    <IconButton 
                      edge="end" 
                      onClick={() => openExplorer(address, currentChainId)}
                      size="small"
                      sx={{ color: 'primary.main' }}
                    >
                      <LaunchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )
              }}
              disabled={true}
              fullWidth
              label="Your Address"
              value={address || ''}
            />
            <Typography color="text.secondary" variant="caption">
              Your wallet address (automatically included)
            </Typography>
          </Box>
          
          {/* AI Address */}
          <Box sx={{ mb: 2 }}>
            <TextField
              InputProps={{
                readOnly: true,
                sx: {
                  bgcolor: 'background.paper',
                  '& .MuiInputBase-input.Mui-disabled': {
                    color: 'text.primary',
                    WebkitTextFillColor: 'unset',
                    opacity: 0.8
                  }
                },
                endAdornment: isLoadingAi ? (
                  <CircularProgress size={20} />
                ) : aiInfo?.aiAddress ? (
                  <Tooltip title="View on Explorer">
                    <IconButton 
                      edge="end" 
                      onClick={() => openExplorer(aiInfo.aiAddress, currentChainId)}
                      size="small"
                      sx={{ color: 'primary.main' }}
                    >
                      <LaunchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : null
              }}
              disabled={true}
              fullWidth
              label="AI Assistant Address"
              value={isLoadingAi ? 'Loading...' : aiInfo?.aiAddress || 'Not available'}
            />
            <Typography color="text.secondary" variant="caption">
              AI assistant address (automatically included)
            </Typography>
          </Box>

          {aiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load AI address. Please try again later.
            </Alert>
          )}

          {/* Error message */}
          {error && (
            <Typography color="error" sx={{ mt: 2 }} variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button disabled={loading || isLoadingAi} onClick={onClose}>
          Cancel
        </Button>
        <Button 
          disabled={loading || isLoadingAi || !aiInfo?.aiAddress} 
          onClick={handleCreateWallet} 
          sx={{ position: 'relative' }}
          variant="contained"
        >
          Create Wallet
          {(loading || isLoadingAi) && (
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
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateMultisigModal; 