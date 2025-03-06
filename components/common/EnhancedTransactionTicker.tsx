// components/common/EnhancedTransactionTicker.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  alpha,
  Box,
  Chip,
  IconButton,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import {
  ArrowDownward as ArrowDownIcon,
  ArrowUpward as ArrowUpIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  SwapHoriz as SwapIcon
} from '@mui/icons-material';

// Define the type for transaction notices
export interface TransactionNotice {
  id: string;
  type: 'buy' | 'sell' | 'swap';
  user: string;
  token: string;
  amount: string;
  value: string;
  timestamp: string;
}

interface EnhancedTransactionTickerProps {
  notices: TransactionNotice[];
  interval?: number;
  autoPlay?: boolean;
  position?: 'header' | 'standalone';
}

const EnhancedTransactionTicker: React.FC<EnhancedTransactionTickerProps> = ({
  notices,
  interval = 5000,
  autoPlay = true,
  position = 'standalone'
}) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Set up auto-rotation
  useEffect(() => {
    if (isPlaying && notices.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % notices.length);
      }, interval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, notices.length, interval]);

  // Format timestamp to a readable format
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      
      return date.toLocaleDateString();
    } catch (e) {
      return 'recent';
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Get current notice
  const currentNotice = notices[currentIndex] || null;
  
  if (!currentNotice || notices.length === 0) {
    return null;
  }

  // Get icon based on transaction type
  const getIcon = (type: 'buy' | 'sell' | 'swap') => {
    switch (type) {
    case 'buy':
      return <ArrowUpIcon fontSize="small" style={{ color: theme.palette.success.main }} />;
    case 'sell':
      return <ArrowDownIcon fontSize="small" style={{ color: theme.palette.error.main }} />;
    case 'swap':
      return <SwapIcon fontSize="small" style={{ color: theme.palette.info.main }} />;
    }
  };

  // Get color based on transaction type
  const getColor = (type: 'buy' | 'sell' | 'swap') => {
    switch (type) {
    case 'buy':
      return theme.palette.success.main;
    case 'sell':
      return theme.palette.error.main;
    case 'swap':
      return theme.palette.info.main;
    }
  };

  // Style for different positions
  const containerStyle = {
    ...(position === 'standalone' ? {
      padding: theme.spacing(1, 2),
      borderRadius: 3,
      boxShadow: theme.customShadows?.light,
      border: `1px solid ${theme.palette.divider}`,
      bgcolor: alpha(theme.palette.background.paper, 0.9),
      backdropFilter: 'blur(8px)',
      maxWidth: 500,
      width: '100%'
    } : {
      width: '100%',
      padding: 0
    })
  };

  return (
    <Paper
      elevation={0}
      sx={containerStyle}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {/* Action icon */}
          <Box 
            sx={{ 
              mr: 1.5,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              bgcolor: alpha(getColor(currentNotice.type), 0.1)
            }}
          >
            {getIcon(currentNotice.type)}
          </Box>
          
          {/* Transaction info */}
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography component="span" sx={{ fontWeight: 500 }} variant="body2">
                {currentNotice.user}
              </Typography>
              
              <Chip 
                label={currentNotice.type.toUpperCase()}
                size="small"
                sx={{ 
                  height: 20,
                  bgcolor: alpha(getColor(currentNotice.type), 0.1),
                  color: getColor(currentNotice.type),
                  fontWeight: 500,
                  fontSize: '0.7rem'
                }}
              />
              
              <Typography component="span" variant="body2">
                {currentNotice.amount} {currentNotice.token} • {currentNotice.value}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Time and play/pause button */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <Typography color="text.secondary" sx={{ mr: 1 }} variant="caption">
            {formatTime(currentNotice.timestamp)}
          </Typography>
          
          {notices.length > 1 && (
            <IconButton onClick={togglePlayPause} size="small">
              {isPlaying ? 
                <PauseIcon fontSize="small" /> : 
                <PlayIcon fontSize="small" />
              }
            </IconButton>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default EnhancedTransactionTicker;