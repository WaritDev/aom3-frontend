'use client';

import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Stack, 
  Container, 
  Box,
  SxProps,
  Theme
} from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Link from 'next/link';

const NEON_GREEN = '#00E08F';

const Navbar: React.FC = () => {
  const docsButtonSx: SxProps<Theme> = {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 800,
    fontSize: '0.85rem',
    letterSpacing: 1,
    px: 3,
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 2,
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: NEON_GREEN,
      color: NEON_GREEN,
      bgcolor: 'rgba(0, 224, 143, 0.05)',
      textShadow: `0 0 10px ${NEON_GREEN}50`,
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

  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      sx={{ 
        bgcolor: 'rgba(5, 5, 5, 0.6)',
        backdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        zIndex: (theme) => theme.zIndex.drawer + 1
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
                    filter: `drop-shadow(0 0 8px ${NEON_GREEN}60)` 
                  }} 
                />
                <Typography 
                  variant="h5" 
                  fontWeight={900} 
                  sx={{ 
                    color: '#fff', 
                    letterSpacing: -1,
                    textTransform: 'uppercase'
                  }}
                >
                  AOM<Box component="span" sx={{ color: NEON_GREEN }}>3</Box>
                </Typography>
              </Stack>
            </Link>

            <Stack direction="row" alignItems="center" spacing={2}>
              
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