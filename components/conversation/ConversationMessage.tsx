// components/conversation/ConversationMessage.tsx
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

export interface Message {
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
    tool?: {
      name: string;
      params: Record<string, any>;
    };
  }

interface ConversationMessageProps {
  message: Message;
  onConfirmTransaction?: (data: any) => void;
  onSignTransaction?: (data: any) => void;
}

const ConversationMessage: React.FC<ConversationMessageProps> = ({
  message,
  onConfirmTransaction,
  onSignTransaction
}) => {
  const theme = useTheme();
  
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
                      <Typography component="span" variant="body1">
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
              sx={{ 
                mb: 1.5,
                whiteSpace: 'pre-line' // Preserve single newlines
              }} 
              variant="body1"
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
          color="info" 
          label={message.tool ? `${message.tool.name}` : "Tool Call"} 
          size="small" 
          sx={{ mb: 1, fontSize: '0.7rem' }}
        />
      );
    } else if (message.message_type === 'thinking') {
      return (
        <Chip 
          color="secondary" 
          label="Thinking" 
          size="small" 
          sx={{ mb: 1, fontSize: '0.7rem' }}
        />
      );
    } else if (message.message_type === 'transaction') {
      return (
        <Chip 
          color="primary" 
          label="Transaction" 
          size="small" 
          sx={{ mb: 1, fontSize: '0.7rem' }}
        />
      );
    }
    
    return null;
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
      }}
    >
      {getAvatar()}
      
      <Paper
        elevation={0}
        sx={getBubbleStyle()}
      >
        {renderMessageTypeChip()}
        
        {formatMessageText(message.text)}

        {/* Status indicator */}
        {message.status && (
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
        )}

        {/* Action buttons */}
        {message.action && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            {message.action.type === 'confirm' && (
              <Button
                color="success"
                onClick={handleActionButton}
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
                onClick={handleActionButton}
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
        )}

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

export default ConversationMessage;