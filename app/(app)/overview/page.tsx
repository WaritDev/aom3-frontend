'use client';

import React from 'react';
import { Container, Typography, Box, Card, CardContent, Stack, Button, Chip } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { useAOM3 } from '@/hooks/useAOM3';
import { DynamicPlanCard } from '@/components/card/DynamicPlanCard';

const NEON_GREEN = '#00E08F';

export default function OverviewPage() {
  const { isWindowOpen, nextQuestId } = useAOM3();

  const questIds = Array.from({ length: Number(nextQuestId) }, (_, i) => BigInt(i));

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: -2 }}>
          Mission <Box component="span" sx={{ color: NEON_GREEN }}>Dashboard</Box>
        </Typography>
      </Box>

      <Card sx={{ background: 'linear-gradient(135deg, #0d2e15 0%, #000 100%)', border: `1px solid ${NEON_GREEN}`, mb: 8, borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="overline" color="#ffd700" fontWeight="900">GLOBAL REWARD POOL</Typography>
              <Typography variant="h2" fontWeight="900" color="white">$25,400.50</Typography>
            </Box>
            <Stack alignItems="flex-end">
              <Typography variant="caption" color={isWindowOpen ? NEON_GREEN : "#888"}>
                 STATUS: {isWindowOpen ? "WINDOW OPEN (DAY 1-7)" : "WINDOW CLOSED"}
              </Typography>
              <Chip label="STREAK ELIGIBLE" sx={{ bgcolor: `${NEON_GREEN}15`, color: NEON_GREEN, fontWeight: 900, mt: 1 }} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="900">ACTIVE STRATEGIES</Typography>
          <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} href="/deposit" sx={{ borderRadius: 2, color: '#FFF' }}>NEW QUEST</Button>
        </Stack>
        
        <Stack spacing={2}>
          {questIds.length > 0 ? (
            questIds.map((id) => (
              <DynamicPlanCard key={id.toString()} questId={id} />
            ))
          ) : (
            <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
              No active quests found. Start your first mission!
            </Typography>
          )}
        </Stack>
      </Stack>

    </Container>
  );
}