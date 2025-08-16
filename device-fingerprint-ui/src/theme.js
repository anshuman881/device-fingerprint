import { createTheme } from '@mui/material';
import { keyframes } from '@mui/system';

const theme = createTheme({
  palette: {
    primary: { main: '#1565C0' }, // A slightly lighter, yet dark blue
    secondary: { main: '#42A5F5' }, // Keep lighter blue for secondary
    error: { main: '#D32F2F' }, // Standard error red
    warning: { main: '#FFB300' }, // Adjusted warning yellow
    background: {
      default: '#1A202C', // Lighter dark background
      paper: 'rgba(30, 40, 50, 0.8)' // Lighter semi-transparent blue for cards/paper
    },
    text: {
      primary: '#FFFFFF', // Keep primary text white for contrast
      secondary: '#90CAF9' // Brighter light blue for secondary text
    },
    boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px rgba(255,255,255,0.06)',
  },
  shape: { borderRadius: 12 }, // Slightly rounded corners, typical Apple
  typography: {
    fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h2: { fontWeight: 600, letterSpacing: 0.8 },
    h3: { fontWeight: 600, letterSpacing: 0.4 },
    subtitle2: { color: '#E0E0E0' }, // Directly set the color to a static value
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0, // Remove default elevation to control via boxShadow
      },
      styleOverrides: {
        root: {
          background: 'rgba(30, 40, 50, 0.8)',
          backdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(144, 202, 249, 0.3)', // Lighter blue border
          boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px rgba(255,255,255,0.06)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 15px 45px rgba(0,0,0,0.6), inset 0 1px rgba(255,255,255,0.1)',
            border: '1px solid rgba(144, 202, 249, 0.3)',
          },
        }
      }
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          background: 'rgba(30, 40, 50, 0.8)',
          backdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(144, 202, 249, 0.3)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px rgba(255,255,255,0.06)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 15px 45px rgba(0,0,0,0.6), inset 0 1px rgba(255,255,255,0.1)',
          },
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: { color: '#FFFFFF' },
        subtitle2: ({ theme }) => ({ color: theme.palette.text.primary })
      }
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 999,
          backdropFilter: 'blur(12px)',
          color: theme.palette.text.primary,
          borderColor: 'rgba(144, 202, 249, 0.4)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            borderColor: theme.palette.primary.light,
            boxShadow: '0 0 10px rgba(21, 101, 192, 0.6)',
          },
        })
      }
    },
    MuiAccordion: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          background: 'rgba(30, 40, 50, 0.8)',
          border: '1px solid rgba(144, 202, 249, 0.3)',
          borderRadius: 12,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          },
          '&:before': { // Remove the default Material-UI border before
            display: 'none',
          },
        },
        '&.Mui-expanded': {
          margin: 'auto !important', // Fixes margin issue when expanded
          marginTop: '16px !important', // Add some top margin for spacing
          marginBottom: '16px !important', // Add some bottom margin
        },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999, // Pill shape
          textTransform: 'none', // No uppercase
          fontWeight: 600,
          padding: '10px 20px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(21, 101, 192, 0.3)',
          },
        },
      },
    }
  }
});

export const auroraShift = keyframes`
  0% { background-position: 0% 0%, 100% 0%, 0% 100%; }
  50% { background-position: 100% 0%, 0% 100%, 100% 100%; }
  100% { background-position: 0% 100%, 100% 100%, 0% 0%; }
`;

export default theme;
