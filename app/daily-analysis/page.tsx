// app/daily-analysis/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Card, CardContent, Grid, Divider, 
  LinearProgress, Chip, alpha, useTheme, CircularProgress, Avatar
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  InfoOutlined as InfoIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  DonutSmall as DonutSmallIcon,
  ShowChart as ShowChartIcon,
  AutoGraph as AutoGraphIcon
} from '@mui/icons-material';
import MainLayout from '@/components/layout/MainLayout';
import { useAccount } from 'wagmi';
import DateTabs from '@/components/analysis/DateTabs';
import AssetAllocation from '@/components/analysis/AssetAllocation';
import InsightsList from '@/components/analysis/InsightsList';
import type { DateTab } from '@/components/analysis/DateTabs';
import type { TokenAllocation } from '@/components/analysis/AssetAllocation';

// 模擬數據
const datesData: DateTab[] = [
  { date: 'March 5, 2025', label: 'Today' },
  { date: 'March 4, 2025', label: 'Yesterday' },
  { date: 'March 3, 2025', label: 'March 3' },
  { date: 'March 2, 2025', label: 'March 2' },
  { date: 'March 1, 2025', label: 'March 1' },
];

// 模擬代幣表現數據
const tokenData: TokenAllocation[] = [
  { symbol: 'ETH', name: 'Ethereum', allocation: 35, performance: 2.4, value: 4200, color: '#627EEA' },
  { symbol: 'BTC', name: 'Bitcoin', allocation: 25, performance: -1.2, value: 3000, color: '#F7931A' },
  { symbol: 'USDC', name: 'USD Coin', allocation: 20, performance: 0.01, value: 2400, color: '#2775CA' },
  { symbol: 'LINK', name: 'Chainlink', allocation: 12, performance: 3.5, value: 1440, color: '#2A5ADA' },
  { symbol: 'UNI', name: 'Uniswap', allocation: 8, performance: -0.8, value: 960, color: '#FF007A' },
];

// 模擬見解數據
const insightsData = [
  "Ethereum's recent protocol upgrade has increased transaction throughput by 15%, potentially impacting price positively in the coming weeks.",
  "Market volatility indicators suggest a possible correction in BTC price within the next 7-10 days. Consider diversifying high-volatility assets.",
  "DeFi protocols are showing increased activity with total value locked up 8% this week, suggesting potential growth in related tokens.",
  "Your portfolio has outperformed market averages by 2.3% this month, primarily due to your ETH and LINK allocations."
];

