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
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell align="center" colSpan={6}>
                  <Typography sx={{ py: 4 }} variant="body1">
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
                      <Typography color="text.secondary" variant="caption">
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
                      color={tx.status === 'completed' ? 'success' : tx.status === 'failed' ? 'error' : 'default'} 
                      label={tx.status}
                      size="small"
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