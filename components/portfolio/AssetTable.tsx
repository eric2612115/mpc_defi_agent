// components/portfolio/AssetTable.tsx
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Avatar, Chip, Button, Box, alpha, useTheme
} from '@mui/material';
import { 
  SwapHoriz as SwapIcon, 
  ArrowUpward as ArrowUpwardIcon, 
  ArrowDownward as ArrowDownwardIcon 
} from '@mui/icons-material';

// 資產類型定義
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  price: number;
  value: number;
  change24h: number;
  logoUrl?: string;
}

interface AssetTableProps {
  assets: Asset[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
}

const AssetTable: React.FC<AssetTableProps> = ({ 
  assets, 
  sortColumn, 
  sortDirection, 
  onSort 
}) => {
  const theme = useTheme();

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        mb: 4
      }}
    >
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
              <TableCell align="center" colSpan={6}>
                <Typography sx={{ py: 4 }} variant="body1">
                  No assets found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            assets.map((asset) => (
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
                      <Typography fontWeight={500} variant="body1">
                        {asset.name}
                      </Typography>
                      <Typography color="text.secondary" variant="caption">
                        {asset.symbol}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight={500} variant="body1">
                    {asset.balance.toLocaleString()} {asset.symbol}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1">
                    ${asset.price.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight={500} variant="body1">
                    ${asset.value.toLocaleString()}
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
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AssetTable;