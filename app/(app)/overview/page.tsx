'use client';

import React, { useState, useMemo } from 'react';
import { 
    Container, Typography, Box, Card, CardContent, Stack, 
    Button, Chip, Divider, CircularProgress,
    Fade, Grow, Zoom, Tooltip, useTheme, alpha
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
    
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    const { 
        isWindowOpen, nextQuestId, rewardPoolBalance, 
        totalDP: globalTotalDP, currentDay, claimRewardAction 
    } = useAOM3();

    const { 
        hlBalance, vaultEquity, vaultApr, vaultPnl,
        isAutoInvesting, hasAgent
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
        <Box sx={{ 
            bgcolor: 'background.default', 
            minHeight: '100vh', 
            width: '100%',
            transition: 'background-color 0.3s ease',
            color: 'text.primary' 
        }}>
            <Container maxWidth="lg" sx={{ py: 8 }}>
            
                <Fade in timeout={800}>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-end' }} spacing={3} sx={{ mb: 6 }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 3 }}>OPERATIONAL TERMINAL</Typography>
                            <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: -2, lineHeight: 1, color: 'text.primary' }}>
                                QUEST <Box component="span" sx={{ color: NEON_GREEN }}>DASHBOARD</Box>
                            </Typography>
                        </Box>
                        
                        <Stack direction="row" spacing={2}>
                            <Tooltip title={hasAgent ? "Automator Active" : "Click to enable"}>
                                <Chip 
                                    icon={<SmartToyIcon style={{ color: hasAgent ? NEON_GREEN : (isDark ? '#555' : '#aaa') }} />}
                                    label={hasAgent ? "AGENT READY" : "AGENT OFFLINE"} 
                                    sx={{ 
                                        bgcolor: hasAgent ? alpha(NEON_GREEN, 0.1) : 'transparent', 
                                        color: hasAgent ? NEON_GREEN : 'text.disabled', 
                                        border: `1px solid ${hasAgent ? NEON_GREEN : theme.palette.divider}`, 
                                        fontWeight: 900, borderRadius: 2 
                                    }} 
                                />
                            </Tooltip>
                            <Chip 
                                label={isWindowOpen ? "SYSTEM ACTIVE" : "VAULT STANDBY"} 
                                sx={{ 
                                    bgcolor: isWindowOpen ? alpha(NEON_GREEN, 0.15) : 'transparent', 
                                    color: isWindowOpen ? NEON_GREEN : 'text.disabled', 
                                    border: `1px solid ${isWindowOpen ? NEON_GREEN : theme.palette.divider}`, 
                                    fontWeight: 900, borderRadius: 2 
                                }} 
                            />
                        </Stack>
                    </Stack>
                </Fade>

                {isAutoInvesting && (
                    <Grow in>
                        <Box sx={{ 
                            mb: 4, p: 2, borderRadius: 3, 
                            bgcolor: alpha(NEON_GREEN, 0.1), 
                            border: `1px solid ${alpha(NEON_GREEN, 0.3)}`, 
                            display: 'flex', alignItems: 'center', gap: 2 
                        }}>
                            <CircularProgress size={20} sx={{ color: NEON_GREEN }} />
                            <Typography variant="body2" sx={{ color: NEON_GREEN, fontWeight: 800 }}>
                                AUTOMATOR ACTIVE: TRANSFERRING ${hlBalance} TO VAULT...
                            </Typography>
                        </Box>
                    </Grow>
                )}

                <Grow in timeout={1000}>
                    <Card sx={{ 
                        background: isDark 
                            ? 'linear-gradient(145deg, #0a120b 0%, #000 100%)' 
                            : `linear-gradient(145deg, ${alpha(NEON_GREEN, 0.05)} 0%, #ffffff 100%)`, 
                        border: `1px solid ${isDark ? alpha(NEON_GREEN, 0.2) : alpha(NEON_GREEN, 0.3)}`, 
                        mb: 4, borderRadius: 4, 
                        boxShadow: isDark ? `0 20px 60px rgba(0,0,0,0.6)` : `0 10px 40px ${alpha(NEON_GREEN, 0.08)}`,
                        transition: 'all 0.3s ease',
                        backgroundImage: 'none',
                        backgroundIme: 'none'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} divider={
                                <Divider orientation="vertical" flexItem sx={{ borderColor: theme.palette.divider }} />
                            }>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 900, display: 'block', mb: 1, letterSpacing: 1 }}>MY VAULT EQUITY</Typography>
                                    <Typography variant="h3" fontWeight="900" color="text.primary">
                                        ${Number(vaultEquity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
                                        <TrendingUpIcon sx={{ fontSize: 18, color: Number(vaultPnl) >= 0 ? NEON_GREEN : '#FF4444' }} />
                                        <Typography variant="body1" sx={{ color: Number(vaultPnl) >= 0 ? NEON_GREEN : '#FF4444', fontWeight: 800 }}>
                                            {Number(vaultPnl) >= 0 ? '+' : ''}${Number(vaultPnl).toFixed(2)} USD PnL
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Box sx={{ flex: 1, textAlign: { xs: 'left', md: 'center' } }}>
                                    <Typography variant="caption" sx={{ color: isDark ? GOLD_COLOR : '#b38f00', fontWeight: 900, display: 'block', mb: 1, letterSpacing: 1 }}>VAULT YIELD (APR)</Typography>
                                    <Typography variant="h3" fontWeight="900" color={isDark ? GOLD_COLOR : '#d4af37'}>{(vaultApr * 100).toFixed(2)}%</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, fontWeight: 600 }}>
                                        Est. Monthly: +{((vaultApr / 12) * 100).toFixed(2)}%
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grow>

                {/* Treasury Section */}
                <Grow in timeout={1100}>
                    <Card sx={{ 
                        bgcolor: 'background.paper', 
                        border: `1px solid ${theme.palette.divider}`, 
                        mb: 8, borderRadius: 4,
                        // 🚩 ลบเงาดำขนาดใหญ่ใน Light mode
                        boxShadow: isDark ? 'none' : '0 8px 32px rgba(0,0,0,0.04)',
                        backgroundImage: 'none', // 👈 ลบขอบมืดของ MUI
                        transition: 'all 0.3s ease'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                                <Box sx={{ flex: 1 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                        <AccountBalanceIcon sx={{ color: NEON_GREEN, fontSize: 18 }} />
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 900, letterSpacing: 1 }}>GLOBAL TREASURY</Typography>
                                    </Stack>
                                    <Typography variant="h4" fontWeight="900" color="text.primary">${Number(rewardPoolBalance).toLocaleString()}</Typography>
                                    <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                                        <Typography variant="caption" sx={{ color: isDark ? GOLD_COLOR : '#b38f00', fontWeight: 800 }}>L1 CASH: ${Number(hlBalance).toFixed(2)}</Typography>
                                    </Stack>
                                </Box>

                                <Box sx={{ 
                                    flex: 1.5, p: 3, 
                                    bgcolor: isDark ? alpha(theme.palette.common.white, 0.03) : alpha(theme.palette.common.black, 0.02), 
                                    borderRadius: 3, 
                                    border: `1px solid ${theme.palette.divider}`,
                                    width: '100%'
                                }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="caption" sx={{ color: isDark ? GOLD_COLOR : '#b38f00', fontWeight: 900, display: 'block' }}>EST. REWARD</Typography>
                                            <Typography variant="h5" fontWeight="900" color={isDark ? GOLD_COLOR : '#d4af37'}>${estimatedReward.toLocaleString()}</Typography>
                                            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>Share: {networkShare.toFixed(3)}%</Typography>
                                        </Box>
                                        <Button 
                                            variant="contained" 
                                            disabled={!isClaimDay || isClaiming || myQuestIds.length === 0}
                                            onClick={handleClaimAll}
                                            startIcon={isClaiming ? <CircularProgress size={16} color="inherit" /> : <WorkspacePremiumIcon />}
                                            sx={{ 
                                                bgcolor: GOLD_COLOR, 
                                                color: '#000', 
                                                fontWeight: 900, 
                                                borderRadius: 2.5, 
                                                px: 3, py: 1.2,
                                                '&:hover': { bgcolor: '#FFC107' },
                                                '&:disabled': { bgcolor: alpha(GOLD_COLOR, 0.3) }
                                            }}
                                        >
                                            {isClaiming ? "SYNCING..." : "CLAIM ALL"}
                                        </Button>
                                    </Stack>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grow>

                {/* Missions List */}
                <Fade in timeout={1300}>
                    <Stack spacing={4}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5" fontWeight="900" sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.primary' }}>
                                <AssessmentIcon sx={{ color: NEON_GREEN }} /> ACTIVE MISSIONS 
                                <Chip 
                                    label={myQuestIds.length} 
                                    size="small" 
                                    sx={{ bgcolor: isDark ? alpha(theme.palette.common.white, 0.05) : '#f0f0f0', color: 'text.secondary', fontWeight: 900 }} 
                                />
                            </Typography>
                            <Button 
                                variant="outlined" 
                                startIcon={<AddCircleOutlineIcon />} 
                                href="/deposit" 
                                sx={{ 
                                    borderRadius: 2.5, 
                                    color: 'text.primary', 
                                    borderColor: theme.palette.divider, 
                                    fontWeight: 800,
                                    '&:hover': { borderColor: NEON_GREEN, bgcolor: alpha(NEON_GREEN, 0.05) }
                                }}
                            >
                                NEW QUEST
                            </Button>
                        </Stack>
                        
                        <Stack spacing={3}>
                            {sortedMyQuestIds.length > 0 ? (
                                sortedMyQuestIds.map((id, index) => (
                                    <Zoom in key={id.toString()} timeout={500 + (index * 100)}>
                                        <Box><DynamicPlanCard questId={id} /></Box>
                                    </Zoom>
                                ))
                            ) : (
                                <Box sx={{ 
                                    textAlign: 'center', py: 10, 
                                    bgcolor: alpha(theme.palette.divider, 0.1), 
                                    borderRadius: 4, border: `2px dashed ${theme.palette.divider}` 
                                }}>
                                    <Typography color="text.disabled" fontWeight={700}>
                                        NO ACTIVE MISSIONS FOUND. START YOUR DISCIPLINE JOURNEY TODAY.
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </Stack>
                </Fade>
            </Container>
        </Box>
    );
}