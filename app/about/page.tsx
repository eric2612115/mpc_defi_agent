// app/about/page.tsx
'use client';
import React from 'react';
import {
  alpha, Box, Card, CardContent, Chip, Container,
  Divider, Grid, Typography, useTheme
} from '@mui/material';
import {
  Architecture as ArchitectureIcon,
  Code as CodeIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  SmartToy as SmartToyIcon
} from '@mui/icons-material';
import MainLayout from '@/components/layout/MainLayout';
import FAQ, { FAQItem } from '@/components/about/FAQ';
import FeatureCard from '@/components/about/FeatureCard';
import StepList, { Step } from '@/components/about/StepList';
import TechList, { TechItem } from '@/components/about/TechList';

export default function AboutPage() {
  const theme = useTheme();

  // FAQ 項目
  const faqItems: FAQItem[] = [
    {
      question: "What is AI Trading Assistant?",
      answer: "AI Trading Assistant is a decentralized application (DApp) that combines AI technology with blockchain security. It allows users to interact with AI agents through natural language to execute trades, analyze market trends, and manage portfolios with enhanced security through multi-signature wallet technology."
    },
    {
      question: "How does the multi-signature security work?",
      answer: "Our platform uses a 2/2 multi-signature wallet system. This means both you and the AI agent must approve each transaction before it's executed. This provides enhanced security as neither party can act alone, and all transactions are transparently recorded on the blockchain."
    },
    {
      question: "Can I trust the AI to make financial decisions?",
      answer: "The AI doesn't make decisions independently. It analyzes market data and provides recommendations based on your instructions, but all transactions require your explicit approval. You maintain full control while benefiting from AI-powered insights."
    },
    {
      question: "How does the AI analyze token security?",
      answer: "The AI agent conducts comprehensive security analyses by examining smart contract code, checking for audit reports, analyzing on-chain data, and reviewing market sentiment. It looks for red flags such as contract vulnerabilities, unusual token distributions, or suspicious activities."
    },
    {
      question: "Is my data and wallet information secure?",
      answer: "Yes. Your wallet connects to our platform using industry-standard authentication methods without ever sharing your private keys. All conversations with the AI are encrypted, and the application uses secure API endpoints for all blockchain interactions."
    }
  ];

  // 功能特點
  const features = [
    {
      icon: <SecurityIcon />,
      title: "Multi-sig Security",
      description: "Enhanced security through multi-signature wallet technology. Every transaction requires dual approval from both you and the AI agent."
    },
    {
      icon: <SmartToyIcon />,
      title: "AI-Powered Analysis",
      description: "Advanced AI technology analyzes market trends, verifies contract security, and offers trading insights to inform your decisions."
    },
    {
      icon: <LanguageIcon />,
      title: "Natural Language Interface",
      description: "Simply tell the AI what you want to do in everyday language. No need to learn complex trading interfaces or technical jargon."
    }
  ];

  // 使用步驟
  const steps: Step[] = [
    {
      number: 1,
      title: "Connect Your Wallet",
      description: "Link your compatible wallet (like MetaMask) to the platform to establish a secure connection."
    },
    {
      number: 2,
      title: "Create Your AI Agent",
      description: "Set up your personalized AI trading assistant, which will help analyze markets and execute trades with your approval."
    },
    {
      number: 3,
      title: "Communicate Your Trading Goals",
      description: "Use natural language to tell the AI what you want to do, such as 'Buy $1000 worth of ETH' or 'Create a diversified portfolio of top DeFi tokens'."
    },
    {
      number: 4,
      title: "Review AI Analysis",
      description: "The AI analyzes market data, contract security, and provides recommendations based on your instructions."
    },
    {
      number: 5,
      title: "Approve and Execute",
      description: "Confirm the transaction if you agree with the AI's analysis. Both you and the AI must sign off before any transaction is executed."
    }
  ];

  // 技術棧
  const frontendTech: TechItem[] = [
    { name: "Next.js 14 with React" },
    { name: "Wagmi for Web3 wallet integration" },
    { name: "Material-UI for component styling" },
    { name: "WebSocket for real-time communication" }
  ];

  const backendTech: TechItem[] = [
    { name: "FastAPI with async support" },
    { name: "Pydantic-AI for agent functionality" },
    { name: "MongoDB with Motor for async database operations" },
    { name: "Gemini API for AI capabilities" }
  ];

  return (
    <MainLayout requireAgent={false} requireWallet={false}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{ 
            textAlign: 'center', 
            mb: 6, 
            pt: 4
          }}
        >
          <Typography component="h1" fontWeight={700} gutterBottom variant="h3">
            About AI Trading Assistant
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }} variant="h6">
            Combining advanced AI technology with blockchain security to provide a safe, 
            intuitive trading experience for cryptocurrency enthusiasts.
          </Typography>
          <Box
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 2, 
              flexWrap: 'wrap'
            }}
          >
            <Chip 
              color="primary" 
              icon={<SmartToyIcon />} 
              label="AI-Powered" 
              sx={{ fontSize: '1rem', py: 2, px: 1 }}
            />
            <Chip 
              color="primary" 
              icon={<SecurityIcon />} 
              label="Multi-sig Security" 
              sx={{ fontSize: '1rem', py: 2, px: 1 }}
              variant="outlined"
            />
            <Chip 
              color="secondary" 
              icon={<LanguageIcon />} 
              label="Natural Language Trading" 
              sx={{ fontSize: '1rem', py: 2, px: 1 }}
            />
          </Box>
        </Box>
        
        <Divider sx={{ mb: 6 }} />
        
        {/* Key Features */}
        <Box sx={{ mb: 6 }}>
          <Typography component="h2" fontWeight={600} gutterBottom variant="h4">
            Key Features
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item key={index} md={4} xs={12}>
                <FeatureCard 
                  description={feature.description}
                  icon={feature.icon}
                  title={feature.title}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* How It Works */}
        <Box sx={{ mb: 6 }}>
          <Typography component="h2" fontWeight={600} gutterBottom variant="h4">
            How It Works
          </Typography>
          <Card 
            sx={{ 
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent>
              <StepList steps={steps} />
            </CardContent>
          </Card>
        </Box>
        
        {/* Technology Stack */}
        <Box sx={{ mb: 6 }}>
          <Typography component="h2" fontWeight={600} gutterBottom variant="h4">
            Technology Stack
          </Typography>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Card 
                sx={{ 
                  height: '100%', 
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <TechList 
                    icon={<CodeIcon color="primary" />} 
                    items={frontendTech} 
                    title="Frontend" 
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={6} xs={12}>
              <Card 
                sx={{ 
                  height: '100%', 
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <TechList 
                    icon={<ArchitectureIcon color="primary" />} 
                    items={backendTech} 
                    title="Backend" 
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        
        {/* FAQ Section */}
        <FAQ items={faqItems} />
      </Container>
    </MainLayout>
  );
}