export default function DailyAnalysisPage() {
  const theme = useTheme();
  const { isConnected } = useAccount();
  const [dateTab, setDateTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 修復水合問題
  useEffect(() => {
    setMounted(true);
    
    // 模擬加載數據
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDateChange = (event: React.SyntheticEvent, newValue: number) => {
    setDateTab(newValue);
    setLoading(true);
    
    // 模擬加載新數據
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // 總投資組合價值
  const totalValue = tokenData.reduce((sum, token) => sum + token.value, 0);

  if (!mounted) {
    return null;
  }

  return (
    <MainLayout>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Daily Analysis
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered insights and analysis of your portfolio performance.
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
              Please connect your wallet to view your daily analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500 }}>
              Connect your wallet to receive personalized AI-generated analysis of your portfolio performance, market insights and trading recommendations.
            </Typography>
          </Box>
        ) : (
          <>
            {/* 日期標籤頁 */}
            <DateTabs 
              dates={datesData} 
              selectedIndex={dateTab} 
              onChange={handleDateChange} 
            />

            {/* 加載狀態 */}
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
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ display: 'block', mt: 1, textAlign: 'center' }}
                >
                  AI is analyzing your portfolio data...
                </Typography>
              </Box>
            ) : (
              <>
                {/* 概覽卡片 */}
                <Card 
                  sx={{ 
                    p: 0, 
                    overflow: 'hidden',
                    mb: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.customShadows.light,
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ 
                    p: 3, 
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.4)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Portfolio Overview
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {datesData[dateTab].date}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h5" sx={{ mb: 0.5 }}>
                          ${totalValue.toLocaleString()}
                        </Typography>
                        <Chip 
                          label="↑ 1.8% today" 
                          size="small" 
                          color="success"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Asset Allocation
                    </Typography>
                    
                    {/* 資產分配條 */}
                    <AssetAllocation tokens={tokenData} />
                  </CardContent>
                </Card>

                {/* 分析和見解 */}
                <Grid container spacing={3}>
                  {/* 圖表 */}
                  <Grid item xs={12} md={8}>
                    <Card sx={{ 
                      height: '100%',
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: theme.customShadows.light,
                      borderRadius: 2
                    }}>
                      <CardContent sx={{ p: 0 }}>
                        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6">Performance Analytics</Typography>
                          <Box>
                            <Avatar sx={{ display: 'inline-flex', width: 24, height: 24, fontSize: '0.75rem', bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                              <BarChartIcon fontSize="small" />
                            </Avatar>
                            <Avatar sx={{ display: 'inline-flex', width: 24, height: 24, fontSize: '0.75rem', ml: 1, bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
                              <TimelineIcon fontSize="small" />
                            </Avatar>
                            <Avatar sx={{ display: 'inline-flex', width: 24, height: 24, fontSize: '0.75rem', ml: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                              <ShowChartIcon fontSize="small" />
                            </Avatar>
                          </Box>
                        </Box>
                        
                        <Box sx={{ 
                          p: 4, 
                          minHeight: 300, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexDirection: 'column'
                        }}>
                          <DonutSmallIcon sx={{ fontSize: 64, color: alpha(theme.palette.text.secondary, 0.2), mb: 2 }} />
                          <Typography variant="body2" color="text.secondary" align="center">
                            Performance chart would be displayed here<br />
                            (Placeholder for actual chart implementation)
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* AI 見解 */}
                  <Grid item xs={12} md={4}>
                    <Card sx={{ 
                      height: '100%',
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: theme.customShadows.light,
                      borderRadius: 2
                    }}>
                      <CardContent sx={{ p: 0 }}>
                        <Box sx={{ 
                          p: 2, 
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <AutoGraphIcon color="primary" />
                          <Typography variant="h6">AI Insights</Typography>
                        </Box>
                        
                        <InsightsList insights={insightsData} />
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* 推薦 */}
                  <Grid item xs={12}>
                    <Card sx={{ 
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: theme.customShadows.light,
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        p: 2, 
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        bgcolor: alpha(theme.palette.primary.main, 0.05)
                      }}>
                        <Typography variant="h6">
                          AI Trading Recommendations
                        </Typography>
                      </Box>
                      <CardContent>
                        <Typography variant="body1" paragraph>
                          Based on your portfolio composition and current market conditions, our AI recommends the following actions:
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ 
                              p: 2, 
                              borderRadius: 2,
                              border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                              bgcolor: alpha(theme.palette.success.main, 0.05)
                            }}>
                              <Typography variant="subtitle1" color="success.main" gutterBottom>
                                ↑ Consider Increasing
                              </Typography>
                              <Typography variant="body2" paragraph>
                                Ethereum (ETH) allocation from 35% to 40% due to upcoming protocol changes and bullish momentum.
                              </Typography>
                              <Chip 
                                label="High Conviction" 
                                size="small" 
                                sx={{ 
                                  bgcolor: alpha(theme.palette.success.main, 0.1),
                                  color: theme.palette.success.main,
                                  borderRadius: 1
                                }} 
                              />
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Box sx={{ 
                              p: 2, 
                              borderRadius: 2,
                              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                              bgcolor: alpha(theme.palette.error.main, 0.05)
                            }}>
                              <Typography variant="subtitle1" color="error.main" gutterBottom>
                                ↓ Consider Reducing
                              </Typography>
                              <Typography variant="body2" paragraph>
                                Bitcoin (BTC) exposure from 25% to 20% temporarily due to technical indicators suggesting a short-term correction.
                              </Typography>
                              <Chip 
                                label="Medium Conviction" 
                                size="small" 
                                sx={{ 
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                  color: theme.palette.error.main,
                                  borderRadius: 1
                                }} 
                              />
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Box sx={{ 
                              p: 2, 
                              borderRadius: 2,
                              border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                              bgcolor: alpha(theme.palette.info.main, 0.05)
                            }}>
                              <Typography variant="subtitle1" color="info.main" gutterBottom>
                                + Consider Adding
                              </Typography>
                              <Typography variant="body2" paragraph>
                                Solana (SOL) with a 5% allocation due to increasing developer activity and improving network performance.
                              </Typography>
                              <Chip 
                                label="Medium Conviction" 
                                size="small" 
                                sx={{ 
                                  bgcolor: alpha(theme.palette.info.main, 0.1),
                                  color: theme.palette.info.main,
                                  borderRadius: 1
                                }} 
                              />
                            </Box>
                          </Grid>
                        </Grid>
                        
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
                          These recommendations are generated by AI based on historical data, market trends, and your portfolio composition.
                          Always conduct your own research before making investment decisions.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}
          </>
        )}
      </Box>
    </MainLayout>
  );
}