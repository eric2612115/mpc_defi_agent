// components/analysis/DateTabs.tsx
import React from 'react';
import { Tabs, Tab, Box, useTheme } from '@mui/material';

export interface DateTab {
  date: string;
  label: string;
}

interface DateTabsProps {
  dates: DateTab[];
  selectedIndex: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const DateTabs: React.FC<DateTabsProps> = ({ dates, selectedIndex, onChange }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs 
        value={selectedIndex} 
        onChange={onChange}
        variant="scrollable"
        scrollButtons="auto"
        TabIndicatorProps={{
          style: {
            backgroundColor: theme.palette.primary.main,
            height: 3
          }
        }}
      >
        {dates.map((date, index) => (
          <Tab 
            key={index}
            label={date.label} 
            sx={{ 
              fontWeight: selectedIndex === index ? 600 : 400,
              color: selectedIndex === index ? theme.palette.primary.main : theme.palette.text.primary
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default DateTabs;