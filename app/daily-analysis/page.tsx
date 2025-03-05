// app/daily-analysis/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Divider, 
  LinearProgress, alpha, useTheme, CircularProgress
} from '@mui/material';
import {
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import MainLayout from '@/components/layout/MainLayout';
import { useAccount } from 'wagmi';
import DateTabs from '@/components/analysis/DateTabs';
import MarketArticleCard from '@/components/analysis/MarketArticleCard';
import MarketInsightsFeed from '@/components/analysis/MarketInsightsFeed';
import type { DateTab } from '@/components/analysis/DateTabs';
import type { MarketAnalysis, MarketInsight } from '@/models/MarketAnalysis';
import { fetchMarketAnalysis, fetchMarketInsights } from '@/mockData/marketAnalysis';

// 日期標籤數據
const datesData: DateTab[] = [
  { date: '2025-03-05', label: 'Today' },
  { date: '2025-03-04', label: 'Yesterday' },
  { date: '2025-03-03', label: 'March 3' },
  { date: '2025-03-02', label: 'March 2' },
  { date: '2025-03-01', label: 'March 1' },
];

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
  };

  if (!mounted) {
    return null;
  }

  return (
    <MainLayout>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Daily Market Analysis
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Expert insights and in-depth analysis of cryptocurrency market trends.
          </Typography>
        </Box>

        {!isConnected ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.background.paper, 0.4),
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`
          }}>
            <InfoIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Please connect your wallet to view market analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500 }}>
              Connect your wallet to access AI-generated market analysis, real-time insights, and trading recommendations.
            </Typography>
          </Box>
        ) : (
          <>
            {/* 日期選項卡 */}
            <DateTabs 
              dates={datesData} 
              selectedIndex={dateTab} 
              onChange={handleDateChange} 
            />

            {/* 加載狀態 */}
            {loading && !marketAnalysis ? (
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
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ display: 'block', mt: 1, textAlign: 'center' }}
                >
                  Loading market analysis...
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {/* 主要分析文章 */}
                <Grid item xs={12} md={8}>
                  {marketAnalysis ? (
                    <MarketArticleCard article={marketAnalysis} expanded={true} />
                  ) : (
                    <Box sx={{ 
                      p: 4, 
                      textAlign: 'center',
                      bgcolor: alpha(theme.palette.background.paper, 0.4),
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`
                    }}>
                      <Typography variant="body1" color="text.secondary">
                        No market analysis available for this date
                      </Typography>
                    </Box>
                  )}
                </Grid>
                
                {/* 市場見解側欄 */}
                <Grid item xs={12} md={4}>
                  <MarketInsightsFeed 
                    insights={marketInsights}
                    isLoading={insightsLoading}
                    onRefresh={handleRefreshInsights}
                    lastUpdated={lastUpdated}
                  />
                </Grid>
              </Grid>
            )}
          </>
        )}
      </Box>
    </MainLayout>
  );
}