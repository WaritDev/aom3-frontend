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
  Theme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const NEON_GREEN = '#00E08F';
const BG_DARK = '#050505';

interface FAQItem {
  q: string;
  a: string;
}

const faqs: FAQItem[] = [
  { 
    q: "What exactly is AOM3?", 
    a: "AOM3 is a gamified Web3 savings protocol. It automates institutional-grade delta-neutral strategies on Hyperliquid, allowing users to earn sustainable yield while building financial discipline through our unique streak-based reward system." 
  },
  { 
    q: "How is the sustainable yield generated?", 
    a: "The core yield is captured from Funding Rates on the Hyperliquid DEX. Additionally, users who maintain their discipline earn a share of the 'Prize Pool'—which consists of yields forfeited by participants who missed their deposit windows." 
  },
  { 
    q: "What is the 7-Day Window rule?", 
    a: "To keep your streak and maximize multipliers, you must deposit your monthly commitment within the first 7 days of each month. Missing this window results in forfeiting that month's yield to the global Prize Pool." 
  },
  { 
    q: "Is there a lock-up period for my funds?", 
    a: "Yes. To ensure effective delta-neutral hedging and long-term wealth compounding, your principal is safely locked until the maturity date of your chosen plan (6, 12, or 24 months)." 
  },
  { 
    q: "What are the primary risks involved?", 
    a: "While we eliminate market price exposure through 1:1 hedging, users are still subject to smart contract risks and exchange solvency risks (Hyperliquid). We prioritize security and transparency to mitigate these factors." 
  },
];

const FAQSection: React.FC = () => {
  const accordionSx: SxProps<Theme> = {
    bgcolor: 'transparent', 
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
    '&:before': { display: 'none' },
    '&:hover': {
      bgcolor: 'rgba(0, 224, 143, 0.02)',
      borderBottom: `1px solid ${NEON_GREEN}40`,
    },
    '&.Mui-expanded': {
        mb: 2,
        borderBottom: `1px solid ${NEON_GREEN}80`,
    }
  };

  return (
    <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: BG_DARK }}>
      <Container maxWidth="md">
        
        <Fade in timeout={1000}>
          <Box mb={8} textAlign="center">
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5} mb={2}>
              <HelpOutlineIcon sx={{ color: NEON_GREEN, fontSize: 20 }} />
              <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 3 }}>
                Quest Intelligence
              </Typography>
            </Stack>
            <Typography variant="h3" fontWeight="900" sx={{ textTransform: 'uppercase', letterSpacing: '-1.5px' }}>
              Frequently Asked <Box component="span" sx={{ color: NEON_GREEN }}>Mechanics</Box>
            </Typography>
          </Box>
        </Fade>

        <Box sx={{ borderTop: `1px solid rgba(255, 255, 255, 0.1)` }}>
          {faqs.map((item, index) => (
            <Accordion key={index} disableGutters elevation={0} sx={accordionSx}>
              <AccordionSummary 
                expandIcon={<AddIcon sx={{ color: NEON_GREEN, fontSize: 24 }} />}
                sx={{ py: 1.5 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: 0.5 }}>
                  {item.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pb: 4 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)', 
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
          <Typography variant="body2" sx={{ color: '#444', fontWeight: 700 }}>
            Still have questions about the engine? 
            <Box 
              component="span" 
              sx={{ 
                color: NEON_GREEN, 
                ml: 1, 
                cursor: 'pointer', 
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                '&:hover': { textDecoration: 'underline' } 
              }}
            >
              Consult the Whitepaper
            </Box>
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default FAQSection;