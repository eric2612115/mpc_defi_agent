// app/portfolio/page.tsx
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

// 模擬數據
const eoa_assets: Asset[] = [
  { id: '1', name: 'Ethereum', symbol: 'ETH', balance: 2.5, price: 3500, value: 8750, change24h: 1.2, logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id: '2', name: 'USD Coin', symbol: 'USDC', balance: 5000, price: 1, value: 5000, change24h: 0, logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
  { id: '3', name: 'ChainLink', symbol: 'LINK', balance: 100, price: 15, value: 1500, change24h: -0.5, logoUrl: 'https://cryptologos.cc/logos/chainlink-link-logo.png' },
  { id: '4', name: 'Uniswap', symbol: 'UNI', balance: 50, price: 8, value: 400, change24h: 2.3, logoUrl: 'https://cryptologos.cc/logos/uniswap-uni-logo.png' },
  { id: '5', name: 'Aave', symbol: 'AAVE', balance: 10, price: 90, value: 900, change24h: 1.8, logoUrl: 'https://cryptologos.cc/logos/aave-aave-logo.png' },
];

const multisig_assets: Asset[] = [
  { id: '1', name: 'Ethereum', symbol: 'ETH', balance: 1.2, price: 3500, value: 4200, change24h: 1.2, logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id: '2', name: 'USD Coin', symbol: 'USDC', balance: 2500, price: 1, value: 2500, change24h: 0, logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
  { id: '3', name: 'ChainLink', symbol: 'LINK', balance: 50, price: 15, value: 750, change24h: -0.5, logoUrl: 'https://cryptologos.cc/logos/chainlink-link-logo.png' },
];

const wallets: Record<string, Wallet> = {
  personal: {
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    totalValue: 16550,
    change24h: 1.2
  },
  multisig: {
    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    totalValue: 7450,
    change24h: 0.8
  }
};

const transactionHistory: Transaction[] = [
  { hash: '0x1234...5678', type: 'Swap', from: 'ETH', to: 'USDC', amount: '0.5 ETH', value: '$1,750', timestamp: '2025-03-05 09:23', status: 'completed' },
  { hash: '0xabcd...efgh', type: 'Receive', from: 'External', to: 'Personal Wallet', amount: '100 LINK', value: '$1,500', timestamp: '2025-03-04 18:42', status: 'completed' },
  { hash: '0x8765...4321', type: 'Send', from: 'Personal Wallet', to: '0x4321...8765', amount: '500 USDC', value: '$500', timestamp: '2025-03-03 12:15', status: 'completed' },
  { hash: '0xijkl...mnop', type: 'Swap', from: 'USDC', to: 'ETH', amount: '1000 USDC', value: '$1,000', timestamp: '2025-03-02 10:37', status: 'completed' },
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

  // 修復水合問題
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // 模擬刷新
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
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
    // 顯示成功消息
    setSuccessAlert(true);
    setTimeout(() => setSuccessAlert(false), 5000);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc'); // 默認降序
    }
  };

  // 基於搜索和排序過濾資產
  const filterAndSortAssets = (assets: Asset[]) => {
    // 先過濾
    const filtered = assets.filter(
      asset => 
        asset.name.toLowerCase().includes(search.toLowerCase()) || 
        asset.symbol.toLowerCase().includes(search.toLowerCase())
    );
    
    // 排序 (按照指定的列和方向)
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

  const currentAssets = tabValue === 0 ? eoa_assets : multisig_assets;
  const filteredAssets = filterAndSortAssets(currentAssets);
  const currentWallet = tabValue === 0 ? wallets.personal : wallets.multisig;

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
            {/* 成功提示 */}
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
            
            {/* 錢包概覽 */}
            <WalletOverview onDeposit={handleDepositOpen} wallet={currentWallet} />

            {/* 標籤頁 */}
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

            {/* 搜索和操作按鈕 */}
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
                  disabled={refreshing}
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

            {/* 資產表格 */}
            <AssetTable 
              assets={filteredAssets} 
              onSort={handleSort} 
              sortColumn={sortColumn} 
              sortDirection={sortDirection} 
            />

            {/* 交易歷史 */}
            <TransactionHistory transactions={transactionHistory} />

            {/* 存款對話框 */}
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