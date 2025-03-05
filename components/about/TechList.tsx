// components/about/TechList.tsx
import React, { ReactNode } from 'react';
import {
  Box, Typography, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

export interface TechItem {
  name: string;
}

interface TechListProps {
  icon: ReactNode;
  title: string;
  items: TechItem[];
}

const TechList: React.FC<TechListProps> = ({ icon, title, items }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography sx={{ ml: 1 }} variant="h6">{title}</Typography>
      </Box>
      <List dense>
        {items.map((item, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <CheckCircleIcon color="success" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TechList;