// components/about/FAQ.tsx
import React from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Typography
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

// FAQ項目類型定義
export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

const FAQ: React.FC<FAQProps> = ({ items, title = "Frequently Asked Questions" }) => {
  return (
    <Box sx={{ mb: 6 }}>
      {title && (
        <Typography component="h2" fontWeight={600} gutterBottom variant="h4">
          {title}
        </Typography>
      )}
      
      {items.map((item, index) => (
        <Accordion
          disableGutters
          elevation={0}
          key={index}
          sx={{ 
            mb: 1, 
            border: '1px solid',
            borderColor: 'divider',
            '&:before': { display: 'none' }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ px: 3, py: 1.5 }}
          >
            <Typography fontWeight={500} variant="subtitle1">
              {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 3, py: 2 }}>
            <Typography>
              {item.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQ;