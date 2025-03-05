// components/analysis/InsightsList.tsx
import React from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';

interface InsightsListProps {
  insights: string[];
}

const InsightsList: React.FC<InsightsListProps> = ({ insights }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ p: 2 }}>
      {insights.map((insight, index) => (
        <Box
          key={index}
          sx={{ 
          mb: 2, 
          p: 2, 
          borderRadius: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.4),
          border: `1px solid ${theme.palette.divider}`
        }}
        >
          <Typography variant="body2">{insight}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default InsightsList;