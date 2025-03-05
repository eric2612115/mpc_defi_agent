// components/conversation/ConversationMessage.tsx
import React from 'react';
import { 
  alpha, 
  Avatar, 
  Box, 
  Button, 
  Chip, 
  CircularProgress, 
  Paper, 
  Typography, 
  useTheme 
} from '@mui/material';
import { 
  SmartToy as AgentIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { customStyles } from '@/lib/theme';

// Message type
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

  // Helper to determine which action to call
  const handleActionClick = () => {
    if (!message.action) return;
    
    if (message.action.type === 'confirm' && onConfirmTransaction) {
      onConfirmTransaction(message.action.data);
    } else if (message.action.type === 'need_user_signature' && onSignTransaction) {
      onSignTransaction(message.action.data);
    }
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
      <Avatar
        sx={{
          bgcolor: message.sender === 'user'
            ? theme.palette.secondary.main
            : message.sender === 'system'
              ? theme.palette.info.main
              : theme.palette.primary.main,
          color: message.sender === 'user'
            ? theme.palette.secondary.contrastText
            : message.sender === 'system'
              ? theme.palette.info.contrastText
              : theme.palette.primary.contrastText,
          width: 38,
          height: 38
        }}
      >
        {message.sender === 'user' ? <PersonIcon /> : 
          message.sender === 'system' ? <InfoIcon /> : <AgentIcon />}
      </Avatar>
      
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: message.sender === 'user' 
            ? customStyles.chatBubbles.user.backgroundColor 
            : message.sender === 'system'
              ? alpha(theme.palette.info.main, 0.1)
              : customStyles.chatBubbles.agent.backgroundColor,
          borderRadius: message.sender === 'user' 
            ? '12px 0 12px 12px' 
            : '0 12px 12px 12px',
          borderRight: message.sender === 'user' 
            ? customStyles.chatBubbles.user.borderRight 
            : 'none',
          borderLeft: message.sender === 'agent' 
            ? customStyles.chatBubbles.agent.borderLeft 
            : message.sender === 'system'
              ? `3px solid ${theme.palette.info.main}`
              : 'none',
          position: 'relative',
          maxWidth: 'calc(100% - 50px)',
          overflow: 'hidden',
          wordBreak: 'break-word',
        }}
      >
        {/* Show a chip for tool calls */}
        {message.message_type === 'tool_call' && (
          <Chip 
            color="info" 
            label="Tool Call" 
            size="small" 
            sx={{ mb: 1, fontSize: '0.7rem' }}
          />
        )}
        
        {/* Hide excessively detailed AI thinking or tool calls from the user */}
        {message.message_type === 'thinking' || message.message_type === 'tool_call' ? (
          <Box sx={{ maxHeight: '40px', overflow: 'hidden', position: 'relative' }}>
            <Typography color="text.secondary" sx={{ opacity: 0.7 }} variant="body2">
              AI is analyzing data...
            </Typography>
            <Box
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0,
                height: '25px',
                background: `linear-gradient(to bottom, transparent, ${message.sender === 'user' 
                  ? customStyles.chatBubbles.user.backgroundColor 
                  : message.sender === 'system'
                    ? alpha(theme.palette.info.main, 0.1)
                    : customStyles.chatBubbles.agent.backgroundColor})` 
              }}
            />
          </Box>
        ) : (
          <Typography sx={{ whiteSpace: 'pre-line' }} variant="body1">
            {message.text}
          </Typography>
        )}

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
                onClick={handleActionClick}
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
                onClick={handleActionClick}
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