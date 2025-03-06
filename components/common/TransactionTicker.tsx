// components/common/TransactionTicker.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  alpha,
  Box,
  Chip,
  IconButton,
  Slide,
  Typography,
  useTheme
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ShoppingCart as BuyIcon,
  Call as CallIcon,
  OpenInFull as ExpandIcon,
  CloseFullscreen as MinimizeIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  CurrencyExchange as SwapIcon
} from '@mui/icons-material';

// Transaction notice type
export interface TransactionNotice {
  id: string;
  type: 'buy' | 'sell' | 'swap';
  user: string;
  token: string;
  amount: string;
  value: string;
  timestamp: string;
}

interface TransactionTickerProps {
  notices: TransactionNotice[];
  autoPlay?: boolean;
  interval?: number;
}

const TransactionTicker: React.FC<TransactionTickerProps> = ({
  notices,
  autoPlay = true,
  interval = 5000,
}) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCurrent, setShowCurrent] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Manage auto-play when notifications change or play status changes
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isPlaying && notices.length > 0) {
      timeoutRef.current = setTimeout(() => {
        // Hide current
        setShowCurrent(false);
        
        // Wait for exit animation to complete then update index and show again
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % notices.length);
          setShowCurrent(true);
        }, 500); // Wait for exit animation to complete
      }, interval);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, isPlaying, notices, interval]);
  
  // If no notifications, display a placeholder
  if (notices.length === 0) {
    return null;
  }
  
  const currentNotice = notices[currentIndex];
  
  // Get icon based on transaction type
  const getIcon = (type: string) => {
    switch (type) {
    case 'buy':
      return <BuyIcon fontSize="small" />;
    case 'sell':
      return <CallIcon fontSize="small" />;
    case 'swap':
      return <SwapIcon fontSize="small" />;
    default:
      return <BuyIcon fontSize="small" />;
    }
  };
  
  // Get color based on transaction type
  const getColor = (type: string) => {
    switch (type) {
    case 'buy':
      return theme.palette.success.main;
    case 'sell':
      return theme.palette.error.main;
    case 'swap':
      return theme.palette.info.main;
    default:
      return theme.palette.primary.main;
    }
  };
  
  return (
    <Box
      sx={{
        maxWidth: isExpanded ? 'unset' : 400,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        bgcolor: alpha(theme.palette.background.paper, 0.7),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
        px: 1,
        backdropFilter: 'blur(8px)',
        boxShadow: theme.customShadows?.light,
        fontFamily: '"Source Sans Pro", "Roboto", "Arial", sans-serif',
      }}
    >
      <IconButton
        onClick={() => setIsPlaying(!isPlaying)}
        size="small"
        sx={{ mr: 1 }}
      >
        {isPlaying ? <PauseIcon fontSize="small" /> : <PlayIcon fontSize="small" />}
      </IconButton>
      
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Slide
          direction="left"
          in={showCurrent}
          mountOnEnter
          timeout={500}
          unmountOnExit
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Chip
              icon={getIcon(currentNotice.type)}
              label={currentNotice.type.toUpperCase()}
              size="small"
              sx={{
                mr: 1,
                bgcolor: alpha(getColor(currentNotice.type), 0.1),
                color: getColor(currentNotice.type),
                borderColor: alpha(getColor(currentNotice.type), 0.3),
                '& .MuiChip-label': { px: 1, fontFamily: '"Source Sans Pro", "Roboto", "Arial", sans-serif' },
                '& .MuiChip-icon': { ml: 0.5 },
              }}
              variant="outlined"
            />
            
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                animation: isExpanded ? 'none' : 'ticker 15s linear infinite',
                '@keyframes ticker': {
                  '0%': { transform: 'translateX(0)' },
                  '100%': { transform: 'translateX(-100%)' },
                },
                whiteSpace: 'nowrap',
                fontFamily: '"Source Sans Pro", "Roboto", "Arial", sans-serif',
              }}
              variant="body2"
            >
              <Box component="span" sx={{ fontWeight: 600 }}>
                {currentNotice.user}
              </Box>{' '}
              {currentNotice.type === 'buy' ? 'bought' : currentNotice.type === 'sell' ? 'sold' : 'swapped'}{' '}
              <Box component="span" sx={{ fontWeight: 600 }}>
                {currentNotice.amount} {currentNotice.token}
              </Box>{' '}
              for{' '}
              <Box component="span" sx={{ fontWeight: 600 }}>
                {currentNotice.value}
              </Box>{' '}
              <Box 
                component="span" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem',
                  ml: 1,
                  fontFamily: '"Source Sans Pro", "Roboto", "Arial", sans-serif',
                }}
              >
                {new Date(currentNotice.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Box>
            </Typography>
          </Box>
        </Slide>
      </Box>
      
      <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          onClick={() => setIsExpanded(!isExpanded)}
          size="small"
        >
          {isExpanded ? <MinimizeIcon fontSize="small" /> : <ExpandIcon fontSize="small" />}
        </IconButton>
        
        <IconButton
          onClick={() => {
            setShowCurrent(false);
            setTimeout(() => {
              setCurrentIndex((prevIndex) => (prevIndex + 1) % notices.length);
              setShowCurrent(true);
            }, 500);
          }}
          size="small"
        >
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TransactionTicker;