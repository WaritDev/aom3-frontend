'use client';

import React from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const faqs = [
  { q: "What is AOM3?", a: "AOM3 is a DeFi protocol giving anyone access to effortless, delta-neutral strategies designed to deliver real and sustainable yield." },
  { q: "Where does the yield come from?", a: "Yield is generated primarily from Funding Rates paid by perp traders. When the funding rate is positive, shorts get paid. We automate this hedging process." },
  { q: "Is there a lock-up period?", a: "No. You can deposit and withdraw your USDC at any time. There are no warm-up periods." },
  { q: "What are the risks?", a: "While we hedge market risk (price movement), smart contract risk and exchange solvency risk still exist. We are audited to minimize these." },
];

const FAQSection = () => {
  return (
    <Box sx={{ py: 12 }}>
      <Container maxWidth="md">
        <Typography variant="h4" textAlign="center" fontWeight="bold" sx={{ mb: 6 }}>
          Answers for all your questions
        </Typography>

        {faqs.map((item, index) => (
          <Accordion 
            key={index} 
            disableGutters 
            elevation={0}
            sx={{ 
              bgcolor: 'transparent', 
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary expandIcon={<AddIcon sx={{ color: 'text.secondary' }} />}>
              <Typography variant="h6" sx={{ fontSize: '1.1rem', py: 1 }}>{item.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary" sx={{ pb: 2 }}>
                {item.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
};

export default FAQSection;