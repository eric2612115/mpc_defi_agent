// app/daily-analysis/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import {
  alpha, Box, CircularProgress, Divider, 
  Grid, LinearProgress, Typography, useTheme
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
            <DateTabs 
              dates={datesData} 
              onChange={handleDateChange} 
              selectedIndex={dateTab} 
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
                  color="text.secondary" 
                  sx={{ display: 'block', mt: 1, textAlign: 'center' }} 
                  variant="caption"
                >
                  Loading market analysis...
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {/* 主要分析文章 */}
                <Grid item md={8} xs={12}>
                  {marketAnalysis ? (
                    <MarketArticleCard article={marketAnalysis} expanded={true} />
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
                </Grid>
                
                {/* 市場見解側欄 */}
                <Grid item md={4} xs={12}>
                  <MarketInsightsFeed 
                    insights={marketInsights}
                    isLoading={insightsLoading}
                    lastUpdated={lastUpdated}
                    onRefresh={handleRefreshInsights}
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