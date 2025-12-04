'use client';

import React from 'react';
import { Box, Container, Typography, Stack, IconButton, Divider } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#000', borderTop: '1px solid #111', pt: 10, pb: 4 }}>
      <Container maxWidth="lg">
        
        <Stack spacing={4} alignItems="center" sx={{ mb: 8, textAlign: 'center' }}>
            <Box>
              <Typography variant="h4" gutterBottom fontWeight="bold">Join the (h)edge</Typography>
              <Typography color="text.secondary">
                Follow AOM3 on social media for the latest strategies and updates.
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2} justifyContent="center">
              <IconButton sx={{ bgcolor: 'rgba(29, 161, 242, 0.1)', color: '#1DA1F2', p: 2 }}>
                <TwitterIcon fontSize="large" />
              </IconButton>
              <IconButton sx={{ bgcolor: 'rgba(0, 136, 204, 0.1)', color: '#0088cc', p: 2 }}>
                <TelegramIcon fontSize="large" />
              </IconButton>
              <IconButton sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: '#fff', p: 2 }}>
                <GitHubIcon fontSize="large" />
              </IconButton>
            </Stack>
        </Stack>

        <Divider sx={{ borderColor: '#222', mb: 8 }} />

        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={{ xs: 6, md: 4 }} 
          justifyContent="space-between"
        >
          <Box sx={{ maxWidth: { xs: '100%', md: 350 } }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>AOM3</Typography>
              <Typography variant="body2" color="text.secondary">
                A DeFi protocol for automated delta-neutral yield strategies. Audited, Secure, and Non-custodial.
              </Typography>
          </Box>
          
          <Stack direction="row" spacing={{ xs: 4, sm: 8, md: 10 }} sx={{ width: { xs: '100%', md: 'auto' } }}>
            
            <Box sx={{ minWidth: 100 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Protocol</Typography>
              <Stack spacing={1} color="text.secondary">
                <Box component="span" sx={{ cursor: 'pointer', '&:hover': { color: '#fff' } }}>Vaults</Box>
                <Box component="span" sx={{ cursor: 'pointer', '&:hover': { color: '#fff' } }}>Analytics</Box>
                <Box component="span" sx={{ cursor: 'pointer', '&:hover': { color: '#fff' } }}>Token</Box>
              </Stack>
            </Box>

            <Box sx={{ minWidth: 100 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Resources</Typography>
              <Stack spacing={1} color="text.secondary">
                <Box component="span" sx={{ cursor: 'pointer', '&:hover': { color: '#fff' } }}>Docs</Box>
                <Box component="span" sx={{ cursor: 'pointer', '&:hover': { color: '#fff' } }}>Audits</Box>
                <Box component="span" sx={{ cursor: 'pointer', '&:hover': { color: '#fff' } }}>GitHub</Box>
              </Stack>
            </Box>

          </Stack>
        </Stack>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            © 2024 AOM3 Protocol. All rights reserved.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default Footer;