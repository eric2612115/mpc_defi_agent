// components/analysis/MarketArticleCard.tsx
import React, { useState } from 'react';
import {
  Card, CardContent, CardMedia, Typography, Box, Avatar, 
  Chip, Divider, alpha, useTheme, Button
} from '@mui/material';
import { 
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { MarketAnalysis, Token } from '../../models/MarketAnalysis';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // 用於支持表格等GitHub風格的Markdown

interface MarketArticleCardProps {
  article: MarketAnalysis;
  expanded?: boolean;
}

const TokenChip: React.FC<{ token: Token }> = ({ token }) => {
  const theme = useTheme();
  
  return (
    <Chip
      avatar={
        token.logoUrl ? (
          <Avatar 
            alt={token.symbol} 
            src={token.logoUrl}
            sx={{ width: 20, height: 20 }}
          />
        ) : (
          <Avatar 
            sx={{ 
              width: 20, 
              height: 20, 
              fontSize: '0.625rem',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main
            }}
          >
            {token.symbol.charAt(0)}
          </Avatar>
        )
      }
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <span>{token.symbol}</span>
          <Box 
            component="span" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: token.priceChange24h > 0 ? 'success.main' : token.priceChange24h < 0 ? 'error.main' : 'text.secondary',
              fontSize: '0.75rem',
              fontWeight: 500
            }}
          >
            {token.priceChange24h > 0 ? (
              <TrendingUpIcon fontSize="inherit" sx={{ mr: 0.25 }} />
            ) : token.priceChange24h < 0 ? (
              <TrendingDownIcon fontSize="inherit" sx={{ mr: 0.25 }} />
            ) : null}
            {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h}%
          </Box>
        </Box>
      }
      size="small"
      sx={{ 
        mr: 1, 
        mb: 1,
        border: token.highlighted ? `1px solid ${theme.palette.primary.main}` : undefined,
        bgcolor: token.highlighted ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.background.paper, 0.7)
      }}
    />
  );
};

