// components/analysis/ArticleCard.tsx
import React, { useState } from 'react';
import {
  alpha, Box, Button, Card, CardContent, Chip, Divider, Typography, useTheme
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Article interface based on the API response
export interface ArticleData {
  _id?: string;
  source: string;
  category: string;
  title: string;
  content_summary: string;
  analysis: string[];
  markdown_content: string;
  date: string;
  keywords: string[];
  header_image_url?: string;
  featured_image_url?: string;
  update_datetime?: string;
}

// Trading token information
interface TokenInfo {
  symbol: string;
  change: number;
}

// Get token info based on category
const getTokenInfo = (category: string): TokenInfo | null => {
  switch (category) {
  case 'BTC':
    return { symbol: 'BTC', change: 2.3 };
  case 'ETH':
    return { symbol: 'ETH', change: -1.2 };
  case 'SOL':
    return { symbol: 'SOL', change: 5.3 };
  case 'Base':
    return { symbol: 'BASE', change: 1.3 };
  default:
    return null;
  }
};

interface ArticleCardProps {
  article: ArticleData;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const tokenInfo = getTokenInfo(article.category);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <Card
      elevation={0}
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
        
        <Typography paragraph variant="body1">
          {article.content_summary}
        </Typography>
        
        {/* Analysis Points when not expanded */}
        {!isExpanded && article.analysis && article.analysis.length > 0 && (
          <>
            <Typography fontWeight={600} gutterBottom sx={{ mt: 3 }} variant="h6">
              Key Points
            </Typography>
            <Box sx={{ mb: 3 }}>
              {article.analysis.slice(0, 3).map((point, idx) => (
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
              {article.analysis.length > 3 && (
                <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                  ...and {article.analysis.length - 3} more key points
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
            {tokenInfo && (
              <Chip 
                icon={tokenInfo.change > 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />} 
                label={`${tokenInfo.symbol} ${tokenInfo.change > 0 ? '+' : ''}${tokenInfo.change}%`}
                size="small"
                sx={{ 
                  bgcolor: alpha(tokenInfo.change > 0 ? theme.palette.success.main : theme.palette.error.main, 0.1),
                  color: tokenInfo.change > 0 ? theme.palette.success.main : theme.palette.error.main
                }}
              />
            )}
            {article.keywords && article.keywords.slice(0, 3).map((keyword) => (
              <Chip 
                key={keyword}
                label={keyword}
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main
                }}
              />
            ))}
          </Box>
        </Box>
        
        {/* Read Full Analysis Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            endIcon={!isExpanded ? <ArrowForwardIcon /> : undefined}
            onClick={toggleExpanded}
            sx={{ 
              borderRadius: 2,
              px: 3
            }}
            variant="outlined"
          >
            {isExpanded ? "Show Less" : "Read Full Analysis"}
          </Button>
        </Box>
        
        {/* Expanded full content */}
        {isExpanded && (
          <Box sx={{ mt: 4, pt: 4, borderTop: `1px solid ${theme.palette.divider}` }}>
            {/* Full Markdown Content */}
            <Box className="article-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.markdown_content}
              </ReactMarkdown>
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default ArticleCard;