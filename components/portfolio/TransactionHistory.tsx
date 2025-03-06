// components/portfolio/TransactionHistory.tsx
import React, { useState } from 'react';
import {
  alpha, Box, Chip, IconButton, Link, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography,
  useTheme
} from '@mui/material';
import { 
  Launch as LaunchIcon
} from '@mui/icons-material';

// Transaction history type definition
export interface Transaction {
  hash: string;
  type: 'Swap' | 'Send' | 'Receive';
  from: string;
  to: string;
  amount: string;
  value: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed' | 'success';
  // Additional fields from API
  chain?: string;
  details?: string;
  chainIndex?: string; // Chain ID for determining explorer
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

// Map of blockchain explorers by chain
const BLOCKCHAIN_EXPLORERS: Record<string, string> = {
  // Mainnets
  '1': 'https://etherscan.io/tx/', // Ethereum
  '56': 'https://bscscan.com/tx/', // BNB Smart Chain
  '137': 'https://polygonscan.com/tx/', // Polygon
  '42161': 'https://arbiscan.io/tx/', // Arbitrum
  '10': 'https://optimistic.etherscan.io/tx/', // Optimism
  '8453': 'https://basescan.org/tx/', // Base
  '43114': 'https://snowtrace.io/tx/', // Avalanche
  '250': 'https://ftmscan.com/tx/', // Fantom
  '42220': 'https://celoscan.io/tx/', // Celo
  
  // Popular chains by name (fallback if chain ID not found)
  'Ethereum': 'https://etherscan.io/tx/',
  'BNB Smart Chain': 'https://bscscan.com/tx/',
  'Polygon': 'https://polygonscan.com/tx/',
  'Arbitrum': 'https://arbiscan.io/tx/',
  'Optimism': 'https://optimistic.etherscan.io/tx/',
  'Base': 'https://basescan.org/tx/',
  'Avalanche': 'https://snowtrace.io/tx/',
  'Fantom': 'https://ftmscan.com/tx/',
  'Celo': 'https://celoscan.io/tx/',
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const theme = useTheme();
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Handle pagination change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Helper to normalize status values
  const normalizeStatus = (status: string): 'pending' | 'completed' | 'failed' => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'success') return 'completed';
    if (statusLower === 'failed' || statusLower === 'error') return 'failed';
    if (statusLower === 'pending' || statusLower === 'processing') return 'pending';
    return 'completed'; // Default to completed
  };

  // Helper to shorten addresses
  const shortenAddress = (address: string): string => {
    if (!address || address.length < 8) return address;
    // Check if it's likely an address (has 0x prefix and is long enough)
    if (address.startsWith('0x') && address.length >= 10) {
      return `${address.substring(0, 5)}...${address.substring(address.length - 3)}`;
    }
    return address;
  };

  // Helper to get explorer URL
  const getExplorerUrl = (tx: Transaction): string | null => {
    if (!tx.hash) return null;
    
    // Try to find the explorer by chain ID first
    if (tx.chainIndex && BLOCKCHAIN_EXPLORERS[tx.chainIndex]) {
      return BLOCKCHAIN_EXPLORERS[tx.chainIndex] + tx.hash;
    }
    
    // If no chain ID or not found, try by chain name
    if (tx.chain && BLOCKCHAIN_EXPLORERS[tx.chain]) {
      return BLOCKCHAIN_EXPLORERS[tx.chain] + tx.hash;
    }
    
    // Default to Ethereum if no match
    return BLOCKCHAIN_EXPLORERS['1'] + tx.hash;
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography gutterBottom variant="h6">
        Recent Transactions
      </Typography>
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.background.default, 0.6) }}>
              <TableCell>Type</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Chain</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell align="center" colSpan={7}>
                  <Typography sx={{ py: 4 }} variant="body1">
                    No transactions found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              transactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((tx, index) => {
                  const explorerUrl = getExplorerUrl(tx);
                  
                  return (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Chip 
                          label={tx.type} 
                          size="small"
                          sx={{ 
                            bgcolor: 
                              tx.type === 'Swap' ? alpha(theme.palette.info.main, 0.1) : 
                                tx.type === 'Send' ? alpha(theme.palette.error.main, 0.1) : 
                                  alpha(theme.palette.success.main, 0.1),
                            color: 
                              tx.type === 'Swap' ? theme.palette.info.main : 
                                tx.type === 'Send' ? theme.palette.error.main : 
                                  theme.palette.success.main,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2">
                              {tx.details || (tx.type === 'Swap' ? 
                                `${shortenAddress(tx.from)} → ${shortenAddress(tx.to)}` : 
                                `${shortenAddress(tx.from)} → ${shortenAddress(tx.to)}`
                              )}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography color="text.secondary" variant="caption">
                                {shortenAddress(tx.hash)}
                              </Typography>
                              {explorerUrl && (
                                <Tooltip title="View on blockchain explorer">
                                  <IconButton
                                    component="a"
                                    href={explorerUrl}
                                    size="small"
                                    sx={{ ml: 0.5 }}
                                    target="_blank"
                                  >
                                    <LaunchIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {tx.chain && (
                          <Chip 
                            label={tx.chain} 
                            size="small"
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                              color: theme.palette.text.primary
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {tx.amount}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={500} variant="body2">
                          {tx.value}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {tx.timestamp}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          color={
                            normalizeStatus(tx.status) === 'completed' ? 
                              'success' : 
                              normalizeStatus(tx.status) === 'failed' ? 
                                'error' : 
                                'default'
                          } 
                          label={normalizeStatus(tx.status)}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={transactions.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Box>
  );
};

export default TransactionHistory;