const MarketArticleCard: React.FC<MarketArticleCardProps> = ({ article, expanded = false }) => {
  const theme = useTheme();
  const [isFullContentVisible, setIsFullContentVisible] = useState(false);
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // For compact view, limit to the first 3 tokens
  const displayTokens = expanded ? article.featuredTokens : article.featuredTokens.slice(0, 3);
  
  // Handle content display based on view mode and expand state
  const getDisplayContent = () => {
    if (isFullContentVisible) {
      // Show full content when expanded
      return article.content;
    } else if (expanded) {
      // Show preview for expanded card (but not full content)
      return article.content.substring(0, 500) + (article.content.length > 500 ? '...' : '');
    } else {
      // Show only summary for compact view
      return article.summary;
    }
  };
  
  const previewContent = getDisplayContent();
    
  return (
    <Card 
      elevation={0} 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: theme.customShadows?.medium,
          borderColor: alpha(theme.palette.primary.main, 0.3),
          transform: 'translateY(-2px)'
        }
      }}
    >
      {/* Cover Image */}
      <CardMedia
        alt={article.title}
        component="img"
        height={200}
        image={article.coverImage}
        sx={{ objectFit: 'cover' }}
      />
      
      {/* Content Area */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Tags */}
        <Box sx={{ mb: 2 }}>
          {article.tags.map((tag) => (
            <Chip
              key={tag._id}
              label={tag.name}
              size="small"
              sx={{ 
                mr: 1, 
                bgcolor: alpha(tag.color || theme.palette.primary.main, 0.1),
                color: tag.color || theme.palette.primary.main,
                fontWeight: 500,
                fontSize: '0.75rem'
              }}
            />
          ))}
        </Box>
        
        {/* Title */}
        <Typography component="h2" fontWeight={600} gutterBottom variant="h5">
          {article.title}
        </Typography>
        
        {/* Author & Metadata */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            alt={article.author.name} 
            src={article.author.avatar} 
            sx={{ width: 32, height: 32, mr: 1 }}
          />
          <Box>
            <Typography fontWeight={500} variant="subtitle2">
              {article.author.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
              <ScheduleIcon fontSize="inherit" sx={{ fontSize: '0.875rem', mr: 0.5 }} />
              <Typography variant="caption">
                {formattedDate} • {article.readingTime} min read
              </Typography>
              <Box 
                sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  ml: 1.5 
                }}
              >
                <VisibilityIcon fontSize="inherit" sx={{ fontSize: '0.875rem', mr: 0.5 }} />
                <Typography variant="caption">
                  {article.viewCount.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        
        {/* Content Preview or Full Content */}
        <Box
          sx={{ 
          mb: 2, 
          color: 'text.secondary', 
          position: 'relative',
          overflow: isFullContentVisible ? 'auto' : 'hidden'
        }}
        >
          {expanded || isFullContentVisible ? (
            <Box
              sx={{ 
              maxHeight: isFullContentVisible ? 'none' : 150, 
              overflow: isFullContentVisible ? 'visible' : 'hidden', 
              position: 'relative'
            }}
            >
              <Box className="article-content">
                <ReactMarkdown
                  components={{
                    img: ({ ...props }) => (
                      // 使用 span 而不是 Box 來避免 hydration 錯誤
                      <span style={{ display: 'block', margin: '16px 0', textAlign: 'center' }}>
                        <img 
                          {...props} 
                          style={{ 
                            maxWidth: '100%', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                          }} 
                        />
                        {props.alt && (
                          <span
                            style={{ 
                            display: 'block', 
                            marginTop: '8px', 
                            color: theme.palette.text.secondary, 
                            fontStyle: 'italic',
                            fontSize: '0.875rem'
                          }}
                          >
                            {props.alt}
                          </span>
                        )}
                      </span>
                    ),
                    table: ({ ...props }) => (
                      <Box sx={{ overflowX: 'auto', my: 3 }}>
                        <table 
                          {...props} 
                          style={{ 
                            borderCollapse: 'collapse', 
                            width: '100%',
                            border: `1px solid ${theme.palette.divider}`
                          }} 
                        />
                      </Box>
                    ),
                    th: ({ ...props }) => (
                      <th 
                        {...props} 
                        style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          borderBottom: `2px solid ${theme.palette.divider}`,
                          fontWeight: 600
                        }} 
                      />
                    ),
                    td: ({ ...props }) => (
                      <td 
                        {...props} 
                        style={{ 
                          padding: '12px 16px', 
                          borderBottom: `1px solid ${theme.palette.divider}`
                        }} 
                      />
                    ),
                    a: ({ ...props }) => (
                      <a 
                        {...props} 
                        rel="noopener noreferrer"
                        style={{ color: theme.palette.primary.main, textDecoration: 'none' }} 
                        target="_blank" 
                      />
                    )
                  }}
                  remarkPlugins={[remarkGfm]}
                >
                  {previewContent}
                </ReactMarkdown>
              </Box>
              {!isFullContentVisible && (
                <Box
                  sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  height: 60, 
                  background: `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0)}, ${theme.palette.background.paper})` 
                }}
                />
              )}
            </Box>
          ) : (
            <Typography paragraph variant="body2">
              {previewContent}
            </Typography>
          )}
        </Box>
        
        {/* Featured Tokens */}
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom variant="subtitle2">
            Featured Tokens
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {displayTokens.map((token) => (
              <TokenChip key={token.symbol} token={token} />
            ))}
            
            {!expanded && article.featuredTokens.length > 3 && (
              <Chip 
                label={`+${article.featuredTokens.length - 3} more`}
                size="small"
                sx={{ mr: 1, mb: 1 }}
                variant="outlined"
              />
            )}
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Read More Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            endIcon={isFullContentVisible ? null : <ArrowForwardIcon />}
            onClick={() => setIsFullContentVisible(!isFullContentVisible)}
            sx={{ 
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {isFullContentVisible ? 'Show Less' : 'Read Full Analysis'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MarketArticleCard;