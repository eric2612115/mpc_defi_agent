// components/about/FeatureCard.tsx
import React, { ReactNode } from 'react';
import { Card, CardContent, Typography, useTheme } from '@mui/material';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        border: `1px solid ${theme.palette.divider}`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.customShadows.medium,
        }
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 60, marginBottom: theme.spacing(2), color: theme.palette.primary.main }}>
          {icon}
        </div>
        <Typography variant="h5" gutterBottom>{title}</Typography>
        <Typography>{description}</Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;