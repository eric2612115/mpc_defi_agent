// components/about/StepList.tsx
import React from 'react';
import {
  List, ListItem, ListItemIcon, ListItemText,
  Box, Typography, Divider, alpha, useTheme
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
              secondary={step.description}
              primaryTypographyProps={{ fontWeight: 600, gutterBottom: true }}
            />
          </ListItem>
          {index < steps.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default StepList;