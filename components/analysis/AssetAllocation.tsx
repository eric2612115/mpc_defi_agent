// components/analysis/AssetAllocation.tsx
import React from 'react';
import { Box, Typography, Avatar, alpha } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

export interface TokenAllocation {
  symbol: string;
  name: string;
  allocation: number;
  performance: number;
  value: number;
  color: string;
}

interface AssetAllocationProps {
  tokens: TokenAllocation[];
}

const AssetAllocation: React.FC<AssetAllocationProps> = ({ tokens }) => {
  return (
    <Box sx={{ mt: 2 }}>
      {tokens.map((token, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 24, 
                  height: 24, 
                  bgcolor: token.color,
                  fontSize: '0.75rem',
                  mr: 1
                }}
              >
                {token.symbol.substring(0, 1)}
              </Avatar>
              <Typography fontWeight={500} variant="body2">
                {token.name} ({token.symbol})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 1 }} variant="body2">
                ${token.value.toLocaleString()}
              </Typography>
              <Typography 
                color={token.performance > 0 ? 'success.main' : token.performance < 0 ? 'error.main' : 'text.secondary'} 
                sx={{ display: 'flex', alignItems: 'center' }}
                variant="caption"
              >
                {token.performance > 0 ? <TrendingUpIcon fontSize="inherit" sx={{ mr: 0.5 }} /> : 
                token.performance < 0 ? <TrendingDownIcon fontSize="inherit" sx={{ mr: 0.5 }} /> : null}
                {token.performance > 0 ? '+' : ''}{token.performance}%
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: '100%', height: 8, bgcolor: alpha(token.color, 0.2), borderRadius: 4 }}>
            <Box 
              sx={{ 
                height: '100%', 
                bgcolor: token.color, 
                borderRadius: 4,
                width: `${token.allocation}%`
              }} 
            />
          </Box>
          <Typography color="text.secondary" sx={{ display: 'block', mt: 0.5 }} variant="caption">
            {token.allocation}% of portfolio
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default AssetAllocation;