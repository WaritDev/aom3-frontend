'use client';

import React from 'react';
import { 
  Container, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Box, 
  Stack, 
  Fade,
  SxProps,
  Theme,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const NEON_GREEN = '#00E08F';

interface FAQItem {
  q: string;
  a: string;
}

const faqs: FAQItem[] = [
  { 
    q: "What is AOM3 exactly?", 
    a: "AOM3 is a community-owned liquidity aggregator built on Hyperliquid. We automate institutional-grade market-making strategies by channeling committed deposits into HLP vaults, rewarding disciplined strategists with both trading yields and bonus incentives." 
  },
  { 
    q: "How is the yield generated?", 
    a: "Yield is generated from three real-world sources within the Hyperliquid ecosystem: trading fees from platform volume, bid-ask spreads, and liquidation revenue. This is 'Real Yield'—pure cash flow independent of inflationary tokenomics." 
  },
  { 
    q: "What are Discipline Points (DP)?", 
    a: "DP represents your weight within the AOM3 protocol. It is calculated based on your deposit amount and commitment duration. The more DP you accumulate through consistent streaks, the larger your share of the global Reward Pool." 
  },
  { 
    q: "What happens if I miss a deposit window?", 
    a: "To maintain your streak and Active DP, you must deposit within the first 7 days of each month. Missing this window stops your streak progression, reducing your potential share of the bonus rewards for that period." 
  },
  { 
    q: "Can I withdraw my funds early?", 
    a: "Yes, strategists can force an early exit. However, to protect the protocol's liquidity and reward long-term discipline, a 10% penalty is applied to the principal. This penalty is then distributed back to the Reward Pool for other active strategists." 
  },
  { 
    q: "What are the primary risks?", 
    a: "Unlike standard lending, HLP involves market-making risks which can be volatile during extreme market shifts. Additionally, users are subject to smart contract risks and exchange-level risks on Hyperliquid. We advise strategists to commit only what aligns with their risk profile." 
  },
];

const FAQSection: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const accordionSx: SxProps<Theme> = {
    bgcolor: 'transparent', 
    borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
    transition: 'all 0.3s ease',
    '&:before': { display: 'none' },
    '&:hover': {
      bgcolor: isDark ? 'rgba(0, 224, 143, 0.02)' : 'rgba(0, 224, 143, 0.04)',
      borderBottom: `1px solid ${NEON_GREEN}40`,
    },
    '&.Mui-expanded': {
        mb: 2,
        borderBottom: `1px solid ${NEON_GREEN}80`,
    }
  };

  return (
    <Box sx={{ 
      py: { xs: 10, md: 15 }, 
      bgcolor: 'background.default',
      transition: 'background-color 0.3s ease'
    }}>
      <Container maxWidth="md">
        
        <Fade in timeout={1000}>
          <Box mb={8} textAlign="center">
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5} mb={2}>
              <HelpOutlineIcon sx={{ color: NEON_GREEN, fontSize: 20 }} />
              <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 3 }}>
                Protocol Intel
              </Typography>
            </Stack>
            <Typography variant="h3" fontWeight="900" sx={{ 
              textTransform: 'uppercase', 
              letterSpacing: '-1.5px',
              color: 'text.primary'
            }}>
              Frequently Asked <Box component="span" sx={{ color: NEON_GREEN }}>Operations</Box>
            </Typography>
          </Box>
        </Fade>

        <Box sx={{ borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
          {faqs.map((item, index) => (
            <Accordion key={index} disableGutters elevation={0} sx={accordionSx}>
              <AccordionSummary 
                expandIcon={<AddIcon sx={{ color: NEON_GREEN, fontSize: 24 }} />}
                sx={{ py: 1.5 }}
              >
                <Typography variant="h6" sx={{ 
                  fontWeight: 800, 
                  fontSize: '1.1rem', 
                  letterSpacing: 0.5,
                  color: 'text.primary' 
                }}>
                  {item.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pb: 4 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.8, 
                    fontWeight: 500,
                    borderLeft: `2px solid ${NEON_GREEN}`,
                    pl: 3,
                    ml: 0.5
                  }}
                >
                  {item.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Box mt={8} textAlign="center">
          <Typography variant="body2" sx={{ 
            color: isDark ? '#444' : '#888', 
            fontWeight: 700 
          }}>
            Seeking more technical depth? 
            <Box 
              component="span" 
              sx={{ 
                color: NEON_GREEN, 
                ml: 1, 
                cursor: 'pointer', 
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                fontWeight: 900,
                '&:hover': { textDecoration: 'underline' } 
              }}
            >
              Review the Documentation
            </Box>
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default FAQSection;