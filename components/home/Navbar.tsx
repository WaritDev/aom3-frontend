'use client';

import React, { useContext } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Stack, 
  Container, 
  Box,
  SxProps,
  Theme,
  IconButton,
  useTheme
} from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Link from 'next/link';
import { ColorModeContext } from '@/components/ThemeRegistry'; 

const NEON_GREEN = '#00E08F';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const { toggleColorMode } = useContext(ColorModeContext);
  const isDark = theme.palette.mode === 'dark';

  const docsButtonSx: SxProps<Theme> = {
    color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
    fontWeight: 800,
    fontSize: '0.85rem',
    letterSpacing: 1,
    px: 3,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: 2,
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: NEON_GREEN,
      color: NEON_GREEN,
      bgcolor: 'rgba(0, 224, 143, 0.05)',
      textShadow: isDark ? `0 0 10px ${NEON_GREEN}50` : 'none',
    }
  };

  const launchButtonSx: SxProps<Theme> = {
    bgcolor: NEON_GREEN,
    color: '#000',
    fontWeight: 900,
    fontSize: '0.85rem',
    letterSpacing: 1,
    px: 3,
    borderRadius: 2,
    boxShadow: `0 0 15px ${NEON_GREEN}40`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      bgcolor: NEON_GREEN,
      boxShadow: `0 0 25px ${NEON_GREEN}70`,
      transform: 'translateY(-2px)',
    }
  };

  const toggleButtonSx: SxProps<Theme> = {
    color: isDark ? NEON_GREEN : '#555',
    border: `1px solid ${isDark ? 'rgba(0, 224, 143, 0.2)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: 2,
    p: 1,
    transition: 'all 0.2s',
    '&:hover': {
      bgcolor: isDark ? 'rgba(0, 224, 143, 0.1)' : 'rgba(0,0,0,0.05)',
      borderColor: NEON_GREEN,
      transform: 'rotate(15deg)'
    }
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      sx={{ 
        bgcolor: isDark ? 'rgba(5, 5, 5, 0.6)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(15px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
        zIndex: (t) => t.zIndex.drawer + 1
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 80 }}>
          
          <Stack 
            direction="row" 
            alignItems="center" 
            justifyContent="space-between" 
            sx={{ width: '100%' }}
          >
            
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ cursor: 'pointer' }}>
                <AutoGraphIcon 
                  sx={{ 
                    color: NEON_GREEN, 
                    fontSize: 32, 
                    filter: isDark ? `drop-shadow(0 0 8px ${NEON_GREEN}60)` : 'none'
                  }} 
                />
                <Typography 
                  variant="h5" 
                  fontWeight={900} 
                  sx={{ 
                    color: isDark ? '#fff' : '#050505', 
                    letterSpacing: -1,
                    textTransform: 'uppercase'
                  }}
                >
                  AOM<Box component="span" sx={{ color: NEON_GREEN }}>3</Box>
                </Typography>
              </Stack>
            </Link>

            <Stack direction="row" alignItems="center" spacing={2}>
              
              {/* 🚩 ปุ่มสลับ Theme */}
              <IconButton onClick={toggleColorMode} sx={toggleButtonSx}>
                {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>

              <Button 
                component={Link}
                href="/docs"
                variant="outlined"
                startIcon={<MenuBookIcon sx={{ fontSize: '18px !important' }} />}
                sx={docsButtonSx}
              >
                Docs
              </Button>

              <Button 
                component={Link}
                href="/overview"
                variant="contained" 
                endIcon={<RocketLaunchIcon sx={{ fontSize: '18px !important' }} />}
                sx={launchButtonSx}
              >
                Launch App
              </Button>
              
            </Stack>

          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;