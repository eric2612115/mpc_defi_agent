// app/market-analysis/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import {
  alpha, Box, Button, CircularProgress, Fab, Grid,
  IconButton, LinearProgress, Menu, MenuItem, TextField, 
  Typography, useTheme
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  InfoOutlined as InfoIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import MainLayout from '@/components/layout/MainLayout';
import { useAccount } from 'wagmi';
import DateTabs, { DateTabItem } from '@/components/analysis/DateTabs';
import ArticleCard, { ArticleData } from '@/components/analysis/MarketArticleCard';
import MarketInsightsFeed from '@/components/analysis/MarketInsightsFeed';
import usePageView from '@/hooks/usePageView';

const MarketAnalysisPage = () => {
  const theme = useTheme();
  usePageView(); 
  const { isConnected } = useAccount();
  const [dateTab, setDateTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [dateMenuAnchorEl, setDateMenuAnchorEl] = useState<null | HTMLElement>(null);
  const dateMenuOpen = Boolean(dateMenuAnchorEl);
  const [customDateInput, setCustomDateInput] = useState('');
  const [datesData, setDatesData] = useState<DateTabItem[]>([]);

  // Generate dynamic date tabs (today and 4 previous days)
  const generateDateTabs = () => {
    const tabs: DateTabItem[] = [];
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
      
      // Use the API endpoint from your API example
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

  if (!mounted) {
    return null;
  }

  return (
    <MainLayout>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography component="h1" gutterBottom variant="h4">
            Crypto Market Analysis
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
            {/* Date Navigation Bar */}
            <Box 
              sx={{ 
                mb: 3, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}
            >
              {/* Date Tabs */}
              <DateTabs
                onChange={handleDateChange}
                selectedIndex={dateTab}
                tabs={datesData}
              />
              
              {/* Date Selector & Refresh */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  onClick={handleDateMenuOpen}
                  startIcon={<CalendarIcon />}
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
                  PaperProps={{
                    sx: { width: 250, p: 2 }
                  }}
                  anchorEl={dateMenuAnchorEl}
                  onClose={handleDateMenuClose}
                  open={dateMenuOpen}
                >
                  <Typography fontWeight={500} sx={{ mb: 2 }} variant="subtitle2">
                    Enter custom date
                  </Typography>
                  <TextField
                    fullWidth
                    label="YYYY-MM-DD"
                    margin="dense"
                    onChange={(e) => setCustomDateInput(e.target.value)}
                    placeholder="e.g., 2025-02-15"
                    size="small"
                    sx={{ mb: 2 }}
                    value={customDateInput}
                  />
                  <Button 
                    disabled={!customDateInput} 
                    fullWidth 
                    onClick={handleCustomDateSubmit}
                    variant="contained"
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
                  articles.map((article, index) => (
                    <ArticleCard article={article} key={article._id || index} />
                  ))
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
                <MarketInsightsFeed
                  autoRefresh={true}
                  refreshInterval={30000}
                  showExcerpt={true}
                  showExternalLinks={true}
                  title="Crypto News"
                />
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
};

export default MarketAnalysisPage;