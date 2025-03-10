// components/portfolio/QuickTransferCard.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  alpha, Box, Button, Card, CardContent, Chip, 
  CircularProgress, Divider, FormControl, 
  Grid, IconButton, InputAdornment, InputLabel, 
  MenuItem, Paper, Radio, Select, SelectChangeEvent, 
  TextField, Tooltip, Typography, useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  ContentCopy as CopyIcon,
  Info as InfoIcon,
  Launch as LaunchIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { useChainId, useConfig, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import CreateMultisigModal from './CreateMultisigModal';
import { openExplorer } from '../../utils/explorerUtils';
import { AssetService } from '@/lib/wallet';

// ERC20 ABI (minimal for transfer)
const erc20Abi = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function'
  }
];

// Available tokens will be passed from the parent component
interface TokenInfo {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  tokenAddress?: string;  // Token contract address
  decimals?: number;      // Token decimals (defaults to 18 if not provided)
  chain: string;
  chainId: number;
}

interface MultisigWallet {
  name: string;
  multisig_address: string;
  chain: string;
  chainId: number;
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
  onCreateMultisig?: () => void;
  isLoadingWallets?: boolean;
}

const QuickTransferCard: React.FC<QuickTransferCardProps> = ({
  userWalletAddress,
  userWalletName = 'My Wallet',
  totalBalance,
  availableTokens,
  relatedWallets,
  onTransfer,
  onCreateMultisig,
  isLoadingWallets = false
}) => {
  const theme = useTheme();
  const currentChainId = useChainId();
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState(currentChainId ? currentChainId.toString() : '');
  const { chains } = useConfig();
  const { switchChain } = useSwitchChain();
  
  // Add state for the modal
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    setSelectedToken(currentChainId.toString());
  }, [currentChainId]);

  // Update selectedNetwork when currentChainId changes
  // React.useEffect(() => {
  //   if (currentChainId) {
  //     setSelectedNetwork(currentChainId.toString());
      
  //     // Filter tokens for the current chain
  //     const tokensForCurrentChain = availableTokens.filter(
  //       token => token.chainId === currentChainId
  //     );
      
  //     // Reset token selection if the current token isn't available on this chain
  //     if (selectedToken && !tokensForCurrentChain.some(token => token.symbol === selectedToken)) {
  //       setSelectedToken('');
  //       setTransferAmount('');
  //     }
  //   }
  // }, [currentChainId, availableTokens, selectedToken]);

  // Get the selected token's data
  const selectedTokenData = availableTokens.find(token => token.symbol === selectedToken);
  const maxTransferAmount = selectedTokenData?.balance || 0;

  // Wagmi hooks for writing to contracts
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  
  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash,
      confirmations: 1,
    });
  

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
    setErrorMessage(null);
  };

  // Handle token selection
  const handleTokenChange = (event: SelectChangeEvent) => {
    const tokenAddress = event.target.value;
    setSelectedToken(tokenAddress);
    
    // Reset amount when token changes
    setTransferAmount('');
    setErrorMessage(null);
  };

  // Set maximum transfer amount
  const handleSetMaxAmount = () => {
    if (selectedToken) {
      const selectedTokenData = availableTokensOptions.find(token => token.tokenAddress === selectedToken);
      if (selectedTokenData) {
        setTransferAmount(selectedTokenData.balance.toString());
      }
    }
  };

  // Add this handler for network changes
  const handleNetworkChange = (event: SelectChangeEvent) => {
    const chainId = Number(event.target.value);
    handleSwitchChain(chainId);
  };

  const handleSwitchChain = (chainId: number) => {
    if (switchChain) {
      switchChain({ chainId });
    }
    setSelectedNetwork(chainId.toString());
    setSelectedToken(''); // Reset token selection when network changes
    setTransferAmount(''); // Reset amount when network changes
    setErrorMessage(null);
  };

  // Execute transfer
  const handleTransfer = async () => {
    // Find the selected token data
    const selectedTokenData = availableTokensOptions.find(token => token.tokenAddress === selectedToken);
    
    if (!selectedTokenData) {
      setErrorMessage('Please select a token');
      return;
    }

    if (!selectedRecipient || !selectedToken || !transferAmount) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    // Clear any previous errors
    setErrorMessage(null);
    setLoading(true);

    try {
      // Get token decimals (default to 18 if not specified)
          
      // Parse amount with proper decimals
      const assetInfo = await AssetService.assetControllerGetAssetsList({
        chainId: selectedNetwork,
      })
      const targetAsset = assetInfo.data.find(asset => asset.address.toLowerCase() === selectedTokenData.tokenAddress?.toLowerCase());
      if (!targetAsset) {
        throw new Error('Token info not found');
      }
      const decimals = targetAsset.token.decimals;

      const amount = parseUnits(transferAmount, decimals);

      // Execute the ERC20 transfer
      await writeContractAsync({
        address: selectedTokenData.tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [selectedRecipient as `0x${string}`, amount]
      });

      // Call parent's transfer function (for UI updates)
      onTransfer({
        token: selectedTokenData.tokenAddress || '',
        amount: transferAmount,
        recipient: selectedRecipient
      });
    } catch (error) {
      console.error('Transfer error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to execute transfer');
      setLoading(false);
    }
  };

  // Reset form on success
  React.useEffect(() => {
    if (isConfirmed) {
      setLoading(false);
      setTransferAmount('');
    }
  }, [isConfirmed]);

  // Update loading state
  React.useEffect(() => {
    if (isPending || isConfirming) {
      setLoading(true);
    }
  }, [isPending, isConfirming]);
  
  const availableTokensOptions = React.useMemo(() => {
    if (!selectedNetwork) {
      return availableTokens;
    }
    return availableTokens.filter(token => token.tokenAddress && token.chainId.toString() === selectedNetwork);
  }, [availableTokens, selectedNetwork]);

  // Handle opening the create multisig modal
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  // Handle successful wallet creation
  const handleMultisigCreated = () => {
    // Call the parent's callback to refresh the wallet list
    if (onCreateMultisig) {
      onCreateMultisig();
    }
  };

  return (
    <>
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

              {/* Network selection */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="network-select-label">Select Network</InputLabel>
                <Select
                  id="network-select"
                  label="Select Network"
                  labelId="network-select-label"
                  onChange={handleNetworkChange}
                  value={selectedNetwork}
                >
                  {chains.map((chain) => (
                    
                    <MenuItem key={chain.id} value={chain.id.toString()}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box 
                          component="div"
                          sx={{ 
                            width: 20, 
                            height: 20,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
                            color: theme.palette.primary.main,
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }} 
                        >
                          {chain.name.charAt(0)}
                        </Box>
                        <Typography>{chain.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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
                  {availableTokensOptions
                    .map((token) => (
                      <MenuItem key={`${token.symbol}-${token.chainId}`} value={token.tokenAddress}>
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
                        {selectedToken ? availableTokensOptions.find(t => t.tokenAddress === selectedToken)?.symbol || '' : ''}
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

              {/* Error message */}
              {errorMessage && (
                <Box 
                  sx={{ 
                    mt: 1, 
                    p: 1, 
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main
                  }}
                >
                  <Typography variant="caption">
                    {errorMessage}
                  </Typography>
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
                    <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
                      No related wallets found. You need to create or connect to a multi-signature wallet first.
                    </Typography>
                    <Button
                      color="primary"
                      onClick={handleOpenCreateModal}
                      startIcon={<AddIcon />}
                      sx={{ borderRadius: 2 }}
                      variant="outlined"
                    >
                      New Multi-sig Wallet
                    </Button>
                  </Box>
                ) : (
                  /* Recipient wallet selection */
                  <Box sx={{ maxHeight: 240, overflow: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                      <Button
                        color="primary"
                        onClick={handleOpenCreateModal}
                        size="small"
                        startIcon={<AddIcon />}
                        sx={{ borderRadius: 2 }}
                        variant="outlined"
                      >
                        New Multi-sig Wallet
                      </Button>
                    </Box>
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
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography fontWeight={600} variant="subtitle2">
                            {wallet.name} 
                          </Typography>
                          <Typography color="text.secondary" variant="caption">
                            {wallet.chain} - {formatAddress(wallet.multisig_address)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Tooltip title="View on Explorer">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the parent onClick
                                openExplorer(wallet.multisig_address, wallet.chainId);
                              }}
                              size="small"
                              sx={{ mr: 1, color: 'primary.main' }}
                            >
                              <LaunchIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Chip
                            label="Multi-Sig"
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Transfer status information */}
              {isPending && (
                <Box 
                  sx={{ 
                    p: 1.5, 
                    mb: 2, 
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <CircularProgress color="info" size={16} sx={{ mr: 1 }} />
                  <Typography variant="caption">
                    Waiting for wallet confirmation...
                  </Typography>
                </Box>
              )}

              {isConfirming && hash && (
                <Box 
                  sx={{ 
                    p: 1.5, 
                    mb: 2, 
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main
                  }}
                >
                  <Typography sx={{ display: 'flex', alignItems: 'center' }} variant="caption">
                    <CircularProgress color="info" size={16} sx={{ mr: 1 }} />
                    Transaction submitted, waiting for confirmation
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Typography 
                      component="a" 
                      href={`https://etherscan.io/tx/${hash}`} 
                      sx={{ 
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                      target="_blank"
                      variant="caption"
                    >
                      View on Etherscan
                    </Typography>
                  </Box>
                </Box>
              )}

              {isConfirmed && (
                <Box 
                  sx={{ 
                    p: 1.5, 
                    mb: 2, 
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <CheckIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="caption">
                    Transfer completed successfully!
                  </Typography>
                </Box>
              )}

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

      {/* Add the CreateMultisigModal */}
      <CreateMultisigModal
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleMultisigCreated}
        open={createModalOpen}
      />
    </>
  );
};

export default QuickTransferCard;