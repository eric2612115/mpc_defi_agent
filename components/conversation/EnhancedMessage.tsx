// components/conversation/EnhancedMessage.tsx
import React, { useState } from 'react';
import {
  Box, Typography, Chip, CircularProgress, Button, useTheme, alpha,
  Paper, Avatar, Collapse, IconButton, Divider, Alert, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, LinearProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  SmartToy as AgentIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { customStyles } from '@/lib/theme';

// Expanded message interface with all the analysis details
export interface EnhancedMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  message_type?: 'normal' | 'thinking' | 'status' | 'tool_call' | 'transaction' | 'error' | 'clarification';
  status?: 'pending' | 'completed' | 'error';
  action?: {
    type: 'confirm' | 'decline' | 'info' | 'need_user_signature' | 'completed' | 'rejected' | 'submitted';
    text: string;
    data?: any;
    tx_hash?: string;
  };
  
  // New fields for enhanced information
  analysis?: {
    source_token?: string;
    target_tokens?: string[];
    blockchain?: string;
    amount?: number;
    security_analysis?: string;
    contract_risk?: string;
    recommendation?: string;
    safe_to_execute?: boolean;
  };
  
  // Token information
  tokens?: Array<{
    symbol: string;
    name?: string;
    address?: string;
    security_score?: number | string;
    allocation?: number;
    risk_level?: string;
    price?: number;
    liquidity?: number;
    details?: any;
  }>;
  
  // Agent thinking process
  thinking_steps?: Array<{
    phase: string;
    question: string;
    answer: string;
  }>;
  
  // Progress indicators
  progress?: {
    current_step?: number;
    total_steps?: number;
    step_name?: string;
  };
}

interface EnhancedMessageProps {
  message: EnhancedMessage;
  onConfirmTransaction?: (data: any) => void;
  onSignTransaction?: (data: any) => void;
}

