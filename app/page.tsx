'use client';
import React, { useEffect, useRef, useState } from 'react';
import { 
  Alert, 
  alpha, 
  Box, 
  Card, 
  CardContent, 
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { 
  SmartToy as AgentIcon,
  InfoOutlined as InfoIcon,
  LightbulbOutlined as LightbulbIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useAccount } from 'wagmi';
import MainLayout from '@/components/layout/MainLayout';
import StructuredMessage from '@/components/conversation/StructuredMessage';
import ThinkingAccordion from '@/components/conversation/ThinkingAccordion'; // Import the new component
import type { StructuredMessage as StructuredMessageType } from '@/components/conversation/StructuredMessage';

import apiClient from '@/lib/apiClient';

// WebSocket URL
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://0.0.0.0:8000/ws';

export default function HomePage() {
  const theme = useTheme();
  const { address, isConnected } = useAccount();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<StructuredMessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // New state for thinking messages
  const [thinkingMessages, setThinkingMessages] = useState<StructuredMessageType[]>([]);
  const [currentThinkingStep, setCurrentThinkingStep] = useState<number>(0);
  const [totalThinkingSteps, setTotalThinkingSteps] = useState<number>(0);
  
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [hasAgent, setHasAgent] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, thinkingMessages]);

  // Check agent status and load previous messages
  useEffect(() => {
    if (mounted && isConnected && address) {
      console.log('Checking agent status for address:', address);
      checkAgentStatus(address);
      fetchPreviousMessages();
    }
  }, [mounted, isConnected, address]);

  // WebSocket connection
  useEffect(() => {
    if (mounted && isConnected && address && hasAgent) {
      console.log('Connecting WebSocket - user connected and has agent');
      connectWebSocket();
    } else {
      console.log('Skipping WebSocket - conditions not met:', {
        mounted, 
        isConnected, 
        hasAddress: !!address,
        hasAgent
      });
    }

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [mounted, isConnected, address, hasAgent]);

  // Reset "isFirstLoad" when the component unmounts
  useEffect(() => {
    return () => {
      setIsFirstLoad(true);
    };
  }, []);

  const checkAgentStatus = async (userAddress: string) => {
    if (!userAddress) return;
    
    try {
      const response = await apiClient.checkAgentStatus(userAddress);
      if (response.data && response.data.has_agent) {
        setHasAgent(true);
      } else {
        setHasAgent(false);
      }
    } catch (error) {
      console.error('Error checking agent status:', error);
      setHasAgent(false);
    }
  };

  const connectWebSocket = () => {
    // Only establish WebSocket connection if user is connected and has agent
    if (!address || !hasAgent) {
      console.log('WebSocket connection skipped - wallet not connected or no agent');
      return;
    }
  
    try {
      const ws = new WebSocket(`${WS_URL}/${address}`);
    
      ws.onopen = () => {
        console.log('WebSocket connected');
        setWsConnected(true);
        setErrorMessage(null);
      };
      
      // Helper function to safely format timestamp
      const formatTimestamp = (timestamp: any): string => {
        // If timestamp is already a string, return it
        if (typeof timestamp === 'string') {
          return timestamp;
        }
        
        // If it's a number or valid date object
        try {
          return new Date(timestamp).toISOString();
        } catch (e) {
          // If conversion fails, return current time
          console.warn("Invalid timestamp format, using current time instead:", timestamp);
          return new Date().toISOString();
        }
      };
  
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received WebSocket message:", data);

          // Skip ping messages
          if (data.type === "ping") {
            console.log("Received ping message, ignoring");
            return;
          }
    
          // Use version with safe timestamp handling
          const safeData = {
            ...data,
            timestamp: formatTimestamp(data.timestamp)
          };
    
          // Handle different message types
          switch (data.message_type) {
          case 'status':
            // Status messages (like "AI is preparing...")
            setMessages(prev => [...prev, safeData]);
            break;
              
          case 'error':
            // Error messages
            setErrorMessage(data.text);
            setIsTyping(false);
            setThinkingMessages([]); // Clear thinking messages on error
            setMessages(prev => [...prev, safeData]);
            break;
              
          case 'thinking':
            setIsTyping(true);
            setThinkingMessages(prev => [...prev, safeData]);
            console.log("get thinking msg:", data);
            // 同時添加到主消息列表，但標記為思考類型
            const thinkingDisplayMessage = {
              ...safeData,
              id: `thinking-${Date.now()}`, // 確保ID唯一
              thinking_display: true
            };
            setMessages(prev => [...prev, thinkingDisplayMessage]);

            setIsTyping(true);
            setThinkingMessages(prev => [...prev, safeData]);
            break;
              
          case 'tool_call':
            // Tool usage messages - add to thinking collection
            setIsTyping(true);
            setThinkingMessages(prev => [...prev, safeData]);
            break;
              
          case 'transaction':
            // Transaction related messages
            setIsTyping(false);
            // Keep thinking messages but stop showing "typing" indicator
            setMessages(prev => [...prev, safeData]);
            break;
              
          case 'normal':
            // Regular messages from the AI
            setIsTyping(false);
            // Keep thinking messages in the state but stop showing "typing" indicator
              
            // Check if we need to update the message with an action
            const messageWithAction = {
              ...safeData,
              action: data.action ? {
                ...data.action,
              } : undefined
            };
              
            setMessages(prev => [...prev, messageWithAction]);
            break;
              
          default:
            // Handle any other message types
            setIsTyping(false);
            setMessages(prev => [...prev, safeData]);
          }
        } catch (e) {
          console.error("Error parsing WebSocket message:", e);
          setErrorMessage("Error processing message from server");
        }
      };
    
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setWsConnected(false);
        
        // Only attempt to reconnect if user is still connected and has agent
        setTimeout(() => {
          if (mounted && isConnected && address && hasAgent) {
            connectWebSocket();
          }
        }, 3000);
      };
    
      ws.onerror = (error) => {
        console.warn('WebSocket connection error - this is normal when wallet not connected or no agent');
        setErrorMessage('Connection error. Trying to reconnect...');
      };
    
      setWebsocket(ws);
    } catch (error) {
      console.warn('Error establishing WebSocket connection:', error);
    }
  };
  
  const fetchPreviousMessages = async () => {
    if (!address) return;
  
    try {
      // First try to use the apiClient - the most robust approach
      const response = await apiClient.getUserMessages(address);
      
      // Check if we got data back successfully
      if (response.data && response.data.messages && response.data.messages.length > 0) {
        const formattedMessages = response.data.messages.map((msg: any) => ({
          ...msg,
          timestamp: formatTimestamp(msg.timestamp) 
        }));
  
        setMessages(formattedMessages);
        setIsFirstLoad(false); // Successfully loaded messages
        return;
      } 
      
      // If no messages were found via API client, or if there was an error,
      // fallback to direct fetch (with error handling)
      try {
        const directResponse = await fetch(`/api/messages?wallet_address=${address}`);
        
        if (!directResponse.ok) {
          console.warn('Direct fetch for messages failed. Using welcome message.');
          // Instead of throwing, we'll gracefully handle by showing welcome message
        } else {
          const data = await directResponse.json();
          
          if (data.messages && data.messages.length > 0) {
            const formattedMessages = data.messages.map((msg: any) => ({
              ...msg,
              timestamp: formatTimestamp(msg.timestamp)
            }));
            
            setMessages(formattedMessages);
            setIsFirstLoad(false); // Successfully loaded messages
            return;
          }
        }
      } catch (directError) {
        console.warn('Error in direct fetch fallback:', directError);
        // Continue to fallback message
      }
      
      // Fallback: If both methods failed to get messages or returned empty arrays,
      // show a welcome message
      setMessages([
        {
          id: '1',
          sender: 'agent',
          text: "Hello! I'm your AI Trading Assistant. How can I help you today?",
          timestamp: new Date().toISOString(),
          message_type: 'normal',
        } as StructuredMessageType
      ]);
      setIsFirstLoad(false); // Used fallback welcome message
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Final fallback - show welcome message if all else failed
      setMessages([
        {
          id: '1',
          sender: 'agent',
          text: "Hello! I'm your AI Trading Assistant. How can I help you today?",
          timestamp: new Date().toISOString(),
          message_type: 'normal',
        } as StructuredMessageType
      ]);
      setIsFirstLoad(false); // Used fallback welcome message
    }
  };
  
  const handleSendMessage = () => {
    if (!input.trim() || !isConnected || !wsConnected) return;
  
    const userMessage: StructuredMessageType = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toISOString(),
      message_type: 'normal',
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Clear the previous thinking messages when sending a new message
    setThinkingMessages([]);
    setCurrentThinkingStep(0);
    setTotalThinkingSteps(0);
  
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({ query: input }));
    } else {
      setErrorMessage('Connection lost. Reconnecting...');
      connectWebSocket();
    }
  };

  const handleConfirmTransaction = async (data: any) => {
    console.log("Confirming transaction:", data);
  
    // Add a confirmation message
    const confirmMessage: StructuredMessageType = {
      id: Date.now().toString(),
      sender: 'system',
      text: 'Transaction confirmed. Processing...',
      timestamp: new Date().toISOString(),
      message_type: 'transaction',
      status: 'pending'
    };
  
    setMessages(prev => [...prev, confirmMessage]);
  
    // Simulate transaction process
    setTimeout(() => {
      const successMessage: StructuredMessageType = {
        id: Date.now().toString(),
        sender: 'system',
        text: 'Transaction successfully executed!',
        timestamp: new Date().toISOString(),
        message_type: 'transaction',
        status: 'completed',
        action: {
          type: 'completed',
          text: 'View Transaction',
          tx_hash: `0x${Math.random().toString(16).substring(2, 42)}`
        }
      };
    
      // Update the messages
      setMessages(prev => [...prev, successMessage]);
    }, 2000);
  };

  const handleSignTransaction = async (data: any) => {
    console.log("Requesting user signature for data:", data);
  
    // Simulate a signature prompt
    const confirmed = window.confirm("Do you want to sign this transaction?");
  
    if (confirmed) {
      try {
        // Simulate sending the signature
        setTimeout(() => {
          const successMessage: StructuredMessageType = {
            id: Date.now().toString(),
            sender: 'system',
            text: 'Transaction signed and submitted to blockchain',
            timestamp: new Date().toISOString(),
            message_type: 'transaction',
            status: 'completed',
            action: {
              type: 'submitted',
              text: 'Transaction submitted',
              tx_hash: data.tx_hash || `0x${Math.random().toString(16).substring(2, 42)}`
            }
          };
        
          setMessages(prev => [...prev, successMessage]);
        }, 1500);
      } catch (error) {
        console.error('Error sending signature:', error);
        setErrorMessage("Error sending signature");
      }
    } else {
      console.log("User cancelled signature");

      try {
        // Simulate rejection response
        const rejectMessage: StructuredMessageType = {
          id: Date.now().toString(),
          sender: 'system',
          text: 'Transaction cancelled by user',
          timestamp: new Date().toISOString(),
          message_type: 'transaction',
          status: 'error',
          action: {
            type: 'rejected',
            text: 'Transaction rejected',
          }
        };
      
        setMessages(prev => [...prev, rejectMessage]);
      } catch (error: any) {
        console.error('Error rejecting transaction:', error);
        setErrorMessage(error.message || 'Error rejecting transaction');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCloseError = () => {
    setErrorMessage(null);
  };

  // Helper function
  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) {
      return new Date().toISOString();
    }
    
    try {
      return new Date(timestamp).toISOString();
    } catch (e) {
      console.warn("Invalid timestamp format, using current time instead:", timestamp);
      return new Date().toISOString();
    }
  };

  // Example suggestions for new users
  const suggestions = [
    "Buy 1000 USDC worth of the top 5 tokens on Base chain",
    "What are the trending tokens today?",
    "Analyze my portfolio and recommend rebalancing",
    "Help me diversify with 5000 USDC across different sectors"
  ];

  // Don't render anything while first loading to prevent flicker
  if (isFirstLoad && isConnected) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  // Render the chat interface
  return (
    <MainLayout>
      <Box sx={{ pb: 2, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
        <Typography fontWeight={600} gutterBottom variant="h5">
          AI Trading Assistant
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }} variant="body2">
          Ask me to analyze markets, execute trades, or manage your portfolio with natural language
        </Typography>

        {/* Chat interface */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.customShadows?.light
          }}
        >
          {/* Chat header */}
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <Box
              sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                bgcolor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.primary.contrastText
              }}
            >
              <AgentIcon />
            </Box>
            <Box>
              <Typography fontWeight={600} variant="subtitle1">
                AI Assistant
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: wsConnected ? 'success.main' : 'error.main'
                  }}
                />
                <Typography color="text.secondary" variant="caption">
                  {wsConnected ? 'Connected' : 'Disconnected'}
                </Typography>
              </Box>
            </Box>
            <Chip 
              color="primary" 
              label="2/2 Multi-sig Wallet" 
              size="small" 
              sx={{ ml: 'auto' }} 
              variant="outlined" 
            />
          </Box>

          {/* Messages area */}
          <Box
            sx={{
              p: 2,
              flexGrow: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              bgcolor: alpha(theme.palette.background.default, 0.3),
            }}
          >
            {/* Welcome card for new users */}
            {messages.length <= 1 && (
              <Card
                elevation={0}
                sx={{ 
                  mb: 2, 
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                  overflow: 'visible'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <LightbulbIcon color="primary" sx={{ mr: 1.5, mt: 0.5 }} />
                    <Box>
                      <Typography fontWeight={600} gutterBottom variant="subtitle1">
                        Tips for using your AI Trading Assistant
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        I can help you manage your portfolio and execute trades using natural language commands. 
                        Simply describe what you want to do, and I&apos;ll handle the details.
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ mb: 1.5 }} variant="subtitle2">
                    Try asking me:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {suggestions.map((suggestion, index) => (
                      <Chip
                        key={index}
                        label={suggestion}
                        onClick={() => setInput(suggestion)}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          }
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Message bubbles */}
            {messages.map((message) => (
              <StructuredMessage
                key={message.id}
                message={message}
                onConfirmTransaction={handleConfirmTransaction}
                onSignTransaction={handleSignTransaction}
              />
            ))}

            {/* NEW: Thinking Accordion Component - only show if there are thinking messages */}
            {thinkingMessages.length > 0 && (
              <ThinkingAccordion 
                currentStep={currentThinkingStep}
                thinkingMessages={thinkingMessages}
                totalSteps={totalThinkingSteps}
              />
            )}

            {/* AI thinking indicator - only show basic indicator when no detailed thinking messages */}
            {isTyping && thinkingMessages.length === 0 && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, ml: 2 }}>
                <Box
                  sx={{ 
                    width: 38, 
                    height: 38, 
                    borderRadius: '50%', 
                    bgcolor: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.primary.contrastText
                  }}
                >
                  <AgentIcon />
                </Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    maxWidth: 'calc(85% - 50px)',
                    bgcolor: alpha(theme.palette.background.paper, 0.6), 
                    p: 2, 
                    borderRadius: 2,
                    borderLeft: `3px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CircularProgress size={16} sx={{ mr: 1.5 }} />
                    <Typography fontWeight={500} variant="body2">
                      Thinking...
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Empty state message */}
            {messages.length === 0 && !isTyping && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  opacity: 0.7
                }}
              >
                <Box
                  sx={{ 
                    p: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <InfoIcon fontSize="large" />
                </Box>
                <Typography gutterBottom variant="body1">
                  No messages yet
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Start by asking about trading or portfolio management
                </Typography>
              </Box>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input area */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                disabled={!wsConnected}
                fullWidth
                maxRows={4}
                multiline
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
                value={input}
                variant="outlined"
              />
              <IconButton
                color="primary"
                disabled={!input.trim() || isTyping || !wsConnected}
                onClick={handleSendMessage}
                sx={{
                  height: 56,
                  width: 56,
                  borderRadius: 2,
                  bgcolor: input.trim() ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Error message */}
        <Snackbar autoHideDuration={6000} onClose={handleCloseError} open={!!errorMessage}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
}