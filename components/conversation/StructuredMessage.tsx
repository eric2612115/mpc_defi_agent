// components/conversation/StructuredMessage.tsx
import React, { useState } from 'react';
import {
  alpha, Avatar, Box, Button, Chip, CircularProgress, Collapse, IconButton, Paper,
  Typography, useTheme
} from '@mui/material';
import {
  SmartToy as AgentIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  KeyboardArrowUp as ExpandLessIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { customStyles } from '@/lib/theme';

// Define structured message interface
export interface StructuredMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  message_type?: 'normal' | 'status' | 'tool_call' | 'transaction' | 'error' | 'clarification' | 'thinking';
  status?: 'pending' | 'completed' | 'error';
  action?: {
    type: 'confirm' | 'info' | 'need_user_signature' | 'completed' | 'rejected' | 'submitted';
    text: string;
    data?: any;
    tx_hash?: string;
  };
  
  // Extended fields for structured data
  summary?: {
    recommendation: string;
    source_token: string;
    target_token?: string;
    transaction_type: 'SINGLE_SWAP' | 'PORTFOLIO';
    security_analysis?: string;
    risk_level?: string;
    portfolio?: Array<{
      symbol: string;
      allocation: number;
      security_score: string | number;
    }>
  };
  
  // For thinking-type messages
  phase?: string;
  progress?: {
    current_step?: number;
    total_steps?: number;
    step_name?: string;
  };
  
  // For tool_call type messages
  tool?: {
    name: string;
    params: Record<string, any>;
  };
  
  // Optional flag for thinking display
  thinking_display?: boolean;
}

interface StructuredMessageProps {
  message: StructuredMessage;
  onConfirmTransaction?: (data: any) => void;
  onSignTransaction?: (data: any) => void;
}

