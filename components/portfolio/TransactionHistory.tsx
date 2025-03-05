// components/portfolio/TransactionHistory.tsx
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Chip, Box, alpha, useTheme
} from '@mui/material';

// 交易歷史類型定義
export interface Transaction {
  hash: string;
  type: 'Swap' | 'Send' | 'Receive';
  from: string;
  to: string;
  amount: string;
  value: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
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
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 4 }}>
                    No transactions found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx, index) => (
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
                    <Box>
                      <Typography variant="body2">
                        {tx.type === 'Swap' ? 
                          `${tx.from} → ${tx.to}` : 
                          `${tx.from} → ${tx.to}`
                        }
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {tx.hash}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {tx.amount}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={500}>
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
                      label={tx.status} 
                      size="small"
                      color={tx.status === 'completed' ? 'success' : tx.status === 'failed' ? 'error' : 'default'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionHistory;