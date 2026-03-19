'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
    Container, Typography, Box, Card, CardContent, Stack, 
    Button, Chip, Divider, CircularProgress,
    Fade, Grow, Zoom, Tooltip, useTheme, alpha, Snackbar, Alert
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import { createClient } from '@supabase/supabase-js'; 
import { useAOM3 } from '@/hooks/useAOM3';
import { useHL } from '@/hooks/useHL'; 
import { useAccount, useReadContract } from 'wagmi'; 
import { DynamicPlanDemoCard } from '@/components/card/DynamicPlanDemoCard'; 
import { AOM3_VAULT_ADDRESS, AOM3_VAULT_ABI } from '@/constants/contracts';

const NEON_GREEN = '#00E08F';
const GOLD_COLOR = '#FFD700';
const NEON_ORANGE = '#FFA500';

export interface QuestDB {
    quest_id: number;
    owner_address: string;
    monthly_amount: number;
    total_deposited: number;
    current_streak: number;
    duration_months: number;
    start_timestamp: string;
    last_deposit_timestamp: string;
    dp: number;
    is_active: boolean;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function OverviewDemoPage() {
    const { address } = useAccount();
    const [isClaiming, setIsClaiming] = useState(false);    
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [myQuestsFromDB, setMyQuestsFromDB] = useState<QuestDB[]>([]);
    const [isLoadingDB, setIsLoadingDB] = useState(true);
    const [toastMessage, setToastMessage] = useState('');
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    const { 
        rewardPoolBalance, 
        claimRewardAction 
    } = useAOM3();

    const { 
        hlBalance, vaultEquity, vaultApr, vaultPnl,
        isAutoInvesting, refreshBalance: refetchHL,
    } = useHL();

    const { data: vaultTotalDPRaw, refetch: refetchVaultTotalDP } = useReadContract({
        address: AOM3_VAULT_ADDRESS as `0x${string}`,
        abi: AOM3_VAULT_ABI,
        functionName: 'totalDisciplinePoints',
    });
    const systemTotalDP = vaultTotalDPRaw ? Number(vaultTotalDPRaw) : 0;

    const fetchMyQuests = useCallback(async (isSilent = false) => {
        if (!address) {
            setMyQuestsFromDB([]);
            if (!isSilent) setIsLoadingDB(false);
            return;
        }

        if (!isSilent) setIsLoadingDB(true);
        try {
            const { data, error } = await supabase
                .from('quests')
                .select('*')
                .eq('owner_address', address.toLowerCase())
                .eq('is_active', true)
                .order('dp', { ascending: false }); 

            if (error) throw error;
            if (data) setMyQuestsFromDB(data as QuestDB[]);
        } catch (err) {
            console.error("Error fetching quests from Supabase:", err);
        } finally {
            if (!isSilent) setIsLoadingDB(false);
        }
    }, [address]);

    useEffect(() => {
        fetchMyQuests();
    }, [fetchMyQuests, refreshTrigger]);

    const { userTotalDP, myActiveQuestIds, myClaimableQuestIds } = useMemo(() => {
        let total = 0;
        const active: bigint[] = [];
        const claimable: bigint[] = [];
        
        myQuestsFromDB.forEach((quest) => {
            const dp = Number(quest.dp);
            const questId = BigInt(quest.quest_id);

            active.push(questId);
            
            if (dp > 0) {
                total += dp;
                claimable.push(questId);
            }
        });
        
        return { userTotalDP: total, myActiveQuestIds: active, myClaimableQuestIds: claimable };
    }, [myQuestsFromDB]);

    const networkShare = systemTotalDP > 0 ? (userTotalDP / systemTotalDP) * 100 : 0;
    const estimatedReward = (networkShare / 100) * Number(rewardPoolBalance);
    const isClaimDay = true; 

    const handleActionSuccess = useCallback(async (message?: string) => {
        setTimeout(async () => {
            setRefreshTrigger(prev => prev + 1);
            await refetchVaultTotalDP();
            await refetchHL();
            
            if (message) setToastMessage(message);
        }, 2500); 
    }, [refetchVaultTotalDP, refetchHL]);

    const handleClaimAll = async () => {
        if (myClaimableQuestIds.length === 0) return;
        setIsClaiming(true);
        try {
            for (const id of myClaimableQuestIds) {
                try { await claimRewardAction(Number(id)); } catch (e) { console.error(e); }
            }
            await handleActionSuccess('Rewards claimed successfully! Data updated.');
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
                        
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Tooltip title="Force Sync Data">
                                <Button 
                                    onClick={() => handleActionSuccess('Data synced with network')} 
                                    disabled={isLoadingDB}
                                    sx={{ minWidth: 0, p: 1, color: 'text.secondary', '&:hover': { color: NEON_GREEN, bgcolor: alpha(NEON_GREEN, 0.1) } }}
                                >
                                    <AutorenewIcon sx={{ animation: isLoadingDB ? 'spin 1s linear infinite' : 'none' }} />
                                </Button>
                            </Tooltip>
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
                        backgroundImage: 'none'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} divider={
                                <Divider orientation="vertical" flexItem sx={{ borderColor: theme.palette.divider }} />
                            }>
                                <Box sx={{ flex: 1.5 }}>
                                    <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 900, display: 'block', mb: 1, letterSpacing: 1 }}>MY VAULT EQUITY</Typography>
                                    
                                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                                        <Box>
                                            <Typography variant="h3" fontWeight="900" color="text.primary">
                                                ${Number(vaultEquity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </Typography>
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                                <TrendingUpIcon sx={{ fontSize: 18, color: Number(vaultPnl) >= 0 ? NEON_GREEN : '#FF4444' }} />
                                                <Typography variant="body1" sx={{ color: Number(vaultPnl) >= 0 ? NEON_GREEN : '#FF4444', fontWeight: 800 }}>
                                                    {Number(vaultPnl) >= 0 ? '+' : ''}${Number(vaultPnl).toFixed(2)} USD PROFIT
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Box>

                                <Box sx={{ flex: 1, textAlign: { xs: 'left', md: 'center' } }}>
                                    <Typography variant="caption" sx={{ color: isDark ? GOLD_COLOR : NEON_ORANGE, fontWeight: 900, display: 'block', mb: 1, letterSpacing: 1 }}>VAULT YIELD (APR)</Typography>
                                    <Typography variant="h3" fontWeight="900" color={isDark ? GOLD_COLOR : NEON_ORANGE}>{(vaultApr * 100).toFixed(2)}%</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, fontWeight: 600 }}>
                                        Est. Monthly: +{((vaultApr / 12) * 100).toFixed(2)}%
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grow>

