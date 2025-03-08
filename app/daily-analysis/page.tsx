// app/daily-analysis/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import {
  alpha, Box, Button, Card, CardContent, Chip, CircularProgress, 
  Divider, Fab, Grid, IconButton, LinearProgress, TextField, 
  Typography, useTheme, Menu, MenuItem
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  CalendarMonth as CalendarIcon,
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
import MarketInsightsFeed from '@/components/analysis/MarketInsightsFeed';

// Article interface based on the API response
interface ArticleData {
  source: string;
  category: string;
  title: string;
  content_summary: string;
  analysis: string[];
  markdown_content: string;
  date: string;
  keywords: string[];
  header_image_url: string;
  featured_image_url: string;
  update_datetime?: string;
}

// Date tab type
interface DateTab {
  date: string; // YYYY-MM-DD format
  label: string;
}

// Mock insights for right sidebar
const mockInsights = [
  {
    _id: 'insight-1',
    content: 'Bitcoin surpasses $70,000 for the first time in 2025, marking a new all-time high.',
    publishedAt: new Date().toISOString(),
    importance: 'high',
    relatedTokens: ['BTC', 'Bitcoin'],
    source: 'CryptoNews'
  },
  {
    _id: 'insight-2',
    content: 'Ethereum continues to face resistance at $2,200 level despite network upgrade announcement.',
    publishedAt: new Date().toISOString(),
    importance: 'medium',
    relatedTokens: ['ETH', 'Ethereum'],
    source: 'DeFi Daily'
  }
];

