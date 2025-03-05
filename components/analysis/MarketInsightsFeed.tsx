// components/analysis/MarketInsightsFeed.tsx
import React, { useState } from 'react';
import {
  alpha, Box, Button, Card, CardContent, Chip, CircularProgress, 
  Divider, IconButton, Link, List, ListItem, ListItemText,
  Paper, Tooltip, Typography, useTheme
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { MarketInsight } from '../../models/MarketAnalysis';
import ReactMarkdown from 'react-markdown';

interface MarketInsightsFeedProps {
  insights: MarketInsight[];
  isLoading?: boolean;
  onRefresh?: () => void;
  lastUpdated?: string;
}

const MarketInsightsFeed: React.FC<MarketInsightsFeedProps> = ({ 
  insights, 
  isLoading = false,
  onRefresh,
  lastUpdated
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | null>(null);
  
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
  
  // Get icon for importance level
  const getImportanceIcon = (importance: 'low' | 'medium' | 'high') => {
    if (importance === 'high') {
      return <ErrorIcon color="error" fontSize="small" />;
    } else if (importance === 'medium') {
      return <TrendingUpIcon color="primary" fontSize="small" />;
    } else {
      return <InfoIcon color="action" fontSize="small" />;
    }
  };
  
  // Get background color for importance level
  const getImportanceBgColor = (importance: 'low' | 'medium' | 'high') => {
    if (importance === 'high') {
      return alpha(theme.palette.error.main, 0.05);
    } else if (importance === 'medium') {
      return alpha(theme.palette.primary.main, 0.05);
    } else {
      return alpha(theme.palette.grey[500], 0.05);
    }
  };
  
  return (
    <Card 
      elevation={0} 
      sx={{ 
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
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
          bgcolor: alpha(theme.palette.background.paper, 0.6)
        }}
      >
        <Typography fontWeight={600} variant="h6">
          Market Insights
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {lastUpdated && (
            <Typography color="text.secondary" sx={{ mr: 1 }} variant="caption">
              Updated: {formatTimeAgo(lastUpdated)}
            </Typography>
          )}
          
          <Tooltip title="Refresh insights">
            <IconButton 
              disabled={isLoading}
              onClick={onRefresh}
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
      
      {/* Insights Feed */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
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
          <List sx={{ p: 0 }}>
            {insights.map((insight) => (
              <React.Fragment key={insight._id}>
                <ListItem 
                  onClick={() => {
                    if (insight.url) {
                      window.open(insight.url, '_blank');
                    } else {
                      setExpanded(expanded === insight._id ? null : insight._id);
                    }
                  }}
                  sx={{ 
                    py: 2, 
                    px: 2, 
                    bgcolor: getImportanceBgColor(insight.importance),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08)
                    },
                    cursor: insight.url ? 'pointer' : 'default'
                  }}
                >
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Box sx={{ pr: 1.5, pt: 0.5 }}>
                      {getImportanceIcon(insight.importance)}
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ mb: 1 }}>
                        <ReactMarkdown>
                          {insight.content}
                        </ReactMarkdown>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          {insight.relatedTokens.map((token) => (
                            <Chip
                              key={token}
                              label={token}
                              size="small"
                              sx={{ 
                                mr: 0.5, 
                                height: 20, 
                                fontSize: '0.7rem',
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main
                              }}
                            />
                          ))}
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography color="text.secondary" variant="caption">
                            {formatTimeAgo(insight.publishedAt)}
                          </Typography>
                          
                          {insight.source && (
                            <Typography 
                              color="text.secondary" 
                              sx={{ ml: 1 }}
                              variant="caption"
                            >
                              • {insight.source}
                            </Typography>
                          )}
                          
                          {insight.url && (
                            <Tooltip title="View source">
                              <ArrowForwardIcon 
                                fontSize="inherit" 
                                sx={{ ml: 0.5, fontSize: '0.875rem', color: theme.palette.primary.main }} 
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
      
      {/* Footer */}
      <Box 
        sx={{ 
          p: 2, 
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button 
          size="small" 
          sx={{ textTransform: 'none', borderRadius: 2 }}
          variant="outlined"
        >
          View All Updates
        </Button>
      </Box>
    </Card>
  );
};

export default MarketInsightsFeed;