const StructuredMessage: React.FC<StructuredMessageProps> = ({
  message,
  onConfirmTransaction,
  onSignTransaction
}) => {
  const theme = useTheme();
  
  // For expandable thinking content if needed
  const [showDetails, setShowDetails] = useState(false);
  
  // 首先檢查是否為思考類型消息，如果是則使用特殊渲染
  if (message.thinking_display || message.message_type === 'thinking') {
    return (
      <Box
        sx={{ 
          p: 2, 
          my: 1, 
          bgcolor: alpha(theme.palette.primary.main, 0.05), 
          borderRadius: 2,
          borderLeft: `3px solid ${theme.palette.primary.main}`,
        }}
      >
        <Typography variant="subtitle2">Thinking Processing:</Typography>
        <Typography sx={{ fontStyle: 'italic' }} variant="body2">
          {message.text}
        </Typography>
        
        {/* 顯示時間戳 */}
        <Typography
          sx={{
            display: 'block',
            mt: 1,
            textAlign: 'right',
            opacity: 0.7,
          }}
          variant="caption"
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Box>
    );
  }
  
  // Get avatar based on sender
  const getAvatar = () => {
    if (message.sender === 'user') {
      return (
        <Avatar
          sx={{
            bgcolor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            width: 38,
            height: 38
          }}
        >
          <PersonIcon />
        </Avatar>
      );
    } else if (message.sender === 'system') {
      return (
        <Avatar
          sx={{
            bgcolor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
            width: 38,
            height: 38
          }}
        >
          <InfoIcon />
        </Avatar>
      );
    } else {
      return (
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            width: 38,
            height: 38
          }}
        >
          {message.message_type === 'thinking' ? <PsychologyIcon /> : <AgentIcon />}
        </Avatar>
      );
    }
  };
  
  // Get message bubble style based on sender
  const getBubbleStyle = () => {
    if (message.sender === 'user') {
      return customStyles.chatBubbles.user;
    } else if (message.sender === 'system') {
      return {
        backgroundColor: alpha(theme.palette.info.main, 0.1),
        color: theme.palette.text.primary,
        borderRadius: '0 12px 12px 12px',
        borderLeft: `3px solid ${theme.palette.info.main}`
      };
    } else {
      return customStyles.chatBubbles.agent;
    }
  };
  
  // Message type label chip
  const renderMessageTypeLabel = () => {
    switch (message.message_type) {
    case 'thinking':
      return <Chip color="primary" label={message.phase || "Thinking"} size="small" sx={{ mb: 1 }} />;
    case 'tool_call':
      return <Chip color="info" label={`Tools: ${message.tool?.name}`} size="small" sx={{ mb: 1 }} />;
    case 'transaction':
      return <Chip color="secondary" label="Trade" size="small" sx={{ mb: 1 }} />;
    case 'error':
      return <Chip color="error" label="Error" size="small" sx={{ mb: 1 }} />;
    default:
      return null;
    }
  };
  
  // Handle text formatting (supporting paragraphs and lists)
  const renderFormattedText = () => {
    if (!message.text) return null;
    
    // Split by double newlines for paragraphs
    const paragraphs = message.text.split('\n\n');
    
    return (
      <>
        {paragraphs.map((paragraph, index) => {
          // Check if paragraph contains list items (lines starting with - or *)
          if (paragraph.includes('\n- ') || paragraph.includes('\n* ')) {
            // Split into normal text and list items
            const parts = paragraph.split(/\n(?=[-*] )/);
            
            return (
              <Box key={index} sx={{ mb: 1.5 }}>
                {parts.map((part, pIndex) => {
                  if (part.startsWith('- ') || part.startsWith('* ')) {
                    // List item
                    return (
                      <Box key={`item-${pIndex}`} sx={{ display: 'flex', ml: 1, mb: 0.5 }}>
                        <Typography sx={{ mr: 1 }} variant="body1">•</Typography>
                        <Typography variant="body1">{part.replace(/^[-*] /, '')}</Typography>
                      </Box>
                    );
                  } else {
                    // Normal text
                    return (
                      <Typography key={`text-${pIndex}`} sx={{ mb: 1 }} variant="body1">
                        {part}
                      </Typography>
                    );
                  }
                })}
              </Box>
            );
          } else {
            // Regular paragraph, preserving single line breaks
            return (
              <Typography key={index} sx={{ mb: 1.5, whiteSpace: 'pre-line' }} variant="body1">
                {paragraph}
              </Typography>
            );
          }
        })}
      </>
    );
  };
  
  // Portfolio visualization (if available)
  const renderPortfolio = () => {
    if (!message.summary?.portfolio || message.summary.portfolio.length === 0) {
      return null;
    }
    
    return (
      <Box sx={{ mt: 2, mb: 2, p: 1.5, bgcolor: alpha(theme.palette.background.default, 0.5), borderRadius: 1 }}>
        <Typography gutterBottom variant="subtitle2">Portfolio Allocation:</Typography>
        
        {message.summary.portfolio.map((item, index) => (
          <Box key={index} sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">{item.symbol}</Typography>
              <Typography fontWeight={500} variant="body2">{item.allocation}%</Typography>
            </Box>
            
            {/* Allocation bar */}
            <Box sx={{ width: '100%', height: 6, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 3 }}>
              <Box 
                sx={{ 
                  height: '100%', 
                  width: `${item.allocation}%`, 
                  bgcolor: theme.palette.primary.main,
                  borderRadius: 3 
                }} 
              />
            </Box>
            
            <Typography color="text.secondary" variant="caption">
              Security Score: {item.security_score}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };
  
  // Special handling for thinking-type messages
  const renderThinkingContent = () => {
    if (message.message_type !== 'thinking') return null;
    
    return (
      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography color="text.secondary" variant="body2">
            {message.phase || 'AI Analysis in Progress'}
          </Typography>
          
          <IconButton onClick={() => setShowDetails(!showDetails)} size="small">
            {showDetails ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Box>
        
        <Collapse in={showDetails}>
          <Typography 
            color="text.secondary"
            sx={{ 
              whiteSpace: 'pre-line',
              p: 1.5,
              backgroundColor: alpha(theme.palette.background.default, 0.3),
              borderRadius: 1,
              fontSize: '0.9rem'
            }} 
            variant="body2"
          >
            {message.text}
          </Typography>
        </Collapse>
        
        {/* Progress indicator if available */}
        {message.progress && message.progress.current_step && message.progress.total_steps && (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography color="text.secondary" variant="caption">
                {message.progress.step_name || `Step ${message.progress.current_step} of ${message.progress.total_steps}`}
              </Typography>
              <Typography color="text.secondary" variant="caption">
                {Math.round((message.progress.current_step / message.progress.total_steps) * 100)}%
              </Typography>
            </Box>
            <Box 
              sx={{ 
                width: '100%', 
                height: 4, 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{ 
                  height: '100%', 
                  width: `${(message.progress.current_step / message.progress.total_steps) * 100}%`, 
                  bgcolor: theme.palette.primary.main,
                }} 
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  };
  
  // Action buttons
  const renderActions = () => {
    if (!message.action) return null;
    
    return (
      <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        {message.action.type === 'confirm' && (
          <Button
            color="success"
            onClick={() => onConfirmTransaction?.(message.action?.data)}
            size="small"
            startIcon={<CheckCircleIcon />}
            sx={{ borderRadius: 1.5 }}
            variant="contained"
          >
            {message.action.text}
          </Button>
        )}
        
        {message.action.type === 'info' && (
          <Button
            color="info"
            size="small"
            startIcon={<InfoIcon />}
            sx={{ borderRadius: 1.5 }}
            variant="outlined"
          >
            {message.action.text}
          </Button>
        )}
        
        {message.action.type === 'need_user_signature' && (
          <Button
            color="primary"
            onClick={() => onSignTransaction?.(message.action?.data)}
            size="small"
            sx={{ borderRadius: 1.5 }}
            variant="contained"
          >
            {message.action.text}
          </Button>
        )}
        
        {message.action.type === 'submitted' && message.action.tx_hash && (
          <Chip 
            color="success" 
            icon={<CheckCircleIcon />}
            label={`Tx: ${message.action.tx_hash.substring(0, 6)}...${message.action.tx_hash.substring(38)}`}
            size="small"
            sx={{ fontFamily: 'monospace' }}
          />
        )}
        
        {message.action.type === 'completed' && (
          <Typography color="success.main" variant="body2">
            {message.action.text}
          </Typography>
        )}
        
        {message.action.type === 'rejected' && (
          <Typography color="error.main" variant="body2">
            {message.action.text}
          </Typography>
        )}
      </Box>
    );
  };
  
  // Status indicator (for transaction states)
  const renderStatus = () => {
    if (!message.status) return null;
    
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 1,
          color: message.status === 'completed'
            ? 'success.main'
            : message.status === 'error'
              ? 'error.main'
              : 'info.main'
        }}
      >
        {message.status === 'pending' && <CircularProgress size={14} sx={{ mr: 1 }} />}
        {message.status === 'completed' && <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />}
        {message.status === 'error' && <CancelIcon fontSize="small" sx={{ mr: 1 }} />}
        <Typography variant="caption">
          {message.status === 'pending' ? 'Processing...' :
            message.status === 'completed' ? 'Completed' : 'Failed'}
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 1.5,
        maxWidth: '85%',
        alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
        mb: 2
      }}
    >
      {getAvatar()}
      
      <Paper
        elevation={0}
        sx={{
          ...getBubbleStyle(),
          p: 2,
          maxWidth: 'calc(100% - 50px)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {renderMessageTypeLabel()}
        
        {/* For thinking messages, we can render differently to normal messages */}
        {message.message_type === 'thinking' ? (
          renderThinkingContent()
        ) : (
          renderFormattedText()
        )}
        
        {renderPortfolio()}
        {renderStatus()}
        {renderActions()}
        
        <Typography
          sx={{
            display: 'block',
            mt: 1,
            textAlign: message.sender === 'user' ? 'right' : 'left',
            opacity: 0.7,
          }}
          variant="caption"
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Paper>
    </Box>
  );
};

export default StructuredMessage;