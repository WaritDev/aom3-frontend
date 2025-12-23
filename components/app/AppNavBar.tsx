'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button, Stack, Container } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const NAV_ITEMS = [
  { label: 'Overview', path: '/overview' },
  { label: 'Deposit',  path: '/deposit' },
  { label: 'Vault',    path: '/vault' },
];

const AppNavbar = () => {
  const pathname = usePathname();

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        bgcolor: '#0a0a0a', 
        borderBottom: '1px solid #222',
        zIndex: 1200
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 70 }}>
          
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
            
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }}>
                <AutoGraphIcon sx={{ color: '#4caf50', fontSize: 28 }} />
                <Typography variant="h6" fontWeight={800} color="white" letterSpacing={1}>
                  AOM3
                </Typography>
              </Stack>
            </Link>

            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, ml: 6, flex: 1 }}>
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link key={item.label} href={item.path} style={{ textDecoration: 'none' }}>
                      <Button 
                        disableRipple
                        sx={{ 
                          color: isActive ? '#4caf50' : '#888',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.95rem',
                          position: 'relative',
                          px: 2,
                          '&:hover': { color: '#fff', bgcolor: 'transparent' },
                          '&::after': isActive ? {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 16,
                            right: 16,
                            height: '2px',
                            bgcolor: '#4caf50',
                            borderRadius: '2px'
                          } : {}
                        }}
                      >
                        {item.label}
                      </Button>
                  </Link>
                );
              })}
            </Stack>

            <Button 
              variant="contained" 
              startIcon={<AccountBalanceWalletIcon />}
              sx={{ bgcolor: '#fff', color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#e0e0e0' } }}
            >
              Connect Wallet
            </Button>

          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppNavbar;