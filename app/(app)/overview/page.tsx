'use client';

import React, { useState, useMemo } from 'react';
import { 
    Container, Typography, Box, Card, CardContent, Stack, 
    Button, Chip, Divider, CircularProgress,
    Fade, Grow, Zoom, Tooltip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { useAOM3 } from '@/hooks/useAOM3';
import { useHL } from '@/hooks/useHL'; 
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
        isWindowOpen, nextQuestId, rewardPoolBalance, 
        totalDP: globalTotalDP, currentDay, claimRewardAction 
    } = useAOM3();

    const { 
        hlBalance, vaultEquity, vaultApr, vaultPnl,
        isAutoInvesting, hasAgent, createAndApproveAgent 
    } = useHL();

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
        allQuestsData.forEach((res) => {
            if (res.status === 'success' && res.result) {
            const quest = res.result as unknown as QuestResult; 
            if (quest[0].toLowerCase() === address.toLowerCase() && quest[8]) {
                total += Number(quest[7]);
                mine.push(BigInt(allQuestsData.indexOf(res)));
            }
            }
        });
        }
        return { userTotalDP: total, myQuestIds: mine };
    }, [allQuestsData, address]);

    const sortedMyQuestIds = useMemo(() => {
        if (!allQuestsData || myQuestIds.length === 0) return [];
        return [...myQuestIds].sort((a, b) => {
        const resA = allQuestsData[Number(a)];
        const resB = allQuestsData[Number(b)];
        if (resA.status === 'success' && resB.status === 'success') {
            const qA = resA.result as unknown as QuestResult;
            const qB = resB.result as unknown as QuestResult;
            return Number(qB[7]) - Number(qA[7]);
        }
        return 0;
        });
    }, [myQuestIds, allQuestsData]);

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
        } finally {
        setIsClaiming(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
        
        <Fade in timeout={800}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 5 }}>
                <Box>
                    <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 3 }}>OPERATIONAL TERMINAL</Typography>
                    <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: -2, lineHeight: 1 }}>
                        QUEST <Box component="span" sx={{ color: NEON_GREEN }}>DASHBOARD</Box>
                    </Typography>
                </Box>
                
                <Stack direction="row" spacing={2}>
                    <Tooltip title={hasAgent ? "Automator Active" : "Click to enable"}>
                        <Chip 
                            icon={<SmartToyIcon style={{ color: hasAgent ? NEON_GREEN : '#555' }} />}
                            label={hasAgent ? "AGENT READY" : "AGENT OFFLINE"} 
                            onClick={!hasAgent ? createAndApproveAgent : undefined}
                            sx={{ bgcolor: hasAgent ? `${NEON_GREEN}10` : 'transparent', color: hasAgent ? NEON_GREEN : '#555', border: `1px solid ${hasAgent ? NEON_GREEN : '#333'}`, fontWeight: 900, borderRadius: 2, cursor: hasAgent ? 'default' : 'pointer' }} 
                        />
                    </Tooltip>
                    <Chip label={isWindowOpen ? "SYSTEM ACTIVE" : "VAULT STANDBY"} sx={{ bgcolor: isWindowOpen ? `${NEON_GREEN}15` : 'transparent', color: isWindowOpen ? NEON_GREEN : '#555', border: `1px solid ${isWindowOpen ? NEON_GREEN : '#333'}`, fontWeight: 900, borderRadius: 2 }} />
                </Stack>
            </Stack>
        </Fade>

        {isAutoInvesting && (
            <Grow in>
                <Box sx={{ mb: 4, p: 2, borderRadius: 2, bgcolor: `${NEON_GREEN}10`, border: `1px solid ${NEON_GREEN}44`, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={20} sx={{ color: NEON_GREEN }} />
                    <Typography variant="body2" sx={{ color: NEON_GREEN, fontWeight: 800 }}>AUTOMATOR ACTIVE: TRANSFERRING ${hlBalance} TO VAULT...</Typography>
                </Box>
            </Grow>
        )}

        <Grow in timeout={1000}>
            <Card sx={{ background: 'linear-gradient(145deg, #0a120b 0%, #000 100%)', border: `1px solid ${NEON_GREEN}33`, mb: 4, borderRadius: 3, boxShadow: `0 20px 60px rgba(0,0,0,0.8)` }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 900, display: 'block', mb: 1 }}>MY VAULT EQUITY</Typography>
                            <Typography variant="h3" fontWeight="900" color="white">${Number(vaultEquity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                <TrendingUpIcon sx={{ fontSize: 16, color: Number(vaultPnl) >= 0 ? NEON_GREEN : '#FF4444' }} />
                                <Typography variant="body2" sx={{ color: Number(vaultPnl) >= 0 ? NEON_GREEN : '#FF4444', fontWeight: 800 }}>
                                    {Number(vaultPnl) >= 0 ? '+' : ''}${Number(vaultPnl).toFixed(2)} USD PnL
                                </Typography>
                            </Stack>
                        </Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: GOLD_COLOR, fontWeight: 900, display: 'block', mb: 1 }}>VAULT YIELD (APR)</Typography>
                            <Typography variant="h3" fontWeight="900" color={GOLD_COLOR}>{(vaultApr * 100).toFixed(2)}%</Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 1 }}>Est. Monthly: +{((vaultApr / 12) * 100).toFixed(2)}%</Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Grow>

        <Grow in timeout={1100}>
            <Card sx={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', mb: 8, borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                        <Box sx={{ flex: 1 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                <AccountBalanceIcon sx={{ color: NEON_GREEN, fontSize: 18 }} />
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900 }}>GLOBAL TREASURY</Typography>
                            </Stack>
                            <Typography variant="h4" fontWeight="900" color="white">${Number(rewardPoolBalance).toLocaleString()}</Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                <Typography variant="caption" sx={{ color: GOLD_COLOR, fontWeight: 800 }}>L1 CASH: ${Number(hlBalance).toFixed(2)}</Typography>
                            </Stack>
                        </Box>

                        <Box sx={{ flex: 1.5, p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="caption" sx={{ color: GOLD_COLOR, fontWeight: 900, display: 'block' }}>EST. REWARD</Typography>
                                    <Typography variant="h5" fontWeight="900" color={GOLD_COLOR}>${estimatedReward.toLocaleString()}</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>Share: {networkShare.toFixed(3)}%</Typography>
                                </Box>
                                <Button 
                                    variant="contained" 
                                    disabled={!isClaimDay || isClaiming || myQuestIds.length === 0}
                                    onClick={handleClaimAll}
                                    startIcon={isClaiming ? <CircularProgress size={16} color="inherit" /> : <WorkspacePremiumIcon />}
                                    sx={{ bgcolor: GOLD_COLOR, color: '#000', fontWeight: 900, borderRadius: 2, px: 3, '&:hover': { bgcolor: '#FFC107' } }}
                                >
                                    {isClaiming ? "SYNCING..." : "CLAIM ALL"}
                                </Button>
                            </Stack>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Grow>

        <Fade in timeout={1300}>
            <Stack spacing={4}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" fontWeight="900" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AssessmentIcon sx={{ color: NEON_GREEN }} /> ACTIVE MISSIONS 
                        <Chip label={myQuestIds.length} size="small" sx={{ bgcolor: '#111', color: '#666', fontWeight: 900 }} />
                    </Typography>
                    <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} href="/deposit" sx={{ borderRadius: 2, color: '#FFF', borderColor: '#333', fontWeight: 800 }}>NEW QUEST</Button>
                </Stack>
                <Stack spacing={3}>
                    {sortedMyQuestIds.map((id, index) => (
                        <Zoom in key={id.toString()} timeout={500 + (index * 100)}>
                            <Box><DynamicPlanCard questId={id} /></Box>
                        </Zoom>
                    ))}
                </Stack>
            </Stack>
        </Fade>
        </Container>
    );
}