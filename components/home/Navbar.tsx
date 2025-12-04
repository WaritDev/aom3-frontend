'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Stack, Container } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

const Navbar = () => {
  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      sx={{ 
        bgcolor: 'rgba(5, 5, 5, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
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
            
            <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }}>
              <AutoGraphIcon sx={{ color: '#4caf50', fontSize: 32 }} />
              <Typography 
                variant="h6" 
                fontWeight={800} 
                letterSpacing={1}
                sx={{ color: '#fff' }}
              >
                AOM3
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={4}>
              
              <Stack 
                direction="row" 
                spacing={4} 
                sx={{ display: { xs: 'none', md: 'flex' } }}
              >
                {['Vaults', 'Strategies', 'Risks', 'Docs'].map((item) => (
                  <Box 
                    key={item} 
                    component="a" 
                    href="#"
                    sx={{ 
                      color: 'text.secondary', 
                      textDecoration: 'none', 
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      transition: 'color 0.2s',
                      '&:hover': { color: '#fff' }
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Stack>

              <Button 
                variant="outlined" 
                size="small"
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.2)', 
                  color: '#fff',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    borderColor: '#4caf50',
                    bgcolor: 'rgba(76, 175, 80, 0.1)'
                  }
                }}
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