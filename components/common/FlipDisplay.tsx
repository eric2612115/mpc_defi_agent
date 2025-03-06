// components/common/FlipDisplay.tsx
import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import theme from '@/lib/theme';

interface FlipDigitProps {
  digit: string;
  previousDigit: string;
  animate: boolean;
}

const FlipDigit: React.FC<FlipDigitProps> = ({ digit, previousDigit, animate }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: 'relative',
        width: 'auto',
        height: '1.3em',
        lineHeight: '1.3em',
        overflow: 'hidden',
        mx: '1px',
        display: 'inline-block',
        fontFamily: '"Source Sans Pro", "Roboto", "Arial", sans-serif',
      }}
    >
      {/* Current digit */}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: animate ? 'transparent' : alpha(theme.palette.primary.main, 0.05),
          color: theme.palette.text.primary,
          borderRadius: '2px',
          px: 0.5,
          display: 'inline-block',
          backfaceVisibility: 'hidden',
          transform: animate ? 'rotateX(-180deg)' : 'rotateX(0)',
          transformStyle: 'preserve-3d',
          transition: animate ? 'transform 0.5s ease-in-out' : 'none',
          fontFamily: '"Source Sans Pro", "Roboto", "Arial", sans-serif',
        }}
      >
        {digit}
      </Box>
      
      {/* Previous digit - for animation */}
      {animate && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            color: theme.palette.text.primary,
            borderRadius: '2px',
            px: 0.5,
            backfaceVisibility: 'hidden',
            transform: 'rotateX(0)',
            animationName: 'flipTop',
            animationDuration: '0.5s',
            animationTimingFunction: 'ease-in-out',
            animationFillMode: 'forwards',
            transformStyle: 'preserve-3d',
            fontFamily: '"Source Sans Pro", "Roboto", "Arial", sans-serif',
            '@keyframes flipTop': {
              '0%': { transform: 'rotateX(0)' },
              '100%': { transform: 'rotateX(180deg)' },
            },
          }}
        >
          {previousDigit}
        </Box>
      )}
      
      {/* Next digit - coming in */}
      {animate && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            color: theme.palette.text.primary,
            borderRadius: '2px',
            px: 0.5,
            backfaceVisibility: 'hidden',
            transform: 'rotateX(-180deg)',
            animationName: 'flipBottom',
            animationDuration: '0.5s',
            animationTimingFunction: 'ease-in-out',
            animationFillMode: 'forwards',
            transformStyle: 'preserve-3d',
            fontFamily: '"Source Sans Pro", "Roboto", "Arial", sans-serif',
            '@keyframes flipBottom': {
              '0%': { transform: 'rotateX(-180deg)' },
              '100%': { transform: 'rotateX(0)' },
            },
          }}
        >
          {digit}
        </Box>
      )}
    </Box>
  );
};

interface FlipDisplayProps {
  value: string;
  fontSize?: string | number;
  fontWeight?: string | number;
}

const FlipDisplay: React.FC<FlipDisplayProps> = ({ 
  value, 
  fontSize = 'inherit',
  fontWeight = 600
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    if (value !== displayValue) {
      setPreviousValue(displayValue);
      setDisplayValue(value);
      setAnimate(true);
      
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 600); // Animation time + a bit of delay
      
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);
  
  // Don't split the value, just render it as a whole
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize,
        fontWeight: 700, // Increase font weight
        fontFamily: '"Source Sans Pro", "Roboto", "Arial", sans-serif',
        letterSpacing: '0.01em', // Improve readability
        backgroundColor: animate ? 'transparent' : alpha('#CBA076', 0.1),
        borderRadius: '4px',
        px: 0.75,
        color: theme.palette.text.primary,
      }}
    >
      {displayValue}
    </Box>
  );
};

export default FlipDisplay;


// Helper function for alpha transparency
function alpha(color: string, value: number): string {
  // Handle hex colors
  if (color.startsWith('#')) {
    return `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${value})`;
  }
  // Return the color as is for other formats (already rgba or named colors)
  return color;
}