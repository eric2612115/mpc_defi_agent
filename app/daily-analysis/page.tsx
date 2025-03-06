// app/daily-analysis/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import {
  alpha, Box, Button, Card, CircularProgress, Divider, Fab,
  Grid, IconButton, LinearProgress, Typography, useTheme 
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  InfoOutlined as InfoIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Refresh as RefreshIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import MainLayout from '@/components/layout/MainLayout';
import { useAccount } from 'wagmi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { MarketAnalysis, MarketInsight } from '@/models/MarketAnalysis';
import { fetchMarketAnalysis, fetchMarketInsights } from '@/mockData/marketAnalysis';

// 日期標籤數據
const datesData = [
  { date: '2025-03-05', label: 'Today' },
  { date: '2025-03-04', label: 'Yesterday' },
  { date: '2025-03-03', label: 'March 3' },
  { date: '2025-03-02', label: 'March 2' },
  { date: '2025-03-01', label: 'March 1' },
];

// News item component
const NewsItem = ({ item }: { item: MarketInsight }) => {
  const theme = useTheme();
  
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

  return (
    <Box 
      onClick={() => item.url && window.open(item.url, '_blank')}
      sx={{
        mb: 2,
        cursor: item.url ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: item.url ? 'translateY(-2px)' : 'none'
        }
      }}
    >
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Box
          sx={{ 
            pr: 1.5, 
            pt: 0.5, 
            color: item.importance === 'high' 
              ? 'error.main' 
              : item.importance === 'medium' 
                ? theme.palette.primary.main 
                : 'text.secondary'
          }}
        >
          <TrendingUpIcon fontSize="small" />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography sx={{ mb: 0.5, fontWeight: 500 }} variant="body1">
            {item.content}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Box>
              {item.relatedTokens.map((token) => (
                <Box 
                  component="span"
                  key={token}
                  sx={{ 
                    display: 'inline-block',
                    mr: 0.5,
                    px: 1,
                    py: 0.25,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 1,
                    fontSize: '0.7rem',
                    color: theme.palette.primary.main,
                    fontWeight: 500
                  }}
                >
                  {token}
                </Box>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography color="text.secondary" variant="caption">
                {formatTimeAgo(item.publishedAt)}
              </Typography>
              
              {item.source && (
                <Typography 
                  color="text.secondary" 
                  sx={{ ml: 1 }} 
                  variant="caption"
                >
                  • {item.source}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default function DailyAnalysisPage() {
  const theme = useTheme();
  const { isConnected } = useAccount();
  const [dateTab, setDateTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null);
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>(undefined);
  const [showFullContent, setShowFullContent] = useState(false);
  const [visibleNewsCount, setVisibleNewsCount] = useState(5);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // 修復水合問題
  useEffect(() => {
    setMounted(true);
  }, []);

  // 載入市場分析與見解
  useEffect(() => {
    if (mounted && isConnected) {
      loadMarketData(datesData[dateTab].date);
      loadMarketInsights();
    }
  }, [mounted, isConnected, dateTab]);
  
  // Add scroll event listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 處理日期選項卡變化
  const handleDateChange = (event: React.SyntheticEvent, newValue: number) => {
    setDateTab(newValue);
    setLoading(true);
  };

  // 載入市場分析數據
  const loadMarketData = async (date: string) => {
    setLoading(true);
    try {
      const data = await fetchMarketAnalysis(date);
      setMarketAnalysis(data);
    } catch (error) {
      console.error('Error loading market analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  // 載入市場見解
  const loadMarketInsights = async () => {
    setInsightsLoading(true);
    try {
      const response = await fetchMarketInsights(12); // 獲取前12條見解
      setMarketInsights(response.insights);
      setLastUpdated(response.lastUpdated);
    } catch (error) {
      console.error('Error loading market insights:', error);
    } finally {
      setInsightsLoading(false);
    }
  };

  // 重新整理市場見解
  const handleRefreshInsights = () => {
    loadMarketInsights();
    setVisibleNewsCount(5);
  };

  // Load more news with increment
  const loadMoreNews = () => {
    // Always increment by 3 articles at a time
    setVisibleNewsCount(prev => prev + 3);
  };
  
  // Back to top handler
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Get content preview
  const getContentPreview = () => {
    if (!marketAnalysis) return '';
    
    if (showFullContent) {
      return marketAnalysis.content;
    } else {
      // Get the first few paragraphs (approx. first 500 chars)
      return marketAnalysis.content.substring(0, 500) + 
        (marketAnalysis.content.length > 500 ? '...' : '');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <MainLayout>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography component="h1" gutterBottom variant="h4">
            Daily Market Analysis
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Expert insights and in-depth analysis of cryptocurrency market trends.
          </Typography>
        </Box>

        {!isConnected ? (
          <Box
            sx={{ 
              textAlign: 'center', 
              py: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette.background.paper, 0.4),
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <InfoIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
            <Typography gutterBottom variant="h6">
              Please connect your wallet to view market analysis
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 500 }} variant="body2">
              Connect your wallet to access AI-generated market analysis, real-time insights, and trading recommendations.
            </Typography>
          </Box>
        ) : (
          <>
            {/* 日期選項卡 */}
            <Box sx={{ mb: 3, overflowX: 'auto', whiteSpace: 'nowrap' }}>
              {datesData.map((date, index) => (
                <Button
                  key={date.date}
                  onClick={(e) => handleDateChange(e, index)}
                  sx={{
                    mr: 1,
                    borderRadius: 10,
                    px: 2,
                    py: 0.75,
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    backgroundColor: dateTab === index ? theme.palette.primary.main : 'transparent',
                    color: dateTab === index ? 'white' : theme.palette.text.primary,
                    borderColor: dateTab === index ? 'transparent' : theme.palette.divider,
                    '&:hover': {
                      backgroundColor: dateTab === index ? 
                        alpha(theme.palette.primary.main, 0.9) : 
                        alpha(theme.palette.primary.main, 0.05),
                    }
                  }}
                  variant={dateTab === index ? "contained" : "outlined"}
                >
                  {date.label}
                </Button>
              ))}
            </Box>

            {/* Content Layout */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', lg: 'row' },
                gap: 3
              }}
            >
              {/* Main Content Area */}
              <Box sx={{ width: { xs: '100%', lg: 'calc(100% - 340px)' } }}>
                {/* Loading State */}
                {loading ? (
                  <Box sx={{ width: '100%', mb: 3 }}>
                    <LinearProgress 
                      color="primary" 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                      }} 
                    />
                    <Typography 
                      color="text.secondary" 
                      sx={{ display: 'block', mt: 1, textAlign: 'center' }} 
                      variant="caption"
                    >
                      Loading market analysis...
                    </Typography>
                  </Box>
                ) : marketAnalysis ? (
                  <Card
                    elevation={0}
                    sx={{ 
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      overflow: 'hidden',
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                    }}
                  >
                    {/* Category filter buttons */}
                    <Box
                      sx={{ 
                        display: 'flex', 
                        gap: 1,
                        flexWrap: 'wrap',
                        p: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        bgcolor: alpha(theme.palette.background.default, 0.5)
                      }}
                    >
                      {marketAnalysis.tags.map((tag) => (
                        <Button
                          key={tag._id}
                          size="small"
                          sx={{ 
                            borderRadius: 10,
                            py: 0.5,
                            px: 1.5,
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            minWidth: 'auto',
                            borderColor: alpha(theme.palette.primary.main, 0.5),
                            color: theme.palette.primary.main,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              borderColor: theme.palette.primary.main
                            }
                          }}
                          variant="outlined"
                        >
                          {tag.name}
                        </Button>
                      ))}
                    </Box>

                    {/* Article Header */}
                    <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <Typography component="h1" fontWeight={600} gutterBottom variant="h5">
                        {marketAnalysis.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography color="text.secondary" variant="body2">
                          {new Date(marketAnalysis.publishedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })} | {marketAnalysis.author.name}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Article Content */}
                    <Box sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography fontWeight={600} gutterBottom variant="h6">
                        Executive Summary
                      </Typography>
                      
                      <Box 
                        className="article-content"
                        sx={{
                          '& img': {
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: 1,
                            my: 2
                          },
                          '& table': {
                            width: '100%',
                            borderCollapse: 'collapse',
                            my: 2
                          },
                          '& th, & td': {
                            border: `1px solid ${theme.palette.divider}`,
                            p: 1.5
                          },
                          '& th': {
                            bgcolor: alpha(theme.palette.background.default, 0.5),
                            fontWeight: 600
                          },
                          '& ul, & ol': {
                            pl: 3,
                            mb: 2
                          },
                          '& li': {
                            mb: 1
                          },
                          '& p': {
                            mb: 2
                          },
                          '& h2': {
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            mt: 3,
                            mb: 2,
                            pb: 1,
                            borderBottom: `1px solid ${theme.palette.divider}`
                          },
                          '& h3': {
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            mt: 2.5,
                            mb: 1.5
                          }
                        }}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {getContentPreview()}
                        </ReactMarkdown>
                      </Box>
                      
                      {/* Featured Tokens */}
                      {marketAnalysis.featuredTokens && marketAnalysis.featuredTokens.length > 0 && (
                        <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                          <Typography gutterBottom variant="subtitle2">
                            Featured Tokens
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {marketAnalysis.featuredTokens.map((token) => (
                              <Box 
                                key={token.symbol}
                                sx={{ 
                                  display: 'flex',
                                  alignItems: 'center',
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 1,
                                  bgcolor: token.highlighted ? 
                                    alpha(theme.palette.primary.main, 0.15) : 
                                    alpha(theme.palette.background.paper, 0.5),
                                  border: token.highlighted ? 
                                    `1px solid ${alpha(theme.palette.primary.main, 0.3)}` : 
                                    `1px solid ${theme.palette.divider}`,
                                  fontSize: '0.75rem'
                                }}
                              >
                                <Typography fontWeight={500} variant="caption">
                                  {token.symbol}
                                </Typography>
                                <Box 
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    ml: 0.5,
                                    color: token.priceChange24h > 0 ? 'success.main' : 'error.main'
                                  }}
                                >
                                  {token.priceChange24h > 0 ? 
                                    <TrendingUpIcon fontSize="inherit" sx={{ fontSize: '0.875rem' }} /> : 
                                    <TrendingDownIcon fontSize="inherit" sx={{ fontSize: '0.875rem' }} />
                                  }
                                  <Typography 
                                    color="inherit"
                                    sx={{ fontWeight: 500 }}
                                    variant="caption"
                                  >
                                    {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h}%
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      {/* Read More / Show Less Button */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                          endIcon={!showFullContent ? <ArrowForwardIcon /> : undefined}
                          onClick={() => setShowFullContent(!showFullContent)}
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none'
                          }}
                          variant="outlined"
                        >
                          {showFullContent ? 'Show Less' : 'Read Full Analysis'}
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                ) : (
                  <Box
                    sx={{ 
                      p: 4, 
                      textAlign: 'center',
                      bgcolor: alpha(theme.palette.background.paper, 0.4),
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <Typography color="text.secondary" variant="body1">
                      No market analysis available for this date
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {/* Market Insights Sidebar */}
              <Box 
                sx={{ 
                  width: { xs: '100%', lg: '320px' },
                  position: { xs: 'static', lg: 'sticky' },
                  top: '100px',
                  alignSelf: 'flex-start',
                  maxHeight: { lg: 'calc(100vh - 120px)' },
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Card 
                  elevation={0}
                  sx={{ 
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: alpha(theme.palette.background.paper, 0.7),
                    border: `1px solid ${theme.palette.divider}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
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
                      bgcolor: alpha(theme.palette.background.default, 0.3)
                    }}
                  >
                    <Typography fontWeight={600} variant="h6">
                      Crypto News
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography color="text.secondary" sx={{ mr: 1 }} variant="caption">
                        Updated: just now
                      </Typography>
                      <IconButton 
                        disabled={insightsLoading}
                        onClick={handleRefreshInsights}
                        size="small"
                      >
                        {insightsLoading ? 
                          <CircularProgress size={16} /> : 
                          <RefreshIcon fontSize="small" />
                        }
                      </IconButton>
                    </Box>
                  </Box>
                  
                  {/* News List - With Fixed Height and Scrollable */}
                  <Box 
                    sx={{ 
                      flexGrow: 1,
                      overflowY: 'auto',
                      height: { xs: '380px', sm: '450px', lg: '500px' },
                      p: 2,
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
                      }
                    }}
                  >
                    {insightsLoading && marketInsights.length === 0 ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : marketInsights.length > 0 ? (
                      marketInsights.slice(0, visibleNewsCount).map((insight) => (
                        <NewsItem item={insight} key={insight._id} />
                      ))
                    ) : (
                      <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No market insights available
                      </Typography>
                    )}
                  </Box>
                  
                  {/* Footer - Load More */}
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderTop: `1px solid ${theme.palette.divider}`,
                      textAlign: 'center' 
                    }}
                  >
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      onClick={loadMoreNews}
                      size="small"
                      sx={{ 
                        borderRadius: 10,
                        bgcolor: theme.palette.primary.main,
                        boxShadow: theme.shadows[2],
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.9),
                        }
                      }}
                      variant="contained"
                    >
                      Load More
                    </Button>
                  </Box>
                </Card>
              </Box>
            </Box>
          </>
        )}
      </Box>
      
      {/* Back to top button */}
      <Fab
        aria-label="back to top"
        color="primary"
        onClick={handleBackToTop}
        size="small"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          opacity: showBackToTop ? 1 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: showBackToTop ? 'auto' : 'none',
          bgcolor: theme.palette.primary.main,
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.9)
          }
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </MainLayout>
  );
}