                <Grow in timeout={1100}>
                    <Card sx={{ 
                        bgcolor: 'background.paper', 
                        border: `1px solid ${theme.palette.divider}`, 
                        mb: 8, borderRadius: 4,
                        boxShadow: isDark ? 'none' : '0 8px 32px rgba(0,0,0,0.04)',
                        backgroundImage: 'none',
                        transition: 'all 0.3s ease'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" justifyContent="space-between">
                                <Box sx={{ flex: 1 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                        <AccountBalanceIcon sx={{ color: NEON_GREEN, fontSize: 18 }} />
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 900, letterSpacing: 1 }}>GLOBAL REWARD POOL</Typography>
                                    </Stack>
                                    <Typography variant="h3" fontWeight="900" color="text.primary" sx={{ letterSpacing: -1 }}>
                                        ${Number(rewardPoolBalance).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, fontWeight: 600 }}>
                                        Your Est. Share ({networkShare.toFixed(2)}%): <Box component="span" color={isDark ? GOLD_COLOR : NEON_ORANGE}>${estimatedReward.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Box>
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: NEON_GREEN, mt: 0.5, display: 'block', fontWeight: 700 }}>
                                        Current Active DP: {userTotalDP.toLocaleString()} / System Total: {systemTotalDP.toLocaleString()}
                                    </Typography>
                                </Box>

                                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                    <Button 
                                        variant="contained" 
                                        disabled={!isClaimDay || isClaiming || myClaimableQuestIds.length === 0}
                                        onClick={handleClaimAll}
                                        startIcon={isClaiming ? <CircularProgress size={16} color="inherit" /> : <WorkspacePremiumIcon />}
                                        sx={{ 
                                            bgcolor: GOLD_COLOR, 
                                            color: '#000', 
                                            fontWeight: 900, 
                                            borderRadius: 3, 
                                            px: 4, py: 2,
                                            boxShadow: isClaimDay && myClaimableQuestIds.length > 0 ? `0 8px 25px ${alpha(GOLD_COLOR, 0.4)}` : 'none',
                                            '&:hover': { bgcolor: '#FFC107', transform: 'translateY(-2px)' },
                                            '&:disabled': { bgcolor: alpha(theme.palette.divider, 0.1), color: 'text.disabled' },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {isClaiming ? "SYNCING..." : "CLAIM REWARDS"}
                                    </Button>
                                    <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: NEON_GREEN, fontWeight: 800 }}>
                                        ✅ CLAIM WINDOW IS OPEN (DEMO MODE)
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grow>

                <Fade in timeout={1300}>
                    <Stack spacing={4}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5" fontWeight="900" sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.primary' }}>
                                <AssessmentIcon sx={{ color: NEON_GREEN }} /> ACTIVE MISSIONS 
                                <Chip 
                                    label={myActiveQuestIds.length}
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
                            {isLoadingDB ? (
                                <Box sx={{ textAlign: 'center', py: 5 }}>
                                    <CircularProgress sx={{ color: NEON_GREEN }} />
                                    <Typography mt={2} color="text.secondary" fontWeight={700}>LOADING MISSIONS...</Typography>
                                </Box>
                            ) : myActiveQuestIds.length > 0 ? (
                                myActiveQuestIds.map((id, index) => (
                                    <Zoom in key={`${id.toString()}-${refreshTrigger}`} timeout={500 + (index * 100)}>
                                        <Box>
                                            <DynamicPlanDemoCard questId={id} onActionSuccess={() => handleActionSuccess('Mission updated successfully!')} />
                                        </Box>
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

            <Snackbar
                open={!!toastMessage}
                autoHideDuration={4000}
                onClose={() => setToastMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setToastMessage('')} severity="success" sx={{ width: '100%', bgcolor: '#000', color: NEON_GREEN, border: `1px solid ${NEON_GREEN}`, fontWeight: 800 }}>
                    {toastMessage}
                </Alert>
            </Snackbar>

            <style jsx global>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </Box>
    );
}