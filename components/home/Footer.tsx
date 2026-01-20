'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  IconButton, 
  Divider,
  SxProps,
  Theme
} from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import TerminalIcon from '@mui/icons-material/Terminal';

const NEON_GREEN = '#00E08F';
const BG_DARK = '#050505';

interface FooterLinkProps {
  label: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ label }) => (
  <Typography 
    variant="body2" 
    sx={{ 
      color: 'rgba(255, 255, 255, 0.4)', 
      cursor: 'pointer', 
      fontWeight: 600,
      fontSize: '0.8rem',
      transition: 'all 0.2s',
      '&:hover': { 
        color: NEON_GREEN,
        transform: 'translateX(4px)',
        textShadow: `0 0 8px ${NEON_GREEN}80`
      } 
    }}
  >
    {label}
  </Typography>
);

const Footer: React.FC = () => {
  const iconButtonSx: SxProps<Theme> = {
    bgcolor: 'rgba(255, 255, 255, 0.03)',
    color: 'rgba(255, 255, 255, 0.6)',
    p: 2,
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s',
    '&:hover': {
      bgcolor: `${NEON_GREEN}10`,
      color: NEON_GREEN,
      borderColor: NEON_GREEN,
      boxShadow: `0 0 20px ${NEON_GREEN}30`,
      transform: 'translateY(-4px)'
    }
  };

  return (
    <Box component="footer" sx={{ bgcolor: BG_DARK, borderTop: '1px solid #111', pt: 10, pb: 4 }}>
      <Container maxWidth="lg">
        
        <Stack spacing={4} alignItems="center" sx={{ mb: 8, textAlign: 'center' }}>
            <Box>
              <Typography variant="h4" fontWeight="900" sx={{ textTransform: 'uppercase', letterSpacing: '-1.5px' }}>
                Join the <Box component="span" sx={{ color: NEON_GREEN }}>(h)edge</Box>
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1, fontWeight: 500 }}>
                Synchronize with the fleet for real-time strategy updates.
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={3} justifyContent="center">
              <IconButton sx={iconButtonSx} aria-label="Twitter">
                <TwitterIcon fontSize="medium" />
              </IconButton>
              <IconButton sx={iconButtonSx} aria-label="Telegram">
                <TelegramIcon fontSize="medium" />
              </IconButton>
              <IconButton sx={iconButtonSx} aria-label="GitHub">
                <GitHubIcon fontSize="medium" />
              </IconButton>
            </Stack>
        </Stack>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 8 }} />

        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={{ xs: 6, md: 4 }} 
          justifyContent="space-between"
        >
          <Box sx={{ maxWidth: { xs: '100%', md: 350 } }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <TerminalIcon sx={{ color: NEON_GREEN, fontSize: 20 }} />
                  <Typography variant="h6" fontWeight="900" sx={{ letterSpacing: 1 }}>AOM3</Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, fontWeight: 500 }}>
                A decentralized engine for institutional-grade delta-neutral yield strategies. Audited, non-custodial, and built for discipline.
              </Typography>
          </Box>
          
          <Stack direction="row" spacing={{ xs: 6, sm: 10 }} sx={{ width: { xs: '100%', md: 'auto' } }}>
            
            <Box>
              <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 900, mb: 2, display: 'block', letterSpacing: 2 }}>
                STRATEGIES
              </Typography>
              <Stack spacing={1.5}>
                <FooterLink label="Active Quests" />
                <FooterLink label="Yield Analytics" />
                <FooterLink label="Hyperliquid Core" />
                <FooterLink label="Prize Pool" />
              </Stack>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 900, mb: 2, display: 'block', letterSpacing: 2 }}>
                INTELLIGENCE
              </Typography>
              <Stack spacing={1.5}>
                <FooterLink label="Documentation" />
                <FooterLink label="Risk Report" />
                <FooterLink label="GitHub HQ" />
                <FooterLink label="Audits" />
              </Stack>
            </Box>

          </Stack>
        </Stack>

        <Box sx={{ mt: 10, textAlign: 'center', opacity: 0.3 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            © 2026 AOM3 PROTOCOL. ALL SYSTEMS OPERATIONAL.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default Footer;