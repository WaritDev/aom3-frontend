'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  AppBar, Toolbar, Typography, Button, Stack, Container, 
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box , Divider
} from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const NEON_GREEN = '#00E08F';
const BG_DARK = '#0a0a0a';
const BORDER_COLOR = '#1E1E1E';

const NAV_ITEMS = [
  { label: 'Overview', path: '/overview' },
  { label: 'Deposit',  path: '/deposit' },
  { label: 'Ranking',  path: '/ranking' },
];

const AppNavbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navButtonStyle = (isActive: boolean) => ({
    color: isActive ? NEON_GREEN : '#888',
    fontWeight: isActive ? 900 : 600,
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    px: 2,
    position: 'relative',
    transition: 'all 0.2s',
    '&:hover': { 
      color: '#fff', 
      bgcolor: 'transparent',
      textShadow: `0 0 10px ${NEON_GREEN}80` 
    },
    '&::after': isActive ? {
      content: '""',
      position: 'absolute',
      bottom: 6,
      left: 16,
      right: 16,
      height: '2px',
      bgcolor: NEON_GREEN,
      borderRadius: '2px',
      boxShadow: `0 0 10px ${NEON_GREEN}`
    } : {}
  });

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          bgcolor: BG_DARK, 
          borderBottom: `1px solid ${BORDER_COLOR}`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(10px)',
          background: `linear-gradient(to bottom, ${BG_DARK}, rgba(10, 10, 10, 0.8))`
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 75 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
              
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <AutoGraphIcon sx={{ color: NEON_GREEN, fontSize: 30, filter: `drop-shadow(0 0 5px ${NEON_GREEN}80)` }} />
                  <Typography variant="h5" fontWeight={900} color="white" sx={{ letterSpacing: -1, textTransform: 'uppercase' }}>
                    AOM<Box component="span" sx={{ color: NEON_GREEN }}>3</Box>
                  </Typography>
                </Stack>
              </Link>

              <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, ml: 4, flex: 1 }}>
                {NAV_ITEMS.map((item) => (
                  <Link key={item.label} href={item.path} style={{ textDecoration: 'none' }}>
                    <Button disableRipple sx={navButtonStyle(pathname === item.path)}>
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <ConnectButton 
                    showBalance={{ smallScreen: false, largeScreen: true }}
                    accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
                  />
                </Box>
                
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ display: { md: 'none' }, color: NEON_GREEN }}
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
            width: '280px', 
            bgcolor: BG_DARK, 
            borderLeft: `1px solid ${BORDER_COLOR}`,
            backgroundImage: 'none',
            p: 2
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#888' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                <Link href={item.path} style={{ textDecoration: 'none', width: '100%' }} onClick={handleDrawerToggle}>
                  <ListItemButton 
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: isActive ? 'rgba(0, 224, 143, 0.1)' : 'transparent',
                      borderLeft: isActive ? `3px solid ${NEON_GREEN}` : '3px solid transparent'
                    }}
                  >
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{ 
                        fontWeight: isActive ? 900 : 500, 
                        color: isActive ? NEON_GREEN : '#888',
                        letterSpacing: 1
                      }} 
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ borderColor: '#222', my: 3 }} />
        
        <Box sx={{ px: 2, display: { sm: 'none' } }}>
            <ConnectButton />
        </Box>
      </Drawer>
    </>
  );
};

export default AppNavbar;