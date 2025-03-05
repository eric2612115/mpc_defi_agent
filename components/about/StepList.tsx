// components/about/StepList.tsx
import React from 'react';
import {
  alpha, Box, Divider, List,
  ListItem, ListItemIcon, ListItemText, Typography, useTheme
} from '@mui/material';

export interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepListProps {
  steps: Step[];
}

const StepList: React.FC<StepListProps> = ({ steps }) => {
  const theme = useTheme();
  
  return (
    <List>
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <ListItem sx={{ py: 2 }}>
            <ListItemIcon>
              <Box 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  mr: 2,
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}
              >
                {step.number}
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={step.title}
              primaryTypographyProps={{ fontWeight: 600, gutterBottom: true }}
              secondary={step.description}
            />
          </ListItem>
          {index < steps.length - 1 && <Divider component="li" variant="inset" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default StepList;