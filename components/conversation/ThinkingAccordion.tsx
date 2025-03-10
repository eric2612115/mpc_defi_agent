// components/conversation/ThinkingAccordion.tsx
import React, { useState } from 'react';
import { 
  alpha, 
  Box, 
  Collapse, 
  IconButton, 
  LinearProgress, 
  Typography, 
  useTheme 
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  KeyboardArrowUp as ExpandLessIcon,
  KeyboardArrowDown as ExpandMoreIcon,
} from '@mui/icons-material';
import { StructuredMessage } from './StructuredMessage';

interface ThinkingAccordionProps {
  thinkingMessages: StructuredMessage[];
  currentStep?: number;
  totalSteps?: number;
}

const ThinkingAccordion: React.FC<ThinkingAccordionProps> = ({
  thinkingMessages,
  currentStep,
  totalSteps
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  // No thinking messages to display
  if (thinkingMessages.length === 0) {
    return null;
  }

  // Calculate progress percentage
  const progressPercentage = currentStep && totalSteps 
    ? Math.round((currentStep / totalSteps) * 100)
    : null;

  // Get the most recent thinking message for the collapsed view
  const latestMessage = thinkingMessages[thinkingMessages.length - 1];

  return (
    <Box 
      sx={{ 
        mt: 2, 
        mb: 2,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
        overflow: 'hidden',
      }}
    >
      {/* Header - Always visible */}
      <Box
        sx={{
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderBottom: expanded ? `1px solid ${theme.palette.divider}` : 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PsychologyIcon 
            color="primary" 
            fontSize="small" 
            sx={{ mr: 1 }} 
          />
          <Typography variant="subtitle2">
            AI Thinking Process
          </Typography>
        </Box>
        
        <IconButton 
          onClick={() => setExpanded(!expanded)} 
          size="small"
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Collapsed view - Preview of thought process */}
      {!expanded && (
        <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.background.paper, 0.4) }}>
          <Typography 
            color="text.secondary" 
            sx={{ 
              fontSize: '0.9rem',
              fontStyle: 'italic',
              mb: 1,
            }} 
            variant="body2"
          >
            {latestMessage.text.length > 100 
              ? `${latestMessage.text.substring(0, 100)}...` 
              : latestMessage.text}
          </Typography>
          
          {progressPercentage !== null && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography color="text.secondary" variant="caption">
                  Thinking progress
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  {progressPercentage}%
                </Typography>
              </Box>
              <LinearProgress 
                sx={{ height: 4, borderRadius: 2 }} 
                value={progressPercentage} 
                variant="determinate" 
              />
            </Box>
          )}
        </Box>
      )}

      {/* Expanded view - Full thought timeline */}
      <Collapse in={expanded}>
        <Box 
          sx={{ 
            p: 1.5, 
            bgcolor: alpha(theme.palette.background.paper, 0.4),
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          {thinkingMessages.map((message, index) => (
            <Box 
              key={index} 
              sx={{ 
                mb: 2, 
                pb: 2,
                borderBottom: index < thinkingMessages.length - 1 
                  ? `1px dashed ${alpha(theme.palette.divider, 0.5)}` 
                  : 'none'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography 
                  color="primary" 
                  fontWeight={500} 
                  sx={{ mr: 1 }} 
                  variant="caption"
                >
                  Step {index + 1}:
                </Typography>
                
                <Typography 
                  fontWeight={500} 
                  variant="body2"
                >
                  {message.phase || 'Thinking'}
                </Typography>
              </Box>
              
              <Typography 
                color="text.secondary" 
                sx={{ whiteSpace: 'pre-line', pl: 2 }} 
                variant="body2"
              >
                {message.text}
              </Typography>
              
              <Typography
                sx={{
                  display: 'block',
                  mt: 0.5,
                  textAlign: 'right',
                  opacity: 0.6,
                }}
                variant="caption"
              >
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default ThinkingAccordion;