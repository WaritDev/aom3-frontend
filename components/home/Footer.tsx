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
  Theme,
  useTheme
} from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import TerminalIcon from '@mui/icons-material/Terminal';

const NEON_GREEN = '#00E08F';

interface FooterLinkProps {
  label: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ label }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Typography 
      variant="body2" 
      sx={{ 
        color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.5)', 
        cursor: 'pointer', 
        fontWeight: 600,
        fontSize: '0.8rem',
        transition: 'all 0.2s',
        '&:hover': { 
          color: NEON_GREEN,
          transform: 'translateX(4px)',
          textShadow: isDark ? `0 0 8px ${NEON_GREEN}80` : 'none'
        } 
      }}
    >
      {label}
    </Typography>
  );
};

const Footer: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const iconButtonSx: SxProps<Theme> = {
    bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
    color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
    p: 2,
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
    transition: 'all 0.3s',
    '&:hover': {
      bgcolor: `${NEON_GREEN}10`,
      color: NEON_GREEN,
      borderColor: NEON_GREEN,
      boxShadow: `0 0 20px ${NEON_GREEN}${isDark ? '30' : '15'}`,
      transform: 'translateY(-4px)'
    }
  };

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.default',
        borderTop: `1px solid ${isDark ? '#111' : '#EEE'}`, 
        pt: 10, 
        pb: 4,
        transition: 'background-color 0.3s ease'
      }}
    >
      <Container maxWidth="lg">
        
        <Stack spacing={4} alignItems="center" sx={{ mb: 8, textAlign: 'center' }}>
            <Box>
              <Typography variant="h4" fontWeight="900" sx={{ 
                textTransform: 'uppercase', 
                letterSpacing: '-1.5px',
                color: 'text.primary'
              }}>
                Own the <Box component="span" sx={{ color: NEON_GREEN }}>Liquidity</Box>
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, fontWeight: 500 }}>
                Stay synchronized with the HLP engine and community updates.
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

        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', mb: 8 }} />

        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={{ xs: 6, md: 4 }} 
          justifyContent="space-between"
        >
          <Box sx={{ maxWidth: { xs: '100%', md: 350 } }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <TerminalIcon sx={{ color: NEON_GREEN, fontSize: 20 }} />
                  <Typography variant="h6" fontWeight="900" sx={{ letterSpacing: 1, color: 'text.primary' }}>AOM3</Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, fontWeight: 500 }}>
                A decentralized aggregator for HLP market-making and liquidation accrual. Community-owned, non-custodial, and engineered for discipline.
              </Typography>
          </Box>
          
          <Stack direction="row" spacing={{ xs: 6, sm: 10 }} sx={{ width: { xs: '100%', md: 'auto' } }}>
            
            <Box>
              <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 900, mb: 2, display: 'block', letterSpacing: 2 }}>
                ECOSYSTEM
              </Typography>
              <Stack spacing={1.5}>
                <FooterLink label="HLP Vault Analytics" />
                <FooterLink label="Strategy Breakdown" />
                <FooterLink label="Hyperliquid L1" />
                <FooterLink label="Reward Pool" />
              </Stack>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 900, mb: 2, display: 'block', letterSpacing: 2 }}>
                INTEL
              </Typography>
              <Stack spacing={1.5}>
                <FooterLink label="Documentation" />
                <FooterLink label="Protocol Risk" />
                <FooterLink label="GitHub HQ" />
                <FooterLink label="Community Governance" />
              </Stack>
            </Box>

          </Stack>
        </Stack>

        <Box sx={{ mt: 10, textAlign: 'center', opacity: isDark ? 0.3 : 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1, color: 'text.primary' }}>
            © 2026 AOM3 PROTOCOL
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default Footer;