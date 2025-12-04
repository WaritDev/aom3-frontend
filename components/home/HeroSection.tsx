'use client';

import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        pt: { xs: 15, md: 25 },
        pb: { xs: 10, md: 15 },
        overflow: 'hidden',
        background: `
          radial-gradient(circle at 50% 10%, rgba(76, 175, 80, 0.15) 0%, rgba(5, 5, 5, 0) 60%),
          linear-gradient(to bottom, #050505, #0a0a0a)
        `,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center" textAlign="center">
          
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '4.5rem' },
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(180deg, #fff 0%, #aaa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Yield beyond the (h)edge.
          </Typography>

          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ maxWidth: '600px', mx: 'auto', fontSize: { xs: '1rem', md: '1.25rem' }, lineHeight: 1.6 }}
          >
            Earn real sustainable yield from delta-neutral strategies. 
            No market exposure. Just execution.
          </Typography>

          <Box pt={2}>
            <Button 
              variant="contained" 
              size="large" 
              endIcon={<RocketLaunchIcon />}
              sx={{ 
                px: 5, 
                py: 2, 
                fontSize: '1.1rem', 
                borderRadius: '50px',
                boxShadow: '0 0 20px rgba(76, 175, 80, 0.4)',
                '&:hover': {
                  boxShadow: '0 0 30px rgba(76, 175, 80, 0.6)',
                }
              }}
              onClick={() => console.log('Launch App')}
            >
              Launch App
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;