const EnhancedMessage: React.FC<EnhancedMessageProps> = ({
  message,
  onConfirmTransaction,
  onSignTransaction
}) => {
  const theme = useTheme();
  const [showDetails, setShowDetails] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  
  // Helper function for rendering multi-line text with proper formatting
  const formatMessageText = (text: string) => {
    if (!text) return '';
    
    // Split by double newlines for paragraphs
    const paragraphs = text.split('\n\n');
    
    return (
      <>
        {paragraphs.map((paragraph, i) => {
          // Check if paragraph contains list items (lines starting with - or *)
          if (paragraph.trim().match(/^[-*]\s/m)) {
            const listItems = paragraph.split('\n').filter(line => line.trim());
            
            return (
              <Box key={i} sx={{ mb: 1.5 }}>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {listItems.map((item, j) => (
                    <li key={j}>
                      <Typography variant="body1" component="span">
                        {item.replace(/^[-*]\s/, '')}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            );
          }
          
          // Handle single line paragraphs
          return (
            <Typography 
              key={i} 
              variant="body1" 
              sx={{ 
                mb: 1.5,
                whiteSpace: 'pre-line' // Preserve single newlines
              }}
            >
              {paragraph}
            </Typography>
          );
        })}
      </>
    );
  };
  
  // Handle button clicks
  const handleActionButton = () => {
    if (!message.action) return;
    
    if (message.action.type === 'confirm' && onConfirmTransaction) {
      onConfirmTransaction(message.action.data);
    } else if (message.action.type === 'need_user_signature' && onSignTransaction) {
      onSignTransaction(message.action.data);
    }
  };
  
  // Different styling based on sender
  const getBubbleStyle = () => {
    if (message.sender === 'user') {
      return {
        ...customStyles.chatBubbles.user,
        maxWidth: 'calc(100% - 50px)'
      };
    } else if (message.sender === 'system') {
      return {
        backgroundColor: alpha(theme.palette.info.main, 0.1),
        color: theme.palette.text.primary,
        borderRadius: '0 12px 12px 12px',
        borderLeft: `3px solid ${theme.palette.info.main}`,
        maxWidth: 'calc(100% - 50px)'
      };
    } else {
      return {
        ...customStyles.chatBubbles.agent,
        maxWidth: 'calc(100% - 50px)'
      };
    }
  };
  
  // Get the appropriate avatar
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
  
  // Render message type chip if it's a special type
  const renderMessageTypeChip = () => {
    if (message.message_type === 'tool_call') {
      return (
        <Chip 
          size="small" 
          label="Processing" 
          color="info" 
          sx={{ mb: 1, fontSize: '0.7rem' }}
        />
      );
    } else if (message.message_type === 'thinking') {
      return (
        <Chip 
          size="small" 
          label="Thinking" 
          color="secondary" 
          sx={{ mb: 1, fontSize: '0.7rem' }}
        />
      );
    } else if (message.message_type === 'transaction') {
      return (
        <Chip 
          size="small" 
          label="Transaction" 
          color="primary" 
          sx={{ mb: 1, fontSize: '0.7rem' }}
        />
      );
    }
    
    return null;
  };

  // Render token details if available
  const renderTokenDetails = () => {
    if (!message.tokens || message.tokens.length === 0) return null;
    
    return (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>Token Allocation</Typography>
          <IconButton size="small" onClick={() => setShowTokens(!showTokens)}>
            {showTokens ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Box>
        
        <Collapse in={showTokens}>
          <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableRow>
                  <TableCell>Token</TableCell>
                  <TableCell align="right">Allocation</TableCell>
                  <TableCell align="right">Security Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {message.tokens.map((token, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {token.symbol}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {token.allocation ? `${token.allocation}%` : 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={token.security_score || 'N/A'} 
                        size="small"
                        color={
                          typeof token.security_score === 'number' || typeof token.security_score === 'string' 
                            ? Number(token.security_score) >= 7 
                              ? 'success' 
                              : Number(token.security_score) >= 5 
                                ? 'warning' 
                                : 'error'
                            : 'default'
                        }
                        sx={{ minWidth: 30 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Progress bars for allocations */}
          <Box sx={{ mb: 2 }}>
            {message.tokens.map((token, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption">{token.symbol}</Typography>
                  <Typography variant="caption">{token.allocation}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={token.allocation || 0} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: Number(token.security_score) >= 7 
                        ? theme.palette.success.main 
                        : Number(token.security_score) >= 5 
                          ? theme.palette.warning.main 
                          : theme.palette.error.main
                    }
                  }} 
                />
              </Box>
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  };
  
  // Render analysis info if available
  const renderAnalysisInfo = () => {
    if (!message.analysis) return null;
    
    return (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>Analysis Details</Typography>
          <IconButton size="small" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Box>
        
        <Collapse in={showDetails}>
          {message.analysis.security_analysis && (
            <Alert 
              severity={message.analysis.safe_to_execute ? "success" : "warning"}
              sx={{ mb: 2, borderRadius: 1 }}
              icon={<SecurityIcon />}
            >
              <Typography variant="subtitle2">Security Analysis</Typography>
              <Typography variant="body2">{message.analysis.security_analysis}</Typography>
              {message.analysis.contract_risk && (
                <Typography variant="body2">Risk Level: {message.analysis.contract_risk}</Typography>
              )}
            </Alert>
          )}
          
          <Box sx={{ 
            p: 1.5, 
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 1,
            mb: 2
          }}>
            <Typography variant="caption" color="text.secondary">Transaction Details</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
              {message.analysis.source_token && (
                <Chip 
                  label={`From: ${message.analysis.source_token}`} 
                  size="small" 
                  variant="outlined"
                />
              )}
              {message.analysis.target_tokens && message.analysis.target_tokens.length > 0 && (
                <Chip 
                  label={`To: ${message.analysis.target_tokens.join(', ')}`} 
                  size="small" 
                  variant="outlined"
                />
              )}
              {message.analysis.amount && (
                <Chip 
                  label={`Amount: ${message.analysis.amount}`} 
                  size="small" 
                  variant="outlined"
                />
              )}
              {message.analysis.blockchain && (
                <Chip 
                  label={`Blockchain: ${message.analysis.blockchain}`} 
                  size="small" 
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        </Collapse>
      </Box>
    );
  };
  
  // Render thinking steps if available
  const renderThinkingSteps = () => {
    if (!message.thinking_steps || message.thinking_steps.length === 0) return null;
    
    return (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>AI Thinking Process</Typography>
          <IconButton size="small" onClick={() => setShowThinking(!showThinking)}>
            {showThinking ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Box>
        
        <Collapse in={showThinking}>
          <Box sx={{ 
            border: `1px solid ${theme.palette.divider}`, 
            borderRadius: 1,
            mb: 2,
            overflow: 'hidden'
          }}>
            {message.thinking_steps.map((step, index) => (
              <Box key={index}>
                {index > 0 && <Divider />}
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: index % 2 === 0 
                    ? 'transparent' 
                    : alpha(theme.palette.background.default, 0.5) 
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Chip 
                      label={step.phase} 
                      size="small" 
                      sx={{ 
                        mr: 1, 
                        textTransform: 'capitalize',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      }}
                    />
                    <Typography variant="body2" fontWeight={500}>{step.question}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>{step.answer}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  };
  
  // Render progress indicator if available
  const renderProgress = () => {
    if (!message.progress) return null;
    
    const { current_step, total_steps, step_name } = message.progress;
    if (!current_step || !total_steps) return null;
    
    const progress = (current_step / total_steps) * 100;
    
    return (
      <Box sx={{ mt: 2, mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            {step_name || `Processing step ${current_step} of ${total_steps}`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {Math.round(progress)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 4, borderRadius: 2 }}
        />
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
        maxWidth: message.sender === 'user' ? '75%' : '85%',
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
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {renderMessageTypeChip()}
        {formatMessageText(message.text)}
        {renderProgress()}
        {renderTokenDetails()}
        {renderAnalysisInfo()}
        {renderThinkingSteps()}

        {/* Status indicator */}
        {message.status && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 1,
            color: message.status === 'completed'
              ? 'success.main'
              : message.status === 'error'
                ? 'error.main'
                : 'info.main'
          }}>
            {message.status === 'pending' && <CircularProgress size={14} sx={{ mr: 1 }} />}
            {message.status === 'completed' && <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />}
            {message.status === 'error' && <CancelIcon fontSize="small" sx={{ mr: 1 }} />}
            <Typography variant="caption">
              {message.status === 'pending' ? 'Processing...' :
                message.status === 'completed' ? 'Completed' : 'Failed'}
            </Typography>
          </Box>
        )}

        {/* Action buttons */}
        {message.action && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            {message.action.type === 'confirm' && (
              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={handleActionButton}
                startIcon={<CheckCircleIcon />}
                sx={{ borderRadius: 1.5 }}
              >
                {message.action.text}
              </Button>
            )}
            {message.action.type === 'info' && (
              <Button
                variant="outlined"
                size="small"
                color="info"
                startIcon={<InfoIcon />}
                sx={{ borderRadius: 1.5 }}
              >
                {message.action.text}
              </Button>
            )}
            {message.action.type === 'need_user_signature' && (
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={handleActionButton}
                sx={{ borderRadius: 1.5 }}
              >
                {message.action.text}
              </Button>
            )}
            {message.action.type === 'submitted' && message.action.tx_hash && (
              <Chip 
                icon={<CheckCircleIcon />} 
                label={`Tx: ${message.action.tx_hash.substring(0, 6)}...${message.action.tx_hash.substring(38)}`}
                color="success"
                size="small"
                sx={{ fontFamily: 'monospace' }}
              />
            )}
            {message.action.type === 'completed' && (
              <Typography variant="body2" color="success.main">
                {message.action.text}
              </Typography>
            )}
            {message.action.type === 'rejected' && (
              <Typography variant="body2" color="error.main">
                {message.action.text}
              </Typography>
            )}
          </Box>
        )}

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            textAlign: message.sender === 'user' ? 'right' : 'left',
            opacity: 0.7,
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Paper>
    </Box>
  );
};

export default EnhancedMessage;