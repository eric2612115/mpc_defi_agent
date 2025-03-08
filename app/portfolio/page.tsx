// app/assets/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import {
  Alert, AlertTitle, alpha, Box, Button, CircularProgress, 
  IconButton, InputAdornment, Tab, Tabs, TextField, Typography, useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { useAccount } from 'wagmi';
import MainLayout from '@/components/layout/MainLayout';
import AssetTable from '@/components/portfolio/AssetTable';
import TransactionHistory from '@/components/portfolio/TransactionHistory';
import QuickTransferCard from '@/components/portfolio/QuickTransferCard';
import DepositDialog from '@/components/portfolio/DepositDialog';
import type { Asset } from '@/components/portfolio/AssetTable';
import type { Transaction } from '@/components/portfolio/TransactionHistory';
// import { OdosSwapWidget } from "odos-widgets";
// import {
//   defaultInputTokenMap,
//   defaultOutputTokenMap,
//   exampleRetroTheme,
//   tokenWhitelistMap,
// } from "@/app/odos/odos";
// import { wagmiConfig } from '../wagmi/wagmi';

// API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000';

// Multisig wallet interface
interface MultisigWallet {
  name: string;
  multisig_address: string;
}

export default function PortfolioPage() {
  const theme = useTheme();
  const { isConnected, address } = useAccount();
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState('value');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [successAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Wallet type
  const walletType = tabValue === 0 ? 'personal' : 'multisig';

  // Data states
  const [personalAssets, setPersonalAssets] = useState<Asset[]>([]);
  const [multisigAssets, setMultisigAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [relatedMultisigWallets, setRelatedMultisigWallets] = useState<MultisigWallet[]>([]);
  
  // Loading states
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingRelatedWallets, setLoadingRelatedWallets] = useState(false);

  
  // Current assets based on selected wallet type
  const currentAssets = walletType === 'personal' ? personalAssets : multisigAssets;

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch related multisig wallets when connected
  useEffect(() => {
    if (mounted && isConnected && address) {
      fetchRelatedMultisigWallets();
    }
  }, [mounted, isConnected, address]);

  // Fetch assets when wallet connected or tab changes
  useEffect(() => {
    if (mounted && isConnected && address) {
      if (walletType === 'personal') {
        fetchPersonalAssets();
      } else {
        fetchMultisigAssets();
      }
      fetchTransactions();
    }
  }, [mounted, isConnected, address, walletType]);

  // Fetch related multisig wallets
  const fetchRelatedMultisigWallets = async () => {
    if (!address) return;
    
    setLoadingRelatedWallets(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/get-wallets-related-multi-sig-wallets?wallet_address=${address}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setRelatedMultisigWallets(data);
      console.log("Retrieved multisig wallets:", data);
    } catch (error) {
      console.error('Error fetching related multisig wallets:', error);
      // Use mock data as fallback
      setRelatedMultisigWallets([
        { name: "Multi-Sig Wallet 1", multisig_address: "0x1234567890abcdef1234567890abcdef12345678" },
        { name: "Multi-Sig Wallet 2", multisig_address: "0xabcdef1234567890abcdef1234567890abcdef12" }
      ]);
    } finally {
      setLoadingRelatedWallets(false);
    }
  };

  // Fetch personal wallet assets
  const fetchPersonalAssets = async () => {
    if (!address) return;
    
    setLoadingAssets(true);
    
    try {
      // Use total-balance-detail API
      const response = await fetch(`${API_BASE_URL}/api/total-balance-detail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: address }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convert API data to Asset format
      const formattedAssets: Asset[] = data.map((item: any, index: number) => ({
        id: index.toString(),
        name: item.symbol, // Use symbol as name since API doesn't provide name
        symbol: item.symbol,
        balance: parseFloat(item.balance) || 0,
        price: parseFloat(item.tokenPrice) || 0,
        value: parseFloat(item.value) || 0,
        change24h: 0, // API doesn't provide 24h change, default to 0
        chain: item.chain,
        chainIndex: item.chainIndex,
        tokenAddress: item.tokenAddress,
        logoUrl: item.icon || undefined,
      }));
      
      setPersonalAssets(formattedAssets);
      
      // Calculate total balance
      const total = formattedAssets.reduce((sum, asset) => sum + asset.value, 0);
      if (walletType === 'personal') {
        setTotalBalance(total);
      }
    } catch (error) {
      console.error('Error fetching personal assets:', error);
      // Use mock data as fallback
      setPersonalAssets([
        { id: '1', name: 'Ethereum', symbol: 'ETH', balance: 2.5, price: 3500, value: 8750, change24h: 1.2, chain: 'Ethereum' },
        { id: '2', name: 'USD Coin', symbol: 'USDC', balance: 5000, price: 1, value: 5000, change24h: 0, chain: 'Ethereum' },
        { id: '3', name: 'ChainLink', symbol: 'LINK', balance: 100, price: 15, value: 1500, change24h: -0.5, chain: 'Ethereum' }
      ]);
      
      if (walletType === 'personal') {
        setTotalBalance(15250); // Mock total balance
      }
    } finally {
      setLoadingAssets(false);
    }
  };

  // Fetch multisig wallet assets
  const fetchMultisigAssets = async () => {
    if (!address || relatedMultisigWallets.length === 0) return;
    
    setLoadingAssets(true);
    
    try {
      // Use the first multisig wallet address
      // In a real app, you might want to let the user select which multisig wallet to use
      const multisigAddress = relatedMultisigWallets[0].multisig_address;
      
      // Use the same API endpoint with multisig address
      const response = await fetch(`${API_BASE_URL}/api/total-balance-detail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: multisigAddress }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convert API data to Asset format with random whitelist status (should come from API)
      const formattedAssets: Asset[] = data.map((item: any, index: number) => ({
        id: index.toString(),
        name: item.symbol,
        symbol: item.symbol,
        balance: parseFloat(item.balance) || 0,
        price: parseFloat(item.tokenPrice) || 0,
        value: parseFloat(item.value) || 0,
        change24h: 0,
        chain: item.chain,
        chainIndex: item.chainIndex,
        tokenAddress: item.tokenAddress,
        logoUrl: item.icon || undefined,
        // Simulate whitelist status - should come from API
        isWhitelisted: Math.random() > 0.3 // 70% chance of being whitelisted
      }));
      
      setMultisigAssets(formattedAssets);
      
      // Calculate total balance
      const total = formattedAssets.reduce((sum, asset) => sum + asset.value, 0);
      if (walletType === 'multisig') {
        setTotalBalance(total);
      }
    } catch (error) {
      console.error('Error fetching multisig assets:', error);
      // Use mock data as fallback
      setMultisigAssets([
        { id: '1', name: 'Ethereum', symbol: 'ETH', balance: 1.8, price: 3500, value: 6300, change24h: 1.2, chain: 'Ethereum', isWhitelisted: true },
        { id: '2', name: 'USD Coin', symbol: 'USDC', balance: 10000, price: 1, value: 10000, change24h: 0, chain: 'Ethereum', isWhitelisted: true },
        { id: '3', name: 'ChainLink', symbol: 'LINK', balance: 80, price: 15, value: 1200, change24h: -0.5, chain: 'Ethereum', isWhitelisted: false }
      ]);
      
      if (walletType === 'multisig') {
        setTotalBalance(17500); // Mock total balance
      }
    } finally {
      setLoadingAssets(false);
    }
  };

  // Fetch transaction history
  const fetchTransactions = async () => {
    if (!address) return;
    
    setLoadingTransactions(true);
    
    try {
      // Use wallet-transaction-history API
      const response = await fetch(`${API_BASE_URL}/api/wallet-transaction-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: address }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convert API data to Transaction format
      const formattedTransactions: Transaction[] = data.map((item: any) => {
        const type = item.type === 'Send' ? 'Send' : 
          item.type === 'Receive' ? 'Receive' : 'Swap';
        
        return {
          hash: item.txHash,
          type: type as 'Send' | 'Receive' | 'Swap',
          from: type === 'Receive' ? 'External' : 'Personal Wallet',
          to: type === 'Send' ? 'External' : 'Personal Wallet',
          amount: item.amount,
          value: item.value || item.amount,
          timestamp: item.time,
          status: item.status.toLowerCase() as 'pending' | 'completed' | 'failed',
          chain: item.chain,
          details: item.details
        };
      });
      
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Use mock data as fallback
      setTransactions([
        {
          hash: '0x1234...5678',
          type: 'Swap',
          from: 'ETH',
          to: 'USDC',
          amount: '1.5 ETH',
          value: '$5,250.00',
          timestamp: '2025-03-05 14:30',
          status: 'completed',
          chain: 'Ethereum'
        },
        {
          hash: '0xabcd...ef01',
          type: 'Send',
          from: 'Personal Wallet',
          to: 'Multi-Sig Wallet',
          amount: '1000 USDC',
          value: '$1,000.00',
          timestamp: '2025-03-04 09:15',
          status: 'completed',
          chain: 'Ethereum'
        }
      ]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Refresh all data
  const handleRefresh = () => {
    setRefreshing(true);
    
    Promise.all([
      walletType === 'personal' ? fetchPersonalAssets() : fetchMultisigAssets(),
      fetchTransactions()
    ]).finally(() => {
      setRefreshing(false);
      setSuccessMessage('Assets refreshed successfully');
      setSuccessAlert(true);
      setTimeout(() => setSuccessAlert(false), 3000);
    });
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSearch(''); // Clear search
    setSortColumn('value'); // Reset sort to default
    setSortDirection('desc'); // Reset sort direction to default
  };

  // Open deposit dialog
  const handleDepositOpen = (asset?: Asset) => {
    setSelectedAsset(asset || null);
    setDepositOpen(true);
  };

  // Close deposit dialog
  const handleDepositClose = () => {
    setSelectedAsset(null);
    setDepositOpen(false);
  };

  // Handle deposit submit
  const handleDepositSubmit = (token: string, amount: string) => {
    console.log('Depositing', amount, token);
    handleDepositClose();
    
    // Simulate API call
    setSuccessMessage(`Successfully deposited ${amount} ${token}`);
    setSuccessAlert(true);
    setTimeout(() => setSuccessAlert(false), 3000);
    
    // Refresh assets
    setTimeout(() => {
      if (walletType === 'personal') {
        fetchPersonalAssets();
      } else {
        fetchMultisigAssets();
      }
    }, 1000);
  };
  
  // Update your existing handlePersonalDeposit function
  const handlePersonalDeposit = (asset: Asset) => {
    console.log('Deposit to personal wallet:', asset);
    setSelectedAsset(asset);
    setDepositOpen(true);
  };

  // Add this before the return statement
  const availableTokensForTransfer = currentAssets.map(asset => ({
    symbol: asset.symbol,
    name: asset.name,
    balance: asset.balance,
    value: asset.value
  }));

  const tokenBalancesMap = currentAssets.reduce((acc, asset) => {
    acc[asset.symbol] = asset.balance;
    return acc;
  }, {} as {[key: string]: number});
  
  // Handle withdraw action on asset
  const handleMultisigWithdraw = (asset: Asset) => {
    console.log('Withdraw from multisig wallet:', asset);
    
    // Simulate API call
    if (asset.isWhitelisted) {
      // Direct withdrawal
      setSuccessMessage(`Withdrawing ${asset.balance} ${asset.symbol} from Multi-Signature wallet`);
    } else {
      // Additional approval required
      setSuccessMessage(`Withdrawal request submitted for ${asset.balance} ${asset.symbol}. Additional approval required for non-whitelisted assets.`);
    }
    
    setSuccessAlert(true);
    setTimeout(() => setSuccessAlert(false), 5000);
  };

  // Handle transfer between wallets
  const handleTransfer = (data: { token: string; amount: string; recipient: string }) => {
    console.log('Transferring', data.amount, data.token, 'to', data.recipient);
    
    // Simulate API call
    setSuccessMessage(`Successfully transferred ${data.amount} ${data.token} to ${data.recipient.substring(0, 6)}...${data.recipient.substring(data.recipient.length - 4)}`);
    setSuccessAlert(true);
    setTimeout(() => setSuccessAlert(false), 3000);
    
    // Refresh assets after transfer
    setTimeout(() => {
      fetchPersonalAssets();
      fetchMultisigAssets();
    }, 1000);
  };

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc'); // Default to descending
    }
  };

  // Filter and sort assets
  const filterAndSortAssets = (assets: Asset[]) => {
    // First filter
    const filtered = assets.filter(
      asset => 
        asset.name.toLowerCase().includes(search.toLowerCase()) || 
        asset.symbol.toLowerCase().includes(search.toLowerCase())
    );
    
    // Then sort
    return [...filtered].sort((a, b) => {
      const aValue = a[sortColumn as keyof Asset];
      const bValue = b[sortColumn as keyof Asset];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      const aNum = Number(aValue) || 0;
      const bNum = Number(bValue) || 0;
      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    });
  };

  const filteredAssets = filterAndSortAssets(currentAssets);

  // Show nothing when not mounted (to prevent hydration issues)
  if (!mounted) {
    return null;
  }

  return (
    <MainLayout>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography component="h1" gutterBottom variant="h4">
            Portfolio
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Manage your assets, transfers, and transactions across all your wallets
          </Typography>
        </Box>

        {!isConnected ? (
          <Box
            sx={{ 
              textAlign: 'center', 
              py: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette.background.paper, 0.4),
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Box
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                mb: 2
              }}
            >
              <WalletIcon fontSize="large" />
            </Box>
            <Typography gutterBottom variant="h6">
              Please connect your wallet to view your assets
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 500, mb: 3 }} variant="body2">
              Connect your wallet to manage your assets, view your portfolio, and execute trades using the AI Trading Assistant.
            </Typography>
          </Box>
        ) : (
          <>
            {/* Success alert */}
            {successAlert && (
              <Alert 
                onClose={() => setSuccessAlert(false)} 
                severity="success"
                sx={{ mb: 3 }}
              >
                <AlertTitle>Success</AlertTitle>
                {successMessage}
              </Alert>
            )}
            
            {/* Quick transfer card */}
            <QuickTransferCard
              availableTokens={availableTokensForTransfer}  // Updated prop
              isLoadingWallets={loadingRelatedWallets}
              onTransfer={handleTransfer}
              relatedWallets={relatedMultisigWallets}
              totalBalance={totalBalance}
              userWalletAddress={address || ''}
              userWalletName={walletType === 'personal' ? 'My Personal Wallet' : 'My Multi-Signature Wallet'}
            />

            {/* Wallet type tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                TabIndicatorProps={{
                  style: {
                    backgroundColor: theme.palette.primary.main,
                    height: 3
                  }
                }} 
                onChange={handleTabChange}
                value={tabValue}
              >
                <Tab 
                  label="Personal Wallet" 
                  sx={{ 
                    fontWeight: tabValue === 0 ? 600 : 400,
                    color: tabValue === 0 ? theme.palette.primary.main : theme.palette.text.primary
                  }}
                />
                <Tab 
                  label="Multi-Signature Wallet" 
                  sx={{ 
                    fontWeight: tabValue === 1 ? 600 : 400,
                    color: tabValue === 1 ? theme.palette.primary.main : theme.palette.text.primary
                  }}
                />
              </Tabs>
            </Box>

            {/* Search and action buttons */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mb: 3,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2
              }}
            >
              <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets..."
                size="small"
                sx={{ 
                  flexGrow: 1, 
                  maxWidth: { xs: '100%', sm: 300 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
                value={search}
                variant="outlined"
              />
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  disabled={refreshing || loadingAssets || loadingTransactions}
                  onClick={handleRefresh}
                  size="small"
                  sx={{ 
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    p: 1
                  }}
                >
                  {refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                </IconButton>
                
                <Button 
                  startIcon={<FilterListIcon />} 
                  sx={{ borderRadius: 2 }}
                  variant="outlined"
                >
                  Filter
                </Button>
                
                <Button 
                  color="primary" 
                  onClick={() => handleDepositOpen()}
                  startIcon={<AddIcon />}
                  sx={{ borderRadius: 2 }}
                  variant="contained"
                >
                  Deposit
                </Button>
              </Box>
            </Box>

            {/* Asset table */}
            {loadingAssets ? (
              <Box sx={{ mb: 4, p: 3, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <AssetTable 
                assets={filteredAssets} 
                onDeposit={handlePersonalDeposit} 
                onSort={handleSort} 
                onWithdraw={handleMultisigWithdraw}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                walletType={walletType}
              />
            )}

            {/* Transaction history */}
            {loadingTransactions ? (
              <Box sx={{ mb: 4, p: 3, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <TransactionHistory transactions={transactions} />
            )}

            {/* Deposit dialog */}
            <DepositDialog 
              onClose={handleDepositClose} 
              onSubmit={handleDepositSubmit} 
              open={depositOpen} 
              preSelectedAmount={selectedAsset?.balance.toString()}
              preSelectedToken={selectedAsset?.symbol}
              tokenBalances={tokenBalancesMap}
              walletType={walletType}
            />
          </>
        )}
      </Box>
    </MainLayout>
  );
}