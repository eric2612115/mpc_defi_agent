// components/portfolio/AssetTable.tsx
import React, { useState } from 'react';
import {
  alpha, Avatar, Box, Button, Chip, IconButton, Pagination, 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Tooltip, Typography, useTheme
} from '@mui/material';
import { 
  Add as AddIcon, 
  ArrowDownward as ArrowDownwardIcon, 
  ArrowUpward as ArrowUpwardIcon,
  Launch as LaunchIcon,
  SwapHoriz as SwapIcon,
  Warning as WarningIcon,
  CallMade as WithdrawIcon
} from '@mui/icons-material';

// Asset type definition with extended properties
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  price: number;
  value: number;
  change24h: number;
  logoUrl?: string;
  // Additional fields
  chain?: string;
  chainIndex?: string;
  tokenAddress?: string;    // Token contract address needed for ERC20 transfers
  decimals?: number;        // Token decimals needed for ERC20 transfers (defaults to 18)
  isWhitelisted?: boolean;  // For multi-signature wallet assets
}

interface AssetTableProps {
  assets: Asset[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
  walletType?: 'personal' | 'multisig';
  onDeposit?: (asset: Asset) => void;
  onWithdraw?: (asset: Asset) => void;
  selectedWalletAddress?: string;
  selectedWalletName?: string;
}

// Map of blockchain explorers for token pages by chain
const TOKEN_EXPLORERS: Record<string, string> = {
  // Mainnets
  '1': 'https://etherscan.io/token/', // Ethereum
  '56': 'https://bscscan.com/token/', // BNB Smart Chain
  '137': 'https://polygonscan.com/token/', // Polygon
  '42161': 'https://arbiscan.io/token/', // Arbitrum
  '10': 'https://optimistic.etherscan.io/token/', // Optimism
  '8453': 'https://basescan.org/token/', // Base
  '43114': 'https://snowtrace.io/token/', // Avalanche
  '250': 'https://ftmscan.com/token/', // Fantom
  '42220': 'https://celoscan.io/token/', // Celo

  // Popular chains by name (fallback if chain ID not found)
  'Ethereum': 'https://etherscan.io/token/',
  'BNB Smart Chain': 'https://bscscan.com/token/',
  'Polygon': 'https://polygonscan.com/token/',
  'Arbitrum': 'https://arbiscan.io/token/',
  'Optimism': 'https://optimistic.etherscan.io/token/',
  'Base': 'https://basescan.org/token/',
  'Avalanche': 'https://snowtrace.io/token/',
  'Fantom': 'https://ftmscan.com/token/',
  'Celo': 'https://celoscan.io/token/',
};

const AssetTable: React.FC<AssetTableProps> = ({ 
  assets, 
  sortColumn, 
  sortDirection, 
  onSort, 
  walletType = 'personal',
  onDeposit,
  onWithdraw,
  selectedWalletAddress,
  selectedWalletName
}) => {
  const theme = useTheme();
  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // Fixed number of items per page
  
  // Calculate total pages
  const totalPages = Math.ceil(assets.length / itemsPerPage);

  // Handle pagination change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Get token explorer URL if tokenAddress is available
  const getTokenExplorerUrl = (asset: Asset): string | null => {
    if (!asset.tokenAddress) return null;
    
    // Try to find the explorer by chain ID first
    if (asset.chainIndex && TOKEN_EXPLORERS[asset.chainIndex]) {
      return TOKEN_EXPLORERS[asset.chainIndex] + asset.tokenAddress;
    }
    
    // If no chain ID or not found, try by chain name
    if (asset.chain && TOKEN_EXPLORERS[asset.chain]) {
      return TOKEN_EXPLORERS[asset.chain] + asset.tokenAddress;
    }
    
    // Default to Ethereum if no match
    return TOKEN_EXPLORERS['1'] + asset.tokenAddress;
  };

  // Calculate the current page's assets
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssets = assets.slice(startIndex, endIndex);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mb: 4, 
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography fontWeight={600} variant="h6">
          {walletType === 'personal' 
            ? 'Personal Wallet Assets' 
            : selectedWalletName 
              ? `${selectedWalletName} Assets` 
              : 'Multi-Signature Wallet Assets'
          }
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {walletType === 'personal' 
            ? 'Assets in your personal wallet' 
            : selectedWalletName 
              ? `Assets in ${selectedWalletName}` 
              : 'Assets in your multi-signature wallet'
          }
        </Typography>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.background.default, 0.6) }}>
              <TableCell>
                <Box 
                  onClick={() => onSort('name')}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer' 
                  }}
                >
                  Asset
                  {sortColumn === 'name' && (
                    sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Box 
                  onClick={() => onSort('chain')}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer' 
                  }}
                >
                  Chain
                  {sortColumn === 'chain' && (
                    sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                  )}
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box 
                  onClick={() => onSort('balance')}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end', 
                    cursor: 'pointer' 
                  }}
                >
                  Balance
                  {sortColumn === 'balance' && (
                    sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                  )}
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box 
                  onClick={() => onSort('price')}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end', 
                    cursor: 'pointer' 
                  }}
                >
                  Price
                  {sortColumn === 'price' && (
                    sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                  )}
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box 
                  onClick={() => onSort('value')}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end', 
                    cursor: 'pointer' 
                  }}
                >
                  Value
                  {sortColumn === 'value' && (
                    sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                  )}
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box 
                  onClick={() => onSort('change24h')}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end', 
                    cursor: 'pointer' 
                  }}
                >
                  24h Change
                  {sortColumn === 'change24h' && (
                    sortDirection === 'asc' ? 
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                  )}
                </Box>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell align="center" colSpan={7}>
                  <Typography sx={{ py: 4 }} variant="body1">
                    No assets found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              currentAssets.map((asset) => {
                const tokenExplorerUrl = getTokenExplorerUrl(asset);
                
                return (
                  <TableRow key={asset.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={asset.logoUrl}
                          sx={{ 
                            width: 40, 
                            height: 40,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            fontSize: '1rem',
                            mr: 2
                          }}
                        >
                          {!asset.logoUrl && asset.symbol.substring(0, 1)}
                        </Avatar>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography fontWeight={500} variant="body1">
                              {asset.name}
                            </Typography>
                            {tokenExplorerUrl && (
                              <Tooltip title="View token on blockchain explorer">
                                <IconButton
                                  component="a"
                                  href={tokenExplorerUrl}
                                  size="small"
                                  sx={{ ml: 0.5 }}
                                  target="_blank"
                                >
                                  <LaunchIcon fontSize="inherit" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {/* For multisig wallet: show whitelist status */}
                            {walletType === 'multisig' && (
                              <Tooltip 
                                title={asset.isWhitelisted 
                                  ? "Whitelisted token: can be withdrawn without additional approvals" 
                                  : "Non-whitelisted token: requires additional approvals to withdraw"}
                              >
                                <Box sx={{ display: 'inline-flex', ml: 0.5 }}>
                                  {asset.isWhitelisted ? (
                                    <Chip 
                                      label="Whitelisted" 
                                      size="small"
                                      sx={{ 
                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                        color: theme.palette.success.main,
                                        height: 20,
                                        fontSize: '0.7rem'
                                      }}
                                    />
                                  ) : (
                                    <WarningIcon 
                                      color="warning" 
                                      fontSize="small" 
                                      sx={{ fontSize: '1rem' }} 
                                    />
                                  )}
                                </Box>
                              </Tooltip>
                            )}
                          </Box>
                          <Typography color="text.secondary" variant="caption">
                            {asset.symbol}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {asset.chain && (
                        <Chip 
                          label={asset.chain} 
                          size="small"
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            color: theme.palette.text.primary
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={500} variant="body1">
                        {asset.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })} {asset.symbol}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1">
                        ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={500} variant="body1">
                        ${asset.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={`${asset.change24h > 0 ? '+' : ''}${asset.change24h}%`}
                        size="small"
                        sx={{ 
                          bgcolor: asset.change24h > 0 
                            ? alpha(theme.palette.success.main, 0.1)
                            : asset.change24h < 0 
                              ? alpha(theme.palette.error.main, 0.1)
                              : alpha(theme.palette.grey[200], 0.5),
                          color: asset.change24h > 0 
                            ? theme.palette.success.main
                            : asset.change24h < 0 
                              ? theme.palette.error.main
                              : theme.palette.text.primary,
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        {/* Different actions based on wallet type */}
                        {walletType === 'personal' ? (
                          // Personal wallet: Swap and Deposit buttons
                          <>
                            <Button 
                              color="primary" 
                              size="small"
                              startIcon={<SwapIcon />}
                              sx={{
                                borderRadius: 1.5,
                                borderColor: theme.palette.primary.main
                              }}
                              variant="outlined"
                            >
                              Swap
                            </Button>
                            {
                              walletType !== 'personal' && onDeposit
                               && (<Button 
                                 color="success" 
                                 onClick={() => onDeposit(asset)}
                                 size="small"
                                 startIcon={<AddIcon />}
                                 sx={{
                                   borderRadius: 1.5,
                                 }}
                                 variant="outlined"
                               >
                                 Deposit
                               </Button>
                               )
                            }
                          </>
                        ) : (
                        // Multi-signature wallet: Withdraw button
                          <>
                            <Button 
                              color="primary" 
                              size="small"
                              startIcon={<SwapIcon />}
                              sx={{
                                borderRadius: 1.5,
                                borderColor: theme.palette.primary.main
                              }}
                              variant="outlined"
                            >
                              Swap
                            </Button>
                            {onWithdraw && (
                              <Button 
                                color="warning" 
                                onClick={() => onWithdraw(asset)}
                                size="small"
                                startIcon={<WithdrawIcon />}
                                sx={{
                                  borderRadius: 1.5,
                                }}
                                variant="outlined"
                              >
                                Withdraw
                              </Button>
                            )}
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      {assets.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination 
            color="primary"
            count={totalPages}
            onChange={handlePageChange}
            page={page}
            shape="rounded"
            showFirstButton
            showLastButton
            size="medium"
          />
        </Box>
      )}
    </Paper>
  );
};

export default AssetTable;