const DailyAnalysisPage = () => {
  const theme = useTheme();
  const { isConnected } = useAccount();
  const [dateTab, setDateTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [dateMenuAnchorEl, setDateMenuAnchorEl] = useState<null | HTMLElement>(null);
  const dateMenuOpen = Boolean(dateMenuAnchorEl);
  const [customDateInput, setCustomDateInput] = useState('');
  const [datesData, setDatesData] = useState<DateTab[]>([]);

  // Generate dynamic date tabs (today and 4 previous days)
  const generateDateTabs = () => {
    const tabs: DateTab[] = [];
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      const formattedDate = formatDateString(date);
      const label = i === 0 ? 'Today' : 
                   i === 1 ? 'Yesterday' : 
                   date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      
      tabs.push({
        date: formattedDate,
        label
      });
    }
    
    return tabs;
  };

  // Format date to YYYY-MM-DD
  const formatDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
    // Generate date tabs on mount
    setDatesData(generateDateTabs());
  }, []);

  // Add scroll event listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch data when date tab changes or on mount
  useEffect(() => {
    if (mounted && isConnected && datesData.length > 0) {
      fetchDailyReport();
    }
  }, [mounted, isConnected, dateTab, datesData]);

  // Handle date tab change
  const handleDateChange = (tabIndex: number) => {
    setDateTab(tabIndex);
    setLoading(true);
  };

  // Handle date menu open
  const handleDateMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setDateMenuAnchorEl(event.currentTarget);
  };

  // Handle date menu close
  const handleDateMenuClose = () => {
    setDateMenuAnchorEl(null);
  };

  // Handle custom date selection
  const handleCustomDateSubmit = () => {
    // Validate input format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(customDateInput)) {
      alert("Please enter a valid date in YYYY-MM-DD format");
      return;
    }
    
    try {
      // Check if it's a valid date
      const date = new Date(customDateInput);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      
      // Check if it's a future date
      if (date > new Date()) {
        alert("Cannot select a future date");
        return;
      }
      
      // Check if the selected date is in our tabs
      const existingTabIndex = datesData.findIndex(tab => tab.date === customDateInput);
      
      if (existingTabIndex >= 0) {
        // If date already exists in tabs, select that tab
        setDateTab(existingTabIndex);
      } else {
        // Otherwise, add new tab and select it
        const newTab = {
          date: customDateInput,
          label: formatCustomDateLabel(new Date(customDateInput))
        };
        const newDatesData = [...datesData, newTab];
        setDatesData(newDatesData);
        setDateTab(newDatesData.length - 1); // New tab will be at the end
      }
      
      // Reset and close
      setCustomDateInput('');
      handleDateMenuClose();
    } catch (error) {
      alert("Please enter a valid date in YYYY-MM-DD format");
    }
  };
  
  // Format date label for custom date
  const formatCustomDateLabel = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Fetch daily report from API
  const fetchDailyReport = async () => {
    setLoading(true);
    
    try {
      if (datesData.length === 0) {
        throw new Error("No dates available");
      }
      
      // Get the date from the currently selected tab
      const selectedDate = datesData[dateTab].date;
      const [year, month, day] = selectedDate.split('-');
      
      console.log(`Fetching report for: ${year}-${month}-${day}`);
      
      const response = await fetch(`/api/get-daily-report?year=${year}&month=${month}&day=${day}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Retrieved articles:", data);
      setArticles(data);
    } catch (error) {
      console.error('Error fetching daily report:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle article expanded state
  const toggleArticleExpanded = (articleTitle: string) => {
    if (expandedArticleId === articleTitle) {
      setExpandedArticleId(null);
    } else {
      setExpandedArticleId(articleTitle);
    }
  };

  // Refresh current date data
  const handleRefresh = () => {
    fetchDailyReport();
  };

  // Back to top handler
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Render article card
  const renderArticleCard = (article: ArticleData) => {
    const isExpanded = expandedArticleId === article.title;
    console.log("Rendering article:", article.title, "Category:", article.category);
    
    return (
      <Card
        elevation={0}
        key={article.title}
        sx={{ 
          mb: 4,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: alpha(theme.palette.background.paper, 0.8)
        }}
      >
        {/* Category tags and title */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip 
              label={article.category} 
              size="small"
              sx={{ 
                fontWeight: 500,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main
              }}
            />
            <Chip 
              label="Market Analysis" 
              size="small"
              sx={{ 
                fontWeight: 500,
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                color: theme.palette.text.primary
              }}
            />
          </Box>
          
          <Typography component="h2" fontWeight={600} gutterBottom variant="h5">
            {article.title}
          </Typography>
          
          <Typography color="text.secondary" variant="body2">
            {formatDate(article.date)} {article.source && `| ${article.source}`}
          </Typography>
        </Box>
        
        <Divider />
        
        {/* Executive Summary */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography fontWeight={600} gutterBottom variant="h6">
            Executive Summary
          </Typography>
          
          <Typography variant="body1" paragraph>
            {article.content_summary}
          </Typography>
          
          {/* Analysis Points when not expanded */}
          {!isExpanded && article.analysis && article.analysis.length > 0 && (
            <>
              <Typography fontWeight={600} gutterBottom variant="h6" sx={{ mt: 3 }}>
                Key Points
              </Typography>
              <Box sx={{ mb: 3 }}>
                {article.analysis.slice(0, 2).map((point, idx) => (
                  <Box 
                    key={idx}
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.paper, 0.5),
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    <Typography variant="body2">{point}</Typography>
                  </Box>
                ))}
                {article.analysis.length > 2 && (
                  <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                    ...and {article.analysis.length - 2} more key points
                  </Typography>
                )}
              </Box>
            </>
          )}
          
          {/* Featured Tokens */}
          <Box sx={{ mt: 3 }}>
            <Typography fontWeight={600} gutterBottom variant="subtitle2">
              Featured Tokens
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {article.category === 'BTC' && (
                <Chip 
                  label="BTC +2.3%" 
                  size="small"
                  icon={<TrendingUpIcon fontSize="small" />}
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main
                  }}
                />
              )}
              {article.category === 'ETH' && (
                <Chip 
                  label="ETH -1.2%" 
                  size="small"
                  icon={<TrendingDownIcon fontSize="small" />}
                  sx={{ 
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main
                  }}
                />
              )}
              {article.category === 'SOL' && (
                <Chip 
                  label="SOL +5.3%" 
                  size="small"
                  icon={<TrendingUpIcon fontSize="small" />}
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main
                  }}
                />
              )}
              {article.category === 'Base' && (
                <Chip 
                  label="BASE +1.3%" 
                  size="small"
                  icon={<TrendingUpIcon fontSize="small" />}
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main
                  }}
                />
              )}
            </Box>
          </Box>
          
          {/* Read Full Analysis Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => toggleArticleExpanded(article.title)}
              sx={{ 
                borderRadius: 2,
                px: 3
              }}
              variant="outlined"
            >
              Read Full Analysis
            </Button>
          </Box>
          
          {/* Expanded full content */}
          {isExpanded && (
            <Box sx={{ mt: 4, pt: 4, borderTop: `1px solid ${theme.palette.divider}` }}>
              {/* Full Markdown Content */}
              <Box className={styles.articleContent}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {article.markdown_content}
                </ReactMarkdown>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  onClick={() => toggleArticleExpanded(article.title)}
                  variant="text"
                  sx={{ textTransform: 'none' }}
                >
                  Show Less
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Card>
    );
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
            {/* Date Tabs Navigation */}
            <Box 
              sx={{ 
                mb: 3, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': {
                  height: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: alpha(theme.palette.background.default, 0.1),
                },
                '&::-webkit-scrollbar-thumb': {
                  background: alpha(theme.palette.primary.main, 0.2),
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: alpha(theme.palette.primary.main, 0.4),
                },
              }}
            >
              <Box sx={{ display: 'flex' }}>
                {datesData.map((date, index) => (
                  <Button
                    key={date.date}
                    onClick={() => handleDateChange(index)}
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
                      },
                      whiteSpace: 'nowrap'
                    }}
                    variant={dateTab === index ? "contained" : "outlined"}
                  >
                    {date.label}
                  </Button>
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  startIcon={<CalendarIcon />}
                  onClick={handleDateMenuOpen}
                  sx={{ 
                    mr: 1, 
                    textTransform: 'none',
                    borderRadius: 10,
                  }}
                  variant="outlined"
                >
                  Select Date
                </Button>
                
                <Menu
                  anchorEl={dateMenuAnchorEl}
                  open={dateMenuOpen}
                  onClose={handleDateMenuClose}
                  PaperProps={{
                    sx: { width: 250, p: 2 }
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2 }}>
                    Enter custom date
                  </Typography>
                  <TextField
                    label="YYYY-MM-DD"
                    value={customDateInput}
                    onChange={(e) => setCustomDateInput(e.target.value)}
                    placeholder="e.g., 2025-02-15"
                    fullWidth
                    size="small"
                    margin="dense"
                    sx={{ mb: 2 }}
                  />
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={handleCustomDateSubmit}
                    disabled={!customDateInput}
                  >
                    Go to Date
                  </Button>
                </Menu>
                
                <IconButton 
                  onClick={handleRefresh}
                  size="small"
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2)
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Box>
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
                ) : articles.length > 0 ? (
                  // Render all article cards
                  articles.map((article, index) => renderArticleCard(article))
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
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography fontWeight={600} variant="h6">
                      Crypto News
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography color="text.secondary" sx={{ mr: 1, fontSize: '0.75rem' }} variant="caption">
                        Updated: just now
                      </Typography>
                      <IconButton 
                        onClick={handleRefresh}
                        size="small"
                      >
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Box sx={{ p: 2, height: '600px', overflowY: 'auto' }}>
                    {/* Bitcoin News Item */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <TrendingUpIcon color="success" fontSize="small" sx={{ mt: 0.5 }} />
                        <Box>
                          <Typography fontWeight={500} variant="body2">
                            Bitcoin surpasses $70,000 for the first time in 2025, marking a new all-time high.
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Chip 
                              label="BTC" 
                              size="small" 
                              sx={{ mr: 1, height: 20, fontSize: '0.7rem' }}
                            />
                            <Typography color="text.secondary" variant="caption">
                              just now • CryptoNews
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    
                    {/* Ethereum News Item */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <TrendingDownIcon color="error" fontSize="small" sx={{ mt: 0.5 }} />
                        <Box>
                          <Typography fontWeight={500} variant="body2">
                            Ethereum continues to face resistance at $2,200 level despite network upgrade announcement.
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Chip 
                              label="ETH" 
                              size="small" 
                              sx={{ mr: 1, height: 20, fontSize: '0.7rem' }}
                            />
                            <Typography color="text.secondary" variant="caption">
                              5m ago • DeFi Daily
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    
                    {/* Solana News Item */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <TrendingUpIcon color="success" fontSize="small" sx={{ mt: 0.5 }} />
                        <Box>
                          <Typography fontWeight={500} variant="body2">
                            Solana network activity reaches record high, driving a 5.3% price increase in the last 24 hours.
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Chip 
                              label="SOL" 
                              size="small" 
                              sx={{ mr: 1, height: 20, fontSize: '0.7rem' }}
                            />
                            <Typography color="text.secondary" variant="caption">
                              30m ago • Blockchain Beat
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    
                    {/* Base News Item */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <TrendingUpIcon color="success" fontSize="small" sx={{ mt: 0.5 }} />
                        <Box>
                          <Typography fontWeight={500} variant="body2">
                            Coinbase&apos;s Base layer-2 solution sees increased adoption with the launch of new DeFi protocols.
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Chip 
                              label="BASE" 
                              size="small" 
                              sx={{ mr: 1, height: 20, fontSize: '0.7rem' }}
                            />
                            <Typography color="text.secondary" variant="caption">
                              1h ago • Layer2 Report
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      fullWidth
                      sx={{ 
                        mt: 2, 
                        borderRadius: 2,
                        textTransform: 'none' 
                      }}
                      variant="outlined"
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
};

export default DailyAnalysisPage;