// lib/theme.ts
import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material';

// 創建更偏黃色的木質主題
export const woodTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#B07941', // 木色主色調
      light: '#D4A76A',
      dark: '#8A5D32',
      contrastText: '#FFFFFF', 
    },
    secondary: {
      main: '#D4A76A', // 淺木色
      light: '#E8C393',
      dark: '#B38A56',
      contrastText: '#33281B', 
    },
    background: {
      default: '#F8EDD7', // 偏黃的淺色背景
      paper: '#F2E6C7',   // 更黃的紙張背景
    },
    text: {
      primary: '#33281B', // 深褐色文字
      secondary: '#7D6547', // 中褐色次要文字
    },
    divider: '#E6D6A9', // 淺黃分隔線
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    warning: {
      main: '#ED6C02',
      light: '#FF9800',
      dark: '#E65100',
    },
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    info: {
      main: '#0288D1',
      light: '#03A9F4',
      dark: '#01579B',
    },
  },
  typography: {
    fontFamily: '"Source Sans Pro", "Roboto", "Arial", sans-serif',
    h1: { fontWeight: 600, fontSize: '2.5rem', color: '#33281B' },
    h2: { fontWeight: 600, fontSize: '2rem', color: '#33281B' },
    h3: { fontWeight: 600, fontSize: '1.75rem', color: '#33281B' },
    h4: { fontWeight: 600, fontSize: '1.5rem', color: '#33281B' },
    h5: { fontWeight: 600, fontSize: '1.25rem', color: '#33281B' },
    h6: { fontWeight: 600, fontSize: '1rem', color: '#33281B' },
    subtitle1: { fontSize: '1.125rem', fontWeight: 500, color: '#33281B' },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, color: '#33281B' },
    body1: { fontSize: '1rem', lineHeight: 1.5, color: '#33281B' },
    body2: { fontSize: '0.875rem', lineHeight: 1.43, color: '#33281B' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.05)',
    '0px 8px 16px rgba(0, 0, 0, 0.05)',
    '0px 12px 24px rgba(0, 0, 0, 0.05)',
    ...Array(20).fill('none'),
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F8EDD7',
          color: '#33281B',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#F8EDD7',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#D4A76A',
            borderRadius: '10px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#F2E6C7',
          borderColor: '#E6D6A9',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#F8EDD7',
          borderBottom: '1px solid #E6D6A9',
          boxShadow: 'none',
          color: '#33281B',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          backgroundColor: '#B07941',
          '&:hover': {
            backgroundColor: '#8A5D32',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
        outlinedPrimary: {
          borderColor: '#B07941',
          color: '#B07941',
          '&:hover': {
            borderColor: '#8A5D32',
            backgroundColor: alpha('#B07941', 0.04),
          },
        },
        text: {
          '&:hover': {
            backgroundColor: alpha('#B07941', 0.04),
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#FFFFFF', 0.7),
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E6D6A9',
            borderWidth: '1.5px',
            transition: 'all 0.2s',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#B07941',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#B07941',
            borderWidth: '2px',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#B07941',
          height: 3,
        },
        root: {
          minHeight: '48px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: '48px',
          color: '#7D6547',
          '&.Mui-selected': {
            color: '#B07941',
            fontWeight: 600,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#F2E6C7',
          border: '1.5px solid #E6D6A9',
          borderRadius: 12,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.05)',
            borderColor: alpha('#B07941', 0.5),
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E6D6A9',
          padding: '16px',
        },
        head: {
          backgroundColor: '#F8EDD7',
          color: '#B07941',
          fontWeight: 600,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#D4A76A',
          color: '#33281B',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#D4A76A', 0.15),
          color: '#7D6547',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E6D6A9',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#7D6547',
          '&:hover': {
            backgroundColor: alpha('#B07941', 0.04),
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#F8EDD7',
          borderRight: '1px solid #E6D6A9',
        },
      },
    },
  },
});

// 添加自定義屬性
woodTheme.customShadows = {
  light: '0 2px 8px rgba(0, 0, 0, 0.05)',
  medium: '0 4px 16px rgba(0, 0, 0, 0.06)',
  strong: '0 8px 24px rgba(0, 0, 0, 0.08)',
  button: '0 4px 8px rgba(0, 0, 0, 0.1)',
  card: '0 6px 16px rgba(0, 0, 0, 0.06)',
};

woodTheme.customBorders = {
  light: `1px solid ${alpha('#E6D6A9', 0.5)}`,
  medium: `1.5px solid ${alpha('#E6D6A9', 0.7)}`,
  strong: `2px solid ${alpha('#B07941', 0.5)}`,
};

// 聊天氣泡樣式
export const customStyles = {
  chatBubbles: {
    user: {
      backgroundColor: alpha('#B07941', 0.08),
      color: '#33281B',
      borderRadius: '12px 0 12px 12px',
      borderRight: `3px solid ${woodTheme.palette.secondary.main}`,
    },
    agent: {
      backgroundColor: alpha('#D4A76A', 0.15),
      color: '#33281B',
      borderRadius: '0 12px 12px 12px',
      borderLeft: `3px solid ${woodTheme.palette.primary.main}`,
    },
  },
  glassEffect: {
    backgroundColor: alpha('#F2E6C7', 0.8),
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    border: `1px solid ${alpha('#B07941', 0.2)}`,
  },
  softShadow: {
    boxShadow: `0 8px 32px 0 ${alpha('#000', 0.08)}`,
  },
  gradientBg: {
    background: `linear-gradient(120deg, ${alpha('#F8EDD7', 0.95)} 0%, ${alpha('#F2E6C7', 0.9)} 100%)`,
  },
};

// 用於typescript類型擴展
declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      light: string;
      medium: string;
      strong: string;
      button: string;
      card: string;
    };
    customBorders: {
      light: string;
      medium: string;
      strong: string;
    };
  }
  
  interface ThemeOptions {
    customShadows?: {
      light?: string;
      medium?: string;
      strong?: string;
      button?: string;
      card?: string;
    };
    customBorders?: {
      light?: string;
      medium?: string;
      strong?: string;
    };
  }
}

export default woodTheme;