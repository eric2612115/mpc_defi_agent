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
import WalletOverview from '@/components/portfolio/WalletOverview';
import DepositDialog from '@/components/portfolio/DepositDialog';
import type { Asset } from '@/components/portfolio/AssetTable';
import type { Transaction } from '@/components/portfolio/TransactionHistory';
import type { Wallet } from '@/components/portfolio/WalletOverview';

// API response types
interface AssetResponse {
  chain: string;
  chainIndex: string;
  symbol: string;
  balance: string;
  tokenPrice: string;
  value: string;
  tokenAddress: string;
  tokenType: string;
  isRiskToken: boolean;
  icon: string | null;
  transferAmount: string;
  availableAmount: string;
}

interface TransactionResponse {
  chain: string;
  chainIndex: string;
  txHash: string;
  type: string;
  details: string;
  amount: string;
  value: string;
  time: string;
  status: string;
  icon: string | null;
  tokenAddress: string;
  hitBlacklist: boolean;
  itype: string;
  tag: string;
}

interface BalanceResponse {
  code: string;
  msg: string;
  data: [{ totalValue: string }];
}

// For mock data when needed
const mockAssets: Asset[] = [
  { id: '1', name: 'Ethereum', symbol: 'ETH', balance: 2.5, price: 3500, value: 8750, change24h: 1.2, logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id: '2', name: 'USD Coin', symbol: 'USDC', balance: 5000, price: 1, value: 5000, change24h: 0, logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
  { id: '3', name: 'ChainLink', symbol: 'LINK', balance: 100, price: 15, value: 1500, change24h: -0.5, logoUrl: 'https://cryptologos.cc/logos/chainlink-link-logo.png' },
];

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

  // Data states
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletData, setWalletData] = useState<Wallet | null>(null);
  
  // Loading states
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(false);
  
  // Error states
  const [errorAssets, setErrorAssets] = useState<string | null>(null);
  const [errorTransactions, setErrorTransactions] = useState<string | null>(null);
  const [errorWallet, setErrorWallet] = useState<string | null>(null);

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch data when wallet is connected
  useEffect(() => {
    if (mounted && isConnected && address) {
      fetchAllData();
    }
  }, [mounted, isConnected, address, tabValue]);

  // Fetch all data from APIs
  const fetchAllData = async () => {
    fetchAssets();
    fetchTransactions();
    fetchWalletOverview();
  };

  // Fetch assets data using Next.js API route as proxy
  const fetchAssets = async () => {
    if (!address) return;
    
    setLoadingAssets(true);
    setErrorAssets(null);
    
    try {
      const response = await fetch('/api/total-balance-detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: address }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }
      
      const data = await response.json() as AssetResponse[];
      
      // Format the data to match the Asset interface
      const formattedAssets: Asset[] = data.map((item, index) => ({
        id: index.toString(),
        name: item.symbol, // Using symbol as name since the API doesn't provide a separate name
        symbol: item.symbol,
        balance: parseFloat(item.balance) || 0,
        price: parseFloat(item.tokenPrice) || 0,
        value: parseFloat(item.value) || 0,
        change24h: 0, // API doesn't provide 24h change, default to 0
        logoUrl: item.icon || undefined,
        chain: item.chain,
        tokenAddress: item.tokenAddress
      }));
      
      setAssets(formattedAssets);
    } catch (error) {
      console.error('Error fetching assets:', error);
      setErrorAssets('Failed to load assets. Please try again later.');
      
      // Use mock data in case of error for development
      setAssets(mockAssets);
    } finally {
      setLoadingAssets(false);
    }
  };

  // Fetch transaction history using Next.js API route as proxy
  const fetchTransactions = async () => {
    if (!address) return;
    
    setLoadingTransactions(true);
    setErrorTransactions(null);
    
    try {
      const response = await fetch('/api/wallet-transaction-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: address }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }
      
      const data = await response.json() as TransactionResponse[];
      
      // Format the data to match the Transaction interface
      const formattedTransactions: Transaction[] = data.map(item => {
        const parsedAmount = item.amount.split(' ');
        
        return {
          hash: item.txHash,
          type: item.type as 'Swap' | 'Send' | 'Receive',
          from: item.type === 'Receive' ? 'External' : 'Personal Wallet',
          to: item.type === 'Send' ? 'External' : 'Personal Wallet',
          amount: item.amount,
          value: item.value ? `$${item.value}` : `${parsedAmount[0]} ${parsedAmount[1] || ''}`,
          timestamp: item.time,
          status: item.status.toLowerCase() as 'pending' | 'completed' | 'failed' | 'success',
          chain: item.chain,
          details: item.details
        };
      });
      
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setErrorTransactions('Failed to load transaction history. Please try again later.');
      
      // Use empty array in case of error
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Fetch wallet overview data using Next.js API route as proxy
  const fetchWalletOverview = async () => {
    if (!address) return;
  
    setLoadingWallet(true);
    setErrorWallet(null);
  
    try {
      const response = await fetch('/api/total-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: address }),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }
    
      const data = await response.json();
    
      // More defensive parsing of the response
      let totalValue = 0;
    
      // Check the structure of the response data
      if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
      // Direct access to totalValue if available
        if (data.data[0] && typeof data.data[0].totalValue === 'string') {
          totalValue = parseFloat(data.data[0].totalValue);
        }
      } else if (data && typeof data.totalValue === 'string') {
      // Alternative structure
        totalValue = parseFloat(data.totalValue);
      } else if (data && typeof data.totalValue === 'number') {
      // Already a number
        totalValue = data.totalValue;
      } else {
        console.log("Unexpected response format:", data);
      }
    
      // Ensure totalValue is a valid number
      if (isNaN(totalValue)) {
        totalValue = 0;
      }
    
      // Format the wallet data
      const formattedWallet: Wallet = {
        address: address,
        totalValue: totalValue,
        change24h: 0, // API doesn't provide 24h change, default to 0
      };
    
      setWalletData(formattedWallet);
    } catch (error) {
      console.error('Error fetching wallet overview:', error);
      setErrorWallet('Failed to load wallet data. Please try again later.');
    
      // Use mock wallet data in case of error
      setWalletData({
        address: address,
        totalValue: 0,
        change24h: 0
      });
    } finally {
      setLoadingWallet(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Fetch fresh data
    fetchAllData().finally(() => {
      setRefreshing(false);
    });
  };

  const handleDepositOpen = () => {
    setDepositOpen(true);
  };

  const handleDepositClose = () => {
    setDepositOpen(false);
  };

  const handleDepositSubmit = (token: string, amount: string) => {
    console.log('Depositing', amount, token);
    handleDepositClose();
    // Show success message
    setSuccessAlert(true);
    setTimeout(() => setSuccessAlert(false), 5000);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc'); // Default to descending order
    }
  };

  // Filter and sort assets based on search and sort settings
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

  const filteredAssets = filterAndSortAssets(assets);

  // Show loading skeletons or empty state when not mounted
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
            Manage your assets across your personal wallet and multi-signature wallets.
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
                Your deposit request has been processed successfully
              </Alert>
            )}
            
            {/* Wallet overview */}
            {loadingWallet ? (
              <Box sx={{ mb: 4, p: 3, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : errorWallet ? (
              <Alert severity="error" sx={{ mb: 4 }}>
                {errorWallet}
              </Alert>
            ) : walletData ? (
              <WalletOverview onDeposit={handleDepositOpen} wallet={walletData} />
            ) : null}

            {/* Tabs */}
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
                  disabled={refreshing || loadingAssets || loadingTransactions || loadingWallet}
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
                  onClick={handleDepositOpen}
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
            ) : errorAssets ? (
              <Alert severity="error" sx={{ mb: 4 }}>
                {errorAssets}
              </Alert>
            ) : (
              <AssetTable 
                assets={filteredAssets} 
                onSort={handleSort} 
                sortColumn={sortColumn} 
                sortDirection={sortDirection} 
              />
            )}

            {/* Transaction history */}
            {loadingTransactions ? (
              <Box sx={{ mb: 4, p: 3, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : errorTransactions ? (
              <Alert severity="error" sx={{ mb: 4 }}>
                {errorTransactions}
              </Alert>
            ) : (
              <TransactionHistory transactions={transactions} />
            )}

            {/* Deposit dialog */}
            <DepositDialog 
              onClose={handleDepositClose} 
              onSubmit={handleDepositSubmit} 
              open={depositOpen} 
              walletType={tabValue === 0 ? 'personal' : 'multisig'} 
            />
          </>
        )}
      </Box>
    </MainLayout>
  );
}