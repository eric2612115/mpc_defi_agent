// components/about/FAQ.tsx
import React from 'react';
import {
  Typography, Accordion, AccordionSummary, AccordionDetails, Box
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
        <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
          {title}
        </Typography>
      )}
      
      {items.map((item, index) => (
        <Accordion key={index} disableGutters elevation={0} sx={{ 
          mb: 1, 
          border: '1px solid',
          borderColor: 'divider',
          '&:before': { display: 'none' }
        }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ px: 3, py: 1.5 }}
          >
            <Typography variant="subtitle1" fontWeight={500}>
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