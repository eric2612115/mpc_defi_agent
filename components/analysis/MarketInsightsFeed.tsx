// components/analysis/MarketInsightsFeed.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  alpha, Box, Button, Card, CardContent, Chip, CircularProgress, 
  Divider, IconButton, Paper, Tooltip, Typography, useTheme
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Launch as LaunchIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { MarketInsight } from '../../models/MarketAnalysis';

// Extended interface to include card_text
interface ExtendedMarketInsight extends MarketInsight {
  card_text?: string;
  excerpt?: string;
}

interface MarketInsightsFeedProps {
  insights: ExtendedMarketInsight[];
  isLoading?: boolean;
  onRefresh?: () => void;
  lastUpdated?: string;
  title?: string;
  showExternalLinks?: boolean;
  showExcerpt?: boolean;
  initialDisplayCount?: number;
  incrementCount?: number;
  maxDisplayCount?: number;
}

const MarketInsightsFeed: React.FC<MarketInsightsFeedProps> = ({ 
  insights, 
  isLoading = false,
  onRefresh,
  lastUpdated,
  title = "Market Insights",
  showExternalLinks = false,
  showExcerpt = true,
  initialDisplayCount = 5,
  incrementCount = 5,
  maxDisplayCount = 20
}) => {
  const theme = useTheme();
  const [refreshTime, setRefreshTime] = useState<Date>(new Date());
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Reset display count when insights change
  useEffect(() => {
    setDisplayCount(initialDisplayCount);
    setHasMore(insights.length > initialDisplayCount);
  }, [insights, initialDisplayCount]);
  
  // Format date/time to display how long ago
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };
  
  // Handle loading more insights
  const handleLoadMore = () => {
    const newDisplayCount = Math.min(displayCount + incrementCount, insights.length);
    setDisplayCount(newDisplayCount);
    setHasMore(newDisplayCount < insights.length && newDisplayCount < maxDisplayCount);
  };
  
  // Handle news item click
  const handleItemClick = (insight: ExtendedMarketInsight) => {
    if (insight.url && showExternalLinks) {
      window.open(insight.url, '_blank');
    }
  };
  
  return (
    <Card 
      elevation={2} 
      sx={{ 
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: alpha('#F2E6C7', 0.7),
        position: 'relative',
        height: '600px', // Fixed height
        width: '100%',
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.background.paper, 0.3)
        }}
      >
        <Typography fontWeight={600} variant="h6">
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography color="text.secondary" sx={{ mr: 1 }} variant="caption">
            Updated: {formatTimeAgo(refreshTime.toISOString())}
          </Typography>
          
          <Tooltip title="Refresh insights">
            <IconButton 
              disabled={isLoading}
              onClick={() => {
                if (onRefresh) {
                  onRefresh();
                }
                setRefreshTime(new Date());
                setDisplayCount(initialDisplayCount);
                setHasMore(insights.length > initialDisplayCount);
              }}
              size="small"
            >
              {isLoading ? 
                <CircularProgress size={20} /> : 
                <RefreshIcon fontSize="small" />
              }
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Insights Feed - With Fixed Height and Scrollbar */}
      <Box 
        ref={scrollContainerRef}
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          height: {xs: 'auto', md: '500px'}, // Fixed height for desktop
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(theme.palette.background.default, 0.4),
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(theme.palette.primary.main, 0.2),
            borderRadius: '10px',
            '&:hover': {
              background: alpha(theme.palette.primary.main, 0.4),
            },
          },
        }}
      >
        {isLoading && insights.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              p: 4, 
              flexGrow: 1
            }}
          >
            <CircularProgress />
          </Box>
        ) : insights.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              p: 4,
              flexGrow: 1
            }}
          >
            <Typography color="text.secondary">
              No insights available
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            {insights.slice(0, displayCount).map((insight) => (
              <Paper
                elevation={1}
                key={insight._id}
                onClick={() => handleItemClick(insight)}
                sx={{ 
                  mb: 2,
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: (insight.url && showExternalLinks) ? 'pointer' : 'default',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Box sx={{ pr: 1.5, pt: 0.5, color: theme.palette.secondary.main }}>
                      <TrendingUpIcon fontSize="small" />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      {/* Title */}
                      <Typography fontWeight={500} variant="body1">
                        {insight.content}
                      </Typography>
                      
                      {/* Card Text / Excerpt */}
                      {showExcerpt && (
                        <Typography 
                          color="text.secondary" 
                          sx={{ 
                            mt: 1, 
                            mb: 1.5,
                            fontSize: '0.85rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.5
                          }} 
                          variant="body2"
                        >
                          {insight.card_text || ''}
                        </Typography>
                      )}
                      
                      {/* Source, Time and Link */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography color="text.secondary" variant="caption">
                          just now
                        </Typography>
                        
                        {insight.source && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography 
                              color="text.secondary" 
                              sx={{ mx: 1 }}
                              variant="caption"
                            >
                              •
                            </Typography>
                            <Typography 
                              color="text.secondary" 
                              variant="caption"
                            >
                              {insight.source}
                            </Typography>
                          </Box>
                        )}
                        
                        {insight.url && showExternalLinks && (
                          <Box sx={{ ml: 1 }}>
                            <LaunchIcon 
                              fontSize="inherit" 
                              sx={{ fontSize: '0.875rem', color: theme.palette.primary.main }} 
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            ))}
            
            {/* "View More" button */}
            {hasMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 1 }}>
                <Button
                  color="primary"
                  disabled={isLoading}
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleLoadMore}
                  size="small"
                  sx={{ 
                    textTransform: 'none', 
                    borderRadius: 2,
                    boxShadow: theme.shadows[1]
                  }}
                  variant="contained"
                >
                  Load More
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default MarketInsightsFeed;