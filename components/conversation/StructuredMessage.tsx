// components/conversation/StructuredMessage.tsx
import React from 'react';
import {
  alpha, Avatar, Box, Button, Chip, CircularProgress, Paper,
  Typography, useTheme
} from '@mui/material';
import {
  SmartToy as AgentIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { customStyles } from '@/lib/theme';

// 定義結構化消息接口
export interface StructuredMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  message_type?: 'normal' | 'thinking' | 'status' | 'tool_call' | 'transaction' | 'error' | 'clarification';
  status?: 'pending' | 'completed' | 'error';
  action?: {
    type: 'confirm' | 'info' | 'need_user_signature' | 'completed' | 'rejected' | 'submitted';
    text: string;
    data?: any;
    tx_hash?: string;
  };
  
  // 擴展字段 - 結構化數據
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
  
  phase?: string; // 用於thinking類型消息
  tool?: {
    name: string;
    params: Record<string, any>;
  }; // 用於tool_call類型消息
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
  
  // 根據發送者獲取頭像
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
          <AgentIcon />
        </Avatar>
      );
    }
  };
  
  // 根據消息類型獲取氣泡樣式
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
  
  // 消息類型標籤
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
  
  // 處理文本格式化 (支持段落和列表)
  const renderFormattedText = () => {
    if (!message.text) return null;
    
    // 按雙換行符分割段落
    const paragraphs = message.text.split('\n\n');
    
    return (
      <>
        {paragraphs.map((paragraph, index) => {
          // 檢查是否包含列表項 (以- 或*開頭的行)
          if (paragraph.includes('\n- ') || paragraph.includes('\n* ')) {
            // 拆分為普通文本和列表項
            const parts = paragraph.split(/\n(?=[-*] )/);
            
            return (
              <Box key={index} sx={{ mb: 1.5 }}>
                {parts.map((part, pIndex) => {
                  if (part.startsWith('- ') || part.startsWith('* ')) {
                    // 列表項
                    return (
                      <Box key={`item-${pIndex}`} sx={{ display: 'flex', ml: 1, mb: 0.5 }}>
                        <Typography sx={{ mr: 1 }} variant="body1">•</Typography>
                        <Typography variant="body1">{part.replace(/^[-*] /, '')}</Typography>
                      </Box>
                    );
                  } else {
                    // 普通文本
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
            // 普通段落，保留單個換行符
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
  
  // 投資組合視覺化 (如果有)
  const renderPortfolio = () => {
    if (!message.summary?.portfolio || message.summary.portfolio.length === 0) {
      return null;
    }
    
    return (
      <Box sx={{ mt: 2, mb: 2, p: 1.5, bgcolor: alpha(theme.palette.background.default, 0.5), borderRadius: 1 }}>
        <Typography gutterBottom variant="subtitle2">投資組合分配:</Typography>
        
        {message.summary.portfolio.map((item, index) => (
          <Box key={index} sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">{item.symbol}</Typography>
              <Typography fontWeight={500} variant="body2">{item.allocation}%</Typography>
            </Box>
            
            {/* 分配比例條 */}
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
              安全評分: {item.security_score}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };
  
  // 操作按鈕
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
  
  // 狀態指示器 (對於交易狀態等)
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
          {message.status === 'pending' ? '處理中...' :
            message.status === 'completed' ? '已完成' : '失敗'}
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
        {renderFormattedText()}
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