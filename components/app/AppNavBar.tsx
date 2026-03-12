'use client';

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  AppBar, Toolbar, Typography, Button, Stack, Container, 
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box, Divider,
  useTheme, alpha, Tooltip
} from '@mui/material';

import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ColorModeContext } from '@/components/ThemeRegistry'; 

const NEON_GREEN = '#00E08F';

const NAV_ITEMS = [
  { label: 'Overview', path: '/overview-demo' },
  { label: 'Deposit',  path: '/deposit' },
  { label: 'Simulation',  path: '/simulation' },
  { label: 'Top Users', path: '/top-users' },
  { label: 'Ranking',  path: '/ranking' },
  { label: 'strategy',  path: '/strategy' },
];

const AppNavbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { toggleColorMode } = useContext(ColorModeContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navButtonStyle = (isActive: boolean) => ({
    color: isActive 
      ? NEON_GREEN 
      : (isDark ? 'rgba(255,255,255,0.6)' : 'text.secondary'),
    fontWeight: isActive ? 900 : 700,
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    px: 2,
    position: 'relative',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': { 
      color: isDark ? '#fff' : '#000', 
      bgcolor: 'transparent',
    },
    '&::after': isActive ? {
      content: '""',
      position: 'absolute',
      bottom: 6,
      left: 16,
      right: 16,
      height: '3px',
      bgcolor: NEON_GREEN,
      borderRadius: '4px',
      boxShadow: isDark ? `0 0 12px ${NEON_GREEN}` : `0 2px 4px ${alpha(NEON_GREEN, 0.4)}`
    } : {}
  });

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          bgcolor: alpha(theme.palette.background.paper, 0.85),
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(16px)',
          backgroundImage: 'none'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 75 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
              
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <AutoGraphIcon sx={{ 
                    color: NEON_GREEN, 
                    fontSize: 32, 
                    filter: isDark ? `drop-shadow(0 0 8px ${NEON_GREEN}80)` : 'none' 
                  }} />
                  <Typography variant="h5" fontWeight={900} color="text.primary" sx={{ letterSpacing: -1.2, textTransform: 'uppercase' }}>
                    AOM<Box component="span" sx={{ color: NEON_GREEN }}>3</Box>
                  </Typography>
                </Stack>
              </Link>

              <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' }, ml: 4, flex: 1 }}>
                {NAV_ITEMS.map((item) => (
                  <Link key={item.label} href={item.path} style={{ textDecoration: 'none' }}>
                    <Button disableRipple sx={navButtonStyle(pathname === item.path)}>
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </Stack>

              <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
                
                <Tooltip title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}>
                  <IconButton 
                    onClick={toggleColorMode} 
                    sx={{ 
                      color: isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                      bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2.5,
                      p: 1.2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: NEON_GREEN,
                        bgcolor: isDark ? alpha(NEON_GREEN, 0.1) : alpha(NEON_GREEN, 0.05),
                        borderColor: alpha(NEON_GREEN, 0.5),
                        transform: 'rotate(15deg)'
                      }
                    }}
                  >
                    {isDark ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>

                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <ConnectButton 
                    showBalance={{ smallScreen: false, largeScreen: true }}
                    accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
                  />
                </Box>
                
                <IconButton
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ display: { md: 'none' }, color: isDark ? NEON_GREEN : 'text.primary' }}
                >
                  <MenuIcon />
                </IconButton>
              </Stack>

            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: { 
            width: '300px', 
            bgcolor: 'background.paper', 
            borderLeft: `1px solid ${theme.palette.divider}`,
            backgroundImage: 'none',
            p: 3
          }
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h6" fontWeight={900} color="text.primary">MENU</Typography>
            <IconButton onClick={handleDrawerToggle} sx={{ color: 'text.secondary' }}>
              <CloseIcon />
            </IconButton>
        </Stack>

        <List sx={{ pt: 0 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 1.5 }}>
                <Link href={item.path} style={{ textDecoration: 'none', width: '100%' }} onClick={handleDrawerToggle}>
                  <ListItemButton 
                    sx={{ 
                      borderRadius: 3,
                      py: 1.5,
                      bgcolor: isActive ? alpha(NEON_GREEN, 0.1) : 'transparent',
                      borderLeft: isActive ? `5px solid ${NEON_GREEN}` : '5px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{ 
                        fontWeight: isActive ? 900 : 600, 
                        color: isActive ? NEON_GREEN : 'text.secondary',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        fontSize: '0.95rem'
                      }} 
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 4 }} />
        
        <Stack spacing={2}>
            <Button 
                fullWidth 
                variant="outlined" 
                onClick={toggleColorMode}
                startIcon={isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                sx={{ 
                    borderRadius: 3, 
                    py: 1.5, 
                    fontWeight: 800, 
                    color: 'text.primary', 
                    borderColor: theme.palette.divider,
                    '&:hover': { borderColor: NEON_GREEN, bgcolor: alpha(NEON_GREEN, 0.05) }
                }}
            >
                {isDark ? 'LIGHT MODE' : 'DARK MODE'}
            </Button>

            <Box sx={{ display: { sm: 'none' } }}>
                <ConnectButton label="CONNECT WALLET" />
            </Box>
        </Stack>
      </Drawer>
    </>
  );
};

export default AppNavbar;