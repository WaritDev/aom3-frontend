'use client';

import React, { useState, useMemo } from 'react';
import { 
    Container, Typography, Box, Card, CardContent, Stack, 
    Button, Chip, Divider, CircularProgress
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AssessmentIcon from '@mui/icons-material/Assessment';

import { useAOM3 } from '@/hooks/useAOM3';
import { useAccount, useReadContracts } from 'wagmi';
import { DynamicPlanCard } from '@/components/card/DynamicPlanCard';
import { AOM3_VAULT_ADDRESS, AOM3_VAULT_ABI } from '@/constants/contracts';

const NEON_GREEN = '#00E08F';
const GOLD_COLOR = '#FFD700';

type QuestResult = readonly [
  `0x${string}`, // owner
  bigint,        // monthlyAmount
  bigint,        // totalDeposited
  bigint,        // currentStreak
  bigint,        // durationMonths
  bigint,        // startTimestamp
  bigint,        // lastDepositTimestamp
  bigint,        // dp
  boolean        // active
];

export default function OverviewPage() {
  const { address } = useAccount();
  const [isClaiming, setIsClaiming] = useState(false);
  const { 
    isWindowOpen, 
    nextQuestId, 
    rewardPoolBalance, 
    totalDP: globalTotalDP, 
    currentDay,
    claimRewardAction
  } = useAOM3();

  const questIds = useMemo(() => 
    Array.from({ length: Number(nextQuestId || 0) }, (_, i) => BigInt(i)), 
    [nextQuestId]
  );

  const { data: allQuestsData } = useReadContracts({
    contracts: questIds.map(id => ({
      address: AOM3_VAULT_ADDRESS as `0x${string}`,
      abi: AOM3_VAULT_ABI,
      functionName: 'quests',
      args: [id],
    }))
  });

  const { userTotalDP, myQuestIds } = useMemo(() => {
    let total = 0;
    const mine: bigint[] = [];
    if (allQuestsData && address) {
      allQuestsData.forEach((res, index) => {
        if (res.status === 'success' && res.result) {
          const quest = res.result as unknown as QuestResult; 
          const owner = quest[0];
          const dpAmount = Number(quest[7]);
          const isActive = quest[8];
          if (owner.toLowerCase() === address.toLowerCase() && isActive) {
            total += dpAmount;
            mine.push(BigInt(index));
          }
        }
      });
    }
    return { userTotalDP: total, myQuestIds: mine };
  }, [allQuestsData, address]);

  const networkShare = globalTotalDP > 0 ? (userTotalDP / Number(globalTotalDP)) * 100 : 0;
  const estimatedReward = (networkShare / 100) * Number(rewardPoolBalance);
  const isClaimDay = currentDay === 1 || currentDay === 16;

  const handleClaimAll = async () => {
    if (myQuestIds.length === 0) return;
    setIsClaiming(true);
    try {
      for (const id of myQuestIds) {
        try { await claimRewardAction(Number(id)); } catch (e) { console.error(e); }
      }
      alert("All eligible rewards claimed!");
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 5 }}>
        <Box>
            <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 800, letterSpacing: 3 }}>
                OPERATIONAL TERMINAL
            </Typography>
            <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: -2, lineHeight: 1 }}>
                QUEST <Box component="span" sx={{ color: NEON_GREEN, textShadow: `0 0 20px ${NEON_GREEN}55` }}>DASHBOARD</Box>
            </Typography>
        </Box>
        <Chip 
            label={isWindowOpen ? "SYSTEM ACTIVE" : "VAULT STANDBY"} 
            sx={{ 
                bgcolor: isWindowOpen ? `${NEON_GREEN}15` : 'transparent', 
                color: isWindowOpen ? NEON_GREEN : '#555',
                border: `1px solid ${isWindowOpen ? NEON_GREEN : '#333'}`,
                fontWeight: 900,
                borderRadius: 2
            }} 
        />
      </Stack>

      <Card sx={{ 
        background: 'linear-gradient(145deg, #0a1a0f 0%, #000 100%)', 
        border: `1px solid ${NEON_GREEN}44`, 
        mb: 8, 
        borderRadius: 6,
        boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 20px ${NEON_GREEN}11`,
        overflow: 'visible'
      }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={{ xs: 5, md: 0 }}
          >
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <AccountBalanceIcon sx={{ color: NEON_GREEN, fontSize: 20 }} />
                <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900, letterSpacing: 2 }}>
                    GLOBAL TREASURY
                </Typography>
              </Stack>
              <Typography variant="h2" fontWeight="900" sx={{ color: 'white', letterSpacing: -2, mb: 1 }}>
                ${Number(rewardPoolBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                Protocol penalties waiting for next cycle distribution.
              </Typography>
            </Box>

            <Box sx={{ flex: 1.6 }}>
              <Stack spacing={4}>
                <Stack direction="row" justifyContent="space-between">
                    <Box>
                        <Typography variant="caption" sx={{ color: GOLD_COLOR, fontWeight: 900, display: 'block', mb: 0.5 }}>YOUR DISCIPLINE</Typography>
                        <Typography variant="h5" fontWeight="900" color="white">{userTotalDP.toLocaleString()} <small style={{ fontSize: '0.8rem', opacity: 0.5 }}>DP</small></Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900, display: 'block', mb: 0.5 }}>NETWORK LOAD</Typography>
                        <Typography variant="h5" fontWeight="900" color="white">{Number(globalTotalDP).toLocaleString()} <small style={{ fontSize: '0.8rem', opacity: 0.5 }}>DP</small></Typography>
                    </Box>
                </Stack>

                <Stack direction="row" justifyContent="space-between" sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Box>
                        <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 900, display: 'block' }}>POOL SHARE</Typography>
                        <Typography variant="h6" fontWeight="900" color="white">{networkShare.toFixed(3)}%</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: GOLD_COLOR, fontWeight: 900, display: 'block' }}>EST. REWARD</Typography>
                        <Typography variant="h6" fontWeight="900" color={GOLD_COLOR}>${estimatedReward.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
                    </Box>
                </Stack>

                <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    background: isClaimDay ? `linear-gradient(90deg, ${GOLD_COLOR}15 0%, transparent 100%)` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isClaimDay ? GOLD_COLOR : 'rgba(255,255,255,0.05)'}`,
                    transition: '0.3s'
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: isClaimDay ? GOLD_COLOR : '#333', boxShadow: isClaimDay ? `0 0 10px ${GOLD_COLOR}` : 'none' }} />
                        <Typography variant="subtitle2" color="white" fontWeight="800">
                          {isClaimDay ? "Rewards Available" : "Next Payout: 1st & 16th Every Month"}
                        </Typography>
                    </Stack>
                    <Button 
                      variant="contained" 
                      disabled={!isClaimDay || isClaiming || myQuestIds.length === 0}
                      onClick={handleClaimAll}
                      startIcon={isClaiming ? <CircularProgress size={16} color="inherit" /> : <WorkspacePremiumIcon />}
                      sx={{ 
                        bgcolor: GOLD_COLOR, color: '#000', fontWeight: 900, borderRadius: 2.5, px: 3,
                        '&:hover': { bgcolor: '#FFC107', transform: 'translateY(-2px)' },
                        transition: '0.2s'
                      }}
                    >
                      {isClaiming ? "SYNCING..." : "CLAIM ALL"}
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="900" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AssessmentIcon sx={{ color: NEON_GREEN }} /> ACTIVE STRATEGIES 
            <Box component="span" sx={{ px: 1.5, py: 0.5, bgcolor: '#111', borderRadius: 2, fontSize: '0.9rem', color: '#666', border: '1px solid #222' }}>
                {myQuestIds.length}
            </Box>
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<AddCircleOutlineIcon />} 
            href="/deposit" 
            sx={{ borderRadius: 3, color: '#FFF', borderColor: '#333', px: 3, fontWeight: 800, '&:hover': { borderColor: NEON_GREEN, color: NEON_GREEN } }}
          >
            NEW QUEST
          </Button>
        </Stack>
        
        <Stack spacing={3}>
          {myQuestIds.length > 0 ? (
            [...myQuestIds].reverse().map((id) => (
              <DynamicPlanCard key={id.toString()} questId={id} />
            ))
          ) : (
            <Box sx={{ py: 12, textAlign: 'center', border: '2px dashed #1A1A1A', borderRadius: 6, bgcolor: 'rgba(255,255,255,0.01)' }}>
              <Typography variant="h6" color="rgba(255,255,255,0.3)" fontWeight="700">
                No active missions detected.
              </Typography>
              <Button href="/deposit" sx={{ mt: 2, color: NEON_GREEN, fontWeight: 800 }}>
                Initialize First Quest →
              </Button>
            </Box>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}