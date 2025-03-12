// components/analysis/DateTabs.tsx
import React from 'react';
import { Button, useTheme, alpha, Box } from '@mui/material';

export interface DateTabItem {
  date: string; // YYYY-MM-DD format
  label: string;
}

interface DateTabsProps {
  tabs: DateTabItem[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

const DateTabs: React.FC<DateTabsProps> = ({ tabs, selectedIndex, onChange }) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        overflowX: 'auto',
        pb: 1,
        '&::-webkit-scrollbar': {
          height: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: alpha(theme.palette.background.default, 0.1),
        },
        '&::-webkit-scrollbar-thumb': {
          background: alpha(theme.palette.primary.main, 0.2),
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: alpha(theme.palette.primary.main, 0.4),
        },
      }}
    >
      {tabs.map((tab, index) => (
        <Button
          key={tab.date}
          onClick={() => onChange(index)}
          sx={{
            mr: 1,
            borderRadius: 10,
            px: 2,
            py: 0.75,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            backgroundColor: selectedIndex === index ? theme.palette.primary.main : 'transparent',
            color: selectedIndex === index ? 'white' : theme.palette.text.primary,
            borderColor: selectedIndex === index ? 'transparent' : theme.palette.divider,
            '&:hover': {
              backgroundColor: selectedIndex === index ? 
                alpha(theme.palette.primary.main, 0.9) : 
                alpha(theme.palette.primary.main, 0.05),
            },
            whiteSpace: 'nowrap'
          }}
          variant={selectedIndex === index ? "contained" : "outlined"}
        >
          {tab.label}
        </Button>
      ))}
    </Box>
  );
};

export default DateTabs;