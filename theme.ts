'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Switch to Dark Mode
    primary: {
      main: '#4caf50', // A vibrant "Success Green" (like the Liminal screenshots)
      contrastText: '#000000',
    },
    background: {
      default: '#050505', // Very deep black/grey
      paper: '#121212',   // Slightly lighter for Cards
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0', // Muted grey for descriptions
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600, letterSpacing: '-0.01em' }, // Used for APY numbers
    overline: { textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12, // Slightly more rounded corners
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default MUI overlay
          border: '1px solid #2d2d2d', // Subtle border
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
  },
});

export default theme;