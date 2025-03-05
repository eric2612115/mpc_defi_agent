// components/common/CreateAgentPrompt.tsx
'use client';
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  CircularProgress,
  alpha, 
  useTheme,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  SmartToy as SmartToyIcon, 
  Security as SecurityIcon,
  Check as CheckIcon,
  AccountBalanceWallet as WalletIcon,
  Shuffle as ShuffleIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

interface CreateAgentPromptProps {
  onCreateAgent: () => Promise<boolean>;
}

export default function CreateAgentPrompt({ onCreateAgent }: CreateAgentPromptProps) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [agentAddress, setAgentAddress] = useState<string | null>(null);

  // Define steps
  const steps = [
    'Learn about MPC Security',
    'Create AI Agent',
    'Fund Your Wallet'
  ];

  // Security features
  const securityFeatures = [
    {
      name: 'Multi-Party Computation (MPC)',
      description: 'Secures your transactions through advanced cryptography'
    },
    {
      name: '2/2 Signature Requirement',
      description: 'Both you and AI must approve each transaction'
    },
    {
      name: 'AI Risk Analysis',
      description: 'Advanced scam detection before any transaction execution'
    },
    {
      name: 'Whitelisted Protocols',
      description: 'Only verified contracts can interact with your assets'
    }
  ];

  // AI features
  const aiFeatures = [
    {
      name: 'Natural Language Trading',
      description: 'Execute complex trades using simple text commands'
    },
    {
      name: 'Portfolio Allocation',
      description: 'Intelligent asset allocation based on your preferences'
    },
    {
      name: 'Risk Assessment',
      description: 'Automated security checks before every transaction'
    },
    {
      name: 'Daily Analysis',
      description: 'Regular updates and insights on your investments'
    }
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCreateAgent = async () => {
    setLoading(true);
    try {
      const success = await onCreateAgent();
      if (success) {
        // Generate a fake MPC address
        const randomAddr = `0x${Array.from({length: 40}, () => 
          '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`;
        setAgentAddress(randomAddr);
        handleNext();
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <SecurityIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Secure Your Assets with MPC Technology
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                The AI Trading Assistant uses Multi-Party Computation (MPC) to create a secure 2/2 
                signature wallet. Both you and the AI must approve any transaction.
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
              gap: 3,
              mb: 4
            }}>
              {securityFeatures.map((feature, index) => (
                <Card key={index} elevation={0} sx={{ 
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: theme.customShadows.medium,
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        {feature.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                size="large"
                sx={{ 
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  minWidth: 200,
                  boxShadow: theme.customShadows.button
                }}
              >
                Continue
              </Button>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <SmartToyIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Create Your Personal AI Trading Assistant
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                Your AI assistant will help you manage your portfolio, analyze market trends, 
                and execute trades based on your instructions.
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
              gap: 3,
              mb: 4
            }}>
              {aiFeatures.map((feature, index) => (
                <Card key={index} elevation={0} sx={{ 
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: theme.customShadows.medium,
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={600}>
                        {feature.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{ 
                  px: 3,
                  borderRadius: 2,
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateAgent}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SmartToyIcon />}
                sx={{ 
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  minWidth: 200,
                  boxShadow: theme.customShadows.button
                }}
              >
                {loading ? 'Creating Agent...' : 'Create AI Agent'}
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <CheckIcon sx={{ 
                fontSize: 60, 
                color: theme.palette.success.main, 
                mb: 2,
                bgcolor: alpha(theme.palette.success.main, 0.1),
                p: 1,
                borderRadius: '50%'
              }} />
              <Typography variant="h5" fontWeight={600} gutterBottom>
                AI Agent Created Successfully!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1, maxWidth: 600, mx: 'auto' }}>
                Your AI Trading Assistant is now ready to use. A new MPC wallet has been created.
              </Typography>
              <Typography variant="subtitle2" sx={{ 
                p: 1.5, 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 1,
                maxWidth: 'fit-content',
                mx: 'auto',
                fontFamily: 'monospace',
                mt: 2
              }}>
                MPC Wallet Address: {agentAddress}
              </Typography>
            </Box>

            <Card elevation={0} sx={{ 
              mb: 4,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 2,
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Next Steps:
                </Typography>
                <List disablePadding>
                  <ListItem disablePadding sx={{ mb: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <MoneyIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Fund your MPC wallet"
                      secondary="Transfer assets to start trading"
                    />
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ShuffleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Start trading with your AI"
                      secondary="Use natural language to instruct your AI"
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AssignmentIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Review daily analysis"
                      secondary="Get AI insights on market trends"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                component="a"
                href="/assets"
                startIcon={<WalletIcon />}
                sx={{ 
                  px: 3,
                  borderRadius: 2,
                }}
              >
                View Wallet
              </Button>
              <Button
                variant="contained"
                color="primary"
                component="a"
                href="/"
                startIcon={<SmartToyIcon />}
                sx={{ 
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  minWidth: 200,
                  boxShadow: theme.customShadows.button
                }}
              >
                Start Using AI Assistant
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        p: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          maxWidth: 900,
          width: '100%',
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(
            theme.palette.background.default,
            0.8
          )} 100%)`,
          backdropFilter: 'blur(10px)',
          boxShadow: theme.customShadows.card,
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ mb: 4 }} />

        {renderStepContent(activeStep)}
      </Paper>
    </Box>
  );
}